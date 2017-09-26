/**
 * Created by godsong on 16/7/6.
 */
const Path = require('path');
const Webpack = require('webpack');
const Loader = require('weex-loader');
const Logger = require('./Logger');
const LogStyle = require('../../common/LogStyle');
const Transformer = require('weex-transformer');
const builder = require('weex-builder');
const Fs = require('fs-extra');
const Config = require('./Config');
const Mkdirp = require('mkdirp');
const chalk = require('chalk');
const ext2Name={
    '.we':'Weex',
    '.vue':'Vue'
};
function loadModulePath(moduleName,extra) {
    try {
        const path = require.resolve(Path.join(moduleName,extra||''));
        return path.slice(0, path.indexOf(moduleName) + moduleName.length);
    } catch (e) {
        return moduleName;
    }
}
exports.loader = function (source, targetPath = '') {
    return new Promise((resolve, reject)=> {
        let ext=Path.extname(source);
        let basename = ext ? Path.basename(source, ext) : source;
        let targetDir = Path.join(__dirname, '../../frontend/', Config.bundleDir, targetPath);
        builder.build(source, targetDir, Config.webpackConfig, (err, output, json) => {
            if (err) {
                console.log(LogStyle.red('build failed!'))
                console.error(LogStyle.red(err))
                return reject(err);
            }
            else {
                console.log(LogStyle.green('build completed!\noutput:'))
                console.log(LogStyle.green(output.toString()))
                console.log(LogStyle.green('\nTime: ' + json.time + 'ms'))
                resolve(targetDir + '/' + basename + '.js');
            }
        })
    });
};
exports.transformer = function (source, targetPath = '') {
    return new Promise((resolve, reject)=> {
        Fs.readFile(source, function (err, fileContent) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            const output = Transformer.transform(Path.basename(source, '.we'), fileContent.toString());
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
        Mkdirp.sync(Path.dirname(targetDir));
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