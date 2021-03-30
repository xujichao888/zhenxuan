<template>
  <div class="jx-special-sales jx-body" v-if="isIn">
    <JXheader title="品牌特卖"></JXheader>
    <div class="jx-brand-name">
      <div class="jx-brand-name-bg">
        <img src="/static/images/brand-head-bg.png" alt="">
      </div>
      <div class="jx-brand-wrap">
        <div class="jx-card jx-on-sale jx-brand-name-content">
          <div class="jx-on-sale-title">
            <div class="jx-on-sale-info">
              <div class="jx-on-sale-info-img">
                <van-image fit="fill" width="100%" height="100%" radius="50%" :src="brandInfo.brand_logo" use-loading-slot>
                  <img slot="loading" :src="defaultImg2">
                </van-image>
              </div>
              <div class="jx-on-sale-info-text">
                <p class="jx-brand-title jx-text-displays-ellipses1">{{brandInfo.brand_name}}</p>
                <p class="jx-look-count" v-if="brandInfo.view * 1 > 0">{{brandInfo.view}}人浏览过</p>
              </div>
            </div>
            <div class="jx-brand-name-btn">
              <button class="mini-btn jx-brown-mini-btn" type="primary" size="mini" @click="sourcesThatBtn">
                货源说明
              </button>
              <button class="mini-btn" type="primary" size="mini" v-if="isNotSalesEnd" @click="shareDialogShow = true">
                分享会场
              </button>
            </div>
          </div>
          <div class="jx-brand-explan">
            {{brandInfo.sale_content}}
          </div>
          <div class="jx-on-sale-time jxDowmTime_special_sales" v-if="isNotSalesEnd">
            <span>距离结束</span>
            <van-count-down use-slot :time="brandInfo.countDownText" @finish="isNotSalesEnd = false" @change="onChangeTime">
              <div class="timeGroup">
                <span class="days">{{ timeData.days }}天</span>
                <span class="hour itme">{{ timeData.hours }}</span>
                <span>:</span>
                <span class="minute itme">{{ timeData.minutes }}</span>
                <span>:</span>
                <span class="second itme">{{ timeData.seconds }}</span>
              </div>
            </van-count-down>
          </div>
          <div class="jx-on-sale-time" v-else>
            <span>已结束</span>
          </div>
        </div>
        <div class="jx-search-list" v-if="commoditiesList.length !== 0">
          <div v-for="(item, index) in commoditiesList" :key="index" class="jx-search-list-item jx-card" @click="goProducts(item.id)">
            <div class="jx-search-list-item-img">
              <van-image fit="fill" width="100%" height="100%" :src="item.pic_url" use-loading-slot lazy-load>
                <img slot="loading" :src="defaultImg2">
              </van-image>
            </div>
            <div class="jx-search-list-item-text">
              {{item.product_name}}
            </div>
            <div class="jx-search-list-item-sales">
              销量{{item.sale_num}}
            </div>
            <div class="jx-search-list-item-rate">
              <span v-if="item.price">￥{{(item.price + item.premium_price) / 100}}</span>
              <span v-else>￥0.00</span>
              <span class="jx-search-list-item-oldrate" v-if="item.pre_price">￥{{(item.pre_price + item.premium_price) / 100}}</span>
            </div>
          </div>
        </div>
        <div class="jx-order-null" v-else>
          <div class="jx-img-null">
            <img src="/static/images/order-null.png" alt="">
          </div>
          <p>暂时还没有商品哦~</p>
        </div>
        <div class="jx-foot-bottom-text" v-if="bottomText">
          已经到底了~
        </div>
      </div>
    </div>
    <mp-loading :duration="900" type="dot-gray" :show="loadingShow" :animated="loadingAnimated"></mp-loading>
    <div class="jx-bottom-right">
      <div class="jx-img-box" @click="switchTab('/pages/index/main')">
        <img src="/static/tabs/home.png" alt="" mode="widthFix">
      </div>
      <div class="jx-img-box jx-img-shop-cart" @click="switchTab('/pages/shopping-cart/main')">
        <img src="/static/tabs/shop-cart.png" alt="" mode="widthFix">
      </div>
    </div>
    <mp-dialog title=" " :show="statementDialogShow" bindbuttontap="tapDialogButton" :buttons="statementDialogButtons" :mask-closable="false" class="jx-statement">
      <div class="jx-statement-content">
        <div class="jx-statement-img">
          <img src="/static/images/statement.jpg" alt="">
        </div>
        <button class="mini-btn jx-save-mini-btn" type="primary" @click="isWritePhotosAlbum">
          保存到手机
        </button>
        <button class="mini-btn jx-close-btn" type="primary" @click="sourcesThatBtn">
          知道了
        </button>
      </div>
    </mp-dialog>
    <mp-dialog title=" " :show="successDialogShow" bindbuttontap="tapDialogButton" :buttons="statementDialogButtons" :mask-closable="false" class="jx-success">
      <div class="jx-content">
        图片已经保存，可到相册中查看
      </div>
    </mp-dialog>
    <vueShareModel :show.sync="shareDialogShow" :type="2" :path="`pages/special/special-sales/main?brandId=${brandId}`" :brandInfo="brandInfo"></vueShareModel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import JXheader from '../../../components/header'
