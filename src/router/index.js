import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/page/Login.vue'
import Home from '../components/common/Home.vue'
import Readme from '../components/page/Readme.vue'
import Messages from '../components/page/Messages.vue'
import Category from '../components/page/Category.vue'
import Foods from '../components/page/Foods.vue'
import Addfood from '../components/page/Addfood.vue'
import Members from '../components/page/Members.vue'
import Orders from '../components/page/Orders.vue'
import Notice from '../components/page/Notice.vue'
import ModifyPassword from '../components/page/ModifyPassword.vue'
Vue.use(Router)
//路由表
export default new Router({
  routes: [
    {path:'/',redirect:'/login'},
    {path: '/login', component: Login},
    {
      path: '/readme', component: Home,
      children:[
        {path: '/', component: Readme},
        {path: '/messages', component: Messages},
        {path: '/category', component: Category},
        {path: '/foods', component: Foods},
        {path: '/addfood', component: Addfood},
        {path: '/members', component: Members},
        {path: '/notice', component: Notice},
        {path: '/orders', component: Orders},
        {path: '/modifyPassword', component: ModifyPassword},
      ]
    },
    {path:'*',redirect:'/login'}
  ]
})
