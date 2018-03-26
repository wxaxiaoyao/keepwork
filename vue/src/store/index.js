
import Vue from "vue";
import Vuex from "vuex";

import editor from "./editor.js";
import gitlab from "./gitlab.js";

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
	modules:{
		editor,
		gitlab,
	},

	// 全局状态
	state:{},
	mutations:{},
	actions:{},
	getters:{},

	strict: debug,
});
