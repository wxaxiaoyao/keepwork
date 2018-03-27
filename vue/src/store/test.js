import vue from "vue";

const state = {
	key:null,
}

const getters = {
	key: (state) => state.key,
}

const actions = {
	setKey({commit}, key) {
		commit("setKey", key);
	}
}

const mutations = {
	setKey(state, key) {
		state.key = key;
	}
}

export default {
	namespaced:true,
	state,
	getters,
	actions,
	mutations,
}
