const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

app.use(require('cors')());

app.post('/api/analyze-ebook', upload.single('ebook'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.slice(0, 8000); // tronque long PDF

    const prompt = buildPrompt(text);
    const aiResponse = await callLMStudio(prompt);

    fs.unlinkSync(filePath);
    res.json({ generatedContent: aiResponse });

  } catch (err) {
    console.error(err);
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Erreur traitement PDF' });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur backend en écoute sur http://localhost:${port}`);
});

function buildPrompt(text) {
    return `
  Tu es une IA éducative spécialisée dans la rédaction de contenus pédagogiques en français parfait (sans fautes de grammaire, conjugaison ou syntaxe).
  
  Voici un extrait de cours à résumer et transformer :
  
  """
  ${text}
  """
  
  Ta mission :
  
  1. ✏️ Rédige un résumé clair, fluide, bien structuré, en français impeccable, de 2 à 3 phrases.
  2. 🧠 Crée 3 questions de quiz sous la forme :
     - Q1 : [texte de la question]
       A) ...
       B) ...
       C) ...
       D) ...
       Réponse correcte : ...
     - Pas de balises HTML ni de formatage Markdown (pas de \`\`\`scss ni autre).
  3. 💡 Donne une astuce ou un point clé à retenir à la fin, dans une phrase concise et bien rédigée.
  
  Ne numérote pas les grandes sections (Résumé, Quiz, Astuce), mais commence directement par le texte, dans cet ordre :
  
  Résumé  
  Questions de quiz  
  Astuce
  
  Respecte imperativement les retours à la ligne pour faciliter la lecture, d'abord, le résumé du cours, ensuite retour a ligne, les quiz, et enfin retour a ligne, l'astuce.
  `;
  }
  

async function callLMStudio(prompt) {
  try {
    const response = await axios.post('http://127.0.0.1:1234/v1/chat/completions', {
      model: "local-model", // nom par défaut dans LM Studio
      messages: [
        { role: "system", content: "Tu es un assistant pédagogique." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('❌ Erreur appel LM Studio :', error);
    return 'Erreur IA';
  }
}
