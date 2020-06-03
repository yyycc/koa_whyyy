const fs = require('fs');
// 用readdirSync列出文件
let addMapping = (router, mapping) => {
    for (let url in mapping) {
        if (url.startsWith('GET ')) {
            let path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            let path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
};

let addControllers = (router, dir) => {// 导入fs模块(文件系统模块)
    let files = fs.readdirSync(__dirname + dir);

    // 过滤出js文件
    let js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (let f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/controllers/' + f);
        console.log(mapping);
        addMapping(router, mapping);
    }
};

module.exports = function (dir) {
    let
        controllers_dir = dir || '/controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};
