import vue from "vue";


const SET_LAYOUT = "SET_LAYOUT";

const state = {
	layout:"headerMainLayout",
}

const getters = {
	layout: (state) => state.layout,
}

const actions = {
	setLayout({commit}, layout) {
		commit("setLayout", layout);
	}
}

const mutations = {
	[SET_LAYOUT](state, layout) {
		state.layout = layout;
	}
}

export default {
	namespaced:true,
	state,
	getters,
	actions,
	mutations,
}
