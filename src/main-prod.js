import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import VueLazyload from 'vue-lazyload'
import 'lib-flexible/flexible'
import 'common/stylus/index.styl'
import '@/assets/common/font/iconfont.css'
import utils from '@/assets/common/js/utils.js'
import * as filters from '@/assets/common/js/convert.js'
import registerGlobalComponents from '@/assets/common/js/globalComponents.js'
import swiperNested from '@/assets/common/js/swiperNested.js'
import Vant from './plugins/vant'
const app = createApp(App)
app.directive('swiper-nested', swiperNested)
app.config.globalProperties.$utils = utils
app.config.globalProperties.$filters = filters
registerGlobalComponents(app)
app.use(pinia)
app.use(router)
app.use(VueLazyload, { preLoad: 1.3 })
app.use(Vant)
app.mount('#app')