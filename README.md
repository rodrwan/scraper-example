# Scraper example

In this example we scrape a basic web page.

[TerraFirma](http://www.terrafirma.cl/)

We extract the link of the shop and extract some list products.

Basically here we demonstrate the power of Yakuza framework.

## Directory structure:

```
.
├── bikes
│   └── terra-firma
│       └── get-shop-link
└── node_modules
    ├── cheerio
    ├── colors
    └── gurkha
    ├── lodash
    └── yakuza
```

- bikes is the main scraper
- terra-firma is where the agent is defined
- get-shop-link is where we create the task to extract shop link

## Install and Run

To install this repo, first you need to clone it.
```sh
git clone git@github.com:rodrwan/scraper-example.git
```

Then to need to install npm packages:
```sh
npm install
```

Finally, you can run:
```sh
node app.js
```
or run
```sh
npm start
```
