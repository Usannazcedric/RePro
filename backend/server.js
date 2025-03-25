const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

const port = 3000;
const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze-ebook', upload.single('ebook'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Générer un résumé simple
    const resume = genererResumeSimple(text);

    fs.unlinkSync(filePath);
    res.json({ generatedContent: resume });

  } catch (err) {
    console.error(err);
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Erreur traitement PDF' });
  }
});

app.listen(port, () => {
  console.log(`Backend en écoute sur http://localhost:${port}`);
});

// Fonction pour générer un résumé simple en une phrase
function genererResumeSimple(text) {
  // Recherche d'un sujet général à partir des premières lignes du texte
  const lignes = text.split('\n').slice(0, 5); // Prendre les 5 premières lignes pour un résumé rapide
  const resume = lignes.join(' '); // Fusionner les lignes et les simplifier

  // Si la première ligne contient un résumé utile, l'utiliser
  const resumeCourt = resume.replace(/\n/g, ' ').slice(0, 200); // Limiter à 200 caractères pour la clarté
  return resumeCourt;
}
