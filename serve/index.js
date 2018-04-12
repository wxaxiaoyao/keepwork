import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";
import wurl from "wurl";
import _ from "lodash";

import log from "./log.js";
import config from "./config.js";
import {gitlabFactory} from "./api/gitlab.js";

const app = new Koa();
const router = new Router();

const sleep = async (second) => {
	await new Promise((reslove, reject) => {
		setTimeout(reslove, second);
	});
}

// 获取GIT的ES数据
const getGitEsData = async function(git, path) {
	const content = await git.getContent(path);
	try {
		return JSON.parse(content);
	} catch {
	}
	return;
} 

router.all("/gitlab", KoaBody(), (ctx, next) => {
	log.info("gitlab push event...");
	const params = ctx.request.body;
	const commit = params.commits[0];
	const project_url = params.project.http_url;
	const origin = wurl("protocol", project_url) + "://" + wurl("hostname", project_url);
	const gitcfg = {
		url:project_url,
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
	const esFileFilter = (path) => /^[\w\d]+_data\/es\/.+\.json$/.text(path);
	upsertFilelist = upsertFilelist.filter(esFileFilter);
	deleteFilelist = deleteFilelist.filter(esFileFilter);

	_.each(upsertFilelist, (path) => {
		const data = getGitEsData(path);
		
	})

	console.log(origin);
	console.log(params);
	console.log(editFilelist);
	console.log(removeFilelist);
});

router.get("/", (ctx, next) => {
	ctx.body = 'hello world';
});

router.all("/user", (ctx, next) => {
	ctx.body = 'hello user ii';
});

router.get("*", (ctx, next) => {
	ctx.body = 'hello user ii';
});

app
.use(router.routes())
.use(router.allowedMethods());

app.listen(config.port);
log.info("start server: ", config.port);


