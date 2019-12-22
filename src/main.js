import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'common/stylus/index.styl'
import 'babel-polyfill'
// 轮播图插件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 解决移动端300ms延迟
import fastclick from 'fastclick'

Vue.use(VueAwesomeSwiper)
fastclick.attach(document.body)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
