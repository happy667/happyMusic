import { createApp } from 'vue'
import {
  Toast,
  Dialog,
} from 'vant'
import 'vant/lib/index.css'
export default {
  install: (app) => {
    app.config.globalProperties.$dialog = Dialog 
    app.config.globalProperties.$toast = Toast
  }
}