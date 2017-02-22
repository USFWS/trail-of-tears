const async = require('async');
const sharp = require('sharp');
const chalk = require('chalk');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const rimraf = require('rimraf');

const fs = require('fs');
const path = require('path');

const input = 'src/images/';
const output = 'dist/images/';

const width = 600;

function build(done) {
  chalk.blue('Processing Images...');

  rimraf(`${output}/**/*.jpg`, err => {
    if (err) return done(err);

    fs.readdir(input, (err, files) => {
      if (err) return done(err);

      // Remove .DS_Store files, they're the worst.
      files = files.filter(file => file !== '.DS_Store');

      async.eachLimit(files, 5, (name, cb) => {
        const filepath = path.join(input, name);
        processHeroImage(filepath, cb);
      }, done);
    });
  });
}

function processHeroImage(filepath, done) {
  const filename = path.basename(filepath);
  console.log(filename);

  sharp(filepath)
    .resize(width)
    .toBuffer((err, buffer, info) => {
      if (err) chalk.red(err);
      const outfile = path.join(output, filename);
      minify(buffer, outfile, done);
    });
}

function minify(buffer, filename, done) {
  imagemin.buffer(buffer, filename, {
    plugins: [ imageminMozjpeg() ]
  }).then(buffer => {
    const directory = path.dirname(filename);
    fs.writeFile(filename, buffer, done);
  }).catch(done);
}

function removeImage(filepath) {
  const fileToDelete = path.join( output + path.basename(filepath) );
  fs.access(fileToDelete, (err) => {
    if (err) chalk.red(err);
    else {
      fs.unlink(fileToDelete, (err) => {
        if (err) chalk.red(err);
      });
    }
  });
}

module.exports.process = processHeroImage;
module.exports.remove = removeImage;
module.exports.build = build;

require('make-runnable');
