import vue from "vue"; 
import {Base64} from "js-base64";

import gitlab from "@@/common/api/gitlab.js";

//import mods from "../components/adi/mod/index.js";

const systemModPath = "https://gitlab.com/wxaxiaoyao/keepworkdatasource/raw/master/xiaoyao_data/mods.json";
const defaultStyleName = "default";

const SET_SYSTEM_MODS = 'SET_SYSTEM_MODS';
const SET_SYSTEM_MOD = 'SET_SYSTEM_MOD';
const SET_TAG_MODS = 'SET_TAG_MODS';
const SET_TAG_MODS_STATE = 'SET_TAG_MODS_STATE';
const SET_TAG_MOD = 'SET_TAG_MOD';
const SET_TAG_MOD_STYLE = 'SET_TAG_MOD_STYLE';
const DELETE_TAG_MOD = "DELETE_TAG_MOD";

const systemModsFunc = () => {
	const mods = {};
	var systemMods = {};
	for (var key in mods) {
		var mod = mods[key];
		systemMods[mod.name] = {
			modName:mod.name,
			components: _.cloneDeep(mod.components),
			properties: _.cloneDeep(mod.properties),
			styles: _.cloneDeep(mod.styles),
			templates: _.cloneDeep(mod.templates),
		};
	}
	return systemMods;
}

export const state = () => ({
	systemMods: systemModsFunc(),
	tagModsState:"unload",
	tagMods: {},
	userMods: {},
});

function toJson(obj) {
	return JSON.stringify(obj, null, 2);
}

function fromJson(str) {
	try {
		return JSON.parse(str);
	} catch(e) {
		console.log(str);
	}

	return undefined;
}

export const getters = {
	mods: (state) => ({...state.systemMods, ...state.userMods}),
	tagMods: (state) => (state.tagMods),
	systemMods: (state) => state.systemMods,
	mod: (state) => (modName, styleName) => (state.userMods[modName] || state.systemMods[modName])[styleName || defaultStyleName],
	tagMod: (state) => (modName) => (state.tagMods[modName] || {}),
	tagModStyle: (state) => (modName, styleName) => (state.tagMods[modName] || {})[styleName || defaultStyleName],
}

export const actions = {
	getMods({}, username) {

	},

	setSystemMod({commit}, mod) {
		if (!mod.modName) {
			return;
		}

		commit(SET_SYSTEM_MOD, mod);
	},

	setSystemMods({commit}, mods) {
		commit(SET_SYSTEM_MODS, mods);
	},

	setTagModStyle({commit, dispatch}, style) {
		commit(SET_TAG_MOD_STYLE, style);	
		//dispatch("submitTagMods");
	},

	deleteTagMod({commit, dispatch}, modName) {
		commit(DELETE_TAG_MOD, modName);
		//dispatch("submitTagMods");
	},

	setTagMod({commit, dispatch}, mod) {
		if (!mod.modName) {
			return;
		}

		commit(SET_TAG_MOD, mod);
		//dispatch("submitTagMods");
	},

	setTagMods({commit, dispatch}, mods) {
		commit(SET_TAG_MODS, mods);
		//dispatch("submitTagMods");
	},

	async loadSystemMods({rootGetters, commit}) {
		//const {api, cfg} = rootGetters["user/getDataSource"]();
		
		//let file = await api.projects.repository.files.show(cfg.projectId, "xiaoyao_data/mods.json", cfg.ref);

		//file.content = Base64.decode(file.content);
		//let mods = fromJson(file.content) || {};

		//commit(SET_SYSTEM_MODS, mods);
	},

	async loadTagMods({state, commit}) {
		if (state.tagModsState == "loaded" || state.tagModsState == "loading") {
			return;
		}
	
		let content = await gitlab.getContent(g_app.config.tagModsPath);
		let mods = fromJson(content) || {};
		
		commit(SET_TAG_MODS, mods);
		commit(SET_TAG_MODS_STATE, "loaded");
	},

	async submitSystemMods({state, getters, rootGetters}) {
		//await gitlab.editFile(g_app.config.tagModsPath, {
			//content:toJson(state.systemMods),
			//commit_message:"update with keepwork mod editor",
		//});
	},

	async submitTagMods({state, getters, rootGetters}) {
		await gitlab.editFile(g_app.config.tagModsPath, {
			content:toJson(state.tagMods),
			commit_message:"update with keepwork mod editor",
		});
	},
}

export const mutations = {
	[SET_SYSTEM_MODS](state, mods) {
		vue.set(state, "systemMods", {
			...state.systemMods,
			...(mods || {}),
		});
	},
	[SET_SYSTEM_MOD](state, mod) {
		vue.set(state.systemMods, mod.modName, mod);
	},
	[SET_TAG_MODS](state, mods) {
		vue.set(state, "tagMods", {
			...state.tagMods,
			...(mods || {}),
		});
	},
	[SET_TAG_MODS_STATE](state, tagModsState) {
		state.tagModsState = tagModsState;
	},
	[DELETE_TAG_MOD](state, modName) {
		vue.delete(state.tagMods, modName);	
	},

	[SET_TAG_MOD](state, mod) {
		vue.set(state.tagMods, mod.modName, mod);
	},
	[SET_TAG_MOD_STYLE](state, style) {
		const styles = state.tagMods[style.modName].styles;
		if (!style.tag) {
			vue.delete(styles, style.styleName);
		} else {
			vue.set(styles, style.styleName, style);
		}
	}
}

//export default {
	//namespaced: true,
	//state, 
	//getters,
	//actions,
	//mutations,
//}
