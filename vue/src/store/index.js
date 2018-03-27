
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import editor from "./editor.js";
import test from "./test.js";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
	modules:{
		editor,
		test,
	},

	// 全局状态
	state:{},
	mutations:{},
	actions:{},
	getters:{},

	strict: debug,

	plugins: [createPersistedState({
		paths: ["test"],
	})],
});
