import Vue from 'vue'
import Vuex from 'vuex'
// import Counter from './modules/Counter'
// import GlobalSettings from './modules/GlobalSettings'
// import LocalOperate from './modules/LocalOperate'
// import Settings from './modules/Settings'

Vue.use(Vuex)
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production'
})
