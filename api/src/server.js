const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs-extra');

const app = express();
app.use(express.json());

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200'],
  })
);

app.post('/generate-pdf', async (req, res) => {
  try {
    const links = req.body.links;
    console.log('Received links:', links);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // const articleUrls = require('./articles.json');
    const articles = [];

    for (const link of links) {
      await page.goto(link, { waitUntil: 'domcontentloaded' });
      const articleTitle = await page.title();
      // const articleContent = await page.content();
      const elements = ['h1', 'h2', 'p'];

      let articleContent = '';
      for (ele of elements) {
        let content = '';
        try {
          content = await page.$eval(
            `.crayons-article__main ${ele}`,
            (el) => el.innerHTML
          );
        } catch (error) {}
        if (content != '') {
          articleContent += content + '<br />';
        }
      }

      articles.push({
        title: articleTitle,
        content: new handlebars.SafeString(articleContent),
      });
    }
    // Close browser
    await browser.close();

    // Generate PDF
    const pdfBrowser = await puppeteer.launch();
    const pdfPage = await pdfBrowser.newPage();

    // Load the HTML template
    const pdfTemplate = fs.readFileSync(
      'templates/article-template.hbs',
      'utf-8'
    );
    const template = handlebars.compile(pdfTemplate);

    const pdfContent = template({ articles });

    await pdfPage.setContent(pdfContent);
    const pdfBuffer = await pdfPage.pdf({ format: 'A4' });
    await pdfBrowser.close();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="articles.pdf"');

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

const port = 5001;
app.listen(port, () => {
  console.log('Website served on http://localhost:' + port);
});
