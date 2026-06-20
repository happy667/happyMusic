import Vue from '@vue/compat'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import animate from 'animate.css'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
import '@/assets/common/font/iconfont.css'
import 'vant/lib/index.css'
import 'swiper/css/swiper.css'
import '@/assets/common/js/globalComponents.js'

// 插件
import vantPlugin from './plugins/vant.js'
import VueLazyload from 'vue-lazyload'
import utils from '@/assets/common/js/utils.js'

Vue.config.productionTip = false

const app = createApp(App)
app.use(router)
app.use(store)
app.use(animate)
app.use(VueLazyload, { preLoad: 1.3 })
app.use(vantPlugin)
app.mount('#app')
app.config.globalProperties.$utils = utils