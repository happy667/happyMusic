import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
import '@/assets/common/font/iconfont.css'
import '@/assets/common/js/utils.js'
import '@/assets/common/js/globalComponents.js'

// 使用懒加载
Vue.use(VueLazyload, {
    preLoad: 1.3
})
Vue.prototype.$Dialog = vant.Dialog
Vue.prototype.$toast = vant.Toast
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')