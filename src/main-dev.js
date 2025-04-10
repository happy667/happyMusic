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
import 'vue-lazyload'

Vue.config.productionTip = false
Vue.use(animate)
Vue.prototype.$Dialog = vant.Dialog
Vue.prototype.$toast = vant.Toast
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')