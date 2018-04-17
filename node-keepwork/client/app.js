import vue from 'vue';
import {sync} from "vuex-router-sync";
import ElementUI from 'element-ui';
import _ from 'lodash';

import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'github-markdown-css/github-markdown.css';


import App from './app.vue';
import {createRouter} from "./router.js";
import {createStore} from "./store/index.js";

import "./lib/jsonEditor";
import consts from "./lib/const.js";
import config from "./config.js";

import "./components/bases";
import "./components/common";

vue.config.productionTip = false;


global._ = _;

global.g_app = {
	_: _,
	vue: new vue(), // vue inst
	consts: consts,
	config: config,
}

vue.use(ElementUI);

export const createApp = (context) => {
	const router = createRouter();
	const store = createStore();

	sync(store, router);

	const app = new vue({
		router,
		store,
		render: h => h(App),
	});

	return {app, router, store};
}

export default createApp();
