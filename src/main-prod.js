import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
import '@/assets/common/font/iconfont.css'
import utils from '@/assets/common/js/utils.js'
import * as filters from '@/assets/common/js/convert.js'
import registerGlobalComponents from '@/assets/common/js/globalComponents.js'
import swiperNested from '@/assets/common/js/swiperNested.js'

// 插件
import Vant from './plugins/vant'
const app = createApp(App)
app.directive('swiper-nested', swiperNested)
// 注册全局组件
app.config.globalProperties.$utils = utils
app.config.globalProperties.$filters = filters
registerGlobalComponents(app)


// 注册插件
app.use(router)
app.use(store)
app.use(VueLazyload, { preLoad: 1.3 })
app.use(Vant)
// 最后挂载应用
app.mount('#app')