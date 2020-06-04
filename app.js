const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

// 导入controller middleware:
const controller = require('./controller');

const router = require('koa-router')();

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
    console.log('end');
});

// parse request body:
app.use(bodyParser());

// add controllers:
// 注册所有的url
app.use(controller());

module.exports = app;
