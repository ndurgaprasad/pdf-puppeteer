const express = require('express');
const router = express.Router();

const { scrapeArticleContent } = require('../services/contentService');
const { generatePDFFromTemplate } = require('../services/pdfGenerationService');

router.post('/generate-pdf', async (req, res) => {
  try {
    const { links } = req.body;

    // Build content from the links
    const articles = await scrapeArticleContent(links);

    // Generate and save PDF
    const pdfBuffer = await generatePDFFromTemplate(articles);
    console.log(pdfBuffer);
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="articles.pdf"');

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;
