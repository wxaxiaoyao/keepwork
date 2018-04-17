
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import theme from "./theme.js";
import app from "./app.js";
import editor from "./editor.js";
import user from "./user.js";
import mods from "./mods.js";
import dataSource from "./dataSource.js";

import test from "./test.js";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export function createStore() {
	return new Vuex.Store({
		modules:{
			theme,
			app,
			editor,
			user,
			mods,
			dataSource,
			test,
		},

		// 全局状态
		state:{},
		mutations:{},
		actions:{},
		getters:{},

		strict: debug,

		plugins: [createPersistedState({
			paths: ["user"],
		}), createPersistedState({
			storage: window.sessionStorage,
			paths: ["dataSource", "mods"],
		})],
	});
}


export default createStore();
