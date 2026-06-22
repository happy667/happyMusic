import { createApp } from 'vue'
import Loading from '@/components/common/Loading'

// Vue 3 全局组件注册
export default function registerGlobalComponents(app) {
  app.component('Loading', Loading)
}