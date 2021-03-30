/* jshint esversion: 6 */
import Vue from 'vue';
import App from './App';
import fly from './utils/fly';
import store from './store';

Vue.prototype.$http = fly;
Vue.prototype.$store= store;
Vue.prototype.$Timer= null;

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

