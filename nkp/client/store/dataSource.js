import vue from "vue";

const state = {
	dataSources:{},
}

const SET_DATA_SOURCE = "SET_DATA_SOURCE";

export const getters = {
	dataSources: (state) => state.dataSources,
	getDataSource: (state) => (username) => state.dataSources[username],
}

export const actions = {
	setDataSource({commit}, dataSource) {
		if (!dataSource || !dataSource.username) {
			return;
		}
		commit(SET_DATA_SOURCE, dataSource);
	}
}

export const mutations = {
	[SET_DATA_SOURCE](state, dataSource) {
		vue.set(state.dataSources, dataSource.username, {
			...(state.dataSources[dataSource.username] || {}),
			...dataSource,
		});
	}
}

//export default {
	//namespaced:true,
	//state,
	//getters,
	//actions,
	//mutations,
//}
