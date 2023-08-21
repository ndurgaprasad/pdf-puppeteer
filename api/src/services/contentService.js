const puppeteer = require('puppeteer');

async function articleContent(url) {
  await page.goto(link, { waitUntil: 'domcontentloaded' });
  const articleTitle = await page.title();
  // const articleContent = await page.content();
  const elements = ['h2', 'img', 'p'];

  let articleContent = '';
  for (ele of elements) {
    articleContent +=
      (await page.$eval(`.crayons-article__main ${ele}`, (el) => {
        console.log(el);
        return el === 'img' ? el : el.innerHTML;
      })) + '<br />';
  }
  return articleContent;
}

module.exports = {
  scrapeArticleContent,
};
