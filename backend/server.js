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
  return `Tu es un professeur expert qui crée une formation pratique et détaillée. ATTENTION: Ne fais PAS d'introduction générale ou de survol. Tu dois créer un VRAI COURS qui enseigne des compétences concrètes.

EXEMPLE DE MAUVAIS CONTENU (À NE PAS FAIRE):
❌ "Découvrez la définition de X et son importance..."
❌ "Dans ce cours, nous explorerons le concept de X..."
❌ "Nous aborderons les différents aspects de X..."
❌ "Introduction aux principes de X..."

EXEMPLE DE BON CONTENU (À FAIRE):
✅ "Pour créer un elevator pitch efficace, commencez par identifier votre USP (Unique Selling Proposition). Prenez votre produit principal et listez ses 3 caractéristiques uniques. Par exemple, si vous vendez un logiciel de gestion de temps, vos USP pourraient être : 1) synchronisation instantanée entre appareils, 2) rapports d'analyse personnalisés, 3) intégration avec le calendrier. Ensuite, transformez ces caractéristiques en bénéfices clients concrets. Pour notre exemple : 1) accédez à vos tâches partout, instantanément, 2) optimisez votre productivité avec des données précises, 3) plus besoin de jongler entre applications..."
STRUCTURE OBLIGATOIRE POUR CHAQUE COURS:
1. Technique/Méthode concrète à apprendre
2. Étapes précises de mise en œuvre
3. Exemple détaillé et réel
4. Conseils pratiques d'expert
5. Exercice ou cas pratique
6. Points clés à retenir

Analyse ce contenu:
"""
${text}
"""

Génère EXACTEMENT cette structure JSON avec du contenu qui ENSEIGNE RÉELLEMENT:

{
  "chapters": [
    {
      "id": 1,
      "title": "[Titre précis et technique du chapitre]",
      "courses": [
        {
          "id": 1,
          "title": "[Titre qui annonce une compétence concrète à acquérir]",
          "duration": "4:30",
          "content": "[CONTENU DÉTAILLÉ ET PRATIQUE:

1. TECHNIQUE PRINCIPALE:
- Description précise de la technique/méthode
- Pourquoi elle fonctionne
- Quand l'utiliser

2. ÉTAPES DE MISE EN ŒUVRE:
- Étape 1: [instruction précise]
- Étape 2: [instruction précise]
- Étape 3: [instruction précise]
- Étape 4: [instruction précise]

3. EXEMPLE CONCRET:
- Situation réelle
- Application détaillée de la technique
- Résultat obtenu

4. CONSEILS D'EXPERT:
- Conseil 1: [conseil spécifique]
- Conseil 2: [conseil spécifique]
- Conseil 3: [conseil spécifique]

5. EXERCICE PRATIQUE:
- Mise en situation
- Instructions étape par étape
- Critères de réussite

6. POINTS CLÉS:
- Point clé 1
- Point clé 2
- Point clé 3]"
        }
      ],
      "quizzes": [
        {
          "id": 1,
          "title": "Test pratique - [Nom de la technique]",
          "question": "[Question qui teste l'application pratique de la technique]",
          "options": {
            "A": "[Réponse détaillée montrant l'application correcte]",
            "B": "[Réponse détaillée avec une erreur courante]",
            "C": "[Réponse détaillée avec une autre approche incorrecte]",
            "D": "[Réponse détaillée avec une confusion commune]"
          },
          "correctAnswer": "A"
        }
      ]
    },
    {
      "id": 2,
      "title": "[Titre précis et technique du chapitre]",
      "courses": [
        {
          "id": 2,
          "title": "[Titre qui annonce une compétence concrète à acquérir]",
          "duration": "5:15",
          "content": "[MÊME STRUCTURE DÉTAILLÉE QUE CI-DESSUS]"
        }
      ],
      "quizzes": [
        {
          "id": 2,
          "title": "Test pratique - [Nom de la technique]",
          "question": "[Question qui teste l'application pratique de la technique]",
          "options": {
            "A": "[Réponse détaillée avec une erreur courante]",
            "B": "[Réponse détaillée montrant l'application correcte]",
            "C": "[Réponse détaillée avec une autre approche incorrecte]",
            "D": "[Réponse détaillée avec une confusion commune]"
          },
          "correctAnswer": "B"
        }
      ]
    },
    {
      "id": 3,
      "title": "[Titre précis et technique du chapitre]",
      "courses": [
        {
          "id": 3,
          "title": "[Titre qui annonce une compétence concrète à acquérir]",
          "duration": "6:00",
          "content": "[MÊME STRUCTURE DÉTAILLÉE QUE CI-DESSUS]"
        }
      ],
      "quizzes": [
        {
          "id": 3,
          "title": "Test pratique - [Nom de la technique]",
          "question": "[Question qui teste l'application pratique de la technique]",
          "options": {
            "A": "[Réponse détaillée avec une erreur courante]",
            "B": "[Réponse détaillée avec une autre approche incorrecte]",
            "C": "[Réponse détaillée montrant l'application correcte]",
            "D": "[Réponse détaillée avec une confusion commune]"
          },
          "correctAnswer": "C"
        }
      ]
    }
  ]
}

RÈGLES ABSOLUES:
1. JAMAIS de contenu introductif ou descriptif
2. TOUJOURS du contenu qui enseigne des techniques concrètes
3. OBLIGATION de suivre la structure en 6 points pour chaque cours
4. MINIMUM 3 exemples concrets par cours
5. TOUJOURS des étapes précises et actionnables
6. Si le PDF est incomplet, COMPLÈTE avec tes connaissances d'expert
7. Les quiz doivent tester l'application pratique, pas la théorie
8. Chaque réponse de quiz doit être détaillée et explicative`;
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
