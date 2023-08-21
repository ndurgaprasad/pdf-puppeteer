const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

async function scrapeArticleContent(links) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const articles = [];
  for (const link of links) {
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    const articleTitle = await page.title();
    const elements = [
      '.crayons-article__main h1',
      '.crayons-article__main h2',
      '.crayons-article__main p',
      '.ws-table-all',
    ];

    let articleContent = '';
    for (ele of elements) {
      let content = '';
      try {
        content = await page.$eval(`${ele}`, (el) => el.innerHTML);
      } catch (error) {
        // console.log(error);
      }
      if (content != '') {
        articleContent += content + '<br />';
      }
    }

    articles.push({
      title: articleTitle,
      content: new handlebars.SafeString(articleContent),
    });
  }

  await browser.close();
  return articles;
}

module.exports = {
  scrapeArticleContent,
};
