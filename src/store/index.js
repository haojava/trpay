import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {

  },
  mutations: {
      setIphoneShareUrl: (state,value) => state.iphoneShareUrl = value
  },
  actions: {

  }
})

export default {
    store
}
