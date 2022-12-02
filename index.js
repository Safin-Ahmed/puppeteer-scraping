const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cron = require("node-cron");
const start = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://learnwebcode.github.io/practice-requests/");
  await page.screenshot({ path: "portfolio.png", fullPage: true });

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".info strong")).map(
      (item) => item.textContent
    );
  });

  await fs.writeFile("names.txt", names.join("\r\n"));

  const photos = await page.$$eval("img", (imgs) => {
    return imgs.map((img) => img.src);
  });

  for (const photo of photos) {
    const imagepage = await page.goto(photo);
    await fs.writeFile(photo.split("/").pop(), await imagepage.buffer());
  }

  await page.click("#clickme");
  const clickedData = await page.$eval("#data", (el) => el.textContent);

  console.log(clickedData);

  await page.type("#ourfield", "blue");
  await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);

  const info = await page.$eval("#message", (el) => el.textContent);
  console.log(info);

  await browser.close();
};

// Automate every 5 seconds
cron.schedule("*/5 * * * * *", start);
