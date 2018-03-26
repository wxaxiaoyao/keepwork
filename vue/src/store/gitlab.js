import vue from "vue";
import gitlab from "../api/gitlab.js";

const SET_REPOSITORY_TREE = 'SET_REPOSITORY_TREE';
const SET_FILE = "SET_FILE";
const SAVE_FILE = "SAVE_FILE";

const state = {
	projects:{},
	trees:{},
	files:{},
};

const getters = {
	files: (state) => state.files,
	trees: (state) => state.trees,
	file: (state) => (path) => state.files[path],
}

const actions = {
	async setTree(context, payload) {
		let {commit, getters: {projects}} = context;
		let {projectId, path} = payload;
		let list = await gitlab.projects.repository.tree(projectId, payload);
		commit(SET_REPOSITORY_TREE, {projectId, path, list});
	},
	async setFile(context, payload){
		let {commit, state} = context;
		let {projectId, path, ref} = payload;
		let file = await gitlab.projects.repository.files.show(projectId, path, ref);
		commit(SET_FILE, {path, file});
	},

	async saveFile(context, payload) {
		let {commit, state} = context;
		let {projectId, path, content} = payload;

		await gitlab.projects.repository.files.edit(projectId, path, 'master',{
			content,
			commit_message: `update with keepwork editor`,
		});
	}
}

const mutations = {
	[SET_REPOSITORY_TREE](state, {projectId, path, list}) {
		vue.set(state, "trees", {
			...state.trees,
			[projectId]:{
				...state.trees[projectId],
				[path]:list,
			},
		});
	},
	[SET_FILE](state, {path, file}){
		vue.set(state.files, path, file);
	},
}

export default {
	namespaced:true,
	state:state,
	getters:getters,
	actions:actions,
	mutations:mutations,
}
