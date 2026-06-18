import Vue from '@vue/compat'
import { createApp } from 'vue'
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
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false
Vue.prototype.$Dialog = Vue.prototype.$Dialog || {}
Vue.prototype.$toast = Vue.prototype.$toast || {}

const app = createApp(App)
app.use(router)
app.use(store)
app.use(animate)
app.use(VueLazyload, { preLoad: 1.3 })
app.mount('#app')