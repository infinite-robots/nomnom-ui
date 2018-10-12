// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import store from './store';
import App from './App';
import router from './router';

Vue.use(Vuetify, {
  theme: {
    primary: '#f19a24',
    secondary: '#FFCD89',
  },
});

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
