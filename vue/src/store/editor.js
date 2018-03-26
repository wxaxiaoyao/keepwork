import vue from "vue";
import _const from "../lib/const.js";

const SET_CURRENT_PAGE_PATH = 'SET_CURRENT_PAGE_PATH';
const SET_CURRENT_PAGE_CONTENT = 'SET_CURRENT_PAGE_CONTENT';

const state = {
	tagId:null, // 当前tag id
	hoverTagId:null, // 鼠标悬浮tag id
	tagPath:null, // 当前tag path
	//mode:_const.EDITOR_MODE_EDITOR,
	pagePath:null, //当前页面URL
	pageContent:"", // 当前页内容
	mode:_const.EDITOR_MODE_NORMAL,
};

const getters = {
	getTagId: (state) => state.tagId,
	getHoverTagId: (state) => state.hoverTagId,
	getTagPath: (state) => state.tagPath,
	getMode: (state) => state.mode,
	getPagePath: (state) => state.pagePath,
	getPageContent: (state) => state.pageContent,
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
		context.commit(SET_CURRENT_PAGE_PATH, pagePath)
	},
	setPageContent(context, pageContent) {
		context.commit(SET_CURRENT_PAGE_CONTENT, pageContent)
	},
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
	[SET_CURRENT_PAGE_PATH](state, pagePath) {
		vue.set(state, "pagePath", pagePath);		
	},
	[SET_CURRENT_PAGE_CONTENT](state, pageContent) {
		vue.set(state, "pageContent", pageContent);
	},
};

export default {
	state:state,
	mutations: mutations,
	actions: actions,
	getters: getters,
};
