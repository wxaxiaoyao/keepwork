import Vue from 'vue';
import VueRouter from "vue-router";

import store from "@/store";
import gitlab from "@/api/gitlab.js";
import {dataSource} from "@/api/keepwork.js";

import test from "./components/pages/test.vue";
import modeditor from "./components/pages/modeditor";
import editor from "./components/pages/editor";
import tagmods from "./components/pages/tagmods/index.vue";
import login from "./components/pages/login/index.vue";
import notfound from "./components/pages/notfound/index.vue";
import userpage from "./components/pages/userpage/index.vue";
import home from "./components/pages/home/index.vue";

Vue.use(VueRouter);

const routerPrefix = "/www";
export const router = new VueRouter({
	mode:"history",
	routes:[
	{
		name:"test",
		path: routerPrefix + "/test",
		component: test,
	},
	{
		name:"home",
		path: routerPrefix + "/home",
		alias: ["/", "/www", "/wiki"],
		component: home,
	},
	{
		path: routerPrefix + "/modeditor",
		component: modeditor,
	},
	{
		name:"editor",
		path: routerPrefix + "/editor",
		component: editor,
		meta:{
			requireAuth: true,
		},
	},
	{
		path: routerPrefix + "/tagmods",
		component: tagmods,
	},
	{
		name:"login",
		path: routerPrefix + "/login",
		component: login,
	},
	{
		name:"register",
		path: routerPrefix + "/register",
		component: login,
	},
	{
		path: '/(www|wiki)/*',
		component: notfound,
	},
	{
		path: "/:username/*",
		component: userpage,
		meta:{
			requireAuth: true,
			requireMods: true,
			requireDataSource: true,
		},
	}
	],
});

// 用户认证钩子
router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requireAuth)) {
		if (!store.getters["user/isAuth"]) {
			next({name:"login"});
			return;
		}
	}	
	next();
	return;
});

// mods加载钩子
router.beforeEach(async function(to, from, next){
	if (to.matched.some(record => record.meta.requireMods)) {
		await store.dispatch("mods/loadTagMods");	
	}
	next();
});

// 数据源钩子
//router.afterEach(async function(to, from){
	//const some = function(record) {
		//if (!record.meta.requireDataSource) {
			//return false;
		//}
		//return true;
	//}
	//if (to.matched.some(some)) {
		 //const username = (to.params || {}).username;
		 //const ds = await dataSource.getDefaultDataSource({username:username});
		 //if (ds) {
			//gitlab.initConfig(ds);
			//store.dispatch("dataSource/setDataSource", ds);
		 //} 
	//}
//})

export default router;
