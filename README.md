# AUR Package Scraper
Scrapes package meta data from the [Arch User Repository](https://aur.archlinux.org/packages/)

## About
This script leverages [Puppeteer](https://github.com/GoogleChrome/puppeteer) to scrape and [Cheerio](https://github.com/cheeriojs/cheerio) to parse package data from the Arch User Repository. 

## Installation
```
npm install
```

## Usage
```
npm start
```

All package meta data will be saved to `aur-package-data.json`.  The total runtime is approximately 4 minutes with a stable internet connection.

## Sample JSON Output
```json
	{
		"name": "yay",
		"version": "9.3.1-1",
		"votes": "793",
		"popularity": "61.36",
		"description": "Yet another yogurt. Pacman wrapper and AUR helper written in go.",
		"maintainer": "jguer"
	}
```
