import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import animate from 'animate.css'
import vueg from 'vueg' // 传入实例化后的router, Options为可选的插件配置
import 'common/stylus/index.styl'
import 'babel-polyfill'
// 解决移动端300ms延迟
import fastclick from 'fastclick'

fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(animate)
Vue.use(vueg, router)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
