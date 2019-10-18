const path = require('path');
const utils = require('./utils');
const fse = require('fs-extra');

module.exports = (dir = '', options) => {
    let outputDir = path.resolve(options.output || dir);
    function outputFile(file, content) {
        console.log('生成页面: %s', file.slice(outputDir.length + 1));
        fse.outputFileSync(file, content);
    }
    let sourceDir = path.resolve(dir, '_posts');
    utils.eachSourceFile(sourceDir, (f, s) => {
        let html = utils.renderPost(dir, f);
        let relativeFile = utils.stripExtname(f.slice(sourceDir.length + 1)) + '.html';
        let file = path.resolve(outputDir, 'posts', relativeFile);
        outputFile(file, html);
    })
    // 生成首页
    let htmlIndex = utils.renderIndex(dir);
    let fileIndex = path.resolve(outputDir, 'index.html');
    outputFile(fileIndex, htmlIndex);
}