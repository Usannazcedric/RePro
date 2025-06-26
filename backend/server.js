const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;

// Configuration Multer pour accepter plusieurs fichiers
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Configuration de LM Studio
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://192.168.1.11:1234';

app.use(require('cors')());
app.use(express.json());

// Vérification de la connexion à LM Studio
async function checkLMStudioConnection() {
  try {
    await axios.get(`${LM_STUDIO_URL}/v1/models`);
    console.log('✅ Connexion à LM Studio établie');
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à LM Studio:', error.message);
    return false;
  }
}

// Mise à jour de l'endpoint pour accepter plusieurs fichiers
app.post('/api/analyze-ebook', upload.fields([
  { name: 'ebook', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  let ebookPath = null;
  let coverImagePath = null;

  try {
    // Récupération des fichiers
    if (!req.files || !req.files.ebook) {
      return res.status(400).json({ error: 'Aucun fichier ebook fourni' });
    }

    ebookPath = req.files.ebook[0].path;
    if (req.files.coverImage) {
      coverImagePath = req.files.coverImage[0].path;
    }

    // Récupération des données supplémentaires
    const quizConfig = req.body.quizConfig ? JSON.parse(req.body.quizConfig) : { chapters: 1, quizzes: 5 };
    const infos = req.body.infos ? JSON.parse(req.body.infos) : {};

    console.log('📚 Lecture du PDF...', { quizConfig, infos });
    const dataBuffer = fs.readFileSync(ebookPath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.slice(0, 8000);
    console.log('✅ PDF lu avec succès');

    console.log('🤖 Envoi à LM Studio...');
    const prompt = buildPrompt(text, quizConfig, infos);
    const aiResponse = await callLMStudio(prompt);
    console.log('✅ Réponse reçue de LM Studio');
    
    console.log('🔍 Parsing de la réponse...');
    const { summary, quizzes, tips } = parseAIResponse(aiResponse);
    console.log('✅ Parsing réussi');

    // Nettoyage des fichiers temporaires
    if (ebookPath && fs.existsSync(ebookPath)) {
      fs.unlinkSync(ebookPath);
    }
    if (coverImagePath && fs.existsSync(coverImagePath)) {
      fs.unlinkSync(coverImagePath);
    }

    res.json({ 
      summary: summary,
      quizzes: quizzes,
      tips: tips,
      receivedConfig: quizConfig,
      receivedInfos: infos
    });

  } catch (err) {
    console.error('❌ Erreur:', err.message);
    
    // Nettoyage en cas d'erreur
    if (ebookPath && fs.existsSync(ebookPath)) {
      fs.unlinkSync(ebookPath);
    }
    if (coverImagePath && fs.existsSync(coverImagePath)) {
      fs.unlinkSync(coverImagePath);
    }
    
    res.status(500).json({ 
      error: 'Erreur lors de la génération du contenu',
      details: err.message
    });
  }
});

app.listen(port, async () => {
  console.log(`✅ Serveur backend en écoute sur http://localhost:${port}`);
  const isLMStudioConnected = await checkLMStudioConnection();
  if (!isLMStudioConnected) {
    console.warn('⚠️ Le serveur démarre mais LM Studio n\'est pas accessible');
  }
});

function buildPrompt(text, quizConfig = { chapters: 1, quizzes: 5 }, infos = {}) {
  const quizTemplate = Array.from({ length: quizConfig.quizzes }, (_, i) => `    {
      "question": "Question ${i + 1}",
      "options": {
        "A": "Réponse A",
        "B": "Réponse B",
        "C": "Réponse C",
        "D": "Réponse D"
      },
      "correctAnswer": "A"
    }`).join(',\n');

  return `
Tu es une IA éducative spécialisée dans la création de contenus pédagogiques en français.

Informations sur la formation :
- Titre : ${infos.title || 'Non spécifié'}
- Thème : ${infos.theme || 'Non spécifié'}
- Nombre de chapitres souhaités : ${quizConfig.chapters}
- Nombre de quiz souhaités : ${quizConfig.quizzes}

Voici un extrait de cours à analyser :

"""
${text}
"""

Génère une réponse structurée avec le format JSON suivant (EXACTEMENT ${quizConfig.quizzes} questions) :

{
  "summary": "Le résumé du cours en 2-3 phrases",
  "quizzes": [
${quizTemplate}
  ],
  "tips": "Une astuce ou point clé à retenir"
}

RÈGLES IMPORTANTES:
1. Le résumé doit être clair et bien structuré
2. Crée EXACTEMENT ${quizConfig.quizzes} questions de quiz (pas plus, pas moins)
3. L'astuce doit être concise et pertinente
4. Respecte STRICTEMENT le format JSON
5. Assure-toi que le JSON est valide (pas de virgules en trop, guillemets correctement fermés)
6. NE RÉPONDS QU'AVEC LE JSON, aucun texte avant ou après
`;
}

function parseAIResponse(response) {
  try {
    console.log('🔍 Début du parsing de la réponse...');
    
    // Si la réponse est déjà un objet (cas de LM Studio)
    if (typeof response === 'object' && response.choices) {
      let content = response.choices[0].message.content;
      console.log('📝 Contenu brut reçu:', content);
      
      // Nettoie la réponse pour s'assurer qu'elle ne contient que du JSON
      content = content.replace(/```json\n?|\n?```/g, '').trim();
      
      // Supprime tout texte avant le premier {
      const firstBrace = content.indexOf('{');
      if (firstBrace > 0) {
        content = content.substring(firstBrace);
      }
      
      // Supprime tout texte après le dernier }
      const lastBrace = content.lastIndexOf('}');
      if (lastBrace !== -1 && lastBrace < content.length - 1) {
        content = content.substring(0, lastBrace + 1);
      }
      
      console.log('🧹 JSON nettoyé:', content);
      
      const parsed = JSON.parse(content);
      console.log('✅ Parsing JSON réussi');
      
      // Validation des données
      if (!parsed.summary || !parsed.quizzes || !Array.isArray(parsed.quizzes) || !parsed.tips) {
        throw new Error('Structure JSON invalide - champs manquants');
      }
      
      // Validation du nombre de quiz
      if (parsed.quizzes.length === 0) {
        throw new Error('Aucun quiz généré');
      }
      
      console.log(`✅ ${parsed.quizzes.length} quiz générés`);
      
      return {
        summary: parsed.summary,
        quizzes: parsed.quizzes,
        tips: parsed.tips
      };
    }

    throw new Error('Format de réponse invalide de LM Studio');
  } catch (error) {
    console.error('❌ Erreur parsing réponse IA:', error);
    
    // En cas d'erreur, retourner une réponse par défaut
    console.log('🔧 Génération d\'une réponse par défaut...');
    return {
      summary: "Résumé du cours non disponible en raison d'une erreur de parsing.",
      quizzes: [
        {
          question: "Question par défaut - Quel est le sujet principal de ce cours ?",
          options: {
            A: "Option A",
            B: "Option B", 
            C: "Option C",
            D: "Option D"
          },
          correctAnswer: "A"
        }
      ],
      tips: "Astuce : Consultez le contenu original pour plus de détails."
    };
  }
}

async function callLMStudio(prompt) {
  try {
    console.log('📡 Envoi de la requête à LM Studio...');
    const response = await axios.post(`${LM_STUDIO_URL}/v1/chat/completions`, {
      model: "local-model",
      messages: [
        { role: "system", content: "Tu es un assistant pédagogique qui répond uniquement en JSON valide." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    console.log('✅ Réponse reçue de LM Studio');
    return response.data;
  } catch (error) {
    console.error('❌ Erreur appel LM Studio:', error.message);
    throw new Error(`Erreur de communication avec LM Studio: ${error.message}`);
  }
}
