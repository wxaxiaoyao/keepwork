
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import theme from "./theme.js";
import app from "./app.js";
import editor from "./editor.js";
import user from "./user.js";
import mods from "./mods.js";

import test from "./test.js";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
	modules:{
		theme,
		app,
		editor,
		user,
		mods,
		test,
	},

	// 全局状态
	state:{},
	mutations:{},
	actions:{},
	getters:{},

	strict: debug,

	plugins: [createPersistedState({
		storage: window.sessionStorage,
		paths: ["test", "user"],
	})],
});
