import Vue from 'vue';
import VueRouter from "vue-router";

import test from "./components/pages/test.vue";
import uieditor from "./components/pages/uieditor.vue";
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
		path:"/uieditor",
		component: uieditor,
	},
	{
		path:"/editor",
		component: editor,
	},
	],
});
