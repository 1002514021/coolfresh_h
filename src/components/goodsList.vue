<template>
  <div id="goodsList">
    <h3>商品列表</h3>
    <div class="queryModel">
      <div class="queryItem">
        <span>上架时间：</span>
        <el-date-picker
          style="width: 180px; margin-right: 20px"
          v-model="dateValue"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div class="queryItem">
        <span>产地：</span>
        <select v-model="field">
          <option value>请选择产地</option>
          <option :value="item.field" v-for="(item,index) of fields " :key="index">{{item.field}}</option>
        </select>
      </div>
      <div class="queryItem">
        <span>商品类型：</span>
        <select v-model="category">
          <option value>请选择商品类型</option>
          <option
            :value="item.category"
            v-for="(item) in categories"
            :key="item.categoryId"
          >{{item.category}}</option>
        </select>
      </div>
      <div class="queryItem queryBtn">
        <button class="myquery" @click="query">查询</button>
        <button class="myreset" @click="reset">重置</button>
      </div>
    </div>
    <el-table  :data="goods" style="width: 100%;margin-bottom: 20px">
      <el-table-column prop="goodId" label="商品编号"></el-table-column>
      <el-table-column prop="goodName"  label="商品名"></el-table-column>
      <el-table-column prop="price" label="售价(元)"></el-table-column>
      <el-table-column prop="originalPrice" label="原价（元）"></el-table-column>
      <el-table-column prop="measuringUnit" label="单位"></el-table-column>
      <el-table-column prop="field" label="产地"></el-table-column>
      <el-table-column prop="category" label="商品分类"></el-table-column>
      <el-table-column prop="startTime" label="开售时间"></el-table-column>
      <el-table-column prop="endTime" label="停售时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="modify(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="remove(scope.row)" type="text" size="small">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:space-between;padding:2% 1%">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageTotal"
      :page-sizes="[3, 4, 20,30, 40, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-button @click="addGood" style="width:8%;background-color:#0c9702;border:none;color:#fff">添加商品</el-button>
    </div>
  </div>
</template>

<script>
import api from "../API.js";
import {mapActions} from 'vuex'
import {setGoodObj} from '../store/modules/actions_type'
var { log } = console;
export default {
  name: "goodsList",
  data() {
    return {
      currentPage: 1,
      total: 0,
      fields: [],
      categories: [],
      goods: [],
      dateValue: "",
      tableData: "",
      field: "",
      category: "",
      pageTotal:5
    };
  },
  methods: {
    ...mapActions([setGoodObj]),
    // 改变每页显示条数
    handleSizeChange(val) {
      this.pageTotal=val
      this.getGoodListData(this.dateValue,this.field,this.category,0,val,this.currentPage)
    },
    //改变当前页
    handleCurrentChange(val) {
      this.currentPage=val
      this.getGoodListData(this.dateValue,this.field,this.category,0,this.pageTotal,val)
    },
    // 商品修改
    modify(row) {
      let goodId=row.goodId
      this[setGoodObj]({goodId})
      this.toGoodManagePage()
    },
    // 商品新增
    addGood(){
      let goodId=''
      this[setGoodObj]({goodId})
      this.toGoodManagePage()
    },
    //调用商品的新增或是修改页面
    toGoodManagePage(){
      this.$router.push({path:'/goodManage'})
    },
    //商品下架
    remove(row){
      let goodId=row.goodId
      this.$axios({
        method:'post',
        data:{goodId},
        url:api.shelve
      }).then(resp=>{
        if(resp.data.code==200){
          this.$message.success('商品已下架')
          this.getGoodListData(this.dateValue,this.field,this.category,0,this.pageTotal,this.currentPage)
        }
      }).catch(err=>{
        log(err)
      })
    },
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
    //条件搜索
    query() {
      this.getGoodListData(this.dateValue,this.field,this.category,0,this.pageTotal,1)
    },
    // 重置条件搜索框
    reset(){
      this.category=''
      this.dateValue=''
      this.field=''
    },
    //数据库请求数据
    getGoodListData(dateValue, field, category, flag, pageSize, current) {
      let queryItems={dateValue, field, category, flag, pageSize, current}
      this.$axios({
        method: "post",
        url: api.getGoodListData,
        data: queryItems
      }).then(resp => {
          let goodsListData = resp.data;
          this.total = goodsListData.goods.length;
          for (let i = 0; i < goodsListData.goods.length; i++) {
            goodsListData.goods[i].startTime = new Date(
              goodsListData.goods[i].startTime
            ).toLocaleDateString();
            goodsListData.goods[i].endTime = new Date(
              goodsListData.goods[i].endTime
            ).toLocaleDateString();
          }
          if(flag==1){
            this.fields = goodsListData.field;
            this.categories = goodsListData.categories;
          }
          this.goods = goodsListData.goods;
          this.total = goodsListData.total;
        })
        .catch(err => {
          log(err);
        });
    }
  },
  created: function() {
    //flag=1代表是初次渲染页面 0代表点击查询按钮请求数据
    this.getGoodListData(this.dateValue,this.field,this.category,1,this.pageTotal,1)
  },
};
</script>

<style scoped lang="less">
* {
  margin: 0px;
  padding: 0px;
}
#goodsList {
  height: 100%;
  width: 99%;
  // border: 1px solid red;
  box-shadow: 0 0 5px 5px #eee;
  padding:0 0.5%;
}
h3 {
  font-size: 14px;
  color:#0c9702;
  font-weight: normal;
  border-bottom: 1px solid #eeeeee;
  line-height: 40px;
  margin: 0 auto 1.9%;
}
.queryModel {
  display: flex;
  align-items: center;
  margin-bottom:2%;
  .queryItem {
    width: 40%;
    display: flex;
    align-items: center;
    margin-right: 1%;
    span {
      width: 30%;
    }
  }
  .queryBtn{
    width: 30%
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
  .myreset {
    color: #333333;
    background-color: #eeeeee;
  }
}
</style>