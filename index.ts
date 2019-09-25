import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as writeJsonFile from 'write-json-file';

const values = [];
const archUrlStart = 'https://aur.archlinux.org/packages/?O=';
const archUrlEnd = '&SeB=nd&K=&outdated=&SB=n&SO=a&PP=250&do_Search=Go';
const pageSize = 250;
let browser, totalPackages, page, bodyHtml, $;

(async () => {
    browser = await puppeteer.launch();
    await fetchPageStats();
    await scrapePackageInfo();
    await browser.close();
})();

async function fetchPageStats() {
    await initialPageLoad(`${archUrlStart}${archUrlEnd}`);

    const statText = ($('.pkglist-stats').first().children('p').first().text());
    totalPackages = statText.trim().split(' ')[0];
}

async function scrapePackageInfo() {
    for (let i = 0; i <= totalPackages; i += pageSize) {
        await initialPageLoad(`${archUrlStart}${i}${archUrlEnd}`);

        $('.results tbody tr').each((index, element) => {
            const columns = $(element).children('td');

            values.push(
                {
                    name: $(columns.get(0)).children('a').text(),
                    version: $(columns.get(1)).text(),
                    votes: parseInt($(columns.get(2)).text()),
                    popularity: parseInt($(columns.get(3)).text()),
                    description: $(columns.get(4)).text(),
                    maintainer: $(columns.get(5)).children('a').text(),
                }
            );


        });

        console.log(`Scraped ${i + pageSize} packages`);
    }

    await writeJsonFile('aur-package-data.json', values);
}

async function initialPageLoad(url) {
    page = await browser.newPage();
    await page.goto(url);
    bodyHtml = await page.evaluate(() => document.body.innerHTML);
    $ = cheerio.load(bodyHtml);
}
