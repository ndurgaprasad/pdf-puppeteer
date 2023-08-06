import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const bodyParser = require('body-parser');
const fs = require('fs-extra');

import { sample_foods } from './data';

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200'],
  })
);

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/foods', (req, res) => {
  res.send(sample_foods);
});

app.post('/generate-pdf', async (req, res) => {
  try {
    const urls = req.body.urls as string[];
    const pdf = await downloadPdfFromUrls(urls);

    // Set the response headers
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="generated-pdf.pdf"'
    );
    res.setHeader('Content-Type', 'application/pdf');

    // Send the PDF as a response
    res.send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

async function downloadPdfFromUrls(urls: string[]): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const pdfs = [];
  for (const url of urls) {
    await page.goto(url);
    const pdf = await page.pdf({ format: 'A4' });
    console.log(`==== URLs ==== ${url}`);
    pdfs.push(pdf);
  }

  await browser.close();

  return Buffer.concat(pdfs);
}

const port = 5001;
app.listen(port, () => {
  console.log('Website served on http://localhost:' + port);
});
