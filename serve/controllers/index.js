import _ from "lodash";
import jwt from "koa-jwt";
import config from "../config.js";
import {validate} from "../middlewares/index.js";

import {ERR_UNATUH} from "../common/error.js";

import user from "./user.js";
export const controllers = {
	user,
}

export const registerControllerRouter = function(router) {
	_.each(controllers, ctrl => {
		_.each(ctrl.getRoutes(), (route) => {
			const methods = _.isArray(route.method) ? route.method : [route.method || "get"];
			_.each(methods, method => {
				method = _.lowerCase(method);
				console.log(method, route.path);
				router[method](route.path, validate(route.validate), async (ctx, next) => {
					// 认证中间件
					const auth = jwt({
						secret: config.secret,
						passthrough: true,
					});
					await auth(ctx, () => {});
					if (route.requireAuth && !ctx.state.user) {
						ctx.body = ERR_UNATUH;
						return;
					}

					const body = await ctrl[route.action](ctx);	
					ctx.body = body || ctx.body;
					//console.log(ctx.body);
				});
			})
			
		})
	});
}

export default registerControllerRouter;
