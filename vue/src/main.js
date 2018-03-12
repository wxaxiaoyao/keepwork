import Vue from 'vue';
import _ from 'lodash';
import ElementUI from 'element-ui';
import VueResource from 'vue-resource';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';

import App from './App.vue';
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueResource);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');

window.app = window.app || {};

app._ = _;
