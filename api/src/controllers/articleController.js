const express = require('express');
const router = express.Router();
const {} = require('../services/contentService');
const { generatePDFFromTemplate } = require('../services/pdfGenerationService');

router.post('/generate-pdf', async (req, res) => {
  try {
    const { urls } = req.body;

    const articles = [];
    for (const url of urls) {
      const article = await scrapeArticleContent(url);
      articles.push(article);
    }

    // Compile Handlebars template
    const compiledTemplate = handlebars.compile(pdfTemplate);
    const htmlContent = compiledTemplate({ articles });

    // Generate and save PDF
    const pdfBuffer = generatePDFFromTemplate(htmlContent);
    fs.writeFileSync('output.pdf', pdfBuffer);

    res.json({ message: 'PDFs generated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
