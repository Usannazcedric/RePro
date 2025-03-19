const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')


const app = express()
const cors = require('cors')
app.use(cors({ origin: 'http://localhost:5173' }))

const port = 3000

const upload = multer({ dest: 'uploads/' })

app.post('/api/analyze-ebook', upload.single('ebook'), async (req, res) => {
  const filePath = req.file.path

  try {
    const dataBuffer = fs.readFileSync(filePath)
    const pdfData = await pdfParse(dataBuffer)
    const text = pdfData.text.slice(0, 3000) 

    const prompt = `Voici le contenu d'un ebook :\n${text}\nFais-moi un résumé simple de ce contenu.`

    const llamaCmd = `/Users/drikce/Desktop/RePro/llama/llama.cpp/build/bin/llama-cli -m /Users/drikce/Desktop/RePro/llama/llama.cpp/models/mistral-7b-instruct-v0.1.Q4_K_M.gguf -p "${prompt.replace(/"/g, '\\"')}" -n 512 2>/dev/null | tail -n +2`

    exec(llamaCmd, (error, stdout, stderr) => {
      fs.unlinkSync(filePath)

      if (error) {
        console.error(`Erreur Llama: ${error}`)
        return res.status(500).json({ error: 'Erreur IA' })
      }

      console.log('Contenu IA :', stdout.trim()) 
      res.json({ generatedContent: stdout.trim() })
    })

  } catch (err) {
    console.error(err)
    fs.unlinkSync(filePath)
    res.status(500).json({ error: 'Erreur traitement PDF' })
  }
})

app.listen(port, () => {
  console.log(`Backend en écoute sur http://localhost:${port}`)
})
