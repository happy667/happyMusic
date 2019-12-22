import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/appIndex/Login')
const Index = () => import('../views/appIndex/Index')
const Register = () => import('../views/appIndex/Register')
const AppIndex = () => import('../views/AppIndex')
const Home = () => import('../views/Home')
Vue.use(VueRouter)

const routes = [
  // 重定向到首页
  {
    path: '/',
    redirect: '/appIndex/Index'
  },
  {
    path: '/AppIndex',
    redirect: '/appIndex/Index'
  },
  // 首页
  {
    path: '/AppIndex',
    component: AppIndex,
    children: [
      // 跳转到首页
      {
        path: 'Index',
        component: Index
      },
      // 跳转到登录页面
      {
        path: 'Login',
        component: Login
      },

      // 跳转到注册页面
      {
        path: 'Register',
        component: Register
      }
    ]
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
