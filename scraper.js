const { chromium } = require('playwright');

async function scrapeQuestionsFromUrl(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const questions = await page.$$eval('.question', (elements) =>
    elements.map(el => {
      const question = el.querySelector('.question-text')?.innerText;
      const options = Array.from(el.querySelectorAll('.option')).map(opt => opt.innerText);
      return { question, options };
    })
  );

  await browser.close();
  return questions;
}

module.exports = { scrapeQuestionsFromUrl };