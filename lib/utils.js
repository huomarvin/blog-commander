const swig = require('swig');
const path = require('path');
const fs = require('fs');
const rd = require('rd');
const MarkdownIt = require('markdown-it');
const md = MarkdownIt({
    html: true,
    langPrefix: 'code-'
});
swig.setDefaults({ cache: false });

function stripExtname(name) {
    var i = 0 - path.extname(name).length;
    if (i === 0) i = name.length;
    return name.slice(0, i);
}

function markdownToHTML(content = '') {
    return md.render(content);
}

function parseSourceContent(data) {
    var split = '---\n';
    var i = data.indexOf(split);
    var info = {};
    if (i !== -1) {
        var j = data.indexOf(split, i + split.length);
        if (j !== -1) {
            var str = data.slice(i + split.length, j).trim();
            data = data.slice(j + split.length);
            str.split('\n').forEach(line => {
                var i = line.indexOf(':');
                if (i !== -1) {
                    var name = line.slice(0, i).trim();
                    var value = line.slice(i + 1).trim();
                    info[name] = value;
                }
            })
        }
    }
    info.source = data;
    return info;
}

function eachSourceFile(sourceDir, callback) {
    rd.eachFileFilterSync(sourceDir, /\.md$/, callback);
}

function renderFile(file, data) {
    return swig.render(fs.readFileSync(file).toString(), {
        filename: file,
        autoescape: false,
        locals: data
    })
}

function renderPost(dir, file) {
    let content = fs.readFileSync(file).toString();
    let post = parseSourceContent(content.toString());
    post.content = markdownToHTML(post.source);
    post.layout = post.layout || 'post';
    const config = loadConfig(dir);
    let html = renderFile(path.resolve(dir, '_layout', post.layout + '.html'), {
        post, config
    })
    return html;
}

function renderIndex(dir) {
    let list = [];
    let sourceDir = path.resolve(dir, '_posts');
    rd.eachFileFilterSync(sourceDir, /\.md$/, (f, s) => {
        let source = fs.readFileSync(f).toString();
        let post = parseSourceContent(source);
        post.timestamp = new Date(post.date);
        post.url = '/posts/' + stripExtname(f.slice(sourceDir.length + 1)) + '.html';
        list.push(post);
    })
    list.sort((a, b) => {
        return b.timestamp - a.timestamp;
    })
    const config = loadConfig(dir);
    let html = renderFile(path.resolve(dir, '_layout', 'index.html'), {
        posts: list,
        config
    });
    return html;
}

function loadConfig(dir) {
    let content = fs.readFileSync(path.resolve(dir, 'config.json')).toString();
    return JSON.parse(content);
}

exports.loadConfig = loadConfig;
exports.renderPost = renderPost;
exports.renderIndex = renderIndex;
exports.stripExtname = stripExtname;
exports.eachSourceFile = eachSourceFile;