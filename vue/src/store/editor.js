import _const from "../lib/const.js";

const state = {
	tagId:null, // 当前tag id
	mode:_const.EDITOR_MODE_EDITOR,
};

const getters = {
	getTagId: (state) => state.tagId,
	getMode: (state) => state.mode,
};

const actions = {
	setTagId({commit, state}, tagId) {
		commit("setTagId", tagId);
	},
	setMode(context, mode) {
		context.commit("setMode", mode);
	},
};

const mutations = {
	setTagId(state, tagId) {
		state.tagId = tagId;
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
