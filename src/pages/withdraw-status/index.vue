<template>
  <div class="jx-pay-status">
    <div class="jx-img">
      <img src="/static/images/success.png" alt="" v-if="isSuccess">
      <img src="/static/images/fail.png" alt="" v-else>
    </div>
    <p>{{isSuccess ? '支付成功' : '支付失败'}}</p>
    <button class="mini-btn" type="primary" size="mini" @click="homeBack" v-if="!isMiniGame">
      {{isMiniGame ? '返回' : '回到首页'}}
    </button>
    <navigator target="miniProgram" open-type="exit" v-if="isMiniGame" hover-class="none">
      <button class="close-btn" type="primary" size="mini">
        返回
      </button>
    </navigator>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSuccess: false,
      isMiniGame: false,
    }
  },
  methods: {
    homeBack () {
      if (this.isMiniGame) {
        wx.navigateBack({
          delta: 1,
        })
        return
      }
      wx.reLaunch({
        url: '/pages/index/main',
      })
    },
  },
  created () {
  },
  mounted () {
  },
  onShow () {
    this.isSuccess = !!(this.$root.$mp.query.status * 1)
    this.isMiniGame = this.$root.$mp.query.game && this.$root.$mp.query.game * 1 == 1
    console.log(this.$root.$mp.query, 'this.$root.$mp.query')
    wx.setNavigationBarTitle({
      title: this.isSuccess ? '支付成功' : '支付失败',
    })
  },
}
</script>

<style lang="scss" scope>
.jx-pay-status {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .jx-img {
    width: 204rpx;
    height: 204rpx;
    margin-top: 223rpx;
  }
  p {
    font-size: 40rpx;
    color: #333333;
    margin: 40rpx 0 145rpx;
  }
  .mini-btn {
    width: 416rpx;
    height: 87rpx;
    border-radius: 43.5rpx;
    line-height: 87rpx;
    background-color: #ff4365;
  }
  .close-btn {
    width: 416rpx;
    height: 87rpx;
    border-radius: 43.5rpx;
    line-height: 87rpx;
    background-color: #ff976a;
    margin-top: 10px;
  }
}
</style>
