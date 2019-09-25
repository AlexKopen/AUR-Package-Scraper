import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as writeJsonFile from 'write-json-file';

const values = [];
const archUrlStart = 'https://aur.archlinux.org/packages/?O=';
const archUrlEnd = '&SeB=nd&K=&outdated=&SB=n&SO=a&PP=250&do_Search=Go';
let browser;
let totalPackages;

(async () => {
    browser = await puppeteer.launch();
    await fetchPageStats();
    await scrapePackageInfo();
    await browser.close();
})();

async function fetchPageStats() {
    const page = await browser.newPage();
    await page.goto(archUrlStart + archUrlEnd);
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);

    const $ = cheerio.load(bodyHtml);
    const statText = ($('.pkglist-stats').first().children('p').first().text());
    totalPackages = statText.trim().split(' ')[0];
}

async function scrapePackageInfo() {
    for (let i = 0; i <= totalPackages; i += 250) {
        const page = await browser.newPage();
        await page.goto(`${archUrlStart}${i}${archUrlEnd}`);
        const bodyHtml = await page.evaluate(() => document.body.innerHTML);

        const $ = cheerio.load(bodyHtml);

        $('.results tbody tr').each((index, element) => {
            const columns = $(element).children('td');

            values.push(
                {
                    name: $(columns.get(0)).children('a').text(),
                    version: $(columns.get(1)).text(),
                    votes: $(columns.get(2)).text(),
                    popularity: $(columns.get(3)).text(),
                    description: $(columns.get(4)).text(),
                    maintainer: $(columns.get(5)).children('a').text(),
                }
            );


        });

        console.log(`wrote ${i + 250} packages`);
    }

    await writeJsonFile('aur-package-data.json', values);
}