const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const path = require('path');

async function msPsdGenerator(tableHTML) {
  // Generate PDF
  const pdfBrowser = await puppeteer.launch();
  const pdfPage = await pdfBrowser.newPage();

  // Load the HTML template

  const pdfTemplate = fs.readFileSync(
    path.resolve(__dirname, '../../templates/ms-pdf-template.hbs'),
    'utf-8'
  );
  const template = handlebars.compile(pdfTemplate);
  const pdfContent = template({
    headTag: tableHTML.headTag,
    svgElement: tableHTML.svgElement,
  });
  console.log(pdfContent);

  await pdfPage.setContent(pdfContent);
  const pdfBuffer = await pdfPage.pdf({ format: 'A4' });
  await pdfBrowser.close();

  return pdfBuffer;
}

module.exports = {
  msPsdGenerator,
};
