const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs-extra');

async function msContent(links) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let svgElement = '';
  let headTag = '';
  for (const link of links) {
    await page.goto(link, { waitUntil: 'networkidle2' });

    headTag = await page.$eval('head', (el) => el.innerHTML);

    // Capture SVG
    svgElement = await page.$eval(
      'sal-components-funds-quote',
      (el) => el.outerHTML
    );
  }

  await browser.close();
  console.log(svgElement, headTag);
  return { svgElement, headTag };
}

module.exports = {
  msContent,
};
