<template>
  <div id="goodManage">
    <div class="breadCrumbs">
      <span class="goodsPage" @click="toGoodsPage">商品</span>
      <span class="currentPage">修改 & 添加</span>
    </div>
    <div class="boxLine">商品基本信息</div>
    <div class="goodInfo">
      <div class="goodItem">
        <span class="good-item-title">商品名：</span>
        <el-input style="width:70%" class="good-item-value" v-model="goodName" placeholder="请输入内容"></el-input>
      </div>
      <div class="goodItem">
        <span class="good-item-title">商品描述：</span>
        <el-input
          autosize
          style="width:70%"
          type="textarea"
          class="good-item-value"
          v-model="presentation"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="goodItem">
        <span class="good-item-title">商品小类：</span>
        <el-select filterable allow-create v-model="kind" placeholder="请选择">
          <el-option
            v-for="item in kinds"
            :key="item.kindId"
            :label="item.kindName"
            :value="item.kindId"
          ></el-option>
        </el-select>
      </div>
      <div class="goodItem">
        <span class="good-item-title">商品大类：</span>
        <el-select v-model="category" placeholder="请选择">
          <el-option
            v-for="item in categories"
            :key="item.categoryId"
            :label="item.category"
            :value="item.categoryId"
          ></el-option>
        </el-select>
      </div>
      <div class="goodItem">
        <span class="good-item-title">鲜果品种：</span>
        <el-input style="width:70%" class="good-item-value" v-model="type" placeholder="请输入内容"></el-input>
      </div>
      <div class="goodItem">
        <span class="good-item-title">产地：</span>
        <el-input style="width:70%" class="good-item-value" v-model="field" placeholder="请输入内容"></el-input>
      </div>
      <div class="goodItem">
        <span class="good-item-title">商品原价：</span>
        <el-input
          style="width:70%"
          class="good-item-value"
          v-model="originalPrice"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="goodItem">
        <span class="good-item-title">商品售价：</span>
        <el-input style="width:70%" class="good-item-value" v-model="price" placeholder="请输入内容"></el-input>
      </div>
      <div class="goodItem" style="margin-right:50%">
        <span class="good-item-title">最小计量单位：</span>
        <el-input
          style="width:70%"
          class="good-item-value"
          v-model="measuringUnit"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="goodItem">
        <span class="good-item-title">销售时间段：</span>
        <el-date-picker
          style="width:70%"
          v-model="sellTime"
          type="daterange"
          format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          default-value="2010-10-01"
        ></el-date-picker>
      </div>
      <div class="goodItem">
        <span class="good-item-title">所含营养元素：</span>
        <el-input
          autosize
          style="width:70%"
          class="good-item-value"
          type="textarea"
          v-model="nutritions"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </div>
    <div class="boxLine">商品展示图片</div>
    <div style="overflow:hidden">
      <div class="singleImg mainGoodImg">
        <div style="margin-bottom:20%">商品主图片</div>
        <div>
          <div class="mainImgBox" style="border:1px solid #ddd" v-if="mainBoxState">
            <img style="width:90px;height:100px;" :src="mainSrc" alt>
            <span class="closeBtn el-icon-close" @click="delMainImg"></span>
          </div>
          <div v-if="!mainBoxState" class="addMainImg" @click="uploadMainImg()">
            <i class="el-icon-plus"></i>
            <input
              accept="image/*"
              type="file"
              style="display:none"
              name="mainImg"
              ref="mainImg"
              @change="mainImgChange($event)"
            >
          </div>
        </div>
      </div>
      <div class="singleImg graphicImg">
        <div style="margin-bottom:20%">图文详情</div>
        <div>
          <div class="graphicBox" style="border:1px solid #ddd" v-if="graphicBoxState">
            <img style="width:90px;height:100px;" :src="graphicSrc" alt>
            <span class="closeBtn el-icon-close" @click="delgraphicImg"></span>
          </div>
          <div v-if="!graphicBoxState" class="addgraphicImg" @click="uploadgraphicImg()">
            <i class="el-icon-plus"></i>
            <input
              accept="image/*"
              type="file"
              style="display:none"
              name="graphicImg"
              ref="graphicImg"
              @change="graphicImgChange($event)"
            >
          </div>
          <!-- <button class="uploadBtn">上传</button> -->
        </div>
      </div>
    </div>
    <div class="upload-img">
      <div>商品展示图片</div>
      <ul class="load-list">
        <li v-for="(item,index) in imgArr" :key="index">
          <div class="load-container">
            <img :src="item">
            <span @click="delImg(index)" class="closeBtn el-icon-close"></span>
          </div>
        </li>
        <li class="img-upload" v-if="allowAddImg">
          <div class="only-add">
            <div class="load-add" @click="upload()">
              <i class="el-icon-plus"></i>
              <!-- multiple="multiple" 允许同时选择多个文件 -->
              <input
                type="file"
                accept="image/*"
                style="display: none"
                multiple="multiple"
                name="goodImgs"
                @change="changeImg($event)"
                ref="uploadImages"
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button class="uploadBtn" @click="submitGoodInfo">确定</button>
  </div>
