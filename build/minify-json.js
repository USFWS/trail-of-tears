const jsonminify = require('jsonminify');
const glob = require('glob');
const each = require('async/each');

const fs = require('fs');
const path = require('path');

const jsonSrc = 'src/data/**/*.geojson';
const dist = 'dist/data/';

function build(done) {
  glob(jsonSrc, (err, files) => {
    if (err) return done(err);
    each(files, minifyJSON, done);
  });
}

function minifyJSON(filepath, cb) {
  fs.readFile(filepath, 'utf8', (err, json) => {
    if (err) console.log(err);

    const basename = path.basename(filepath).replace('geojson', 'js');
    const outpath = path.join(dist, basename);
    fs.writeFile(outpath, jsonminify(json, 'utf8'), (err) => {
      if (err) console.log(err);
      if (cb) cb();
    });
  });
}

function removeJSON(filepath) {
  const fileToDelete = path.join( dist + path.basename(filepath).replace('geojson', 'js') );
  fs.access(fileToDelete, (err) => {
    if (err) console.error(err);
    else {
      fs.unlink(fileToDelete, (err) => {
        if (err) console.error(err);
      });
    }
  });
}

module.exports.removeJSON = removeJSON;
module.exports.minifyJSON = minifyJSON;
module.exports.build = build;

require('make-runnable');
