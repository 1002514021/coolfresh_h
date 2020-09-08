import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
      // redirect:'/Login'
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Forget',
      name: 'Forget',
      component: ()=>import('./views/Forget.vue')
    },
    {
      path:'/401',
      name:'401',
      component:()=>import('./components/401.vue') 
    },
    {
      path:'/Home',
      name:'Home',
      required:true,
      component:()=>import('./views/Home.vue'),
      meta:{
        required:true,
        roles:[1,2]
      },
      children:[
        {
          path:'/Home/index',
          name:'index',
          component:()=>import('./components/index.vue'),
          meta:{
            required:true,
            roles:[1,2]
          }
        },
        {
          path:'/Home/goods',
          name:'goods',
          component:()=>import('./components/goods.vue'),
          meta:{
            required:true,
            roles:[1,2]
          },
          children:[
            {
              path:'/goodsList',
              name:'goodsList',
              component:()=>import('./components/goodsList.vue'),
            },
            {
              path:'/goodManage',
              name:'goodManage',
              component:()=>import('./components/goodManage.vue'),
            }
          ]
        },
        {
          path:'/Home/order',
          name:'order',
          component:()=>import('./components/order.vue'),
          meta:{
            required:true,
            roles:[1,2]
          }
        },
        {
          path:'/Home/report',
          name:'report',
          component:()=>import('./components/report.vue'),
          meta:{
            required:true,
            roles:[1]
          }
        },
        {
          path:'/Home/permission',
          name:'permission',
          component:()=>import('./components/permission.vue'),
          meta:{
            required:true,
            roles:[1]
          }
        }
      ]
    }
  ]
})
