import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// import * as echarts from 'echarts'

// css样式(由于项目初期使用原生js开发，所以css没有分离)
import '../../static/css/master.css'
import '../../static/css/index.css'

// mixins
import { defaultDragEvent, defaultRefreshEvent } from './lib/defaultEvent'

// filters
import filters from './lib/filters'
Object.keys(filters).forEach(fil => {
  Vue.filter(fil, (filters as { [key: string]: Function })[fil])
})

Vue.config.productionTip = false

// Vue.prototype.$echarts = echarts
/* eslint-disable no-new */
new Vue({
  router,
  store,
  mixins: [defaultDragEvent, defaultRefreshEvent],
  render: h => h(App)
}).$mount('#app')
