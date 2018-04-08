import vue from "vue";

const state = {
	dataSources:{},
}

const SET_DATA_SOURCE = "SET_DATA_SOURCE";

const getters = {
	dataSources: (state) => state.dataSources,
	getDataSource: (state) => (username) => state.dataSources[username],
}

const actions = {
	setDataSource({commit}, dataSource) {
		commit(SET_DATA_SOURCE, dataSource);
	}
}

const mutations = {
	[SET_DATA_SOURCE](state, dataSource) {
		vue.set(state.dataSources, dataSource.username, {
			...(state.dataSources[dataSource.username] || {}),
			...dataSource,
		});
	}
}

export default {
	namespaced:true,
	state,
	getters,
	actions,
	mutations,
}
