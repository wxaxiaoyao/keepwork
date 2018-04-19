import _ from "lodash";
import joi from "joi";
import wurl from "wurl";
import yaml from "js-yaml";

import ERR from "../common/error.js";
import config from "../config.js";
import esClient from "../../common/api/elasticSearch.js";
import {gitlabFactory} from "../../common//api/gitlab.js";
import gitlab from "../../common/api/gitlab.js";
//import {gitlabFactory} from "../../vue/src//api/gitlab.js";

// 获取GIT的ES数据
const getGitData = async function(git, path) {
	try {
		const content = await git.getContent(path);
		const data = JSON.parse(content);
		return data;
	} catch (e){
		console.log(e);
	}
	return;
} 

const formatSiteinfoESData = function(data) {

}

const formatUserinfoESData = function(data) {

}

const formatPageinfoESData = function(data) {

}

const formatESDataMap = {
	"userinfo": formatUserinfoESData,
	"siteinfo": formatSiteinfoESData,
	"pageinfo": formatPageinfoESData,
}

export const Gitlab = function() {
	
}

// 获取git文件中的数据信息
Gitlab.prototype.getGitFileData = function(content) {
	try {
		//return Json.parse(content);
		return yaml.safeLoad(content, {json:true});
	} catch(e) {
		console.log(e);
	}

	return ;
}

Gitlab.prototype.formatESData = function(data, tablename) {
	data = _.cloneDeep(data || {});
	const format = formatESDataMap[tablename];

	format && format(data);

	return data;
}

Gitlab.prototype.submitESData = async function(item) {
	const data = item.data || {};
	const tablename = item.tablename;
	const path = item.path;
	const action = item.action;
	const indexs = [data.index_prefix || "kw", tablename, data.version || "v0"];
	const esData = {
		index: indexs.join("_"),
		type: tablename,
		id: path.replace(/\//g, "_"),
		body: data.data || {},
	}
	esData.body.path = path;

	let res = null;
	try {
		//console.log(item, esData);
		res = await (esClient[action])(esData);
	} catch(e) {
		console.log(e);
	}
	//console.log(res);
}

Gitlab.prototype.webhook = async function(ctx) {
	const self = this;
	const params = ctx.request.body;
	const commit = params.commits[0];
	const project_url = params.project.http_url;
	const origin = wurl("protocol", project_url) + "://" + wurl("hostname", project_url);
	const gitcfg = {
		rawBaseUrl:origin,
		project_id:params.project_id,
		external_username: params.user_username,
		username:"xiaoyao",	
		token:config.gitlabToken,
	}
	const git = gitlabFactory(gitcfg);
	
	// 取出文件列表
	const filelist = [];
	const dataFileReg = /^[\w\d]+_data\/([_\w]+)\/.+\.yaml$/;
	const filelistAddItem = (path, oper, action) => {
		if (!dataFileReg.test(path)) return;
		
		const tablename = path.match(dataFileReg)[1];
		
		filelist.push({
			path:path, 
			tablename:tablename,
			oper:oper,
			action:action,
		});
	}

	_.each(params.commits, commit => {
		_.each(commit.added, (path) => filelistAddItem(path, "added", "index"));
		_.each(commit.modified, (path) => filelistAddItem(path, "modified", "index"));
		_.each(commit.removed, (path) => filelistAddItem(path, "removed", "delete"));
	});

	const promises = [];
	_.each(filelist, (item) => {
		promises.push(git.getContent(item.path).then(content => {
			item.content = content;
			item.data = self.getGitFileData(content) || {};
			//console.log(item);
			//item.esData = self.formatESData(item.data),
		}));
	});

	await Promise.all(promises);

	//console.log(filelist);
	_.each(filelist, file => self.submitESData(file));

	return ;
}

// 提供接口 写git es
Gitlab.prototype.gitlab = async (ctx) => {
	const params = ctx.request.body;

	if (!params.git || !params.git.projectId || !params.path || !params.data) return ERR.ERR_PARAMS;

	const gitcfg = params.git;
	gitcfg.token = gitcfg.token || config.gitlabToken;
	const git = gitlabFactory(gitcfg);

	git.upsertFile();
}

Gitlab.prototype.getRoutes = function() {
	const prefix = "/gitlab";
	const routes = [
	{
		path: prefix + "/webhook",
		method: "post",
		action: "webhook",
	},
	];

	return routes;
}

export default new Gitlab();
