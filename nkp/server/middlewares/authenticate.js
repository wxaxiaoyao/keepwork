import jwt from "koa-jwt";
import config from "../config.js";

export default (opt) => {
	const auth = jwt({
		...opt,
		secret: config.secret,
	});

	return async (ctx, next) {
		await auth(ctx, next).catch(function(e){
			console.log(e);
		});
		console.log(ctx.state);
	}
}
