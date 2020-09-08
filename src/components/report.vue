<template>
  <div class="demo-container">
    <div ref="chart_wrap" class="chart_wrap" style="marginTop:2%"></div>
    <div ref="chart_years" class="chart_years" style="width:100%;height:600px;marginTop:10%"></div>
  </div>
</template>
<script>
import api from "../API.js";
let { log } = console;
export default {
  name: "report",
  computed: {},
  data() {
    return {
      sellData: [],
      seriesData: [],
      categoryArr: [],
      sellNumArr: [],
      products: [],
    };
  },
  mounted() {
    this.initCharts();
    this.drowLine();
    setTimeout(() => {
      this.seriesData.push({
        name: "销量",
        type: "bar",
        data: this.sellNumArr
      });
    }, 600);
  },
  watch: {
    seriesData(val, oldVal) {
      this.setOptions(val);
    },
    products(val, oldVal) {
      this.setOption1(val);
    }
  },
  methods: {
    initCharts() {
      this.chart = this.$echarts.init(this.$refs.chart_wrap);
      this.setOptions();
    },
    drowLine() {
      this.mychart = this.$echarts.init(this.$refs.chart_years);
      this.mychart.on("updateAxisPointer", this.changePie);
      this.setOption1();
    },
    setOptions(series) {
      this.chart.setOption({
        title: {
          text: "本月总销售情况",
          textStyle: {
            color: "#333", //默认颜色
            fontWeight: "nomal"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true, //是否显示工具箱
          right: "10%",
          //要显示的工具箱内容
          feature: {
            saveAsImage: {
              //保存为图片
              show: true
            }
          }
        },
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: this.categoryArr
        },
        yAxis: {},
        series: series
      });
    },
    setOption1() {
      this.mychart.setOption({
        title: {
          text: "今年总销售情况",
          textStyle: {
            color: "#333", //默认颜色
            fontWeight: "nomal"
          }
        },
        legend: {},
        tooltip: {
          trigger: "axis",
          showContent: false
        },
        toolbox: {
          show: true,
          right: "10%",
          //要显示的工具箱内容
          feature: {
            saveAsImage: {
              //保存为图片
              show: true
            },
          }
        },
        dataset: {
          source: this.products
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "55%" },
        series: [
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "25%"],
            label: {
              formatter: "{b}: {@12月} ({d}%)"
            },
            encode: {
              itemName: "product",
              value: "12月",
              tooltip: "12月"
            }
          }
        ]
      });
    },
    changePie(event) {
      var xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        var dimension = xAxisInfo.value + 1;
        this.mychart.setOption({
          series: {
            id: "pie",
            label: {
              formatter: "{b}: {@[" + dimension + "]} ({d}%)"
            },
            encode: {
              value: dimension,
              tooltip: dimension
            }
          }
        });
      }
    }
  },
  beforeMount() {
    this.products = [
      [
        "product",
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      [
        "鲜果",
        41.1,
        30.4,
        65.1,
        53.3,
        83.8,
        98.7,
        41.1,
        30.4,
        65.1,
        53.3,
        83.8,
        98.7
      ],
      [
        "果饮",
        86.5,
        92.1,
        85.7,
        83.1,
        73.4,
        55.1,
        86.5,
        92.1,
        85.7,
        83.1,
        73.9,
        55.1
      ],
      [
        "果干",
        24.1,
        67.2,
        79.5,
        86.4,
        65.2,
        82.5,
        86.5,
        92.1,
        85.7,
        83.4,
        73.4,
        51.1
      ],
      [
        "果酱",
        55.2,
        67.1,
        69.2,
        272.4,
        53.9,
        39.1,
        86.5,
        92.1,
        85.7,
        80.1,
        70.4,
        52.1
      ]
    ];
    this.$axios({
      method: "post",
      url: api.getRecord
    })
      .then(resp => {
        let sellNum = [];
        let category = [];
        for (let item of resp.data.sellData) {
          sellNum.push(item.sellNum);
          category.push(item.category);
        }
        this.categoryArr = category;
        this.sellNumArr = sellNum;
      })
      .catch(err => {
        log(err);
      });
    this.changePie();
  }
};
</script>
<style lang="less" scoped>
.chart_wrap {
  height: 400px;
}
</style>
