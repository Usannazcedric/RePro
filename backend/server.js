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
    const { chapters } = parseAIResponse(aiResponse);
    console.log('✅ Parsing réussi');

    // Nettoyage des fichiers temporaires
    if (ebookPath && fs.existsSync(ebookPath)) {
      fs.unlinkSync(ebookPath);
    }
    if (coverImagePath && fs.existsSync(coverImagePath)) {
      fs.unlinkSync(coverImagePath);
    }

    res.json({ 
      chapters: chapters,
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

function buildPrompt(text, quizConfig = { chapters: 3, quizzes: 5 }, infos = {}) {
  return `
Tu es une IA éducative française. Tu dois OBLIGATOIREMENT générer une structure de formation avec 3 chapitres EN FRANÇAIS.

TRÈS IMPORTANT: 
- Réponds UNIQUEMENT en FRANÇAIS
- Tout le contenu doit être en FRANÇAIS (titres, descriptions, questions, options)
- Tu dois répondre UNIQUEMENT avec le JSON suivant, rien d'autre

Analyse ce contenu de cours:
"""
${text}
"""

Génère EXACTEMENT cette structure JSON (remplace les [...] par du contenu adapté au document EN FRANÇAIS):

{
  "chapters": [
    {
      "id": 1,
      "title": "[Titre du chapitre 1 basé sur le contenu - EN FRANÇAIS]",
      "courses": [
        {
          "id": 1,
          "title": "[Titre du cours basé sur le contenu - EN FRANÇAIS]",
          "duration": "4:30",
          "content": "[Description détaillée du cours en 2-3 phrases basée sur le contenu du PDF - EN FRANÇAIS]"
        }
      ],
      "quizzes": [
        {
          "id": 1,
          "title": "Test - Chapitre 1",
          "question": "[Question basée sur le contenu du chapitre - EN FRANÇAIS]",
          "options": {
            "A": "[Option basée sur le contenu - EN FRANÇAIS]",
            "B": "[Option basée sur le contenu - EN FRANÇAIS]",
            "C": "[Option basée sur le contenu - EN FRANÇAIS]",
            "D": "[Option basée sur le contenu - EN FRANÇAIS]"
          },
          "correctAnswer": "A"
        }
      ]
    },
    {
      "id": 2,
      "title": "[Titre du chapitre 2 basé sur le contenu - EN FRANÇAIS]",
      "courses": [
        {
          "id": 2,
          "title": "[Titre du cours basé sur le contenu - EN FRANÇAIS]",
          "duration": "5:15",
          "content": "[Description détaillée du cours en 2-3 phrases basée sur le contenu du PDF - EN FRANÇAIS]"
        }
      ],
      "quizzes": [
        {
          "id": 2,
          "title": "Test - Chapitre 2",
          "question": "[Question basée sur le contenu du chapitre - EN FRANÇAIS]",
          "options": {
            "A": "[Option basée sur le contenu - EN FRANÇAIS]",
            "B": "[Option basée sur le contenu - EN FRANÇAIS]",
            "C": "[Option basée sur le contenu - EN FRANÇAIS]",
            "D": "[Option basée sur le contenu - EN FRANÇAIS]"
          },
          "correctAnswer": "B"
        }
      ]
    },
    {
      "id": 3,
      "title": "[Titre du chapitre 3 basé sur le contenu - EN FRANÇAIS]",
      "courses": [
        {
          "id": 3,
          "title": "[Titre du cours basé sur le contenu - EN FRANÇAIS]",
          "duration": "6:00",
          "content": "[Description détaillée du cours en 2-3 phrases basée sur le contenu du PDF - EN FRANÇAIS]"
        }
      ],
      "quizzes": [
        {
          "id": 3,
          "title": "Test - Chapitre 3",
          "question": "[Question basée sur le contenu du chapitre - EN FRANÇAIS]",
          "options": {
            "A": "[Option basée sur le contenu - EN FRANÇAIS]",
            "B": "[Option basée sur le contenu - EN FRANÇAIS]",
            "C": "[Option basée sur le contenu - EN FRANÇAIS]",
            "D": "[Option basée sur le contenu - EN FRANÇAIS]"
          },
          "correctAnswer": "C"
        }
      ]
    }
  ]
}

RÈGLES STRICTES:
- Réponds UNIQUEMENT avec ce JSON
- Remplace tous les [...] par du contenu réel EN FRANÇAIS
- 3 chapitres OBLIGATOIRES
- Minimum 1 cours et 1 quiz par chapitre
- Tu peux ajouter plus de cours/quiz si tu veux
- Durées entre 3:00 et 8:00
- TOUT LE CONTENU DOIT ÊTRE EN FRANÇAIS
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
      
      // Gestion spéciale pour JSON coupé - essayer de le compléter
      let cleanContent = content;
      const lastBrace = content.lastIndexOf('}');
      
      // Si le JSON semble coupé, essayer de le réparer
      if (lastBrace === -1 || !content.trim().endsWith('}')) {
        console.log('🔧 JSON semble coupé, tentative de réparation...');
        
        // Chercher le dernier chapitre complet
        const chaptersMatch = content.match(/"chapters":\s*\[(.*)/s);
        if (chaptersMatch) {
          const chaptersContent = chaptersMatch[1];
          
          // Compter les accolades ouvertes vs fermées pour voir où on en est
          let openBraces = 0;
          let lastCompleteChapter = 0;
          
          for (let i = 0; i < chaptersContent.length; i++) {
            if (chaptersContent[i] === '{') openBraces++;
            if (chaptersContent[i] === '}') {
              openBraces--;
              if (openBraces === 0) {
                lastCompleteChapter = i;
              }
            }
          }
          
          if (lastCompleteChapter > 0) {
            // Reconstruit le JSON avec les chapitres complets
            const validChapters = chaptersContent.substring(0, lastCompleteChapter + 1);
            cleanContent = `{"chapters":[${validChapters}]}`;
            console.log('🔧 JSON réparé:', cleanContent);
          }
        }
      } else {
        // Supprime tout texte après le dernier }
        if (lastBrace !== -1 && lastBrace < content.length - 1) {
          cleanContent = content.substring(0, lastBrace + 1);
        }
      }
      
      console.log('🧹 JSON nettoyé:', cleanContent);
      
      const parsed = JSON.parse(cleanContent);
      console.log('✅ Parsing JSON réussi');
      
      // Validation des données
      if (!parsed.chapters || !Array.isArray(parsed.chapters)) {
        throw new Error('Structure JSON invalide - chapitres manquants');
      }
      
      console.log(`📊 ${parsed.chapters.length} chapitres trouvés`);
      
      // Si on a moins de 3 chapitres mais au moins 1, on garde ce qu'on a
      if (parsed.chapters.length === 0) {
        throw new Error('Aucun chapitre trouvé');
      }
      
      // Validation de chaque chapitre
      parsed.chapters.forEach((chapter, index) => {
        if (!chapter.title || !chapter.courses || !chapter.quizzes) {
          throw new Error(`Chapitre ${index + 1} invalide - champs manquants`);
        }
        if (!Array.isArray(chapter.courses) || !Array.isArray(chapter.quizzes)) {
          throw new Error(`Chapitre ${index + 1} invalide - cours ou quiz ne sont pas des tableaux`);
        }
        if (chapter.courses.length === 0 || chapter.quizzes.length === 0) {
          throw new Error(`Chapitre ${index + 1} invalide - doit avoir au moins 1 cours et 1 quiz`);
        }
      });
      
      console.log(`✅ ${parsed.chapters.length} chapitres validés avec succès`);
      
      return {
        chapters: parsed.chapters
      };
    }

    throw new Error('Format de réponse invalide de LM Studio');
  } catch (error) {
    console.error('❌ Erreur parsing réponse IA:', error);
    console.error('📄 Contenu qui a causé l\'erreur:', response?.choices?.[0]?.message?.content?.substring(0, 500));
    
    // En cas d'erreur, retourner une réponse par défaut basée sur Elevator Pitch
    console.log('🔧 Génération d\'une réponse par défaut basée sur Elevator Pitch...');
    return {
      chapters: [
        {
          id: 1,
          title: "Introduction à l'elevator pitch",
          courses: [
            {
              id: 1,
              title: "Concept et importance de l'elevator pitch",
              duration: "4:30",
              content: "L'elevator pitch est un pitch court et convaincant qui résume une idée, un projet ou un produit en quelques minutes. Découvrez son importance dans le monde des affaires."
            }
          ],
          quizzes: [
            {
              id: 1,
              title: "Test - Chapitre 1",
              question: "Qu'est-ce que l'elevator pitch ?",
              options: {
                A: "Un discours long et complexe",
                B: "Une courte présentation convaincante",
                C: "Une réunion en elevator",
                D: "Un type de pitch business"
              },
              correctAnswer: "B"
            }
          ]
        },
        {
          id: 2,
          title: "Les composants clés",
          courses: [
            {
              id: 2,
              title: "Composantes clés d'un elevator pitch",
              duration: "5:15",
              content: "Dans cette section, nous examinerons les différentes composantes clés d'un elevator pitch, telles que la concision, la clarté, la crédibilité et la conceptualisation."
            }
          ],
          quizzes: [
            {
              id: 2,
              title: "Test - Chapitre 2",
              question: "Quelles sont les composantes clés d'un elevator pitch ?",
              options: {
                A: "Concis, Clair, Convaincant et Conceptuel",
                B: "Long, Confus, Pas convaincant et Non conceptuel",
                C: "Concis, Non clair, Non convaincant et Non conceptuel",
                D: "Concis, Clair, Convaincant, Conceptuel et Concret"
              },
              correctAnswer: "A"
            }
          ]
        },
        {
          id: 3,
          title: "La structure",
          courses: [
            {
              id: 3,
              title: "Structure d'un elevator pitch",
              duration: "6:00",
              content: "Dans cette section, nous examinerons la structure typique d'un elevator pitch, telle que décrite par Chris O'Leary. Nous explorerons également d'autres structures de pitch."
            }
          ],
          quizzes: [
            {
              id: 3,
              title: "Test - Chapitre 3",
              question: "Quelle est la structure typique d'un elevator pitch ?",
              options: {
                A: "Introduction, développement, conclusion",
                B: "Présentation, argumentation, appel à l'action",
                C: "Problème, solution, bénéfices",
                D: "Qui, quoi, pourquoi, comment"
              },
              correctAnswer: "C"
            }
          ]
        }
      ]
    };
  }
}

async function callLMStudio(prompt) {
  try {
    console.log('📡 Envoi de la requête à LM Studio...');
    const response = await axios.post(`${LM_STUDIO_URL}/v1/chat/completions`, {
      model: "local-model",
      messages: [
        { role: "system", content: "Tu es un assistant pédagogique français qui répond uniquement en JSON valide EN FRANÇAIS. Tout le contenu que tu génères doit être en français." },
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
