/**
 * Created by godsong on 16/7/6.
 */
const Path = require('path');
const Transformer = require('weex-transformer');
const builder = require('weex-builder');
const Fs = require('fs-extra');
const Config = require('./Config');
const Mkdirp = require('mkdirp');
const chalk = require('chalk');

exports.loader = function (source, targetPath = '') {
  return new Promise((resolve, reject) => {
    const ext = Path.extname(source);
    const basename = ext ? Path.basename(source, ext) : source;
    const targetDir = Path.join(__dirname, '../../frontend/', Config.bundleDir, targetPath);
    builder.build(source, targetDir, Config.webpackConfig, (err, output, json) => {
      if (err) {
        console.log(chalk.red('Build failed!'));
        console.error(chalk.red(err));
        return reject(err);
      }
      else {
        console.log('Build completed!\nChild');
        console.log(output.toString());
        console.log(`Time: ${chalk.bold(json.time)}ms`);
        resolve(targetDir + '/' + basename + '.js');
      }
    });
  });
};
exports.transformer = function (source, targetPath = '') {
  return new Promise((resolve, reject) => {
    Fs.readFile(source, function (err, fileContent) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      const output = Transformer.transform(Path.basename(source, '.we'), fileContent.toString());
      const targetDir = Path.join(__dirname, '../../frontend/', Config.bundleDir, targetPath, Path.basename(source, '.we') + '.js');
      Mkdirp.sync(Path.dirname(targetDir));
      Fs.writeFileSync(targetDir, output.result);
      resolve(targetDir);
    });
  });
};
exports.copy = function (source, targetPath = '') {
  return new Promise((resolve, reject) => {
    const targetDir = Path.join(__dirname, '../../frontend/', Config.bundleDir, targetPath, Path.basename(source));
    Mkdirp.sync(Path.dirname(targetDir));
    const input = Fs.createReadStream(source);
    const output = Fs.createWriteStream(targetDir);
    input.pipe(output, {
      end: false
    });
    input.on('end', function () {
      output.end();
      resolve(targetDir);
    });
  });
};
