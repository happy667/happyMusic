import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
import './plugins/vant.js'
import '@/assets/common/font/iconfont.css'
import '@/assets/common/js/utils.js'
import VueLazyLoad from 'vue-lazyload'
import '@/assets/common/js/globalComponents.js'
import {
  defaultMusicImage
} from 'common/js/config.js'
// 解决移动端300ms延迟
import fastclick from 'fastclick'
fastclick.attach(document.body)
Vue.config.productionTip = false
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
