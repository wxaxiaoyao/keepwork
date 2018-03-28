import Vue from 'vue';
import VueRouter from "vue-router";

import test from "./components/pages/test.vue";
import modeditor from "./components/pages/modeditor";
import editor from "./components/pages/editor";

Vue.use(VueRouter);

export default new VueRouter({
	mode:"history",
	routes:[
	{
		path:"/test",
		component: test,
	},
	{
		path:"/modeditor",
		component: modeditor,
	},
	{
		path:"/editor",
		component: editor,
	},
	],
});
