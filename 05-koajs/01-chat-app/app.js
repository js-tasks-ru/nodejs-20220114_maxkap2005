const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
    ctx.set('Content-Type', 'text/plain;charset=utf-8');
    ctx.set("Cache-Control", "no-cache, must-revalidate");

    const promise = new Promise((resolve, reject) => {
        subscribers.push(resolve);
        ctx.res.on("close", function () {
            //console.log("rejected -> " + subscribers.indexOf(resolve));
            subscribers.splice(subscribers.indexOf(resolve), 1);
            //console.log(subscribers);
            reject();
        });
    });


    let message = await promise;
    ctx.body = message;


});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
    if (message) {

        subscribers.forEach(function (resolve) {
            resolve(message);
        });

        subscribers = [];
        ctx.response.status = 200;
        ctx.body = "ok";
    }
    else {
        ctx.response.status = 400;
        ctx.body = "not ok";
    }

});

app.use(router.routes());

module.exports = app;
