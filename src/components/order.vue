<template>
  <div id="goodsList">
    <h3>订单查看/清理</h3>
    <div class="queryModel">
      <div class="queryItem">
        <span>下单时间：</span>
        <el-date-picker
          style="width:70%; margin-right: 20px"
          v-model="orderDate"
          type="date"
          @change="searchItem"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div class="queryItem">
        <span>订单状态：</span>
        <el-cascader
          style="width: 70%;"
          clearable
          expand-trigger="hover"
          :options="orderItems"
          @change="setState"
          :show-all-levels="false"
        ></el-cascader>
      </div>
      <div class="queryItem">
        <span>订单编号：</span>
        <el-input @change="searchItem" style="width: 70%;" v-model="orderCode" placeholder="请输入内容"></el-input>
      </div>
      <button @click="exportExcel" style="width:6%;background-color:#0c9702;">导出</button>
    </div>
    <el-table id="orderTable" :data="orders" style="width: 100%;margin-bottom: 20px">
      <el-table-column :selectable="checkboxInit" type="selection"></el-table-column>
      <el-table-column width="130%" prop="orderCode" label="订单编号"></el-table-column>
      <el-table-column width="120" prop="goodsId" label="商品编号"></el-table-column>
      <el-table-column prop="account" label="客户账号"></el-table-column>
      <el-table-column prop="state" label="订单状态"></el-table-column>
      <el-table-column prop="orderDate" label="下单日期"></el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
      <el-table-column prop="fee" label="订单金额"></el-table-column>
      <el-table-column prop="fee" label="订单金额"></el-table-column>
      <el-table-column prop="addressId" label="收货地址编号"></el-table-column>
      <el-table-column v-if="isShow" fixed="right" label="接收订单">
        <template slot-scope="scope">
          <el-button @click="toprocess(scope.row)" type="text" size="small">待处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="align-item:center;display:flex;justify-content:space-between;padding:2% 1%">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageTotal"
        :page-sizes="[8, 10, 20,30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <button v-if="isShowBtn" class="clearBtn" @click="clearOver">清空过期订单</button>
    </div>
  </div>
