import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as writeJsonFile from 'write-json-file';

const {Cluster} = require('puppeteer-cluster');
const os = require('os');

(async () => {
    const packagesMetadata = [];
    const archUrlStart = 'https://aur.archlinux.org/packages/?O=';
    const archUrlEnd = '&SeB=nd&K=&outdated=&SB=n&SO=a&PP=250&do_Search=Go';
    const pageCount = 250;
    let count = 0;

    // Fetch packages stats
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${archUrlStart}${archUrlEnd}`);
    const bodyHtml = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(bodyHtml);

    const statText = ($('.pkglist-stats').first().children('p').first().text());
    const totalPackages = statText.trim().split(' ')[0];

    // Define cluster parameters
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: os.cpus().length
    });

    // Scrape individual page package data as queue is populated
    await cluster.task(async ({page, data: url}) => {
        await page.goto(url);
        let bodyHtml = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHtml);

        $('.results tbody tr').each((index, element) => {
            const columns = $(element).children('td');

            packagesMetadata.push(
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

        console.log(`${++count}/${Math.floor(totalPackages / pageCount) + 1} pages scraped`)
    });

    // Queue pages to be scraped
    for (let i = 0; i <= totalPackages; i += pageCount) {
        cluster.queue(`${archUrlStart}${i}${archUrlEnd}`);
    }

    // Write results to JSON file when queue is empty
    await cluster.idle();
    await cluster.close();
    await writeJsonFile('aur-package-data.json', packagesMetadata);

    process.exit(0);
})();
