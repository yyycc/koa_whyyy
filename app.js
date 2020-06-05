const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

// 导入controller middleware:
const controller = require('./controller');

const router = require('koa-router')();

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next().catch(err => {
        ctx.status = 404;
        ctx.body = {
            success: false,
            err: err
        }
    });
    console.log('end');
});

// parse request body:
app.use(bodyParser());

// add controllers:
// 注册所有的url
app.use(controller());

// koa app的listen()方法返回http.Server:
let server = app.listen(3000);
// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;
// 创建WebSocketServer:
let wss = new WebSocketServer({
    server: server
});

module.exports = app;
