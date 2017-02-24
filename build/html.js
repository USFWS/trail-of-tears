const fs = require('fs');

const cheerio = require('cheerio');
const moment = require('moment');
const parallel = require('async/parallel');
const pug = require('pug');
const tidy = require('htmltidy').tidy;
const slugify = require('underscore.string/slugify');

const template = pug.compileFile('./src/templates/locations.pug');
const htmlPath = 'src/index.html';
const jsonPath = 'src/data/locations.geojson'
const htmlOutPath = 'dist/index.html';

parallel([
  getFile.bind(null, htmlPath),
  getFile.bind(null, jsonPath)
], buildPage);

function buildPage (err, results) {
    if (err) console.log(err);

    const $ = cheerio.load(results[0]);
    const locations = JSON.parse(results[1]);
    const tidyOptions = {
      doctype: 'html5',
      indent: true,
      outputXml: true,
      wrap: 10000
    };

    $('.locations').append( template({ locations: locations.features, slugify }) );
    $('.last-updated').append(`Last Updated: ${moment().format('MMMM D, YYYY')}`);

    tidy($.html(), tidyOptions, (err, prettyHtml) => {
      if (err) chalk.red(err);
      writeOutput(htmlOutPath, prettyHtml);
    });
  }

function writeOutput(path, data) {
  fs.writeFile(path, data, err => {
    if (err) chalk.red(err);
  });
}

function getFile (path, cb) {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) return cb(err);
    else return cb(null, data);
  });
}
