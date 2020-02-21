import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import animate from 'animate.css'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
// import 'babel-polyfill'
import './plugins/vant.js'
import 'vant/lib/index.css'
import '@/assets/common/font/iconfont.css'
import '@/assets/common/js/utils.js'
import 'swiper/css/swiper.css'
import {
  defaultMusicImage
} from 'common/js/config.js'
import VueLazyLoad from 'vue-lazyload'
// 解决移动端300ms延迟
import fastclick from 'fastclick'
// Vue.use(VueAwesomeSwiper)
fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(animate)
// 使用懒加载
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  loading: defaultMusicImage
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
