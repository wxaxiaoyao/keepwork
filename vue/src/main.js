import Vue from 'vue';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';


import App from './App.vue';
import router from "./router";
import store from "./store";

import "./lib/jsonEditor";
import "./components/bases";

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');

