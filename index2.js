const puppeteer = require("puppeteer");
const fs = require("fs/promises");
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://quotes.toscrape.com/");
  await page.screenshot({ path: "my-website.png" });

  const grabContact = await page.evaluate(() => {
    const pgTag = document.querySelectorAll(".c-info-item");
    let infos = [];
    pgTag.forEach((div) => {
      infos.push(div.innerText);
    });

    return infos;
  });

  const grabQuotes = await page.evaluate(() => {
    const quotes = document.querySelectorAll(".quote");
    let quotesArr = [];
    quotes.forEach((quote) => {
      const quoteInfo = quote.querySelectorAll("span");
      const quoteText = quoteInfo[0].innerText;
      const authorName = quoteInfo[1].querySelector("small").innerText;
      quotesArr.push({
        quote: quoteText,
        author: authorName,
      });
    });

    return quotesArr;
  });

  console.log(grabQuotes);

  fs.writeFile("quotes.json", JSON.stringify(grabQuotes));

  await page.click('a[href="/login"]');
  await page.type("#username", "SafinAhmed", { delay: 100 });
  await page.type("#password", "12345", { delay: 100 });
  await page.click('input[value="Login"]');

  await browser.close();
})();
