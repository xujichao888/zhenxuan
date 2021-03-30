<template>
  <div>
    <header class="jx-home-header">
      <img src="/static/images/home-header-bg.png" alt="">
      <div class="jx-classification">
        <div :style="{height: navBarHeight + 'px'}"></div>
        <div class="jx-class-centont" :style="{height: titleBarHeight + 'px'}">
          <navigator url="/pages/brand-classifi/main">
            <div class="jx-class-icon">
              <img src="/static/icons/classfiy-icon.png" alt="">
              分类
            </div>
          </navigator>
          <navigator class="jx-class-search" url="/pages/search/main">
            <img src="/static/icons/magnifying-icon.png" alt="">
            <input type="text" placeholder="商品名称/品牌" disabled>
          </navigator>
        </div>
        <div class="jx-classify-list">
          <scroll-view class="jx-scroll-classify" scroll-x="true" bindscroll="scroll" :show-scrollbar="false" style="height: 70rpx;" :scroll-into-view="scroll_id">
            <div class="jx-scroll-classify-item" :id="'scroll_id' + item.id" v-for="(item, index) in classifyList" :key="item.id" @click="cutClassify(item.id, index)">
              {{item.name}}
              <div class="jx-classify-item-active" v-if="item.id === classifySelectIndex"></div>
            </div>
          </scroll-view>
          <van-transition :show="classifyShow" custom-class="classifyblock">
            <div class="classify-wrap">
              <div class="title">全部分类</div>
              <scroll-view scroll-y="true" class="classify-scoll">
                <div class="classify-group">
                  <div class="classify_item" v-for="(item, index) in classifyList" :key="item.id" @click="cutClassify(item.id, index, true)">
                    {{item.name}}
                    <div class="jx-classify-item-active" v-if="item.id === classifySelectIndex"></div>
                  </div>
                </div>
              </scroll-view>
            </div>
          </van-transition>
          <div class="jx-right-classify" @click="showClassify">
            <img src="/static/icons/bottom-arrow.png" alt="" :class="{'active': classifyShow}">
          </div>
        </div>
      </div>
    </header>
    <scroll-view class="scroll-view-page" refresher-enabled :showScrollbar="false" scroll-y :refresher-triggered="triggered" @refresherrefresh="uptatePage" @refresherrestore="onRestore">
      <div class="jx-home-body jx-body" :style="{paddingBottom: is_IphoneX ? '160rpx' : '135rpx'}">
        <div class="jx-card jx-share-tuan">
          <div class="jx-tuan-info">
            <div class="jx-portrait">
              <!-- <img :src="leaderInfo.user_img_url" alt=""> -->
              <van-image fit="fill" width="100%" height="100%" radius="50%" :src="leaderInfo.user_img_url" use-loading-slot>
                <img slot="loading" :src="defaultImg2">
              </van-image>
            </div>
            <div class="jx-info-share">
              <p class="jx-info-share-title">{{leaderInfo.user_nickname}}</p>
              <p class="jx-info-share-count" v-if="leaderInfo.view != undefined">{{leaderInfo.view}}人浏览过</p>
            </div>
          </div>
          <button class="mini-btn" type="primary" size="mini" @click="shareEvent">
            分享
            <img src="/static/icons/share-icon.png" alt="">
          </button>
        </div>
        <div class="jx-card jx-margin-top-20 jx-bannar-home" v-if="classifySelectIndex === 0">
          <swiper autoplay :current="currentIndex" @change="swiperChange">
            <swiper-item v-for="item in bannerList" :key="item.id">
              <div class="swiper-item" @click="bannerLogoClick(item)">
                <van-image fit="fill" width="100%" height="100%" :src="item.banner_logo" use-loading-slot>
                  <img slot="loading" :src="defaultImg1">
                </van-image>
              </div>
            </swiper-item>
          </swiper>
          <div class="jx-indicator-dots">
            <div :class="['jx-indicator-dots-item', currentIndex * 1 === index ? 'jx-indicator-dots-item-active': '']" v-for="(item, index) in bannerList" :key="item.id"></div>
          </div>
        </div>
        <div :class="['jx-card jx-margin-top-20 jx-today-new', {'jx-today-new3': newProduct.length < 3}]" v-if="classifySelectIndex === 0" @click="lookNew">
          <div class="jx-today-new-title">
            <p>
              今日上新
            </p>
            <button class="mini-btn" type="primary" size="mini">
              查看新品
              <img src="/static/icons/right-solid-arrows.png" alt="">
            </button>
          </div>
          <div class="jx-new-img-list">
            <div v-for="(item, index) in newProduct" :key="index">
              <div class="jx-new-img" v-if="index < 3">
                <van-image fit="fill" width="100%" height="100%" :src="item.pic_url" use-loading-slot lazy-load>
                  <img slot="loading" :src="defaultImg2">
                </van-image>
                <img src="/static/images/sold-out.png" alt="" class="jx-shop-lose-img" v-if="item.isLose">
              </div>
            </div>
          </div>
        </div>
        <div class="jx-brand-navbar" v-if="classifySelectIndex === 0">
          <scroll-view class="jx-brand-scroll" scroll-x="true" bindscroll="scroll" :scroll-left="brandScrollLeft">
            <span v-for="(item, index) in brandListClassify" :key="item.id">
              <span :class="['jx-recommend', {'jx-brand-active': item.id === brandClassifySelectIndex}]" @click="cutBrandClassify(item.id)">
                {{item.name}}
              </span>
              <span v-if="(index + 1) < brandListClassify.length">/</span>
            </span>
          </scroll-view>
        </div>
        <div v-if="classifyListContent.length !== 0">
          <div class="jx-card jx-on-sale" v-for="(item, index_) in classifyListContent" :key="index_" @click="bannerClick(item)">
            <div class="jx-on-sale-title">
              <div class="jx-on-sale-info">
                <div class="jx-on-sale-info-img">
                  <img :src="item.brand_img" alt="">
                </div>
                <div class="jx-on-sale-info-text" style="max-width:350rpx;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  {{item.brand_name}}
                </div>
              </div>
              <button class="mini-btn" type="primary" size="mini">
                进入特卖会
              </button>
            </div>
            <div :class="['jx-on-sale-img', {'jx-on-sale-img-start': item.super_shops.length < 3}]">
              <div v-for="(k, index) in item.super_shops" :key="k.id">
                <div class="jx-on-sale-img-item" v-if="index < 3">
                  <van-image fit="fill" width="100%" height="100%" :src="k.pic_url" use-loading-slot lazy-load>
                    <img slot="loading" :src="defaultImg2">
                  </van-image>
                  <div class="jx-on-sale-img-price">
                    ￥{{(k.price + k.premium_price) / 100}}
                  </div>
                </div>
              </div>
            </div>
            <div class="jx-on-sale-time">
              <div v-if="item.countDownText === 0 || item.isLose">
                已结束
              </div>
              <div v-else class="jxDowmTime_index">
                <span>距结束:</span>
                <van-count-down @finish="finish(item)" :time="item.countDownText" format="DD 天 HH 时 mm 分 ss 秒" />
              </div>
            </div>
          </div>
        </div>
        <div class="jx-foot-bottom-text" v-else>
          暂无数据
        </div>
        <div class="jx-foot-bottom-text" v-if="bottomText">
          已经到底了~
        </div>
        <mp-loading :duration="900" type="dot-gray" :show="loadingShow" :animated="loadingAnimated"></mp-loading>
      </div>
    </scroll-view>
    <vueShareModel :show.sync="dialogShow"></vueShareModel>
    <vue-tab-bar selectNavIndex="0">
    </vue-tab-bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setNavBarHeight, countDown } from '../../utils/index'
