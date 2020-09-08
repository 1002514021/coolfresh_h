<template>
  <div id="goodsList">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "goods",
  data() {
    return {};
  },
  beforeCreate: function() {
    this.$router.push({
        path:'/goodsList'
    })
  },
};
</script>

<style scoped lang="less">
  #goodsList{
    width: 100%;
    height: 100%;
  }
</style>