import vueShareModel from '../../../components/share-model'
import { countDown } from '../../../utils/index'
export default {
  data () {
    return {
      isIn: false,
      statementDialogShow: false,
      successDialogShow: false,
      shareDialogShow: false,
      statementDialogButtons: [],
      searchValue: '',
      commoditiesList: [],
      brandInfo: {
        countDownText: '',
        saleEndTime: '',
        countDown: {
          day: 0,
          hourText: '00',
          minuteText: '00',
          secondText: '00',
        },
      },
      page: 1,
      bottomText: false,
      loadingShow: false,
      loadingAnimated: true,
      brandId: 0,
      saleEndTime: '',
      createInterval: '',
      isNotSalesEnd: false,
      timeData: {},
    }
  },
  components: {
    JXheader,
    vueShareModel,
  },
  onHide () {
    this.shareDialogShow = false
  },
  computed: {
    ...mapGetters([
      'defaultImg2',
    ]),
  },
  methods: {
    onChangeTime (e) {
      this.timeData = e.mp.detail
    },
    closeInput () {
      // console.log(this.searchValue)
      this.searchValue = '';
      wx.hideKeyboard();
    },
    switchTab (url) {
      wx.reLaunch({
        url,
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          if (page.route === url.replace(/\//, '')) {
            page.onLoad();
          }
        },
      })
    },
    endTimeCountDown () {
      if (!this.saleEndTime) {
        this.isNotSalesEnd = false
        return
      }

      let end_time = this.saleEndTime.replace(/-/g, '/')
      let now_time = this.now_time.replace(/-/g, '/')

      end_time = +new Date(end_time)
      now_time = +new Date(now_time)
      let down_time = end_time - now_time
      if (down_time <= 1000) {
        this.brandInfo.countDownText = 0
        this.isNotSalesEnd = false
        return
      }
      this.isNotSalesEnd = true
      this.brandInfo.countDownText = down_time
    },
    sourcesThatBtn () {
      this.statementDialogShow = !this.statementDialogShow
    },
    isWritePhotosAlbum () {
      let _this = this
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.writePhotosAlbum']) {
            _this.saveStatementImage();
          } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                _this.saveStatementImage();
              },
              fail () {
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none',
                })
              },
            })
          } else {
            wx.openSetting({
              success (res) {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  _this.saveStatementImage();
                } else {
                  wx.showToast({
                    title: '您没有授权，无法保存到相册',
                    icon: 'none',
                  })
                }
              },
            })
          }
        },
      })
    },
    saveStatementImage () {
      const _this = this
      wx.saveImageToPhotosAlbum({
        filePath: '/static/images/statement.jpg',
        success (res) {
          if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
            _this.statementDialogShow = false
            _this.successDialogShow = true
            setTimeout(() => {
              _this.successDialogShow = false
            }, 1000)
          }
        },
        fail (error) {
          console.log(error)
        },
      })
    },
    goProducts (productsId) {
      wx.navigateTo({ url: `/pages/products/main?productsId=${productsId}&saleEndTime=${this.saleEndTime}` });
    },
    getBrandInfo () {
      this.$http.get({
        url: `/brand/detail?brand_id=${this.brandId}`,
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.brandInfo = data
          this.brandInfo.saleEndTime = data.sale_end_time
          this.saleEndTime = data.sale_end_time
          this.now_time = data.server_time
          this.endTimeCountDown()
        } else {
          console.log(res);
        }
      });
    },
    getBrandProduct () {
      this.$Timer = setTimeout(() => {
        wx.showLoading({
          title: '加载中...',
          mask: true,
        });
      }, 2000)
      this.$http.get({
        url: '/brand/product',
        data: {
          brand_id: this.brandId,
          curr_page: this.page,
          page_size: 10,
        },
      }).then(res => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
        this.isIn = true
        if (res.code * 1 === 0) {
          const data = res.data
          if (this.page === 1) {
            if (this.commoditiesList.length < 10) this.bottomText = true
            else this.bottomText = false
            this.commoditiesList = data
          } else {
            if (!data || data.length < 10) {
              setTimeout(() => {
                this.bottomText = true
              }, 1000);
              return
            }
            this.bottomText = false
            data.map(item => {
              this.commoditiesList.push(item)
            })
          }
        } else {
          console.log(res);
        }
      }).catch(() => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
      })
    },
  },
  created () {
  },
  mounted () {
  },
  onLoad (option) {
    if (option.brandId) {
      this.brandId = option.brandId
      if (option.hasOwnProperty('leader')) {
        this.$store.commit('setLeader', option.leader * 1)
        this.$store.commit('setShareUserId', option.userid * 1)
      }
    }
    if (option.scene) {
      let qrId = decodeURIComponent(option.scene)

      let arr = qrId.split('#');
      for (var i = 0; i < arr.length; i++) {
        let newArr = arr[i].split('=');

        for (var j = 0; j < newArr.length; j++) {
          if (newArr[0] == 'leader') {
            this.$store.commit('setLeader', newArr[1] * 1)
          }
          if (newArr[0] == 'userid') {
            this.$store.commit('setShareUserId', newArr[1] * 1)
          }
          if (newArr[0] == 'brandId') {
            this.brandId = newArr[1] * 1
          }
        }
      }
    }
    let isLeader = wx.getStorageSync('userType')
    if (isLeader != '' && isLeader == 2) {
      wx.redirectTo({ url: `/pages/special/special-sales-leader/main?brandId=${this.brandId}` });
    } else {
      this.getBrandInfo()
      this.getBrandProduct()
    }
  },
  onShow () {
    let isLeader = wx.getStorageSync('userType')
    if (isLeader != '' && isLeader == 2) {
      wx.redirectTo({ url: `/pages/special/special-sales-leader/main?brandId=${this.brandId}` });
    }
  },
  onReachBottom () {
    if (this.bottomText || this.classifyListContent.length < 10) {
      this.loadingShow = false
      this.bottomText = true
      return
    }
    this.page += 1
    this.loadingShow = true
    this.getBrandProduct(1, this.brandId)
  },
  onUnload () {
    this.shareDialogShow = false
  },
  onShareAppMessage (res) {
    let leader = this.$store.state.leader * 1
    let userid = wx.getStorageSync('userid')
    let isLeader = wx.getStorageSync('userType')
    if (userid == '' || !userid) userid = 0
    if (isLeader != '' && isLeader == 2) {
      leader = userid
    }
    const shareObj = {
      title: this.$store.state.title,
      path: '/pages/special/special-sales/main?leader=' + leader + '&userid=' + userid + '&brandId=' + this.brandId,
      imgUrl: '',
      success: function (res) {
        // 转发成功之后的回调
        console.log(res);
        // if (res.errMsg == 'shareAppMessage:ok') {
        //   _this.dialogShow = false
        //   console.log(_this.dialogShow);
        // }
        wx.showToast({
          title: '分享成功',
          icon: 'none',
        });
      },
      fail: function () {
        // 转发失败之后的回调
        // if (res.errMsg == 'shareAppMessage:fail cancel') {
        // // 用户取消转发
        // } else if(res.errMsg == 'shareAppMessage:fail') {
        // // 转发失败，其中 detail message 为详细失败信息
        // }
        wx.showToast({
          title: '分享失败',
          icon: 'none',
        });
      },
    };
    return shareObj
  },
}
</script>

