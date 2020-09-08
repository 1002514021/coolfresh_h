<template>
  <div id="login" v-bind:style="contentStyleObj">
    <div class="mainBox">
      <div class="mainBar">
        <h3>凉鲜生后台管理系统</h3>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          style="height:100%;display:flex; flex-direction: column;justify-content: space-between"
        >
          <el-form-item label="账号" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input type="password" v-model="ruleForm.pwd"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-radio-group v-model="ruleForm.role">
              <el-radio style="margin-bottom:5%" v-for="(item) of roles" :label="item.roleId" :key="item.roleId">{{item.role}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div id="others">
          <span id='forget' @click="toForget">忘记密码/修改密码</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let { log } = console;
import { Message } from "element-ui";
import api from "../API.js";
import {USER_LOGIN} from'../store/modules/actions_type'
import {mapActions} from 'vuex'
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        role: 1,
        account: "",
        pwd: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 11, max: 11, message: "长度11 个字符", trigger: "blur" }
        ],
        pwd: [{ required: true, message: "请输入账号密码", trigger: "blur" }]
      },
      //大盒子的高
      contentStyleObj: {
        height: ""
      },
      roles: []
    };
  },
  methods: {
    ...mapActions([USER_LOGIN]),
    getHeight() {
      this.contentStyleObj.height = window.innerHeight + "px";
    },
    submitForm(formName) {
      let _that=this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this[USER_LOGIN]({account:this.ruleForm.account,pwd:this.ruleForm.pwd,role:this.ruleForm.role,_that:_that})
         //在这里调用登录函数 触发actions
        //  this.$store.dispatch(USER_LOGIN,
        //  {account:this.ruleForm.account,pwd:this.ruleForm.pwd,role:this.ruleForm.role,_that:_that})
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toForget(){
      this.$router.push({
        path:'/Forget'
      })
    }
  },
  beforeCreate() {
    this.$axios({
      method: "post",
      url: api.getRoles
    })
      .then(resp => {
        this.roles = resp.data;
      })
      .catch(err => {
        log(err);
      });
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  }
};
</script>
<style lang="less" scoped>
#login {
  background: url("../images/indexBg.jpg");
  .mainBox {
    width: 100%;
    height: 100%;
    // background: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    .mainBar {
      display: flex;
      flex-direction: column;
      box-shadow: -2px 0 2px 2px #000;
      justify-content: space-between;
      h3 {
        height: 10%;
        font-size: 16px;
        font-weight: normal;
        text-align: center;
        margin-bottom: 5%;
        color: #0c9702;
        font-style: italic;
      }
      width: 40%;
      height: 60%;
      background-color: #fff;
      margin: 5% auto auto auto;
      padding: 2% 4% 4% 0;
      .demo-ruleForm {
        height: 70%;
        overflow: hidden;
      }
      .el-button {
        width: 20%;
      }
      .el-button--primary {
        color: #fff;
        background-color: #0c9702;
        border: none;
      }
      #others {
        height:5%;
        margin: 2% 1% 0 10%;
        display: flex;
        justify-content: space-between;
        #forget{
          cursor: pointer;
        }
        #forget:hover{
          color:#0c9702;
        }
      }
    }
  }
}
</style>


