import gitlabApi from "../../client/lib/gitlab-api";
//import gitlabApi from "node-gitlab-api";
import {Base64} from "js-base64";
import _ from "lodash";


const defaultUsername = "keepwork";

const defaultConfig = {
	apiBaseUrl:"https://gitlab.com",
	rawBaseUrl:"https://gitlab.com",
	token:"Ed9S7hSfiruewMR-jitR",
	ref:"master",
	branch:"master",
	projectId:4980659,
	//rootPath:"xiaoyao",
};

const xiaoyaoConfig = {
	username:"xiaoyao",
	projectId: 4980659,
	externalUsername: "wxaxiaoyao",
	projectName: "keepworkdatasource",
	token:"Ed9S7hSfiruewMR-jitR",
	ref: "master",
	branch: "master",
}

const keepworkConfig = {
	username:"keepwork",
	externalUsername: "keepwork",
	projectName: "keepworkdatasource",
	host:"https://gitlab.com",
	token:"9x94xLa-CZPH9Da5h5kd",
	ref:"master",
	branch: "master",
	projectId:5112836,
}

const gitlab = {
	gits:{

	}
}

const encodeUrl = function(url) {
	return encodeURIComponent(url).replace(/\./g,'%2E')
}

const getUsernameByPath = function(path) {
	const paths = (path || "").split("/");
	let username = "keepwork";
	for (let i = 0; i < paths.length; i++) {
		if (paths[i]) {
			username = paths[i];
			break;
		}
	}

	username = username.replace(/_(data|files)$/, "");

	return username;
}

function Gitlab(config){
	config = _.mapKeys(config || {}, (value, key) => _.camelCase(key));
	this.cfg = {
		...defaultConfig,
		...((gitlab.gits[config.username] || {}).cfg || {}),
		...(config || {}),
	};
	//console.log(cfg);
	
	const gitcfg = {url: this.cfg.rawBaseUrl, token: this.cfg.token};
	//this.api = {
		////RepositoryFiles: new RepositoryFiles(gitcfg),
		////Repositories: new Repositories(gitcfg),
	//}
	this.api = new gitlabApi({url:this.cfg.rawBaseUrl, token:this.cfg.token});
	//return this;
}

Gitlab.prototype.getFile = function(path) {
	return this.api.RepositoryFiles.show(this.cfg.projectId, path, this.cfg.ref).then(file => {
		file.content = Base64.decode(file.content);
		return file;
	});
}

Gitlab.prototype.getContent = function(path) {
	return this.api.RepositoryFiles.show(this.cfg.projectId, path, this.cfg.ref).then(file => Base64.decode(file.content));
}

Gitlab.prototype.upsertFile = function(path, options) {
	const file = this.getFile(path);
	return file ? this.editFile(path, options) : this.createFile(path, options);
}

Gitlab.prototype.editFile = function(path, options) {
	return this.api.RepositoryFiles.edit(this.cfg.projectId, path, this.cfg.branch, options);
}

Gitlab.prototype.createFile = function(path, options) {
	return this.api.RepositoryFiles.create(this.cfg.projectId, path, this.cfg.branch, options);
}

Gitlab.prototype.removeFile = function(path, options) {
	return this.api.RepositoryFiles.remove(this.cfg.projectId, path, this.cfg.branch, options);
}

Gitlab.prototype.getTree = function(path, options) {
	options = options || {};
	options.path = path;

	return this.api.Repositories.tree(this.cfg.projectId, options);
}

Gitlab.prototype.getFileGitUrl = function(path) {
	const url = this.cfg.rawBaseUrl + "/" + this.cfg.externalUsername + "/" + this.cfg.projectName + '/blob/' + "master" + '/' + path;
	
	return url;
}

gitlab.initConfig = function(config){
	if (!config || !config.username) {
		return;
	}
	
	this.gits[config.username] = new Gitlab(config);
}

gitlab.getGitByPath = function(path) {
	const username = getUsernameByPath(path);
	return this.gits[username] || this.gits[defaultUsername];
}

gitlab.getContent = function(path) {
	return this.getGitByPath(path).getContent(path);
}

gitlab.getFile = function(path) {
	return this.getGitByPath(path).getFile(path);
}

gitlab.editFile = function(path, options) {
	const git = this.getGitByPath(path);
	return git.editFile(path, options);
}

gitlab.createFile = function(path, options) {
	const git = this.getGitByPath(path);
	//path = encodeUrl(path);
	return git.createFile(path, options);
}

gitlab.removeFile = function(path, options) {
	const git = this.getGitByPath(path);
	return git.removeFile(path, options);
}

gitlab.getTree = function(path, options) {
	const git = this.getGitByPath(path);
	return git.getTree(path, options);
}

gitlab.getFileGitUrl = function(path) {
	return this.getGitByPath(path).getFileGitUrl(path);
}

gitlab.initConfig(keepworkConfig);
gitlab.initConfig(xiaoyaoConfig);

export const gitlabFactory = (config) => new Gitlab(config);
export default gitlab;
