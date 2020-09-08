<template>
  <div id="permission">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="manager">
        <div class="userManageBox">
          <button class="addManager" @click="toaddManager">新增用户</button>
          <el-table :data="managers" style="width: 100%">
            <el-table-column prop="account" label="账号"></el-table-column>
            <el-table-column prop="uname" label="用户名"></el-table-column>
            <el-table-column prop="pwd" label="密码"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column width="200" prop="regTime" label="注册时间"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="modifyUserInfo(scope.row)" type="text" size="small">修改</el-button>
                <el-button @click="removeUser(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="config">
        <div class="config">
          <div class="chooseRole">
            <span>选择角色:</span>
            <el-select @change="defaltChecked" v-model="viewRoleId" placeholder="请选择角色">
              <el-option
                v-for="item in roles"
                :key="item.roleId"
                :value="item.roleId"
                :label="item.role"
              ></el-option>
            </el-select>
          </div>
          <div class="permissList">
            <span>权限列表：</span>
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="item.name" v-for="item in permission" :key="item.permissionId"></el-checkbox>
            </el-checkbox-group>
            <button class="saveCfg" @click="modifyPermiss">确定</button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="roles">
        <div class="roleManage">
          <button class="addRoleBtn" @click="toaddRoleDialog">新增角色</button>
          <el-table :data="roles" border style="width:60%">
            <el-table-column prop="roleId" label="角色编号"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="modifyRoleBtn(scope.row)" type="text" size="small">修改</el-button>
                <el-button type="text" @click="checkRole(scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 删除用户提示 -->
    <el-dialog
      class="delDialog deleteManagerDialog"
      title="提示"
      :visible.sync="centerDialogVisible"
      width="20%"
      center
    >
      <span>确定要解除该管理员的职位？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelManager">取 消</el-button>
        <el-button type="primary" @click="deleteManager">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除角色提示 -->
    <el-dialog
      class="delDialog delRoleDialog"
      title="提示"
      :visible.sync="delRoleDialog"
      width="20%"
      center
    >
      <span>确定要删除该项角色？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelRole">取 消</el-button>
        <el-button type="primary" @click="delRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog class="modifyRoleDialog" title="角色修改" :visible.sync="modifyRoleDialog" width="30%">
      <div>
        <span>修改用户角色：</span>
        <el-select v-model="role" placeholder="请选择角色">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.role"
            :value="item.roleId"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelModifyRole">取 消</el-button>
        <el-button type="primary" @click="modifyRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog class="addManagerDialog" title="添加用户" :visible.sync="addManager" width="40%">
      <div>
        <span class="itemTitle">账号：</span>
        <el-input
          class="inputBox"
          @blur="checkPhone"
          oninput="if(value.length>11)value=value.slice(0,11)"
          v-model="account"
          placeholder="账号为手机号"
        ></el-input>
      </div>
      <div>
        <span class="itemTitle">用户名：</span>
        <el-input class="inputBox" v-model="uname" placeholder="用户名"></el-input>
      </div>
      <div>
        <span class="itemTitle">密码：</span>
        <el-input title="初始密码为666" class="inputBox" type="password" v-model="pwd"></el-input>
      </div>
      <div>
        <span class="itemTitle">角色：</span>
        <el-select v-model="urole" placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.role"
            :value="item.roleId"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span class="itemTitle">性别：</span>
        <el-radio v-model="sex" label="男"></el-radio>
        <el-radio v-model="sex" label="女"></el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddManager">取 消</el-button>
        <el-button type="primary" @click="createManager">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog class="addRoleDialog" title="添加角色" :visible.sync="addRoleDialog" width="40%">
      <div>
        <span class="itemTitle">角色：</span>
        <el-input class="inputBox" v-model="newRole" placeholder="角色"></el-input>
      </div>
      <div>
        <span class="itemTitle">角色描述：</span>
        <el-input class="inputBox" v-model="roleDesc" placeholder="角色描述"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRole">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog
      class="modifyRoleDescDialog"
      title="角色修改"
      :visible.sync="modifyRoleDescDialog"
      width="30%"
    >
      <div>
        <span style="margin-bottom:1%;display:block">角色描述：</span>
        <el-input v-model="modifyRoleDesc"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelModifyRoleDesc">取 消</el-button>
        <el-button type="primary" @click="saveRoleDesc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let { log } = console;
