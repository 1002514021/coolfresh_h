import {setGoodObj} from './actions_type'
let {log}=console
const goodObj={
    state:{
        //要修改的商品id
        objGoodId:'',
        removeManagerId:'',
    },
    actions:{
        [setGoodObj]({commit},{goodId}){
            commit('setGoodId',goodId)
        },
        setManagerId({commit},{account}){
            log(account)
            commit('setManagerId',account)
        },
        // setRoles({commit},{roles}){
        //     commit('setRoles',roles)
        // }
    },
    mutations:{
        setGoodId(state,goodId){
            state.objGoodId=goodId
        },
        setManagerId(state,account){
            state.removeManagerId=account
        },
        // setRoles(state,roles){
        //     state.roles=roles
        // }
    },
    getters:{
        get_goodId(state){
            return state.objGoodId
        },
        get_manager(state){
            return state.removeManagerId
        }
    }
}
export default(goodObj)