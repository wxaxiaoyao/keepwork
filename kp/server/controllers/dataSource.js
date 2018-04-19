import _ from "lodash";
import joi from "joi";
import jwt from "jwt-simple";

import config from "../config.js";
import ERR from "../common/error.js";
import DataSourceModel from "../models/dataSource.js";

const defaultDataSource = {
	username:"keepwork",
	externalUsername: "keepwork",
	projectName: "keepworkdatasource",
	host:"https://gitlab.com",
	token:"9x94xLa-CZPH9Da5h5kd",
	ref:"master",
	branch: "master",
	projectId:5112836,
}

export const DataSource = function() {
	this.model = DataSourceModel;
}

DataSource.prototype.create = function() {

} 

DataSource.prototype.update = function() {

}

DataSource.prototype.delete = function() {

}

DataSource.prototype.find = function() {

}

DataSource.prototype.getSystemDataSource = function() {
	return _.cloneDeep(defaultDataSource);
}

// 获取用户默认数据源
DataSource.prototype.getDefaultDataSource = async function(ctx) {
	const params = ctx.request.query;
	const authUsername = ctx.state.user.username;
	const username = params.username || authUsername;

	if (!username) return ERR.ERR_PARAMS;
	
	let dataSource = await this.model.findOne({
		where: {
			username: username,
			isDefault: true,
		},
	});

	if (!dataSource) return ERR.ERR_NOT_FOUND;

	dataSource = dataSource.get({plain:true});

	if (username != authUsername) {
		dataSource.token = undefined;
		dataSource.externalPassword = undefined;
	}

	return dataSource;
}

DataSource.prototype.getRoutes = function() {
	const prefix = "/dataSource";
	const routes = [
	{
		path: prefix + "/getDefaultDataSource",
		method: "get",
		action: "getDefaultDataSource",
	},
	];

	return routes;
}

export default new DataSource();
