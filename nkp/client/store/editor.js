import vue from "vue";
import {Base64} from "js-base64";
import Hashes from "jshashes";
import consts from "@/lib/consts.js";
import gitlab from "@@/common/api/gitlab.js";

const SET_PAGE_PATH = 'SET_PAGE_PATH';
const SET_PAGE_CONTENT = 'SET_PAGE_CONTENT';
const SET_PAGE = 'SET_PAGE';
const SET_PAGES = 'SET_PAGES';
const SET_SWITCH_PAGE = 'SET_SWITCH_PAGE';
const DELETE_PAGE = 'DELETE_PAGE';

const sha1 = new Hashes.SHA1().setUTF8(true);


const getStringByteLength = function(str) {
	var totalLength = 0;     
	var charCode;  
	for (var i = 0; i < str.length; i++) {  
		charCode = str.charCodeAt(i);  
		if (charCode < 0x007f)  {     
			totalLength++;     
		} else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
			totalLength += 2;     
		} else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
			totalLength += 3;   
		} else{  
			totalLength += 4;   
		}          
	}  
	return totalLength;   
}

const gitsha = function(content) {
	var header = "blob " + getStringByteLength(content) + "\0";
	var text = header + content;
	return sha1.hex(text);
}

const treeNodeToPage = function(node) {
	let paths = node.path.split("/");
	let page = {
		name:node.name,
		path:node.path,
		type:node.type,
		id:node.id,
		username:paths[0],
	}

	page.name = page.name.replace(/\.md$/, "");
	page.url = page.path.replace(/\.md$/, "");

	return page;
}

export const state = () => ({
	tagId:null, // 当前tag id
	hoverTagId:null, // 鼠标悬浮tag id
	tagPath:null, // 当前tag path
	hoverTagPath:null, // 鼠标悬浮tag path
	//mode:consts.EDITOR_MODE_EDITOR,
	pagePath:"", //当前页面URL
	pageContent:"", // 当前页面内容
	switchPage:false, // 是否切换页面
	pages:{},       // 页面节点信息
	gits:{},        // 数据源
	mode:consts.EDITOR_MODE_NORMAL,
});

export const getters = {
	getTagId: (state) => state.tagId,
	getHoverTagId: (state) => state.hoverTagId,
	getTagPath: (state) => state.tagPath,
	getMode: (state) => state.mode,
	getPagePath: (state) => state.pagePath,
	getPageContent: (state) => state.pageContent,
	switchPage: (state) => state.switchPage,	
	getPages: (state) => state.pages,
	getPageByPath: (state) => (path) => (state.pages[path] || {}),
	getPageContentByPath: (state) => (path) => (state.pages[path] || {}).content,
	getGit: (state) => (key) => (state.gits[key] || {projectId:4980659, git:gitlab.api, ref:"master", rootPath:"xiaoyao"}),
};

