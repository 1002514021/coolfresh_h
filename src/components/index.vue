<template>
  <div id="index">
    <div id="item-boxs">
      <div class="item-box">
        <span class="el-icon el-icon-edit-outline"></span>
        <span class="item-text">
          今日预约
          <span class="item-num viewNum">{{appointNum}}</span>
        </span>
      </div>
      <div class="item-box">
        <span class="el-icon el-icon-edit-outline"></span>
        <span class="item-text">
          今日下单
          <span class="item-num orderNum">{{orderNum}}</span>
        </span>
      </div>
      <div class="item-box">
        <span class="el-icon el-icon-refresh"></span>
        <span class="item-text">
          今日上新
          <span class="item-num viewNum">{{shelveNum}}</span>
        </span>
      </div>
      <div class="item-box">
        <span class="el-icon el-icon-refresh"></span>
        <span class="item-text">
          今日会员注册
          <span class="item-num viewNum">{{regNum}}</span>
        </span>
      </div>
    </div>
    <div ref="area" class="area" style="width:100%;height:400px"></div>
  </div>
</template>
<script>
import api from "../API.js";
// import chinaJson from './china.json';
import "echarts/map/js/china.js";
// var echarts = require('echarts');
let { log } = console;
export default {
  name: "index",
  data() {
    return {
      max: 0, //会员分布区域最大数
      rangeColor: ["#fff", "yellow", "red"],
      areaData: [],
      geoCoordMap: {},
      regNum: 0,
      orderNum: 0,
      shelveNum: 0,
      appointNum: 0
    };
  },
  beforeCreate() {
    var myDate = new Date();
    myDate.getYear(); // 获取当前年份(2位)
    myDate.getFullYear(); // 获取完整的年份(4位,1970-????)
    myDate.getMonth(); // 获取当前月份(0-11,0代表1月)
    myDate.getDate(); // 获取当前日(1-31)
    myDate.getDay(); // 获取当前星期X(0-6,0代表星期天)
    myDate.getTime(); // 获取当前时间(从1970.1.1开始的毫秒数)
    myDate.getHours(); // 获取当前小时数(0-23)
    myDate.getMinutes(); // 获取当前分钟数(0-59)
    myDate.getSeconds(); // 获取当前秒数(0-59)
    myDate.getMilliseconds(); // 获取当前毫秒数(0-999)
    myDate.toLocaleDateString(); // 获取当前日期
    var mytime = myDate.toLocaleTimeString(); // 获取当前时间
    myDate.toLocaleString();
    Date.prototype.Format = function(fmt) {
      // author: meizz
      var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    };
    var time1 = new Date().Format("yyyy-MM-dd");
    var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
    this.$axios({
      method: "post",
      url: api.getIndexData,
      data: { time1, time2 }
    })
      .then(resp => {
        log(resp.data);
        let geoCoordMap = {},
          areaData = [],
          address = [],
          lng = "",
          lat = "";
        let max = 0;
        for (let item of resp.data.position) {
          if (address.indexOf(item.address) < 0) {
            address.push(item.address);
            areaData.push({ name: item.address, value: 1 });
            lng = Number(item.lngLat.split(",")[0]);
            lat = Number(item.lngLat.split(",")[1]);
            geoCoordMap[item.address] = [lng, lat]; //给对象动态添加属性和值
          } else {
            for (let _item of areaData) {
              if (item.address == _item.name) {
                _item.value += 1;
                max < _item.value ? (max = _item.value) : (max = max);
              }
            }
          }
        }
        this.geoCoordMap = geoCoordMap;
        this.areaData = areaData;
        this.max = max;
        this.regNum = resp.data.regNum;
        this.orderNum = resp.data.orderNum;
        this.shelveNum = resp.data.shelveNum;
        this.appointNum = resp.data.appointNum;
      })
      .catch(err => {
        log(err);
      });
  },
  watch: {
    //监听数据变化
    areaData(val, oldVal) {
      this.setOptions(val);
    },
    geoCoordMap(val, oldVal) {
      this.setOptions(val);
    }
  },
  mounted() {
    this.areaInfo();
  },
  methods: {
    convertData(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    },
    areaInfo() {
      this.ereaEchart = this.$echarts.init(this.$refs.area);
      this.setOptions();
    },
    setOptions(series) {
      this.ereaEchart.setOption({
        backgroundColor: "#fff",
        title: {
          text: "会员分布",
          x: "center",
          textStyle: {
            color: "#333",
            fontSize: 12,
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return params.name + " : " + params.value[2];
          }
        },
        legend: {
          orient: "vertical",
          y: "bottom",
          x: "right",
          textStyle: {
            color: "#333"
          }
        },
        visualMap: {
          min: 0,
          max: this.max,
          text: [this.max, 0],
          inRange: {
            color: this.rangeColor
          },
          textStyle: {
            color: "#333"
          }
        },
        geo: {
          map: "china",
          label: {
            emphasis: {
              show: true,
              textStyle: {
                color: "#333"
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#323c48",
              borderColor: "#111"
            },
            emphasis: {
              areaColor: "#fff"
            }
          }
        },

        series: [
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            data: this.convertData(this.areaData),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            symbolSize: 10,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                borderColor: "#fff",
                borderWidth: 1,
                label: { show: true }
              }
            }
          }
        ]
      });
    }
  }
};
</script>
<style lang="less" scoped>
#index {
  width: 100%;
  height: 100%;
  color: #333;
  #item-boxs {
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: space-around;
    .item-box {
      margin-right: 4%;
      width: 20%;
      height: 60%;
      border-radius: 3%;
      display: flex;
      align-items: center;
      box-shadow: 1px 4px 3px 3px #ddd;
      .item-num {
        font-size: 20px;
        margin-left: 4%;
        color: #0c9702;
        font-weight: bold;
      }
      .el-icon {
        width: 40%;
        text-align: center;
        font-size: 40px;
        display: block;
        line-height: 230%;
      }
      .item-text {
        width: 60%;
        text-align: center;
      }
    }
  }
}
</style>

