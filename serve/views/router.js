import Vue from "vue";
import Router from "vue-router";

import test from "./components/test.vue";
Vue.use(Router);

const routerPrefix = "/www";
export function createRouter() {
	return new Router({
		mode: "history",
		routes: [
			{
				name:"test",
				path: routerPrefix + "/test",
				component: test,
			},

		]
	});
}
