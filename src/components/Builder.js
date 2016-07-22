/**
 * Created by godsong on 16/7/6.
 */
var Path = require('path');
var Webpack = require('webpack');
var Loader = require('weex-loader');
var Transformer = require('weex-transformer');
var Fs = require('fs');
var Config = require('./Config');
var Mkdirp = require('mkdirp')
exports.loader = function (source, targetPath = '') {
    return new Promise((resolve, reject)=> {
        let basename = Path.basename(source, '.we');
        let targetDir = Path.join(__dirname, '../../frontend/', Config.bundleDir, targetPath);
        Webpack({
            entry: source + '?entry=true',
            output: {
                path: targetDir,
                filename: basename + '.js'
            },
            devtool: '#inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.we(\?[^?]+)?$/,
                        loader: 'weex'
                    }
                ]
            }
        }, function (err, stats) {
            console.log(err,stats);
            if (err) {

                return reject(err);
            }
            resolve(targetDir + '/' + basename + '.js');
        });
    });
};
exports.transformer = function (source, targetPath = '') {
    return new Promise((resolve, reject)=> {
        Fs.readFile(source, function (err, fileContent) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            var output = Transformer.transform(Path.basename(source, '.we'), fileContent.toString());
            let targetDir = Path.join(__dirname, '../../frontend/', Config.bundleDir, targetPath, Path.basename(source, '.we') + '.js');
            Mkdirp.sync(Path.dirname(targetDir));
            Fs.writeFileSync(targetDir, output.result);
            resolve(targetDir);
        });
    });
};
exports.copy = function (source, targetPath = '') {
    return new Promise((resolve, reject)=> {
        let targetDir = Path.join(__dirname, '../../frontend/', Config.bundleDir, targetPath, Path.basename(source));
        let input = Fs.createReadStream(source);
        let output = Fs.createWriteStream(targetDir);
        input.pipe(output, {
            end: false
        });
        input.on('end', function () {
            output.end();
            resolve(targetDir);
        })
    });
};