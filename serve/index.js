import Koa from "koa";
import cors from "@koa/cors";
import seesion from "koa-session";
import Router from "koa-router";
import KoaBody from "koa-body";
import wurl from "wurl";
import _ from "lodash";

import registerControllerRouter from "./controllers/index.js";

import log from "./log.js";
import config from "./config.js";
import {gitlabFactory} from "./api/gitlab.js";
import {elasticsearchFactory} from "./api/elasticSearch.js";

import {esDataFormat} from "./es_data_format/index.js";

const app = new Koa();

const router = new Router({
	prefix: config.apiUrlPrefix,
});

const esClient = elasticsearchFactory();

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

// gitlabWebhook 中间件 处理gitlab相关逻辑
const gitlabWebhook = async (ctx, next) => {
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
	const dataFileReg = /^[\w\d]+_data\/([_\w]+)\/.+\.json$/;
	const filelistAddItem = (path, oper) => dataFileReg.test(path) && filelist.push({path:path, oper:oper});
	_.each(params.commits, commit => {
		_.each(commit.added, (path) => filelistAddItem(path, "added"));
		_.each(commit.modified, (path) => filelistAddItem(path, "modified"));
		_.each(commit.removed, (path) => filelistAddItem(path, "removed"));
	});

	const promises = [];
	_.each(filelist, (item) => {
		promises.push(git.getContent(item.path).then(content => item.content = content));
	});

	await Promise.all(promises);

	//console.log(filelist);

	const data = ctx.data || {};
	ctx.data = data;

	data.gitlabWebhook = {
		git:git,
		filelist:filelist,
	};
	
	next();
}

const status_ok = (ctx, next) => ctx.status = 200;

router.post(
	"/gitlab_webhook",
	KoaBody(),
	gitlabWebhook,
	esDataFormat,	
	status_ok,
)

router.post("/gitlab", KoaBody(), (ctx, next) => {
	log.info("gitlab push event...");
	ctx.status = 200;
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
	let upsertFilelist = [];
	let deleteFilelist = [];
	_.each(params.commits, commit => {
		upsertFilelist = upsertFilelist.concat(commit.added, commit.modified);
		deleteFilelist = deleteFilelist.concat(commit.removed);
	});

	// 过滤出es相关文件
	const dataFileReg = /^[\w\d]+_data\/([_\w]+)\/.+\.json$/;
	const dataFileFilter = (path) => dataFileReg.test(path);
	upsertFilelist = upsertFilelist.filter(dataFileFilter);
	deleteFilelist = deleteFilelist.filter(dataFileFilter);

	const getESData = (path, data) => {
		const tablename = path.match(dataFileReg)[1];
		const indexs = [data.index_prefix || "kw", tablename, data.version || "v0"];
		const esData = {
			index: indexs.join("_"),
			type: tablename,
			id: path.replace(/\//g, "_"),
			body: data.data || {},
		}

		esData.body.path = path;

		return esData;
	}

	const submitESData = async (path, oper) => {
		const data = getGitData(git, path);
		if (!data) return;

		const esData = getESData(path, data);
		console.log(esData);

		let res = null;
		try {
			res = await (esClient[oper])(esData);
		} catch(e) {
			console.log(e);
		}
		console.log(res);
	}

	console.log(upsertFilelist);
	console.log(deleteFilelist);
	_.each(upsertFilelist, (path) => submitESData(path, "index"));
	_.each(deleteFilelist, (path) => submitESData(path, "delete"));
});

// 直接提供客户端接口 写gitlab es
router.post("/gitlab/:tablename/:filename", KoaBody(), (ctx, next) => {
	
});

router.get("/", (ctx, next) => {
	ctx.body = 'hello world';
});



registerControllerRouter(router);

router.get("*", (ctx, next) => {
	ctx.body = 'hello user ii';
});

app
.use(cors())
.use(KoaBody())
.use(seesion({signed: false},app))
.use(router.routes())
.use(router.allowedMethods());

app.listen(config.port);
log.info("start server: ", config.port);


