import vue from "vue";

const SET_TOKEN = 'SET_TOKEN';
const SET_AUTH = "SET_AUTH";
const SET_USERINFO = 'SET_USERINFO';
const SET_USER_DATA_SOURCE = "SET_USER_DATA_SOURCE";

const state = {
	username: "xiaoyao",  // 当前认证用户名
	isAuth:false, // 是否认证
	token:null,
	userinfo: {},
}

const getters = {
	isAuth: (state) => state.isAuth,
	token: (state) => state.token,
	userinfo: (state) => (state.userinfo || {}),
	dataSource: (state) => state.dataSource,
}

const actions = {
	setToken({commit}, token) {
		commit(SET_TOKEN, token); 
	},
	setAuth({commit}, auth) {
		commit(SET_AUTH, auth);
	},
	setUserinfo({commit}, userinfo){
		commit(SET_USERINFO, userinfo);
	},
	setUserDataSource({commit}, dataSource) {
		commit(SET_USER_DATA_SOURCE, dataSource);
	},
}

const mutations = {
	[SET_TOKEN](state, token) {
		vue.set(state, "token", token);		
	},
	[SET_AUTH](state, auth) {
		vue.set(state, "isAuth", auth);
	},
	[SET_USERINFO](state, userinfo) {
		vue.set(state, "userinfo", {
			...(state.userinfo || {}),
			...(userinfo || {}),
		});
	},
	[SET_USER_DATA_SOURCE](state, dataSource) {
		vue.set(state, "dataSource", {
			...(state.dataSource || {}),
			...(dataSource || {})
		});
	},
}

export default {
	namespaced: true,
	state, 
	getters,
	actions,
	mutations,
}
