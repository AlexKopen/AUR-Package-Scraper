# AUR Package Scraper
Aggregates package metadata from the [Arch User Repository](https://aur.archlinux.org/packages/).

## About
This script leverages [Puppeteer](https://github.com/GoogleChrome/puppeteer), [Puppeteer Cluster](https://github.com/thomasdondorf/puppeteer-cluster#clusteridle), and [Cheerio](https://github.com/cheeriojs/cheerio) to scrape and parse package details from the Arch User Repository.  This data is written to a JSON file and can be used in any database or application. 

## Installation
```
npm install
```

## Usage
```
npm start
```

All scraped values will be saved to `aur-package-data.json`.  The number of cores on the host system is used to determine the level of concurrency.  As of 10/15/19, using a stable internet connection and 12-core processor, the total runtime is approximately 50 seconds.  The generated JSON file is around 475,683 lines long and 11.9 Mib in size.

## Sample JSON Output
```json
	{
		"name": "yay",
		"version": "9.3.1-1",
		"votes": 793,
		"popularity": 61.36,
		"description": "Yet another yogurt. Pacman wrapper and AUR helper written in go.",
		"maintainer": "jguer"
	}
```
