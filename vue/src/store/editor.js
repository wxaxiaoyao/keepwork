import _const from "../lib/const.js";

const state = {
	tagId:null, // 当前tag id
	hoverTagId:null, // 鼠标悬浮tag id
	//mode:_const.EDITOR_MODE_EDITOR,
	mode:_const.EDITOR_MODE_NORMAL,
};

const getters = {
	getTagId: (state) => state.tagId,
	getHoverTagId: (state) => state.hoverTagId,
	getMode: (state) => state.mode,
};

const actions = {
	setTagId({commit, state}, tagId) {
		commit("setTagId", tagId);
	},
	setHoverTagId({commit, state}, tagId) {
		commit("setHoverTagId", tagId);
	},
	setMode(context, mode) {
		context.commit("setMode", mode);
	},
};

const mutations = {
	setTagId(state, tagId) {
		state.tagId = tagId;
	},
	setHoverTagId(state, tagId) {
		state.hoverTagId = tagId;
	},
	setMode(state, mode) {
		state.mode = mode;
	},
};

export default {
	state:state,
	mutations: mutations,
	actions: actions,
	getters: getters,
};
