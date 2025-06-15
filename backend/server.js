const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

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

app.post('/api/analyze-ebook', upload.single('ebook'), async (req, res) => {
  const filePath = req.file.path;

  try {
    console.log('📚 Lecture du PDF...');
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.slice(0, 8000);
    console.log('✅ PDF lu avec succès');

    console.log('🤖 Envoi à LM Studio...');
    const prompt = buildPrompt(text);
    const aiResponse = await callLMStudio(prompt);
    console.log('✅ Réponse reçue de LM Studio');
    
    console.log('🔍 Parsing de la réponse...');
    const { summary, quizzes, tips } = parseAIResponse(aiResponse);
    console.log('✅ Parsing réussi');

    fs.unlinkSync(filePath);
    res.json({ 
      summary: summary,
      quizzes: quizzes,
      tips: tips
    });

  } catch (err) {
    console.error('❌ Erreur:', err.message);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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

function buildPrompt(text) {
  return `
Tu es une IA éducative spécialisée dans la création de contenus pédagogiques en français.

Voici un extrait de cours à analyser :

"""
${text}
"""

Génère une réponse structurée avec le format JSON suivant :

{
  "summary": "Le résumé du cours en 2-3 phrases",
  "quizzes": [
    {
      "question": "Question 1",
      "options": {
        "A": "Réponse A",
        "B": "Réponse B",
        "C": "Réponse C",
        "D": "Réponse D"
      },
      "correctAnswer": "A"
    },
    // 2 autres questions similaires
  ],
  "tips": "Une astuce ou point clé à retenir"
}

Important:
1. Le résumé doit être clair et bien structuré
2. Crée exactement 3 questions de quiz
3. L'astuce doit être concise et pertinente
4. Respecte STRICTEMENT le format JSON
`;
}

function parseAIResponse(response) {
  try {
    console.log('🔍 Début du parsing de la réponse...');
    
    // Si la réponse est déjà un objet (cas de LM Studio)
    if (typeof response === 'object' && response.choices) {
      const content = response.choices[0].message.content;
      console.log('📝 Contenu brut reçu:', content);
      
      // Nettoie la réponse pour s'assurer qu'elle ne contient que du JSON
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
      console.log('🧹 JSON nettoyé:', jsonStr);
      
      const parsed = JSON.parse(jsonStr);
      console.log('✅ Parsing JSON réussi');
      
      return {
        summary: parsed.summary,
        quizzes: parsed.quizzes,
        tips: parsed.tips
      };
    }

    throw new Error('Format de réponse invalide de LM Studio');
  } catch (error) {
    console.error('❌ Erreur parsing réponse IA:', error);
    throw new Error(`Erreur de parsing: ${error.message}`);
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
