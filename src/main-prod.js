import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
import '@/assets/common/font/iconfont.css'
import '@/assets/common/js/utils.js'
import '@/assets/common/js/globalComponents.js'
import 'vue-lazyload'
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')