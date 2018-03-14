
const state = {
	rootTag:null,
	currentTag:null,
};

const getters = {
	getCurrentTag: (state) => state.currentTag,
};

const actions = {
	setCurrentTag({commit, state}, tag) {
		commit("setCurrentTag", tag);
	},
};

const mutations = {
	setCurrentTag(state, tag) {
		state.currentTag = tag;
	},
};

export default {
	state:state,
	mutations: mutations,
	actions: actions,
	getters: getters,
};
