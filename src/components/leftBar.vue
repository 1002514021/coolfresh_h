<template>
  <el-row class="menu">
    <el-col :span="12" class="tac">
      <el-menu
        router
        default-active="1"
        class="menuBox el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#333"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <template v-for="(item,index) of userList">
          <el-menu-item :index="item.permission" :key="index">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
import { getUserList } from "../store/modules/actions_type";
import { mapActions } from "vuex";
var { log } = console;
export default {
  data() {
    return {
      userList: []
    };
  },
  methods: {
    ...mapActions([getUserList]),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getList() {
      let _this = this;
      //调用vuex里面获取全向列表的方法
      // this.$store.dispatch(getUserList, _this);
      this[getUserList](_this);
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="less" scoped>
.tac {
  width: 100%;
}
.menu {
  width: 100%;
}
.menuBox {
  width: 100%;
  border: none;
}
</style>


