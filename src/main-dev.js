import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import animate from 'animate.css'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'

import 'vant/lib/index.css'
import '@/assets/common/font/iconfont.css'
import '@/assets/common/js/utils.js'
import 'swiper/css/swiper.css'
import '@/assets/common/js/globalComponents.js'

// 插件
import './plugins/vant.js'
import './plugins/vueLazyLoad.js'
// 解决移动端300ms延迟
import fastclick from 'fastclick'

Vue.config.productionTip = false
Vue.use(animate)
fastclick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
