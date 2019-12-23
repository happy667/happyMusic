import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import animate from 'animate.css'
import 'common/stylus/index.styl'
import 'babel-polyfill'
import Vant from 'vant'
import 'vant/lib/index.css'
// 轮播图插件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 解决移动端300ms延迟
import fastclick from 'fastclick'
Vue.use(Vant)
Vue.use(VueAwesomeSwiper)
fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(animate)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
