import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/Login')
const Index = () => import('../views/Index')
const Register = () => import('../views/Register')
const Home = () => import('../views/Home.vue')
Vue.use(VueRouter)

const routes = [
  // 重定向到首页
  {
    path: '/',
    redirect: '/Home'
  },
  // 跳转到登录页面
  {
    path: '/Login',
    component: Login
  },
  // 跳转到首页
  {
    path: '/Index',
    component: Index
  },
  // 跳转到注册页面
  {
    path: '/Register',
    component: Register
  },
  // 音乐app首页
  {
    path: '/Home',
    component: Home
  }

]

const router = new VueRouter({
  routes
})

export default router
