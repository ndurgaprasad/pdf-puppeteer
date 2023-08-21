const express = require('express');
const router = express.Router();

const { msContent } = require('../services/ms/content-service');
const { msPsdGenerator } = require('../services/ms/pdf-generator');

router.post('/ms-generate-pdf', async (req, res) => {
  try {
    const { links } = req.body;

    // Build content from the links
    const tableHTML = await msContent(links);

    // Generate and save PDF
    const pdfBuffer = await msPsdGenerator(tableHTML);

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
