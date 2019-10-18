const path = require('path');
const utils = require('./utils');
const fse = require('fs-extra');
const moment = require('moment');
// __dirname：    获得当前执行文件所在目录的完整目录名
// __filename：   获得当前执行文件的带有完整绝对路径的文件名
// process.cwd()：获得当前执行node命令时候的文件夹目录名 
module.exports = (dir = '') => {
    fse.mkdirSync(path.resolve(dir));
    fse.mkdirSync(path.resolve(dir, '_layout'));
    fse.mkdirSync(path.resolve(dir, '_posts'));
    fse.mkdirSync(path.resolve(dir, 'assets'));
    fse.mkdirSync(path.resolve(dir, 'posts'));
    let tplDir = path.resolve(__dirname, '../tpl');
    fse.copySync(tplDir, dir);
    newPost(dir, 'Hello, world', '这是我的第一篇文章');
    console.log('OK');
}
function newPost(dir, title, content) {
    let data = [
        '---',
        'title:  ' + title,
        'date:  ' + moment().format('YYYY-MM-DD'),
        '---', '', content
    ].join('\n');
    let name = moment().format('YYYY-MM') + '/hello-world.md';
    let file = path.resolve(dir, '_posts', name);
    fse.outputFileSync(file, data);
}