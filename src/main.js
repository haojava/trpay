// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vant from 'vant'
import App from './App'
import router from './router'
import store from './store'
import commonFunction from './utils/utils.js'
import 'vant/lib/index.less'

Vue.use(VueAxios, axios);
Vue.use(Vant);
Vue.use(commonFunction);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
