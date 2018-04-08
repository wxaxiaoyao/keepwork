import vue from 'vue';
import ElementUI from 'element-ui';
import _ from 'lodash';

import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'github-markdown-css/github-markdown.css';


import app from './app.vue';
import router from "./router";
import store from "./store";

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

new vue({
  render: h => h(app),
  router,
  store,
}).$mount('#app');