export const actions = {
	indexDB_savePage({commit, getters:{getPageByPath}}, page) {
		let oldpage = getPageByPath(page.path) || {};

		if (page.content != undefined && page.content != oldpage.content) {
			page.isModify = true;
		}
		
		g_app.pageDB.setItem({
			...oldpage,
			...page,
		});

		//console.log(oldpage, page);
		commit(SET_PAGE, page);
	},
	indexDB_deletePage(context, pagePath) {
		g_app.pageDB.deleteItem(pagePath);
	},
	setTagId({commit, state}, tagId) {
		commit("setTagId", tagId);
	},
	setHoverTagId({commit, state}, tagId) {
		commit("setHoverTagId", tagId);
	},
	setTagPath({commit, state}, tagPath) {
		commit("setTagPath", tagPath);
	},
	setMode(context, mode) {
		context.commit("setMode", mode);
	},
	setPagePath(context, pagePath) {
		context.commit(SET_PAGE_PATH, pagePath)
	},
	setPageContent(context, pageContent) {
		context.commit(SET_PAGE_CONTENT, pageContent)
	},
	setSwitchPage({commit}, switchPage) {
		commit(SET_SWITCH_PAGE, switchPage);	
	},
	setPage({commit, dispatch}, page) {
		if (!page.path) {
			return;
		}

		dispatch("indexDB_savePage", page);
	},
	loadPage(context, page) {
		let {commit, state, dispatch, getters:{getPageByPath}} = context;
		let {path} = page;
		let _loadPageFromServer = async function() {
			commit(SET_PAGE, {path:path, isRefresh:true});
			let file = await gitlab.getFile(page.path);
			page.id = file.blob_id;
			page.content = file.content;
			page.isRefresh = false;
			commit(SET_PAGE, page);
			if (state.pagePath == path) {
				commit(SET_SWITCH_PAGE, true);
			}
			//dispatch("indexDB_savePage", page);
		}
		let _loadPageFromDB = function(page) {
			if (state.pagePath == path) {
				commit(SET_SWITCH_PAGE, true);
			}
			commit(SET_PAGE, page);
		}
		g_app.pageDB.getItem(path).then(function(data){
			if (!data) {
				_loadPageFromServer();
				return;
			}
			var oldpage = getPageByPath(path);
			if (data.id == oldpage.id) {
				console.log("本地最新");
				_loadPageFromDB(data);

			} else if (data.id != oldpage.id && oldpage.isModify) {
				console.log("冲突");
				_loadPageFromDB(data);
			} else {
				console.log("服务器最新");
				_loadPageFromServer();
				return;
			}
		}, function() {
			_loadPageFromServer();
		})
	},
	async savePage(context, page) {
		let {path, content} = page;
		let {commit, getters, dispatch, state} = context;
		if (!path) {
			return;
		}

		let oper =  (state.pages[path] && state.pages[path].id) ? "editFile" : "createFile";

		commit(SET_PAGE, {...page, isRefresh:true});
		await gitlab[oper](path, {
			content:content,
			commit_message: 'update with keepwork editor',
		}).catch(function(){
		});

		let sha = gitsha(content);
		commit(SET_PAGE, {...page, isRefresh:false});
		dispatch("indexDB_savePage", {...page, isModify:false, id:sha});
	},
	async deletePage(context, page) {
		let {path} = page;
		let {commit, getters:{getGit}, dispatch} = context;

		if (!path) {
			return;
		}

		commit(SET_PAGE, {path:path, isRefresh:true});
		await gitlab.removeFile(path, {
			commit_message: 'delete by keepwork',
		});
		commit(SET_PAGE, {path:path, isRefresh:false});

		dispatch("indexDB_deletePage", path);
		commit(DELETE_PAGE, path);
	},
	async loadTree(context, payload) {
		let {commit, getters: {getGit}} = context;
		let list = await gitlab.getTree(payload.path, {...payload, recursive: true,}) || [];
		let pages = {};
		list.forEach(function(node){
			pages[node.path] = treeNodeToPage(node);
		});

		commit(SET_PAGES, pages);
	}
};

export const mutations = {
	setTagId(state, tagId) {
		state.tagId = tagId;
	},
	setHoverTagId(state, tagId) {
		state.hoverTagId = tagId;
	},
	setTagPath(state, tagPath) {
		state.tagPath = tagPath;
	},
	setMode(state, mode) {
		state.mode = mode;
	},
	[SET_PAGE_PATH](state, pagePath) {
		vue.set(state, "pagePath", pagePath);		
	},
	[SET_PAGE_CONTENT](state, pageContent) {
		vue.set(state, "pageContent", pageContent);		
	},
	[SET_SWITCH_PAGE](state, switchPage) {
		vue.set(state, 'switchPage', switchPage);
	},
	[SET_PAGE](state, page) {
		vue.set(state.pages, page.path, {
			...(state.pages[page.path] || {}),
			...page,
		});
	},
	[DELETE_PAGE](state, path) {
		vue.delete(state.pages, path);
	},
	[SET_PAGES](state, pages) {
		vue.set(state, "pages", {
			...state.pages,
			...pages,
		});
	},
};

//export default {
	//state:state,
	//mutations: mutations,
	//actions: actions,
	//getters: getters,
//};
