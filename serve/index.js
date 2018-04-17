import Koa from "koa";
import cors from "@koa/cors";
import seesion from "koa-session";
import Router from "koa-router";
import KoaBody from "koa-body";
import wurl from "wurl";
import _ from "lodash";

import registerControllerRouter from "./controllers/index.js";

import views from "./views/index.js";

import log from "./log.js";
import config from "./config.js";

import {esDataFormat} from "./es_data_format/index.js";

import models from "./models/index.js";

const app = new Koa();

const apiRouter = new Router({
	prefix: config.apiUrlPrefix,
});
const viewRouter = new Router({});

//router.post("/gitlab", KoaBody(), (ctx, next) => {
	//log.info("gitlab push event...");
	//ctx.status = 200;
	//const params = ctx.request.body;
	//const commit = params.commits[0];
	//const project_url = params.project.http_url;
	//const origin = wurl("protocol", project_url) + "://" + wurl("hostname", project_url);
	//const gitcfg = {
		//rawBaseUrl:origin,
		//project_id:params.project_id,
		//external_username: params.user_username,
		//username:"xiaoyao",	
		//token:config.gitlabToken,
	//}
	//const git = gitlabFactory(gitcfg);
	
	//// 取出文件列表
	//let upsertFilelist = [];
	//let deleteFilelist = [];
	//_.each(params.commits, commit => {
		//upsertFilelist = upsertFilelist.concat(commit.added, commit.modified);
		//deleteFilelist = deleteFilelist.concat(commit.removed);
	//});

	//// 过滤出es相关文件
	//const dataFileReg = /^[\w\d]+_data\/([_\w]+)\/.+\.json$/;
	//const dataFileFilter = (path) => dataFileReg.test(path);
	//upsertFilelist = upsertFilelist.filter(dataFileFilter);
	//deleteFilelist = deleteFilelist.filter(dataFileFilter);

	//const getESData = (path, data) => {
		//const tablename = path.match(dataFileReg)[1];
		//const indexs = [data.index_prefix || "kw", tablename, data.version || "v0"];
		//const esData = {
			//index: indexs.join("_"),
			//type: tablename,
			//id: path.replace(/\//g, "_"),
			//body: data.data || {},
		//}

		//esData.body.path = path;

		//return esData;
	//}

	//const submitESData = async (path, oper) => {
		//const data = getGitData(git, path);
		//if (!data) return;

		//const esData = getESData(path, data);
		//console.log(esData);

		//let res = null;
		//try {
			//res = await (esClient[oper])(esData);
		//} catch(e) {
			//console.log(e);
		//}
		//console.log(res);
	//}

	//console.log(upsertFilelist);
	//console.log(deleteFilelist);
	//_.each(upsertFilelist, (path) => submitESData(path, "index"));
	//_.each(deleteFilelist, (path) => submitESData(path, "delete"));
//});


viewRouter.get("/www/*", views);

registerControllerRouter(apiRouter);

app
.use(cors())
.use(KoaBody())
.use(seesion({signed: false},app))
.use(apiRouter.routes())
.use(apiRouter.allowedMethods())
.use(viewRouter.routes());

app.listen(config.port);
log.info("start server: ", config.port);


