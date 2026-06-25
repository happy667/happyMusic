import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'animate.css'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
import '@/assets/common/font/iconfont.css'
import 'swiper/css'
import 'swiper/css/pagination'
import registerGlobalComponents from '@/assets/common/js/globalComponents.js'
import swiperNested from '@/assets/common/js/swiperNested.js'

// 插件
import Vant from './plugins/vant'
import VueLazyload from 'vue-lazyload'
import utils from '@/assets/common/js/utils.js'
import * as filters from '@/assets/common/js/convert.js'

const app = createApp(App)
app.directive('swiper-nested', swiperNested)
app.config.globalProperties.$utils = utils
app.config.globalProperties.$filters = filters
// 注册全局组件
registerGlobalComponents(app)

// 注册插件
app.use(router)
app.use(store)
app.use(Vant)
app.use(VueLazyload, { preLoad: 1.3 })
// 最后挂载应用
app.mount('#app')