const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const utils = require('./utils');
const open = require('open');
module.exports = (dir = '.') => {
    var app = express();
    var router = express.Router();
    app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
    app.use(router);

    router.get('/posts/*', (req, res, next) => {
        let name = utils.stripExtname(req.params[0]);
        let file = path.resolve(dir, '_posts', `${name}.md`)
        res.end(utils.renderPost(dir, file));
    });
    router.get('/', (req, res, next) => {
        let html = utils.renderIndex(dir);
        res.end(html);
    })
    const config = utils.loadConfig(dir);
    let port = config.port || 3000;
    let url = `http://127.0.0.1:${port}`;
    app.listen(port);;
    open(url);
}