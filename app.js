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
app.use(controller());

// add router middleware:
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