</template>
<script>
import api from "../API.js";
import { Message } from "element-ui";
import { setTimeout } from "timers";
import FileSaver from "file-saver";
import XLSX from "xlsx";
var { log } = console;
export default {
  name: "order",
  data() {
    return {
      isShow: true,
      isShowBtn: true,
      currentPage: 1,
      total: 0,
      pageTotal: 8,
      orderCode: "",
      account: "",
      state: "",
      isProcessed: "",
      orderDate: "",
      orders: [],
      goodsId: "",
      orderItems: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "未付款",
          label: "未付款"
        },
        {
          value: "已付款",
          label: "已付款",
          children: [
            {
              value: "已处理",
              label: "已处理"
            },
            {
              value: "待处理",
              label: "待处理"
            }
          ]
        }
      ]
    };
  },
  methods: {
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#orderTable"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "订单表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //清空过期订单
    clearOver() {
      let _this = this;
      let overDates = [];
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].isOver) {
          overDates.push(this.orders[i].orderCode);
        }
      }
      if (overDates.length == 0) {
        this.$message.warning("没有过期订单");
      } else {
        this.$axios({
          method: "post",
          data: { overDates },
          url: api.clearOver
        })
          .then(resp => {
            if (resp.data.code == 200) {
              this.$message.success("过期订单清理完毕");
              // _this.$notify.close()
              _this.searchItem();
            }
          })
          .catch(err => {
            log(err);
          });
      }
    },
    //复选框条件禁用
    checkboxInit(row, index) {
      if (row.isOver) {
        return true;
      } else {
        return false;
      }
    },
    // ...mapActions([setGoodObj]),
    // 改变每页显示条数
    handleSizeChange(val) {
      log(0);
      this.pageTotal = val;
      this.getOrdersData({
        orderDate: this.orderDate,
        state: this.state,
        flag: 1,
        orderCode: this.orderCode,
        pageTotal: this.pageTotal,
        currentPage: this.currentPage
      });
    },
    //改变当前页
    handleCurrentChange(val) {
      log(1);
      this.currentPage = val;
      this.getOrdersData({
        orderDate: this.orderDate,
        state: this.state,
        flag: 1,
        orderCode: this.orderCode,
        pageTotal: this.pageTotal,
        currentPage: this.currentPage
      });
    },
    setState(value) {
      (this.isProcessed = ""), (this.state = "");
      if (value.length > 1) {
        this.isProcessed = value[value.length - 1];
      } else {
        this.state = value[value.length - 1];
      }
      this.searchItem();
    },
    searchItem() {
      this.getOrdersData({
        orderDate: this.orderDate,
        orderCode: this.orderCode,
        isProcessed: this.isProcessed,
        state: this.state,
        flag: 1,
        pageTotal: this.pageTotal,
        currentPage: this.currentPage
      });
    },
    //接收订单
    toprocess(row) {
      let _this = this;
      let orderCode = row.orderCode;
      if (row.state == "已付款") {
        this.$axios({
          method: "post",
          data: { orderCode },
          url: api.processOrder
        })
          .then(resp => {
            if (resp.data.code == 200) {
              this.$message.success("订单已接收");
              setTimeout(function() {
                _this.searchItem();
              }, 1000);
            }
          })
          .catch(err => {
            log(err);
          });
      }else{
        this.$message.error("订单还未付款");
      }
    },
    //数据库请求数据
    getOrdersData(obj) {
      if (
        this.state == "未付款" ||
        (this.state == "" && this.isProcessed == "")
      ) {
        this.isShowBtn = true;
      } else {
        this.isShowBtn = false;
      }
      this.$axios({
        method: "post",
        url: api.getOrdersData,
        data: obj
      })
        .then(resp => {
          if (this.isProcessed == "待处理") {
            this.isShow = true;
          } else {
            this.isShow = false;
          }
          let orders = resp.data.orders;
          let states = resp.data.states;
          for (let i = 0; i < orders.length; i++) {
            orders[i].orderDate = new Date(
              orders[i].orderDate
            ).toLocaleDateString();
          }
          this.total = resp.data.totalPage;
          this.goodsId = resp.data.goodsId;
          this.orders = orders;
          let now = new Date().getTime();
          for (let i = 0; i < this.orders.length; i++) {
            let orderDate = new Date(this.orders[i].orderDate).getTime();
            //如果订单时间大于24小时将被标记为过期订单
            if (
              now - orderDate > 86400000 &&
              this.orders[i].state == "未付款"
            ) {
              this.orders[i].isOver = true;
            } else {
              this.orders[i].isOver = false;
            }
          }
          if (obj.flag == 0) {
            // this.states = states;
            //如果有过期订单，页面初次渲染的时候就会提示
            for (let i = 0; i < this.orders.length; i++) {
              if (this.orders[i].isOver) {
                this.$notify({
                  title: "提示",
                  message: "存在过期订单",
                  duration: 3000
                });
                break;
              }
            }
          }
        })
        .catch(err => {
          log(err);
        });
    }
  },
  // flag:1代表非初次渲染0代表初次渲染
  created: function() {
    this.isShow = false;
    this.getOrdersData({
      flag: 0,
      pageTotal: this.pageTotal,
      currentPage: this.currentPage
    });
  }
};
</script>

<style scoped lang="less">
* {
  margin: 0px;
  padding: 0px;
}
#goodsList {
  height: 100%;
  width: 100%;
  // border: 1px solid red;
  box-shadow: 0 0 5px 5px #eee;
  padding: 0 0.5%;
}
h3 {
  font-size: 14px;
  color: #0c9702;
  font-weight: normal;
  border-bottom: 1px solid #eeeeee;
  line-height: 40px;
  margin: 0 auto 1.9%;
}
.queryModel {
  display: flex;
  align-items: center;
  margin: 2%;
  .queryItem {
    width: 30%;
    display: flex;
    align-items: center;
    margin-right: 1%;
    span {
      width: 20%;
    }
  }
  .queryBtn {
    width: 15%;
    margin-left: 10%;
  }
  select {
    width: 70%;
    height: 40px;
    border: 1px solid #eeeeee;
    display: inline-block;
    margin-right: 20px;
    color: #797979;
  }
  button {
    width: 100%;
    height: 30px;
    color: #ffffff;
    border: none;
    margin-right: 20px;
    cursor: pointer;
  }
  .myquery {
    background-color: #0c9702;
  }
  // .myreset {
  //   color: #333333;
  //   background-color: #eeeeee;
  // }
}
.clearBtn {
  border: none;
  padding: 2px 5px;
  background-color: #0c9702;
  color: #fff;
  cursor: pointer;
}
</style>