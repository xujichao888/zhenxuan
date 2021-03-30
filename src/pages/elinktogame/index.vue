<template>
  <div class="share-container">
    <img class="imagess" src="/static/images/shareAndRed_bg2.jpg">
    <img class="redImg" :src="result.img">
    <div class="bottom-box">
      <img class="link-btn" @click="goToGame" src="/static/images/xgoto_get.png" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      result: {}
    };
  },
  onLoad(op) {
      this.result = op ;
      console.log(op)
  },
  methods: {
    goToGame() {
      let {GamePath,appid} = this.result 

     wx.navigateToMiniProgram({
        appId: appid,
        path: `?${GamePath}`,
        envVersion:'trial'
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.share-container {
  width: 750rpx;
  height: 100vh;
  position: relative;
  .imagess{
    width: 750rpx;
  }
  .redImg{
    width: 596rpx;
    height: 800rpx;
    position: absolute;
    top: 10vh;
    left: 50%;
    transform: translateX(-50%);
  }
  .bottom-box {
    width: 750rpx;
    height: 150rpx;
    position: absolute;
    bottom: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .link-btn {
      width: 295rpx;
      height: 99rpx;
      text-align: center;
      line-height: 100rpx;
      color: #fff;
      font-size: 40rpx;
      border-radius: 10rpx;
    }
  }
}
</style>