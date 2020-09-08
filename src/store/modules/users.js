import api from "../.././API";
import {SET_USER} from './mutations_type'
// import {setUserList} from './mutations_type'
import {USER_LOGIN} from './actions_type'
import { Message } from "element-ui";
import {GET_TOKEN} from './getter_type';
import {getUserList} from './actions_type'
import {GET_USERLIST} from './getter_type'
import {userLogOut} from './actions_type'
const {log}=console
const user={
    
    state:{
        user:{},
        userList:[]
    },
    actions:{
        //用户登录
        [USER_LOGIN]({commit},user){
            let{account,pwd,role,_that}=user
            _that.$axios({
              method: "post",
              url: api.login,
              data:{account,pwd,role}
            }).then(resp => {
                if (resp.data.code == 200) {
                    commit(SET_USER,user)
                  //把登录信息保存在本地缓存（真实项目里登录信息就是token）
                  _that.$router.push({
                    path: "/Home"
                  });
                } else if (resp.data.code == 600) {
                  Message({
                    message: "账号密码有误请重新输入",
                    type: "error"
                  });
                  this.resetForm("ruleForm");
                }
              })
              .catch(err => {
                log(err);
              });
        },
        // 获取用户菜单
        [getUserList](content,_this){
            _this.$axios({
                url:api.getUserList,
                method:'post',
            }).then((resp)=>{
               let  userList=resp.data
               _this.userList=userList
            })
        },
        //退出登录
        [userLogOut]({commit}){
            commit(SET_USER,{})
            // commit(setUserList,[])
        }
    },
    mutations:{
        [SET_USER](state,user){
            state.user=user
        },
        // [setUserList](state,usrList){
        //      state.userList=usrList
        // }
    },
    getters:{
        [GET_TOKEN](state){
            return state.user.account
        },
        [GET_USERLIST](state){
            return state.userList
        },
        get_role(state){
            return state.user.role
        },
        get_user(state){
            return state.user
        }
    }
}
export default(user)