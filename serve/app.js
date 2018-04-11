const Koa = require("koa");
const Router = require("koa-router");

const log4js = require("./log.js");
const config = require("./config.js");

const log = log4js.logger;

const app = new Koa();
const router = new Router();

router.all("/gitlab", (ctx, next) => {
	console.log(ctx.request);
	console.log(ctx.request.query);
	console.log(ctx);
	ctx.body = "this is test";
});

router.get("/", (ctx, next) => {
	log.debug(ctx);
	ctx.body = 'hello world';
});

router.all("/user", (ctx, next) => {
	ctx.body = 'hello user ii';
	log.info("/user");
});

router.get("*", (ctx, next) => {
	ctx.body = 'hello user ii';
});

app
.use(router.routes())
.use(router.allowedMethods());

app.listen(config.port);
log.info("start server: ", config.port);


