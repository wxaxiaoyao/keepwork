import _const from "../lib/const.js";

const state = {
	rootTag:null,
	currentTag:null,
	mode:_const.EDITOR_MODE_EDITOR,
};

const getters = {
	getCurrentTag: (state) => state.currentTag,
	getMode: (state) => state.mode,
};

const actions = {
	setCurrentTag({commit, state}, tag) {
		commit("setCurrentTag", tag);
	},
	setMode(context, mode) {
		context.commit("setMode", mode);
	},
};

const mutations = {
	setCurrentTag(state, tag) {
		state.currentTag = tag;
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
