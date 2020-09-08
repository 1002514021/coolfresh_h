import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/users'
import goodObj from './modules/goodObj'
Vue.use(Vuex)
export default new Vuex.Store({
    modules:{
        user,
        goodObj
    }
})