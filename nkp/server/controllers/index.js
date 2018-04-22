import _ from "lodash";
import {validate} from "../middlewares/index.js";

import {ERR_UNATUH} from "../common/error.js";

import code from "./code.js";
import user from "./user.js";
import dataSource from "./dataSource.js";
import gitlab from "./gitlab.js"; 

export const controllers = {
	code,
	user,
	dataSource,
	gitlab,
}

export const registerControllerRouter = function(router) {
	_.each(controllers, ctrl => {
		_.each(ctrl.getRoutes(), (route) => {
			const methods = _.isArray(route.method) ? route.method : [route.method || "get"];
			_.each(methods, method => {
				method = _.lowerCase(method);
				//console.log(method, route.path);
				router[method](route.path, validate(route.validate), async (ctx, next) => {
					// 认证中间件
					if (route.requireAuth && !ctx.state.user) {
						ctx.body = ERR_UNATUH;
						return;
					}

					ctx.state.user = ctx.state.user || {};

					try {
						const body = await ctrl[route.action](ctx);	
						ctx.body = body || ctx.body;
					} catch(e) {
						console.log(e);
						ctx.status = 500;
						ctx.body = "请求无法处理";
					}
					//console.log(ctx.body);
				});
			})
			
		})
	});

	router.all("/*", (ctx, next) => {
		ctx.status = 404;
	});
}

export default registerControllerRouter;
