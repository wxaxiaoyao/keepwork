import Vue from 'vue';
import VueRouter from "vue-router";

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
export default new VueRouter({
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
	}
	],
});