import vueTabBar from '../../components/jx-bottom-footer'
import vueShareModel from '../../components/share-model'
export default {
  data () {
    return {
      scroll_id: '',
      triggered: false,
      classifyShow: false,
      titleBarHeight: 44,
      navBarHeight: 0,
      classifySelectIndex: 0,
      brandClassifySelectIndex: 0,
      brandScrollLeft: 0,
      classifyList: [],
      brandListClassify: [],
      currentIndex: 0,
      bannerList: [],
      getNewProduct: [],
      newProduct: [],
      dialogShow: false,
      dialogButtons: [],
      classifyListContent: [],
      supersalePage: 1,
      classifyListContentPage: 1,
      loadingShow: false,
      loadingAnimated: true,
      bottomText: false,
      createInterval: [],
      leaderInfo: {
        user_img_url: '',
        user_nickname: '',
        view: 0,
      },
    }
  },
  components: {
    vueTabBar,
    vueShareModel,
  },
  computed: {
    ...mapGetters([
      'is_IphoneX',
      'barTitle',
      'defaultImg1',
      'defaultImg2',
    ]),
  },
  methods: {
    finish (item) {
      item.isLose = true
      this.$forceUpdate()
    },
    onRestore () {
      console.log('刷新完成')
    },
    uptatePage () {
      if (this._freshing) return
      this._freshing = true
      this.triggered = true
      this.init()
    },
    init (isIn) {
      this.$Timer = setTimeout(() => {
        wx.showLoading({
          title: '加载中...',
          mask: true,
        });
      }, 2000)
      this.classifyListContent = []
      this.brandScrollLeft = 0
      this.getCategory(isIn)
      this.getBannarList()
      this.goodSupdate()
      this.getView()
    },
    showClassify () {
      this.classifyShow = !this.classifyShow
    },
    swiperChange (e) {
      this.currentIndex = e.target.current
    },
    cutClassify (classifyId, index, isMove) {
      this.classifyShow = false
      this.classifySelectIndex = classifyId
      if (isMove) {
        this.scroll_id = 'scroll_id' + classifyId
      }
      // this.classifyListContent = []
      this.bottomText = false
      this.clearIntervalArry()
      if (this.classifySelectIndex === 0) {
        this.getSupersale(1)
      } else {
        this.pageSize = 1
        this.getCategoryList(1)
      }
    },
    getCategory (isIn) {
      this.$http.get({
        url: '/category',
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.classifyList = data.title_bar
          this.classifyList.unshift({
            id: 0,
            name: '全部',
          })
          this.brandListClassify = data.mid_bar
          if (isIn === true) {
            this.classifySelectIndex = this.classifyList[0].id
            this.brandClassifySelectIndex = this.brandListClassify[0].id
            this.getSupersale(1);
          } else {
            this.cutClassify(this.classifySelectIndex)
          }
        } else {
          console.log(res)
        }
      });
    },
    getBannarList () {
      this.$http.get({
        url: '/index/banner',
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.bannerList = data
        } else {
          console.log(res)
        }
      });
    },
    getView () {
      this.$http.get({
        url: '/view',
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.leaderInfo = data
        } else {
          console.log(res)
        }
      });
    },
    getCategoryList () {
      this.$http.get({
        url: `/category/${this.classifySelectIndex}?curr_page=${this.classifyListContentPage}&page_size=10&id=${this.classifySelectIndex}`,
      }).then(res => {
        if (this._freshing) {
          this._freshing = false
          this.triggered = false
        }
        if (res.code * 1 === 0) {
          const data = res.data
          this.loadingShow = false
          this.loadingAnimated = false
          if (this.classifyListContentPage === 1) {
            this.classifyListContent = data.supers || []
            if (data.supers.length < 10) (this.bottomText = true)
            this.classifyListContent.map(item => {
              this.endTimeCountDown(item)
            })
          } else {
            if (!data) {
              setTimeout(() => {
                this.bottomText = true
              }, 1000)
              this.classifyListContentPage -= 1
              return
            }
            data.supers.map(item => {
              this.endTimeCountDown(item)
              this.classifyListContent.push(item)
            })
          }
        } else {
          console.log(res)
        }
      });
    },
    getSupersale () {
      this.$http.get({
        url: `/supersale/${this.brandClassifySelectIndex}?curr_page=${this.supersalePage}&page_size=10`,
      }).then(res => {
        wx.hideLoading()
        if (this._freshing) {
          this._freshing = false
          this.triggered = false
        }
        if (res.code * 1 === 0) {
          const data = res.data
          if (this.supersalePage === 1) {
            setTimeout(() => {
              this.loadingShow = false
              this.loadingAnimated = false
            }, 2000)
            if (data && data.length < 10) {
              this.bottomText = true
            } else {
              this.bottomText = false
            }
            this.classifyListContent = data || []
            this.classifyListContent.map(item => {
              this.endTimeCountDown(item)
            })
          } else {
            if (!data) {
              setTimeout(() => {
                this.bottomText = true
              }, 1000)
              this.supersalePage -= 1
              return
            }
            this.bottomText = false
            data.map(item => {
              this.endTimeCountDown(item)
              this.classifyListContent.push(item)
            })
          }
        } else {
          console.log(res)
        }
      });
    },
    goodSupdate () {
      this.$http.get({
        url: `/supersale/6?curr_page=${1}&page_size=10`,
      }).then(res => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
        if (res.code * 1 === 0) {
          const data = res.data
          this.getNewProduct = data || []
          this.getNewProduct.map(item => {
            const endTimeArr = item.sale_end_time.replace(/-/g, '/')
            const endTime = +new Date(endTimeArr)
            const newDate = +new Date(item.server_time)
            item.isLose = endTime < newDate
          })

          this.setNewProduct()
        } else {
          console.log(res)
        }
      }).catch(() => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
      })
    },
    setNewProduct () {
      this.newProduct = []
      for (let i = 0; i < this.getNewProduct.length && i < 3; i++) {
        let _item = this.getNewProduct[i].super_shops
        if (_item && _item[0]) {
          this.newProduct.push(_item[0])
        }

      }
    },
    shareEvent () {
      this.dialogShow = !this.dialogShow
    },
    bannerClick (item) {
      let isLeader = wx.getStorageSync('userType')
      let page = isLeader != '' && isLeader == 2 ? 'special-sales-leader' : 'special-sales'
      wx.navigateTo({ url: `/pages/special/${page}/main?brandId=${item.brand_id}` });
    },
    bannerLogoClick (item) {
      if (item.super_sale === 0) {
        wx.showToast({
          title: '暂未关联特卖会',
          icon: 'none',
        })
        return
      }
      let isLeader = wx.getStorageSync('userType')
      let page = isLeader != '' && isLeader == 2 ? 'special-sales-leader' : 'special-sales'
      wx.navigateTo({ url: `/pages/special/${page}/main?brandId=${item.brand_id}&saleEndTime=${item.banner_end_time}` });
    },
    cutBrandClassify (id) {
      this.brandClassifySelectIndex = id
      this.getSupersale(1)
      this.clearIntervalArry()
    },
    lookNew () {
      wx.navigateTo({ url: `/pages/new-arrival/main` });
    },
    endTimeCountDown (item) {
      let end_time = item.sale_end_time.replace(/-/g, '/')
      let now_time = item.server_time.replace(/-/g, '/')
      end_time = +new Date(end_time)
      now_time = +new Date(now_time)
      let down_time = end_time - now_time
      if (down_time <= 1000) {
        item.countDownText = 0
        item.isLose = true
        return
      }
      item.countDownText = down_time
    },
    clearIntervalArry () {
      for (let i = 0; i <= this.createInterval.length; i++) {
        clearInterval(this.createInterval[i]);
      }
      this.createInterval.splice(0, this.createInterval.length)
      this.createIntervalCount = 0
    },
  },
  mounted () {
    setNavBarHeight(this)
  },
  onLoad (option) {
    if (option) {
      if (option.hasOwnProperty('leader')) {
        this.$store.commit('setLeader', option.leader * 1)
        this.$store.commit('setShareUserId', option.userid * 1)

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
          }
        }
      }
    }
    this.init(true)
    wx.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
        } else {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userid')
        }
      },
    })
  },
  onHide () {
    this.dialogShow = false
    this.classifyShow = false
    this.clearIntervalArry()
  },
  onReachBottom () {
    if (this.bottomText || this.classifyListContent.length < 10) {
      this.loadingShow = false
      this.bottomText = true
      return
    }
    this.loadingShow = true
    if (this.classifySelectIndex === 0) {
      this.supersalePage += 1
      this.getSupersale(this.supersalePage)
    } else {
      this.classifyListContentPage += 1
      this.cutBrandClassify(this.classifyListContentPage)
    }
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
      title: this.barTitle,
      path: '/pages/index/main?leader=' + leader + '&userid=' + userid,
      imgUrl: '',
      success: function (res) {
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

<style scoped lang="scss">
page {
  position: relative;
  height: 100%;
}
.jx-home-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  font-size: 0;
  img {
    width: 100%;
    height: 274rpx;
  }
  .jx-classification {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .jx-class-centont {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      .jx-class-icon {
        width: 50rpx;
        display: flex;
        justify-content: center;
        font-size: 22rpx;
        flex-direction: column;
        color: #fff;
        letter-spacing: 1rpx;
        align-content: center;
        margin-left: 30rpx;
        margin-right: 50rpx;
        img {
          width: 35rpx;
          height: 28rpx;
          display: block;
          margin: 0 auto;
          margin-bottom: 10rpx;
        }
      }
      .jx-class-search {
        position: relative;
        input {
          background-color: #fff;
          width: 320rpx;
          height: 60rpx;
          border-radius: 30rpx;
          padding-left: 58rpx;
          font-size: 30rpx;
        }
        img {
          width: 29rpx;
          height: 29rpx;
          position: absolute;
          left: 17rpx;
          top: 17rpx;
        }
      }
    }
    .jx-classify-list {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: absolute;
      bottom: 15rpx;
      position: relative;
    }
    .jx-scroll-classify {
      width: 650rpx;
      white-space: nowrap;
      height: 70rpx;
      .jx-scroll-classify-item {
        display: inline-block;
        color: #f1f1f1;
        font-size: 30rpx;
        position: relative;
        padding: 0 15px;
      }
      .jx-classify-item-active {
        width: 30rpx;
        height: 10rpx;
        border-radius: 5rpx;
        background-color: #f1f1f1;
        margin: 0 auto;
        margin-top: 15rpx;
      }
    }
    .classifyblock {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      .classify-wrap {
        left: 0;
        top: 0;
        width: 100%;
        display: flex;
        position: absolute;
        background: white;
        padding: 20rpx 20rpx 10rpx 20rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        border-radius: 0 0 15rpx 15rpx;
        box-shadow: 0 1rpx 6rpx 3rpx rgba(0, 0, 0, 0.2);
        .title {
          font-size: 26rpx;
          color: #333333;
        }
        .classify-scoll {
          margin-top: 10px;
          height: 230rpx;
          .classify-group {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            width: 100%;
            .classify_item {
              font-size: 24rpx;
              color: #333333;
              padding: 0 15px;
              height: 50rpx;
              line-height: 50rpx;
              text-align: center;
              border: 1rpx solid #ff4365;
              border-radius: 10rpx;
              color: #ff4365;
              margin: 0 10px 10px 0;
            }
          }
        }
      }
    }
    .jx-right-classify {
      width: 90rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-left: 1px solid #f6bac5;
      height: 40rpx;
      margin-top: 2rpx;
      img {
        width: 29rpx;
        height: 16rpx;
        transition: 0.2s 0.2s;
        &.active {
          transform: rotate(-180deg);
          filter: invert(100%);
        }
      }
    }
  }
}
.scroll-view-page {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 294rpx;
  .jx-home-body {
    margin: 0 20rpx auto;
    padding-bottom: 145rpx;
    height: auto;
    .jx-bannar-home {
      overflow: hidden;
      position: relative;
      .jx-indicator-dots {
        position: absolute;
        bottom: 7rpx;
        left: 0;
        display: flex;
        justify-content: center;
        width: 100%;
        .jx-indicator-dots-item {
          width: 16rpx;
          height: 4rpx;
          border-radius: 2rpx;
          background-color: #ffffff;
          margin-right: 6rpx;
        }
        .jx-indicator-dots-item-active {
          width: 38rpx;
        }
      }
    }
    .jx-today-new {
      height: 235rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .jx-today-new-title {
        & > p {
          font-size: 34rpx;
          font-weight: 500;
        }
        width: 195rpx;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
      .mini-btn {
        width: 170rpx;
        font-size: 24rpx;
        margin-top: 17rpx;
        img {
          width: 12rpx;
          height: 18rpx;
          margin-left: 10rpx;
        }
      }
      .jx-new-img-list {
        display: flex;
      }
      .jx-new-img {
        width: 150rpx;
        height: 150rpx;
        border-radius: 10rpx;
        overflow: hidden;
        margin-right: 18rpx;
        position: relative;
      }
    }
    .jx-today-new3 {
      justify-content: flex-start;
      .jx-today-new-title {
        margin-right: 30rpx;
      }
    }
    .jx-brand-navbar {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 34rpx;
      color: #333333;
      .jx-brand-scroll {
        width: 710rpx;
        white-space: nowrap;
        height: 100rpx;
        display: flex;
        align-items: center;
      }
      .jx-recommend {
        width: 203rpx;
        display: inline-block;
        text-align: center;
        margin-top: 28rpx;
      }
      .jx-brand-active {
        color: #fd637e;
        position: relative;
        &::before {
          content: "";
          width: 85rpx;
          height: 5rpx;
          border-radius: 2.5rpx;
          background-color: #fd637e;
          position: absolute;
          bottom: -7rpx;
          left: 0;
          right: 0;
          margin: auto;
        }
      }
    }
  }
}

.swiper-item {
  height: 100%;
  width: 100%;
}
._swiper-item {
  border-radius: 25rpx;
}
.jx-foot-bottom-text {
  height: 40rpx;
  line-height: 40rpx;
}
.jx-shop-lose-img {
  width: 115rpx;
  height: 115rpx;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 21.5rpx;
  z-index: 2;
}
</style>
