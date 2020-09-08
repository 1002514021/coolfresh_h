<template>
  <div id="forget" v-bind:style="contentStyleObj">
    <div class="mainBox">
      <div class="mainBar">
        <h3>找回密码/修改密码</h3>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          style="height:100%;display:flex; flex-direction: column;justify-content: space-between"
        >
          <el-form-item id="account" label="账号" prop="account">
            <el-input class="phone" v-model="ruleForm.account"></el-input>
            <el-button class="sendCodeBtn" @click="sendMsg('ruleForm')">发送验证码</el-button>
          </el-form-item>
          <el-form-item ref="smsForm" label="验证码" prop="code">
            <el-input v-model="ruleForm.code" @blur="verifyCode('ruleForm')"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd" ref="pwdForm">
            <el-input type="password" v-model="ruleForm.pwd"></el-input>
          </el-form-item>
          <el-form-item label="确定密码" prop="ensure" ref="ensureForm">
            <el-input type="password" v-model="ruleForm.ensure" @blur="isSame('ruleForm')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm('ruleForm')" type="primary">重置密码</el-button>
            <el-button @click="reLogin">返回登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
let { log } = console;
import { Message } from "element-ui";
import api from "../API.js";
import { mapActions } from "vuex";
export default {
  name: "forget",
  data() {
    return {
      ruleForm: {
        account: "",
        pwd: "",
        code: "",
        ensure: ""
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 11, max: 11, message: "长度11 个字符", trigger: "blur" }
        ],
        pwd: [{ required: true, message: "请输入新秘密", trigger: "blur" }],
        ensure: [{ required: true, message: "请确定新秘密", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      contentStyleObj: {
        height: ""
      }
    };
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.innerHeight + "px";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let pwd = this.ruleForm.pwd;
          this.$axios({
            method: "post",
            data: { pwd },
            url: api.resetPwd
          })
            .then(resp => {
              log(resp);
              if (resp.data.code == 200) {
                this.$message.success("密码重置成功，去登录");
              }
            })
            .catch(err => {
              log(err);
            });
        } else {
          log(2);
          return false;
        }
      });
    },
    sendMsg(phoneNum) {
      this.$refs[phoneNum].validateField("account", accountError => {
        if (!accountError) {
          let phone = this.ruleForm.account;
          log(phone);
          this.$axios({
            method: "post",
            url: api.sendMSg,
            data: { phone }
          })
            .then(resp => {
              log(resp);
              if (resp.data.code == 200) {
                //   this.$message({
                //       type:'success',
                //       message:'验证码发送，请注意查收'
                //   })
                this.$message.success("(^o^)~ 验证码发送成功！");
              }
            })
            .catch(err => {
              log(err);
            });
        } else {
          return false;
        }
      });
    },
    verifyCode(smscode) {
      this.$refs[smscode].validateField("account", accountError => {
        if (!accountError) {
          let phone = this.ruleForm.account;
          this.$refs[smscode].validateField("code", codeError => {
            if (!codeError) {
              let code = this.ruleForm.code;
              let phone = this.ruleForm.account;
              this.$axios({
                method: "post",
                url: api.verifyCode,
                data: { code, phone }
              })
                .then(resp => {
                  // log(resp)
                  if (resp.data.code == 200) {
                  } else {
                    this.$refs["smsForm"].clearValidate();
                    this.$message.error("验证码错误,请从新输入");
                    this.ruleForm.code = "";
                  }
                })
                .catch(err => {
                  log(err);
                });
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    isSame(isSame) {
      this.$refs[isSame].validateField("pwd", pwdError => {
        if (!pwdError) {
          this.$refs[isSame].validateField("ensure", ensureError => {
            if (!ensureError) {
              if (this.ruleForm.pwd != this.ruleForm.ensure) {
                this.$message.error("两次密码输入不同，请重新确认");
                this.$refs["pwdForm"].clearValidate();
                this.ruleForm.pwd = "";
                // this.ruleForm.ensure=''
              }
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    reLogin() {
        this.$router.push('/Login')
    }
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
#forget {
  font: 12px;
  background: url("../images/indexBg.jpg");
  .mainBox {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    .mainBar {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      #account {
        .phone {
          width: 75%;
        }
        .sendCodeBtn {
          width: 20%;
          margin-left: 5%;
        }
      }
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
      padding: 2% 4%;
      .el-button--primary {
        color: #fff;
        background-color: #0c9702;
        border: none;
      }
    }
  }
}
</style>


