import _ from "lodash";
import joi from "joi";
import jwt from "jwt-simple";

import config from "../config.js";
import {ERR, ERR_OK} from "../common/error.js";
import userModel from "../models/user.js";

export const User = function() {
	this.model = userModel;
}

User.prototype.create = function() {

} 

User.prototype.update = function() {

}

User.prototype.delete = function() {

}

User.prototype.find = function() {

}

User.prototype.register = async function(ctx) {
	const params = ctx.request.body;
	let user = await this.model.findOne({
		where: {
			username: params.username,
		},
	});
	
	if (user) 	return ERR.setMessage("用户已存在");

	user = await this.model.create({
		username: params.username,
		password: params.password,
	});

	if (!user) return ERR;

	return ERR_OK.setData({
		token: jwt.encode({
			userId: user._id, 
			username: user.username
		}, config.secret),
		userinfo: user,
	});
}

User.prototype.login = async function(ctx) {
	const params = ctx.request.body;
	let user = await this.model.findOne({
		where: {
			username: params.username,
			password: params.password,
		},
	});
	
	if (!user) {
		return ERR.setMessage("用户名或密码错误");
	}

	user = user.get({plain:true});


	return ERR_OK.setData({
		token: jwt.encode({
			userId: user._id, 
			username: user.username
		}, config.secret),
		userinfo: user,
	});
}

User.prototype.isLogin = async function(ctx) {
	this.model.findById(1);
	return "hello world";
}

User.prototype.getRoutes = function() {
	const self = this;
	const prefix = "/user";
	const routes = [
	{
		path: prefix + "/register",
		method: "post",
		action: "register",
		validate: {
			body: {
				username: joi.string().min(4).max(48).required(),
				password: joi.string().min(4).max(48).required(),
			},
		}
	},

	{
		path: prefix + "/login",
		method: "post",
		action: "login",
		validate: {
			body: {
				username: joi.string().min(4).max(48).required(),
				password: joi.string().min(4).max(48).required(),
			},
		}
	},

	{
		path: prefix + "/isLogin",
		method: "get",
		action: "isLogin",
	},
	];

	return routes;
}

export default new User();