import api from "../API.js";
import store from "../store/index";
export default {
  name: "permission",
  data() {
    return {
      centerDialogVisible: false,
      modifyRoleDialog: false,
      addManager: false,
      managers: [],
      activeName: "manager",
      role: "",
      roles: [],
      account: "",
      uname: "",
      pwd: "666",
      urole: "",
      sex: "男",
      roleId: "",
      delRoleDialog: false,
      newRole: "",
      roleDesc: "",
      addRoleDialog: false,
      modifyRoleDesc: "",
      modifyRoleDescDialog: false,
      viewRoleId: "",
      checkList: [],
      permission: [],
    };
  },
  methods: {
    // 毫秒换成标准时间格式
    dateString(datetimes) {
      var datetime = new Date(datetimes);
      var year = datetime.getFullYear();
      var month =
        datetime.getMonth() + 1 < 10
          ? "0" + (datetime.getMonth() + 1)
          : datetime.getMonth() + 1;
      var date =
        datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      var hour =
        datetime.getHours() < 10
          ? "0" + datetime.getHours()
          : datetime.getHours();
      var minute =
        datetime.getMinutes() < 10
          ? "0" + datetime.getMinutes()
          : datetime.getMinutes();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //查看是否该角色下有用户
    checkRole(row) {
      this.roleId = row.roleId;
      this.$axios({
        method: "post",
        data: { roleId: this.roleId },
        url: api.checkRole
      })
        .then(resp => {
          if (resp.data.length > 0) {
            this.$message.error("该项权限不能解除，下面还有用户");
          } else {
            this.delRoleDialog = true;
          }
        })
        .catch(err => {
          log(err);
        });
    },
    //用户修改
    modifyRole(row) {
      log(row);
    },
    //取消删除角色
    cancelDelRole() {
      this.roleId = "";
      this.delRoleDialog = false;
    },
    //确定删除角色
    delRole() {
      this.$axios({
        method: "post",
        data: { roleId: this.roleId },
        url: api.delRole
      })
        .then(resp => {
          if (resp.data.code == 200) {
            this.$message.success("删除成功");
            this.roles = resp.data.roles;
            this.roleId = "";
            this.delRoleDialog = false;
          }
        })
        .catch(err => {
          log(err);
        });
    },
    createManager() {
      if (
        this.account != "" &&
        this.uname != "" &&
        this.pwd != "" &&
        this.urole != "" &&
        this.sex != ""
      ) {
        let regTime = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()} ${new Date().getHours()}:${new Date().getMinutes()}`;
        this.$axios({
          method: "post",
          data: {
            account: this.account,
            uname: this.uname,
            pwd: this.pwd,
            roleId: this.urole,
            sex: this.sex,
            regTime
          },
          url: api.createManager
        })
          .then(resp => {
            if (resp.data.code == 200) {
              this.addManager = false;
              let managers = resp.data.managers;
              for (let item of managers) {
                item.regTime = this.dateString(
                  new Date(item.regTime).getTime()
                );
              }
              this.managers = resp.data.managers;
            }
          })
          .catch(err => {
            log(err);
          });
      } else {
        this.$message.error("输入不能为空");
      }
    },
    checkPhone() {
      if (!/^1[34578]\d{9}$/.test(this.account)) {
        this.$message.warning("输入格式不对，请重新输入");
        this.account = "";
      } else if (this.account == "") {
        this.$message.warning("输入不能为空");
      } else {
        this.$axios({
          method: "post",
          data: { account: this.account },
          url: api.checkPhone
        })
          .then(resp => {
            if (resp.data.length > 0) {
              this.$message.error("账户已存在,请重新输入");
              this.account = "";
            }
          })
          .catch(err => {
            log(err);
          });
      }
    },
    //去往添加用户界面
    toaddManager() {
      this.addManager = true;
    },
    cancelAddManager() {
      this.addManager = false;
    },
    //去往修改用户角色界面
    modifyUserInfo(row) {
      this.modifyRoleDialog = true;
      this.$store.dispatch("setManagerId", { account: row.account });
    },
    //取消修改用户角色
    cancelModifyRole() {
      this.modifyRoleDialog = false;
      // this.$store.dispatch("setManagerId", { account:''});
    },
    //修改用户角色
    modifyRole() {
      this.modifyRoleDialog = false;
      let roleId = this.role;
      let account = this.$store.getters.get_manager;
      this.$axios({
        method: "post",
        data: { account, roleId },
        url: api.modifyRole
      })
        .then(resp => {
          if (resp.data.code == 200) {
            let managers = resp.data.managers;
            for (let item of managers) {
              item.regTime = this.dateString(new Date(item.regTime).getTime());
            }
            this.managers = resp.data.managers;
          }
        })
        .catch(err => {
          log(err);
        });
    },
    //去往删除用户界面
    removeUser(row) {
      this.$store.dispatch("setManagerId", { account: row.account });
      this.centerDialogVisible = true;
    },
    //删除用户
    deleteManager() {
      this.centerDialogVisible = false;
      let account = this.$store.getters.get_manager;
      this.$axios({
        method: "post",
        data: { account },
        url: api.deleteManager
      })
        .then(resp => {
          if (resp.data.code == 200) {
            this.$message.success(`账号为${account}的管理员已离职`);
            let managers = resp.data.managers;
            for (let item of managers) {
              item.regTime = this.dateString(new Date(item.regTime).getTime());
            }
            this.managers = resp.data.managers;
          }
        })
        .catch(err => {
          log(err);
        });
    },
    //取消删除用户
    cancelDelManager() {
      this.centerDialogVisible = false;
      this.$store.dispatch("setManagerId", { account: "" });
    },
    //弹出添加角色列表
    toaddRoleDialog() {
      this.addRoleDialog = true;
    },
    cancelAddRole() {
      this.addRoleDialog = false;
    },
    //去添加角色对话框
    modifyRoleBtn(row) {
      (this.modifyRoleDescDialog = true), (this.roleId = row.roleId);
      this.modifyRoleDesc = row.roleDesc;
    },
    addRole() {
      if (this.newRole != "" && this.roleDesc != "") {
        this.$axios({
          method: "post",
          data: { role: this.newRole, roleDesc: this.roleDesc },
          url: api.addRole
        })
          .then(resp => {
            if (resp.data.code == 200) {
              this.roles = resp.data.roles;
              this.$message.success("添加成功");
              this.addRoleDialog = false;
              this.newRole = "";
              this.roleDesc = "";
            } else if (resp.data.code == 600) {
              this.$message.error("该角色已存在，请重新输入");
            }
          })
          .catch(err => {
            log(err);
          });
      } else {
        this.$message.error("输入不能为空");
      }
    },
    // 保存修改角色描述
    saveRoleDesc() {
      if (this.modifyRoleDesc != "") {
        this.$axios({
          method: "post",
          data: { roleDesc: this.modifyRoleDesc, roleId: this.roleId },
          url: api.modifyRole
        })
          .then(resp => {
            if (resp.data.code == 200) {
              this.roles = resp.data.roles;
              this.$message.success("修改成功");
              this.role = "";
              this.modifyRoleDescDialog = false;
            }
          })
          .catch(err => {
            log(err);
          });
      } else {
        this.$message.error("输入不能为空");
      }
    },
    cancelModifyRoleDesc() {
      this.role = "";
      this.modifyRoleDescDialog = false;
    },
    //修改权限
    modifyPermiss() {
      let checkedId = [];
      for (let itemId of this.permission) {
        for (let itemName of this.checkList) {
          if (itemName == itemId.name) {
            checkedId.push(itemId.permissionId);
          }
        }
      }
      this.$axios({
        method: "post",
        data: { checkedId, roleId: this.viewRoleId },
        url: api.modifyPermiss
      })
        .then(resp => {
          if (resp.data.code == 200) {
            this.$message.success("权限修改成功");
          }
        })
        .catch(err => {
          log(err);
        });
    },
    //获取指定角色权限列表
    
    defaltChecked() {
      this.checkList=[]
      if (this.viewRoleId != "") {
        this.$axios({
          method: "post",
          data: { roleId: this.viewRoleId },
          url: api.getRolePermiss
        })
          .then(resp => {
            for (let item of resp.data) {
              this.checkList.push(item.name);
            }
          })
          .catch(err => {
            log(err);
          });
      }
    }
  },
  created() {
    this.$axios({
      method: "post",
      url: api.getPermissionData
    })
      .then(resp => {
        let managers = resp.data.managers;
        for (let item of managers) {
          item.regTime = this.dateString(new Date(item.regTime).getTime());
        }
        this.managers = resp.data.managers;
        this.roles = resp.data.roles;
        this.permission = resp.data.permission;
        // this.$store.dispatch('setRoles',{roles:resp.data.roles})
      })
      .catch(err => {
        log(err);
      });
  }
};
</script>
<style lang="less">
#permission {
  box-shadow: 0 0;
  box-shadow: 1px 2px 5px 5px #ddd;
  padding: 0 1%;
  width: 98%;
  height: 100%;
  .userManageBox {
    width: 100%;
    height: 100%;
    .addManager {
      border: none;
      background-color: #0c9702;
      color: #fff;
      padding: 0.4% 1%;
      margin: 2% 0;
      cursor: pointer;
    }
  }
  .el-tabs__active-bar {
    background-color: #0c9702;
  }
  .el-tabs__item.is-active {
    color: #0c9702;
  }
  .el-tabs__item:hover {
    color: #0c9702;
  }
  .el-button--primary {
    background-color: #0c9702;
    color: #fff;
    width: 20%;
    line-height: 10%;
    border-radius: 0;
    border: none;
  }
  .el-button--default {
    background-color: #ddd;
    color: #333;
    width: 20%;
    line-height: 10%;
    border-radius: 0;
    border: none;
    margin-right: 10%;
  }
  .el-dialog__footer {
    padding: 2% 2% 5%;
  }
  .el-dialog__body {
    padding: 2.5%;
  }
  .el-dialog__header {
    padding: 2%;
  }
  .el-dialog__title {
    font-size: 14px;
  }
  .addManagerDialog {
    div {
      margin-bottom: 2%;
      .itemTitle {
        width: 10%;
        margin-right: 5%;
        display: inline-block;
      }
      .inputBox {
        width: 60%;
      }
    }
  }
  .roleManage {
    .addRoleBtn {
      border: none;
      background-color: #0c9702;
      color: #fff;
      padding: 0.4% 1%;
      margin: 2% 0;
      cursor: pointer;
    }
  }
  .addRoleDialog {
    div {
      margin-bottom: 2%;
    }
    span {
      margin-bottom: 1%;
      display: block;
    }
  }
  .config{
    margin: 2%;
    .chooseRole{
      margin-bottom: 2%;
      .el-input__inner{
        margin-left: 5%;
      }
    }
    .permissList{
      span{
        margin-bottom:1%;
        display: inline-block;
      }
    }
    .saveCfg{
      margin: 4% 0;
      border: none;
      background-color: #0c9702;
      color: #fff;
      padding: 1% 3%;
    }
  }
}
</style>


