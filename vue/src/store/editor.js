import vue from "vue";
import {Base64} from "js-base64";
import _const from "../lib/const.js";
import gitlab from "../api/gitlab.js";

const SET_PAGE_PATH = 'SET_PAGE_PATH';
const SET_PAGE_CONTENT = 'SET_PAGE_CONTENT';
const SET_PAGE = 'SET_PAGE';
const SET_PAGES = 'SET_PAGES';

const treeNodeToPage = function(node) {
	var paths = node.path.split("/");
	let page = {
		name:node.name,
		path:node.path,
		type:node.type,
		id:node.id,
		username:paths[0],
	}
	page.name = page.name.replace(/\.md$/, "");

	return page;
}

const state = {
	tagId:null, // 当前tag id
	hoverTagId:null, // 鼠标悬浮tag id
	tagPath:null, // 当前tag path
	//mode:_const.EDITOR_MODE_EDITOR,
	pagePath:"", //当前页面URL
	pageContent:"", // 当前页内容
	pages:{},       // 页面节点信息
	gits:{},        // 数据源
	mode:_const.EDITOR_MODE_NORMAL,
};

const getters = {
	getTagId: (state) => state.tagId,
	getHoverTagId: (state) => state.hoverTagId,
	getTagPath: (state) => state.tagPath,
	getMode: (state) => state.mode,
	getPagePath: (state) => state.pagePath,
	getPageContent: (state) => state.pageContent,
	getPages: (state) => state.pages,
	getPageByPath: (state) => (path) => state.pages[path],
	getGit: (state) => (key) => (state.gits[key] || {projectId:4980659, git:gitlab, ref:"master", rootPath:"xiaoyao"}),
};

const actions = {
	setTagId({commit, state}, tagId) {
		commit("setTagId", tagId);
	},
	setHoverTagId({commit, state}, tagId) {
		commit("setHoverTagId", tagId);
	},
	setTagPath({commit, state}, tagPath) {
		commit("setTagPath", tagPath);
	},
	setMode(context, mode) {
		context.commit("setMode", mode);
	},
	setPagePath(context, pagePath) {
		context.commit(SET_PAGE_PATH, pagePath)
	},
	setPageContent(context, pageContent) {
		context.commit(SET_PAGE_CONTENT, pageContent)
	},
	setPage({commit}, page) {
		commit(SET_PAGE, page);
	},
	async loadPage(context, page) {
		let {commit, state} = context;
		let {path} = page;
		commit(SET_PAGE, {path:path, isRefresh:true});
		let {projectId, git, ref} = context.getters.getGit();
		let file = await git.projects.repository.files.show(projectId, page.path, ref);
		page.id = file.blob_id;
		page.content = Base64.decode(file.content);
		page.isRefresh = false;
		commit(SET_PAGE, page);
		if (state.pagePath == path) {
			commit(SET_PAGE_CONTENT, page.content);
		}
	},
	async savePage(context, page) {
		let {path, content} = page;
		let {commit, getters} = context;
		let {projectId, git} = getters.getGit();
		commit(SET_PAGE, {path:path, isRefresh:true});
		await git.projects.repository.files.edit(projectId, path, 'master',{
			content:content,
			commit_message: 'update with keepwork editor',
		});
		commit(SET_PAGE, {path:path, content:content, isRefresh:false});

	},
	async deletePage(context, page) {
		let {path} = page;
		let {commit, getters:{getGit}} = context;
		let {projectId, git} = getGit();
		commit(SET_PAGE, {path:path, isRefresh:true});
		await git.projects.repository.files.remove(projectId, path, 'master',{
			commit_message: 'delete by keepwork',
		});
		commit(SET_PAGE, {path:path, isRefresh:false});
	},
	async loadTree(context, payload) {
		let {commit, getters: {getGit}} = context;
		let {projectId, git, rootPath} = getGit();
		let list = await git.projects.repository.tree(projectId, {
			path:rootPath,
			recursive: true,
		});
		let pages = {};
		list.forEach(function(node){
			pages[node.path] = treeNodeToPage(node);
		});

		commit(SET_PAGES, pages);
	}
};

const mutations = {
	setTagId(state, tagId) {
		state.tagId = tagId;
	},
	setHoverTagId(state, tagId) {
		state.hoverTagId = tagId;
	},
	setTagPath(state, tagPath) {
		state.tagPath = tagPath;
	},
	setMode(state, mode) {
		state.mode = mode;
	},
	[SET_PAGE_PATH](state, pagePath) {
		vue.set(state, "pagePath", pagePath);		
	},
	[SET_PAGE_CONTENT](state, pageContent) {
		vue.set(state, "pageContent", pageContent);
	},
	[SET_PAGE](state, page) {
		vue.set(state.pages, page.path, {
			...(state.pages[page.path] || {}),
			...page,
		});
	},
	[SET_PAGES](state, pages) {
		vue.set(state, "pages", {
			...state.pages,
			...pages,
		});
	},
};

export default {
	state:state,
	mutations: mutations,
	actions: actions,
	getters: getters,
};
