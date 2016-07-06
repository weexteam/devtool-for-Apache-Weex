/**
 * Created by godsong on 16/7/6.
 */
var Path = require('path');
var webpack = require('webpack');
var loader = require('weex-loader');

exports.build = function (source,targetPath='') {
    return new Promise((resolve, reject)=> {
        let basename = Path.basename(source, '.we');
        let targetDir=Path.join(__dirname,'../../frontend/bundle/',targetPath);
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