const puppeteer = require("puppeteer");
const XLSX = require("xlsx");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome", // Required for Render
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto("https://books.toscrape.com/");

  const grab = await page.evaluate(() => {
    let t = document.querySelectorAll(".row .product_pod");
    let arr = [];

    t.forEach((element) => {
      let p = element.querySelector("h3 a");
      let price = element.querySelector(".product_price .price_color");
      let rating = element.querySelector("p");
      let avail = element.querySelector(".instock.availability");

      arr.push({
        Book_Name: p.innerHTML,
        Price: price.innerHTML,
        Rating: rating.className.split(" ")[1],
        Availibility: avail.innerText.trim(),
      });
    });

    return arr;
  });

  console.log(grab);

  const ws = XLSX.utils.json_to_sheet(grab);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Books");
  XLSX.writeFile(wb, "books.xlsx");

  await browser.close();
})();
