<template>
  <el-container>
    <el-header id="header">
      <div class="logoBox">
        <img src="../images/logo.png" alt>
      </div>
      <div class='systemName'>凉鲜生后台管理系统</div>
      <div class="header-right">
        <div class="account-box header-item-box">
        <span class="el-icon-circle-close"></span>
          <span>账户：王又</span>
        </div>
        <div class="logout-box header-item-box">
          <span class="el-icon-circle-close"></span>
          <span @click="logout">退出</span>
        </div>
      </div>
    </el-header>
    <el-container :style="boxStyleObj">
      <el-aside id="nav" width="13%" style="background-color:#333">
        <left-bar></left-bar>
      </el-aside>
      <el-main width="87%" id="main-box" style="background-color:#fff">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// import { getUserList } from "../store/modules/actions_type";
import { constants } from "fs";
import store from "../store/index";
// import { GET_USERLIST } from "../store/modules/getter_type";
import { userLogOut } from "../store/modules/actions_type";
import { mapActions } from "vuex";
import leftBar from "../components/leftBar";
let { log } = console;
export default {
  name: "home",
  components: {
    leftBar
  },
  data() {
    return {
      boxStyleObj: {
        height: ""
      }
    };
  },
  methods: {
    ...mapActions([userLogOut]),
    getHeight() {
      this.boxStyleObj.height = window.innerHeight - 60 + "px";
    },
    logout(){
     this.$router.push("/Login");
      this[userLogOut]();
    }
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  beforeCreate() {
    this.$router.push({
      path: "/home/index"
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  }
};
</script>
<style lang="less" scoped>
#header {
  display: flex;
  align-items: center;
  background-color: #333;
  padding: 0;
  .logoBox {
    text-align: center;
    width: 12.9%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    img {
      width: 38%;
      height: 100%;
    }
  }
  .systemName{
    width: 20%;
    color:#fff;
    text-indent: 5%;
    font-size: 14px;
  }
  .header-right {
    width: 67.1%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .header-item-box {
      margin-right: 2%;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logout-box {
      cursor: pointer;
    }
  }
}
#nav {
  padding: 1% 0;
}

</style>