</template>
<script>
import api from "../API.js";
var { log } = console;
export default {
  name: "goodManage",
  data() {
    return {
      imgArr: [], // 存放临时图片的数组
      allowAddImg: true, // 上传达到限制后隐藏上传按钮
      imgData: "",
      imgSrc: "",
      filesArr: {},
      imgList: [],
      formData: new FormData(),
      mainImgFormData: new FormData(),
      graphicFormData: new FormData(),
      mainSrc: "",
      graphicSrc: "",
      mainBoxState: false,
      graphicBoxState: false,
      newGraphicImg: "",
      newMainImg: "",
      newGoodListImg: [],
      kinds: [],
      categories: [],
      goodName: "",
      presentation: "",
      type: "",
      originalPrice: "",
      price: "",
      field: "",
      sellTime: "",
      nutritions: "",
      measuringUnit: "",
      category: "",
      kind: "",
      goodInfo: {}
      // graphicType:'file'
    };
  },
  methods: {
    toGoodsPage() {
      this.$router.push({ path: "/goodsList" });
    },
    upload() {
      // 调起input选择框
      this.$refs.uploadImages.click();
    },
    changeImg(e) {
      var _this = this;
      var imgLimit = 1024;
      var files = e.target.files;
      var image = new Image();
      if (files.length > 0) {
        var dd = 0;
        var timer = setInterval(function() {
          if (
            files.item(dd).type != "image/png" &&
            files.item(dd).type != "image/jpeg" &&
            files.item(dd).type != "image/gif"
          ) {
            return false;
          }
          if (files.item(dd).size > imgLimit * 102400) {
            //to do sth
          } else {
            image.src = window.URL.createObjectURL(files.item(dd));
            image.onload = function() {
              // 默认按比例压缩
              var w = image.width,
                h = image.height,
                scale = w / h;
              w = 200;
              h = w / scale;
              // 默认图片质量为0.7，quality值越小，所绘制出的图像越模糊
              var quality = 0.7;
              //生成canvas
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              // 创建属性节点
              var anw = document.createAttribute("width");
              anw.nodeValue = w;
              var anh = document.createAttribute("height");
              anh.nodeValue = h;
              canvas.setAttributeNode(anw);
              canvas.setAttributeNode(anh);
              ctx.drawImage(image, 0, 0, w, h);
              var ext = image.src
                .substring(image.src.lastIndexOf(".") + 1)
                .toLowerCase(); //图片格式
              var base64 = canvas.toDataURL("image/" + ext, quality);
              // 回调函数返回base64的值
              if (_this.imgArr.length <= 9) {
                _this.imgArr.push("");
                _this.imgArr.splice(-1, 1, base64); //替换数组数据的方法，此处不能使用：this.imgArr[index] = url;
                if (_this.imgArr.length >= 10) {
                  _this.allowAddImg = false;
                }
              }
            };
          }
          if (dd < files.length - 1) {
            dd++;
          } else {
            clearInterval(timer);
          }
        }, 1000);
      }
      this.filesArr = this.$refs.uploadImages.files;
      for (var i = 0; i < this.filesArr.length; i++) {
        this.formData.append("goodImgs", this.filesArr[i]);
        if (!e.target.files[0].size) return;
        this.fileList(e.target.files);
      }
      this.$axios({
        method: "post",
        url: api.uploadImages,
        anync: true,
        contentType: "multipart/form-data",
        data: this.formData
      })
        .then(resp => {
          log(this.newGoodListImg);
          for (let item of resp.data.detailArr) {
            this.newGoodListImg.push(api.imagePath + item);
          }
          log(this.newGoodListImg);
        })
        .catch(err => {
          log(err);
        });
    },
    fileList(files) {
      for (let i = 0; i < files.length; i++) {
        this.fileAdd(files[i]);
      }
    },
    fileDel(index) {
      //删除已选择的图片
      this.size = this.size - this.imgList[index].file.size; //总大小
      this.imgList.splice(index, 1);
    },
    fileAdd(file) {
      this.size = this.size + file.size; //总大小
      let reader = new FileReader();
      reader.vue = this;
      reader.readAsDataURL(file);
      reader.onload = function() {
        file.src = this.result;
        this.vue.imgList.push({
          file
        });
      };
    },
    // 删除图片
    delImg(n) {
      this.imgArr.splice(n, 1);
      if (this.imgArr.length < 10) {
        this.allowAddImg = true;
      }
      this.newGoodListImg.splice(n, 1)
    },
    uploadMainImg() {
      this.$refs.mainImg.click();
    },
    uploadgraphicImg() {
      this.$refs.graphicImg.click();
    },
    //graphicImg上传预览
    uploadGraphicImg(tag) {
      var file = tag.files[0];
      let _this = this;
      var imgSrc;
      if (!/image\/\w+/.test(file.type)) {
        this.$message.warning("看清楚，这个需要图片！");
        return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        imgSrc = this.result;
        _this.graphicSrc = imgSrc;
      };
    },
    graphicImgChange(e) {
      this.graphicFormData.append("graphicImg", e.target.files[0]);
      this.uploadGraphicImg(e.target);
      this.graphicBoxState = !this.graphicBoxState;
      this.$axios({
        method: "post",
        url: api.goodGraphic,
        anync: true,
        contentType: false,
        // contentType: "multipart/form-data",
        data: this.graphicFormData
      })
        .then(res => {
          // this.graphicType='text'
          this.newGraphicImg = res.data;
        })
        .catch(err => {
          log(err);
        });
    },
    //mainImg上传预览
    uploadImg(tag) {
      var file = tag.files[0];
      let _this = this;
      var imgSrc;
      if (!/image\/\w+/.test(file.type)) {
        this.$message.warning("看清楚，这个需要图片！");
        return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        imgSrc = this.result;
        _this.mainSrc = imgSrc;
      };
    },
    mainImgChange(e) {
      this.mainImgFormData.append("mainImg", e.target.files[0]);
      this.uploadImg(e.target);
      this.mainBoxState = !this.mainBoxState;
      this.$axios({
        method: "post",
        url: api.sendGoodImg,
        anync: true,
        contentType: false,
        // contentType: "multipart/form-data",
        data: this.mainImgFormData
      })
        .then(res => {
          this.newMainImg = res.data;
        })
        .catch(err => {
          log(err);
        });
    },
    delMainImg() {
      this.mainSrc = "";
      this.mainBoxState = !this.mainBoxState;
    },
    delgraphicImg() {
      this.graphicSrc = "";
      this.graphicBoxState = !this.graphicBoxState;
    },
    submitGoodInfo() {
      let shelveTime = new Date().toLocaleDateString();
      let goodId = this.$store.getters.get_goodId;
      let goodData = {
        goodId,
        goodName: this.goodName,
        presentation: this.presentation,
        type: this.type,
        originalPrice: Number(this.originalPrice),
        price: Number(this.price),
        field: this.field,
        sellTime: this.sellTime,
        nutritions: this.nutritions,
        measuringUnit: this.measuringUnit,
        category: this.category,
        kind: this.kind,
        newGraphicImg: this.newGraphicImg,
        newMainImg: this.newMainImg,
        goodListImg: this.newGoodListImg
      };
      goodData.newGraphicImg = this.newGraphicImg.split("/")[
        this.newGraphicImg.split("/").length - 1
      ];
      goodData.newMainImg = this.newMainImg.split("/")[
        this.newMainImg.split("/").length - 1
      ];
      for (let i = 0; i < goodData.goodListImg.length; i++) {
        let goodItem = goodData.goodListImg[i];
        if (goodItem.split("/").length > 0) {
          goodData.goodListImg[i] = goodItem.split("/")[
            goodItem.split("/").length - 1
          ];
        }
      }
      log(goodData.goodListImg);
      let {
        goodName,
        presentation,
        type,
        originalPrice,
        price,
        field,
        sellTime,
        nutritions,
        measuringUnit,
        category,
        kind,
        newGraphicImg,
        newMainImg,
        goodListImg
      } = goodData;
      if (
        goodName != "" &&
        presentation != "" &&
        type != "" &&
        originalPrice != "" &&
        price != "" &&
        field != "" &&
        sellTime != "" &&
        nutritions != "" &&
        measuringUnit != "" &&
        category != "" &&
        kind != "" &&
        newGraphicImg != "" &&
        newMainImg != "" &&
        goodListImg.length > 0
      ) {
        if (goodId) {
          this.$axios({
            method: "post",
            data: goodData,
            url: api.modifyGood
          })
            .then(resp => {
              if (resp.data.code == 200) {
                // this.newGoodListImg = [];
                // this.imgArr = [];
                this.$message.success("商品修改成功");
              }
            })
            .catch(err => {
              log(err);
            });
        } else {
          let goodId = new Date();
          goodId = new Date(goodId).getTime();
          this.$axios({
            method: "post",
            data: {
              goodId,
              goodName,
              presentation,
              type,
              originalPrice,
              price,
              field,
              sellTime,
              nutritions,
              measuringUnit,
              category,
              kind,
              newGraphicImg,
              newMainImg,
              goodListImg,
              shelveTime
            },
            url: api.addGood
          })
            .then(resp => {
              if (resp.data.code == 200) {
                this.$message.success("商品添加成功");
              }
            })
            .catch(err => {
              log(err);
            });
        }
      } else {
        this.$message.success("输入不能为空！");
      }
    }
  },
  beforeCreate() {
    this.newGoodListImg = [];
    this.imgArr = [];
    let goodId = this.$store.getters.get_goodId;
    this.$axios({
      method: "post",
      url: api.getGoodImgs,
      data: { goodId }
    })
      .then(resp => {
        this.kinds = resp.data.kinds;
        this.categories = resp.data.categories;
        if (goodId) {
          for (let item of resp.data.showImgs) {
            this.newGoodListImg.push(`${api.imagePath}${item.goodImage}`);
            this.imgArr.push(`${api.imagePath}${item.goodImage}`);
          }
          let goodInfo = resp.data.goodInfo[0];
          this.goodInfo = goodInfo;
          this.mainSrc = api.imagePath + goodInfo.image;
          this.mainBoxState = !this.mainBoxState;
          this.newGraphicImg = api.imagePath + goodInfo.googGraphic;
          this.newMainImg = api.imagePath + goodInfo.image;
          this.graphicSrc = api.imagePath + goodInfo.googGraphic;
          this.graphicBoxState = !this.graphicBoxState;
          this.goodName = goodInfo.goodName;
          this.presentation = goodInfo.presentation;
          this.type = goodInfo.type;
          this.originalPrice = goodInfo.originalPrice;
          this.price = goodInfo.price;
          this.field = goodInfo.field;
          this.nutritions = goodInfo.nutritions;
          this.measuringUnit = goodInfo.measuringUnit;
          this.category = goodInfo.categoryId;
          this.kind = goodInfo.kindId;
          this.sellTime = [goodInfo.startTime, goodInfo.endTime];
        }
        log(this.newGoodListImg);
        log(this.imgArr);
      })
      .catch(err => {
        log(err);
      });
  }
};
</script>
<style lang="less" scoped>
#goodManage {
  // height: 100%;
  margin-bottom: 2%;
  width: 96%;
  box-shadow: 0 0 5px 5px #eee;
  padding: 0 2%;
  .breadCrumbs {
    padding: 2% 0;
    .goodsPage {
      color: #0c9702;
      cursor: pointer;
      font-weight: bold;
      margin-right: 2%;
    }
  }
  .boxLine {
    font-weight: bold;
    color: #0c9702;
    border-bottom: 1px solid #ddd;
    line-height: 300%;
    margin-bottom: 2.5%;
  }
  .uploadBtn {
    background-color: #0c9702;
    color: #fff;
    border: none;
    padding: 1% 3%;
    margin: 5% 0;
    cursor: pointer;
  }
  .closeBtn {
    position: absolute;
    top: 0.2%;
    right: 0.2%;
    width: 15px;
    height: 15px;
    text-align: center;
    line-height: 15px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    cursor: pointer;
    display: none;
  }
  .upload-img {
    .load-list {
      list-style: none;
      line-height: 100px;
      overflow: hidden;
      li {
        float: left;
        width: 90px;
        height: 100px;
        margin: 2% 1.5% 2% 0;
        overflow: hidden;
        border: 1px solid #ddd;
        .load-container {
          position: relative;
          height: 100%;
        }
        .load-container:hover .closeBtn {
          display: block;
        }
        img {
          width: 90px;
          height: 100px;
        }
      }
      .img-upload {
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .mainGoodImg {
    margin: 2% 2% 2% 0;
    .addMainImg {
      width: 90px;
      height: 100px;
      border: 1px solid #ddd;
      text-align: center;
      line-height: 100px;
      cursor: pointer;
      margin: 2% 0;
    }
    .mainImgBox {
      margin: 2% 0;
      width: 90px;
      height: 100px;
      border: 1px solid #ddd;
      position: relative;
    }
    .mainImgBox:hover .closeBtn {
      display: block;
    }
  }
  .graphicImg {
    margin: 2% 0;
    .addgraphicImg {
      width: 90px;
      height: 100px;
      border: 1px solid #ddd;
      text-align: center;
      line-height: 100px;
      cursor: pointer;
      margin: 2% 0;
    }
    .graphicBox {
      margin: 2% 0;
      width: 90px;
      height: 100px;
      border: 1px solid #ddd;
      position: relative;
    }
    .graphicBox:hover .closeBtn {
      display: block;
    }
  }
  .singleImg {
    float: left;
  }
  .goodInfo {
    display: flex;
    flex-wrap: wrap;
    .goodItem {
      display: flex;
      width: 50%;
      margin-bottom: 2%;
      align-items: center;
      span {
        width: 20%;
      }
    }
  }
}
</style>