<style lang="scss" scope>
.jx-body {
  padding-bottom: 0;
}
.jx-brand-name {
  padding-top: 183rpx;
  position: relative;
}
.jx-brand-name-bg {
  width: 100%;
  height: 146rpx;
}
.jx-brand-wrap {
  position: absolute;
  top: 185rpx;
  left: 0;
  right: 0;
  margin: auto;
}
.jx-brand-name-content {
  width: 694rpx;
  // height: 347rpx;
  box-sizing: border-box;
  padding: 20rpx 20rpx 0;
  margin: 0 auto 15rpx;
  .jx-on-sale-info-img {
    height: 90rpx;
    width: 90rpx;
  }
  .jx-on-sale-info-text {
    max-width: 350rpx;
    margin-left: 18rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .jx-brand-title {
      font-size: 34rpx;
      color: #333333;
      font-weight: bold;
      width: 170rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
    .jx-look-count {
      font-size: 24rpx;
      color: #666666;
      margin-top: 10rpx;
    }
  }
  .mini-btn {
    height: 56rpx;
    line-height: 56rpx;
    border-radius: 28rpx;
  }
  .jx-brown-mini-btn {
    margin-right: 10rpx;
    background: linear-gradient(to right, #d1b49b, #c19a79);
  }
  .jx-brand-name-btn {
    display: flex;
    align-items: center;
  }
  .jx-on-sale-title {
    margin-bottom: 23rpx;
  }
  .jx-brand-explan {
    font-size: 26rpx;
    color: #666666;
    box-sizing: border-box;
    margin-bottom: 10rpx;
    padding-bottom: 10px;
    word-wrap: break-word;
  }
  .jx-on-sale-time {
    border-top: 1rpx solid #c6c6c6;
    text-align: right;
    font-size: 26rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #333333;
  }
  .jx-time-circle {
    height: 37rpx;
    width: 37rpx;
    display: inline-block;
    background-color: #333333;
    color: #fff;
    text-align: center;
    line-height: 37rpx;
    border-radius: 50%;
  }
}
.jx-search-list {
  padding-top: 0rpx;
  .jx-search-list-item-text {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 32px;
    line-height: 1.2;
    box-sizing: border-box;
    word-break: break-all;
  }
}
.jx-bottom-right {
  position: fixed;
  bottom: 140rpx;
  right: 25rpx;
  .jx-img-box {
    padding: 14rpx;
    background-color: #fff;
    border-radius: 50%;
    border: 3rpx solid #ff627f;
    width: 54rpx;
    height: 54rpx;
  }
  .jx-img-shop-cart {
    margin-top: 17rpx;
  }
}
.jx-foot-bottom-text {
  height: 115rpx;
  line-height: 115rpx;
  text-align: center;
  font-size: 24rpx;
  color: #999999;
}
</style>

<style lang="scss">
.jx-statement {
  .jx-statement-content {
    width: 555rpx;
    height: 835rpx;
    border-radius: 40rpx;
    background-color: #fff;
    box-sizing: border-box;
    padding: 66rpx 71rpx 0;
    .jx-statement-img {
      padding: 15rpx;
      width: 374rpx;
      height: 516rpx;
      box-shadow: 0 0 10rpx 0 #333;
      box-sizing: border-box;
      margin: 0 auto;
      margin-bottom: 40rpx;
    }
    .mini-btn {
      width: 415rpx;
      height: 88rpx;
      background: #ff4466;
      text-align: center;
      border-radius: 44rpx;
      display: flex;
      justify-content: center;
      font-weight: bold;
    }
    .jx-close-btn {
      margin-top: 10rpx;
      background: #fff;
      font-size: 30rpx;
      color: #666666;
    }
  }
}
.jx-success {
  .jx-content {
    width: 480rpx;
    height: 123rpx;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 28rpx;
    text-align: center;
    border-radius: 61.5rpx;
    box-sizing: border-box;
    padding: 0 85rpx;
    display: flex;
    align-items: center;
  }
}
.jx-order-null {
  color: #858585;
  font-size: 30rpx;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  padding-top: 210rpx;
  .jx-img-null {
    width: 268rpx;
    height: 284rpx;
    margin-top: 45rpx;
  }
  p {
    margin-top: 55rpx;
  }
}
</style>