# AUR Package Scraper
Scrapes package meta data from the [Arch User Repository](https://aur.archlinux.org/packages/)

# About
This script leverages [Puppeteer](https://github.com/GoogleChrome/puppeteer) to scrape and [Cheerio](https://github.com/cheeriojs/cheerio) to parse package data, from the Arch User Repository. 

# Installation
```
npm install
```

# Usage
```
npm start
```

This will scrape all package meta data, and save it to `aur-package-data.json`.  The script takes approximately 4 minutes to run with a stable internet connection.

# Sample JSON Output
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
