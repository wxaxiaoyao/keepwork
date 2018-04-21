import vue from "vue";

const SET_TOKEN = 'SET_TOKEN';
const SET_USER = 'SET_USER';
const SET_USER_DATA_SOURCE = "SET_USER_DATA_SOURCE";

export const state = () => ({
	username: "xiaoyao",  // 当前认证用户名
	token:null,
	userinfo: {},
})

export const getters = {
	isAuthenticated: (state) => state.user && state.user.username,
	token: (state) => state.token,
	user: (state) => (state.user || {}),
	dataSource: (state) => state.dataSource,
}

export const actions = {
	setToken({commit}, token) {
		commit(SET_TOKEN, token); 
	},
	setUser({commit}, user){
		commit(SET_USER, user);
	},
	setUserDataSource({commit}, dataSource) {
		commit(SET_USER_DATA_SOURCE, dataSource);
	},
}

export const mutations = {
	[SET_TOKEN](state, token) {
		vue.set(state, "token", token);		
	},
	[SET_USER](state, user) {
		vue.set(state, "user", {
			...(state.user || {}),
			...(user || {}),
		});
	},
	[SET_USER_DATA_SOURCE](state, dataSource) {
		vue.set(state, "dataSource", {
			...(state.dataSource || {}),
			...(dataSource || {})
		});
	},
}

//export default {
	//namespaced: true,
	//state, 
	//getters,
	//actions,
	//mutations,
//}
