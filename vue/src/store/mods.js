import vue from "vue"; 
import {Base64} from "js-base64";
import mods from "../components/adi/mod/index.js";

const systemModPath = "https://gitlab.com/wxaxiaoyao/keepworkdatasource/raw/master/xiaoyao_data/mods.json";

const SET_SYSTEM_MODS = 'SET_SYSTEM_MODS';
const SET_SYSTEM_MOD = 'SET_SYSTEM_MOD';
const SET_TAG_MODS = 'SET_TAG_MODS';
const SET_TAG_MOD = 'SET_TAG_MOD';

const systemModsFunc = () => {
	var systemMods = {};
	for (var key in mods) {
		var mod = mods[key];
		systemMods[mod.name] = {
			name:mod.name,
			components: _.cloneDeep(mod.components),
			properties: _.cloneDeep(mod.properties),
			styles: _.cloneDeep(mod.styles),
			templates: _.cloneDeep(mod.templates),
		};
	}
	return systemMods;
}

const state = {
	systemMods: systemModsFunc(),
	tagMods: {},
	userMods: {},
}

function toJson(obj) {
	return JSON.stringify(obj, null, 2);
}

function fromJson(str) {
	try {
		return JSON.parse(str);
	} catch {
	}

	return undefined;
}

const getters = {
	mods: (state) => ({...state.systemMods, ...state.userMods}),
	tagMods: (state) => (state.tagMods),
	systemMods: (state) => state.systemMods,
	mod: (state) => (modName) => (state.userMods[modName] || state.systemMods[modName]),
	tagMod: (state) => (modName) => (state.tagMods[modName]),
}

const actions = {
	getMods({}, username) {

	},

	setSystemMod({commit}, mod) {
		if (!mod.name) {
			return;
		}

		commit(SET_SYSTEM_MOD, mod);
	},

	setSystemMods({commit}, mods) {
		commit(SET_SYSTEM_MODS, mods);
	},

	setTagMod({commit}, mod) {
		if (!mod.name) {
			return;
		}

		commit(SET_TAG_MOD, mod);
	},

	setTagMods({commit}, mods) {
		commit(SET_TAG_MODS, mods);
	},

	async loadSystemMods({rootGetters, commit}) {
		const {api, cfg} = rootGetters["user/getDataSource"]();
		
		let file = await api.projects.repository.files.show(cfg.projectId, "xiaoyao_data/mods.json", cfg.ref);

		file.content = Base64.decode(file.content);
		let mods = fromJson(file.content) || {};

		commit(SET_SYSTEM_MODS, mods);
	},

	async loadTagMods({rootGetters, commit}) {
		const {api, cfg} = rootGetters["user/getDataSource"]();
		let file = await api.projects.repository.files.show(cfg.projectId, "xiaoyao_data/tag_mods.json", cfg.ref);
		file.content = Base64.decode(file.content);
		let mods = fromJson(file.content) || {};
		
		commit(SET_TAG_MODS, mods);
	},

	async submitSystemMods({state, getters, rootGetters}) {
		const {api, cfg} = rootGetters["user/getDataSource"]();
		await api.projects.repository.files.edit(cfg.projectId, "xiaoyao_data/mods.json", cfg.branch, {
			content:toJson(state.systemMods),
			commit_message:"update with keepwork mod editor",
		});
	},

	async submitTagMods({state, getters, rootGetters}) {
		const {api, cfg} = rootGetters["user/getDataSource"]();
		await api.projects.repository.files.edit(cfg.projectId, "xiaoyao_data/tag_mods.json", cfg.branch, {
			content:toJson(state.tagMods),
			commit_message:"update with keepwork mod editor",
		});
	},
}

const mutations = {
	[SET_SYSTEM_MODS](state, mods) {
		vue.set(state, "systemMods", {
			...state.systemMods,
			...(mods || {}),
		});
	},
	[SET_SYSTEM_MOD](state, mod) {
		vue.set(state.systemMods, mod.name, mod);
	},
	[SET_TAG_MODS](state, mods) {
		vue.set(state, "tagMods", {
			...state.tagMods,
			...(mods || {}),
		});
	},
	[SET_TAG_MOD](state, mod) {
		vue.set(state.tagMods, mod.name, mod);
	},
}

export default {
	namespaced: true,
	state, 
	getters,
	actions,
	mutations,
}
