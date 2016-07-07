/**
 * Created by godsong on 16/7/6.
 */
var Path = require('path');
var webpack = require('webpack');
var loader = require('weex-loader');
var transformer = require('weex-transformer');
var Fs = require('fs');
var Config=require('./Config');
exports.loader = function (source, targetPath = '') {
    return new Promise((resolve, reject)=> {
        let basename = Path.basename(source, '.we');
        let targetDir = Path.join(__dirname, '../../frontend/',Config.bundleDir, targetPath);
        webpack({
            entry: source,
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
            if (err) {
                return reject(err);
            }
            resolve(targetDir + '/' + basename + '.js');
        });
    });
};
exports.transformer = function (source, targetPath = '') {
    return new Promise((resolve,reject )=> {
        Fs.readFile(source, function (err, fileContent) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            var output = transformer.transform(Path.basename(source,'.we'), fileContent.toString());
            let targetDir = Path.join(__dirname, '../../frontend/',Config.bundleDir, targetPath, Path.basename(source, '.we') + '.js');
            Fs.writeFileSync(targetDir, output.result);
            resolve(targetDir);
        });
    });
};