import Koa from "koa";
import cors from "@koa/cors";
import jwt from "koa-jwt";
import Router from "koa-router";
import KoaBody from "koa-body";
import Static from "koa-static";
import wurl from "wurl";
import _ from "lodash";

import registerControllerRouter from "./controllers/index.js";

//import log from "./log.js";
import config from "./config.js";
import models from "./models/index.js";

const apiRouter = new Router({
	prefix: config.apiUrlPrefix,
});
registerControllerRouter(apiRouter);


export default (app, views) => {
	const viewRouter = new Router({});
	//viewRouter.get("/www/*", views);

	app
	.use(Static("../.nuxt/"))
	.use(cors())
	.use(KoaBody())
	.use(jwt({secret:config.secret, passthrough:true, cookie:"token"}))
	.use(apiRouter.routes())
	.use(apiRouter.allowedMethods())
	.use(viewRouter.routes());
}

