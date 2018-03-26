import Vue from 'vue';
import ElementUI from 'element-ui';
import _ from 'lodash';

import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';


import App from './App.vue';
import router from "./router";
import store from "./store";

import "./lib/jsonEditor";
import "./components/bases";
import "./components/common";

Vue.config.productionTip = false;

global._ = _;

global.g_app = {
	_: _,
};

//console.log(g_app);
console.log(process.env.TEST)
console.log(process.env.NODE_ENV)

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
