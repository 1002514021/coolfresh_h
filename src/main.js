import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Element from 'element-ui'
import echarts from 'echarts'
import store from './store/index'
import {GET_TOKEN} from './store/modules/getter_type'

// var {log}=console
Vue.config.productionTip = false
//给vue原型对象拓展一个$axios的方法
Vue.prototype.$axios = axios 
Vue.prototype.$echarts=echarts
router.beforeEach((to,from,next)=>{
  if(to.name==='Login'){
    next()
  }else{
    //需要登录的判断
    if(to.meta.required){
      if(store.getters[GET_TOKEN]){
        //在登录的情况下判断这个账号可以进入哪些页面
        //这句话的意思是下一个页面的权限列表有没有当前这个用户的权限
        if(to.meta.roles.indexOf(store.getters.get_role)>=0){
          next()
        }else{
          next('/401')
        }
       
      }else{
        next('/Login')
      }
    }else{
      next()
    }
  }
})
Vue.use(Element)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
