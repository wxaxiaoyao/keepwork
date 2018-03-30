import vue from "vue";
import {gitlabFactory} from "../api/gitlab.js";

const state = {
	username: "xiaoyao",  // 当前认证用户名
	userinfo: {

	},

	dataSources: {
		"xiaoyao" : {
			projectId: 4980659,
			externalUsername: "xiaoyao",
			projectName: "keepworkdatasource",
			token:"Ed9S7hSfiruewMR-jitR",
			ref: "master",
			branch: "master",
		},
	},
}

const getters = {
	getUserinfo: (state) => (username) => (state.userinfo[username] || {}),
	getDataSource: (state) => (username) => (gitlabFactory(state.dataSources[username || state.username])),
}

const actions = {
	getUserinfo(){

	},

	getDataSource() {

	}
}

const mutations = {

}

export default {
	namespaced: true,
	state, 
	getters,
	actions,
	mutations,
}
