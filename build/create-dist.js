const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const chalk = require('chalk');

const directories = [
  'dist/js',
  'dist/data',
  'dist/css',
  'dist/images',
];

chalk.blue(directories);
rimraf('dist/*', err => {
  if (err) chalk.red(err);

  directories.forEach(path => {
    mkdirp(path, err => {
      if (err) chalk.red(err);
    });
  });
});
