import gitlabApi from "node-gitlab-api";
import {Base64} from "js-base64";

const defaultUsername = "keepwork";

const defaultConfig = {
	host:"https://gitlab.com",
	token:"Ed9S7hSfiruewMR-jitR",
	ref:"master",
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

export const gitlabFactory = (config) => {
	config = _.mapKeys(config || {}, (value, key) => _.camelCase(key));
	console.log(config);
	const cfg = {
		...defaultConfig,
		...((gitlab.gits[config.username] || {}).cfg || {}),
		...(config || {}),
	};
	
	const api  = gitlabApi({host:cfg.host, token:cfg.token});
	const git = {api, cfg};

	git.getContent = function(path) {
		return this.api.projects.repository.files.show(this.cfg.projectId, path, this.cfg.ref).then(file => Base64.decode(file.content));
	};

	return git;
}

const getUsernameByPath = function(path) {
	const paths = path.split("/");
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

gitlab.initConfig = function(config){
	this.gits[config.username] = gitlabFactory(config);
}

gitlab.getGitByPath = function(path) {
	const username = getUsernameByPath(path);
	return this.gits[username] || this.gits[defaultUsername];
}

gitlab.getContent = function(path) {
	const git = this.getGitByPath(path);
	return git.api.projects.repository.files.show(git.cfg.projectId, path, git.cfg.ref).then(file => Base64.decode(file.content));
}

gitlab.getFile = function(path) {
	const git = this.getGitByPath(path);
	return git.api.projects.repository.files.show(git.cfg.projectId, path, git.cfg.ref).then(file => {
		file.content = Base64.decode(file.content);
		return file;
	});
}

gitlab.editFile = function(path, options) {
	const git = this.getGitByPath(path);
	return git.api.projects.repository.files.edit(git.cfg.projectId, path, git.cfg.branch, options);
}

gitlab.createFile = function(path, options) {
	const git = this.getGitByPath(path);
	return git.api.projects.repository.files.create(git.cfg.projectId, path, git.cfg.branch, options);
}

gitlab.removeFile = function(path, options) {
	const git = this.getGitByPath(path);
	return git.api.projects.repository.files.remove(git.cfg.projectId, path, git.cfg.branch, options);
}

gitlab.getTree = function(path, options) {
	const git = this.getGitByPath(path);
	options = options || {};
	options.path = path;

	return git.api.projects.repository.tree(git.cfg.projectId, options);
}

gitlab.getFileGitUrl = function(path) {
	const cfg = this.getGitByPath(path).cfg;
	const url = cfg.host + "/" + cfg.externalUsername + "/" + cfg.projectName + '/blob/' + "master" + '/' + path;
	
	return url;
}
gitlab.initConfig(keepworkConfig);
//gitlab.initConfig(xiaoyaoConfig);

export default gitlab;
