<template>
  <div class="share-container">
    <img class="imagess" v-if="imgType == 'wlpoker' || imgType == 'wlmahjong'" src="/static/images/shareAndRed_bg.jpg">
    <img class="imagess" v-else src="/static/images/shareAndRed_bg2.jpg">
    <div class="boxx">
      <img class="redImg" :src="result.redimage">
      <div class="bottom-box" v-if="imgType == 'wlpoker' || imgType == 'wlmahjong'">
        <img class="link-btn" @click="GotoRedPage" src="/static/images/xget_cover.png" />
        <div class="share-btn">
          <button class="btn" open-type="share"></button>
          <img  src="/static/images/xshare_friend.png" />
        </div>
      </div>
    </div>
    <div class="bottom-box-active" v-if="imgType != 'wlpoker' && imgType != 'wlmahjong'">
        <img class="link-btn" @click="GotoRedPage" src="/static/images/xget_cover.png" />
        <div class="share-btn">
          <button class="btn" open-type="share"></button>
          <img  src="/static/images/xshare_friend.png" />
        </div>
      </div>
    <div class="wechat-search" v-if="imgType == 'wlpoker' || imgType == 'wlmahjong'">
       <img class="text-imgs" src="/static/images/wechat_search.png" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      result: {},
      imgType:''
    };
  },
  created() {},
  onLoad(op) {
    console.log(op);
    let { product_type } = op;
    this.imgType = product_type;
    this.getSomeMsg(product_type);
  },
  onShareAppMessage(e) {
    //触发分享
    let { appid, path: GamePath, title, image,redimage } = this.result;
    console.log(`pages/elinktogame/main?GamePath=${GamePath}&appid=${appid}`);
    return {
      title, //分享内容(为空则为当前页面文本)
      path: `pages/elinktogame/main?GamePath=${GamePath.slice(1)}&appid=${appid}&img=${redimage}`, //分享地址 路径，传递参数到指定页面。(为空则为当前页面路径)
      imageUrl: image, //分享的封面图(为空则为当前页面)
    };
  },
  methods: {
    getSomeMsg(params) {
      //请求接口
      this.$http
        .get({
          url: `/getgameshare/${params}`,
        })
        .then((res) => {
          this.result = res.data;
          console.log(this.result);
        })
        .catch((err) => {
        });
    },
    GotoRedPage() {
      //去往红包页面
      let { redurl } = this.result;
      wx.showRedPackage({
        url: redurl,
        fail() {
          wx.showToast({
            title: "加载失败,请稍后重试",
            icon: "none",
          });
        },
      });
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
  .boxx{
    width: 750rpx;
    height: 80vh;
    padding: 40rpx 0;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .redImg{
      margin-top: 40rpx;
      width: 596rpx;
      height: 800rpx;
    }
    .bottom-box {
      width: 750rpx;
      height: 150rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .link-btn,
      .share-btn {
        width: 295rpx;
        height: 99rpx;
        text-align: center;
        line-height: 100rpx;
        color: #fff;
        font-size: 40rpx;
        border-radius: 10rpx;
        margin-left: 50rpx;
      }
      .share-btn {
        margin-left: 40rpx;
        margin-right: 50rpx;
        position: relative;
        .btn {
          width: 100%;
          height: 100%;
          font-size: 40rpx;
          line-height: 100rpx;
          border-radius: 10rpx;
          position: absolute;
          background: none !important;
        }
      }
    }
  }
  .bottom-box-active{
    width: 750rpx;
      height: 150rpx;
         display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      left: 0;
      bottom: 40rpx;
       .link-btn,
      .share-btn {
        width: 295rpx;
        height: 99rpx;
        text-align: center;
        line-height: 100rpx;
        color: #fff;
        font-size: 40rpx;
        border-radius: 10rpx;
        margin-left: 50rpx;
      }
      .share-btn {
        margin-left: 40rpx;
        margin-right: 50rpx;
        position: relative;
        .btn {
          width: 100%;
          height: 100%;
          font-size: 40rpx;
          line-height: 100rpx;
          border-radius: 10rpx;
          position: absolute;
          background: none !important;
        }
      }

  }
  .wechat-search{
    width: 750rpx;
    height: 131rpx;
    position: absolute;
    z-index: 9;
    bottom: 60rpx;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .text-imgs{
      width: 439rpx;
      height: 131rpx;
    }
  }
}
</style>