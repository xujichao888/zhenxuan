<template>
  <div>
    <header class="jx-me-header-leader" v-if="isLeader">
      <img src="/static/images/me_leder_bg.png" alt="">
      <div class="jx-me-title">
        <div :style="{height: navBarHeight + 'px'}"></div>
        <div class="jx-me-text" :style="{height: titleBarHeight + 'px', lineHeight: titleBarHeight + 'px'}"></div>
        <div class="jx-user-login">
          <div class="jx-user-login-wrap">
            <div class="jx-user-head">
              <img v-if="!isLogin" src="/static/images/defult-head.png" alt="">
              <img v-else :src="userInfo.avatarUrl" alt="">
            </div>
            <button open-type="getUserInfo" @getuserinfo="wxLogin" lang="zh_CN" class="jx-login-btn" v-if="!isLogin">
              立即登录
              <img src="/static/icons/right-arrow.png" alt="">
            </button>
            <div class="jx-user-login jx-user-nick-name" v-else>
              <div class="group">
                <span class="name">{{userInfo.nickName}}</span>
                <div class="leve" v-if="userInfo && userInfo.leve">
                  <span class="left">{{userInfo.leve[0]}}</span>
                  {{userInfo.leve}}
                </div>
              </div>
            </div>
            <div class="jx-refreshed-userinfo" v-if="isLogin" @click="refreshedUserInfo">
              刷新信息
              <img src="/static/icons/refreshed-icon.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </header>
    <header v-else class="jx-me-header">
      <img src="/static/images/me-header-bg.png" alt="">
      <div class="jx-me-title">
        <div :style="{height: navBarHeight + 'px'}"></div>
        <div class="jx-me-text" :style="{height: titleBarHeight + 'px', lineHeight: titleBarHeight + 'px'}">我的</div>
        <div class="jx-user-login">
          <div class="jx-user-head">
            <img v-if="!isLogin" src="/static/images/defult-head.png" alt="">
            <img v-else :src="userInfo.avatarUrl" alt="">
          </div>
          <button open-type="getUserInfo" @getuserinfo="wxLogin" lang="zh_CN" class="jx-login-btn" v-if="!isLogin">
            立即登录
            <img src="/static/icons/right-arrow.png" alt="">
          </button>
          <div class="jx-user-login jx-user-nick-name" v-else>
            {{userInfo.nickName}}
          </div>
          <div class="jx-refreshed-userinfo" v-if="isLogin" @click="refreshedUserInfo">
            刷新信息
            <img src="/static/icons/refreshed-icon.png" alt="">
          </div>
        </div>
      </div>
    </header>
    <div class="jx-body" :class="{'jx-body-leader': isLeader}" :style="{marginTop: isLeader ? navBarHeight + 10 + 'px' : '20rpx'}">
      <div class="profit" v-if="isLeader" @click="redirectTo('/pages/me-leader/profit/main', {})">
        <div class="top">
          <div class="left">
            <div class="tips">
              <img class="text item" @click.stop="showMoad" src="/static/icons/question.png">
              <span class="text item">累计收益(元)</span>
              <img class="text item" src="/static/icons/right-solid-arrows.png">
            </div>
            <span class="pric" v-if="userInfo.balance && userInfo.balance > 0">{{userInfo.balance / 100}}</span>
            <span class="pric" v-else>0.00</span>
          </div>
          <div class="right">
            <div class="item">
              <span class="text item">今日预估收入（元）</span>
              <span class="pric" v-if="userInfo.day_estimate && userInfo.day_estimate > 0">{{userInfo.day_estimate / 100}}</span>
              <span class="pric" v-else>0.00</span>
            </div>
            <div class="item">
              <span class="text item">本月预估收入（元）</span>
              <span class="pric" v-if="userInfo.month_estimate && userInfo.month_estimate > 0">{{userInfo.month_estimate / 100}}</span>
              <span class="pric" v-else>0.00</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="wrap" v-if="userInfo.leader_level < 3" @click.stop="redirectTo('/pages/me-leader/update/main', {})">
            <div>
              <img class="text item" src="/static/icons/vipicon.png">
              <span>升级<span class="vip">{{userInfo.nextLeve}}</span>获取更高权益</span>
            </div>
            <span>去升级 ></span>
          </div>
        </div>
      </div>
      <scroll-view class="scroll-view-page" :refresher-enabled="isLogin" :showScrollbar="false" scroll-y :refresher-triggered="triggered" @refresherrefresh="uptatePage" @refresherrestore="onRestore" :style="{top: isLeader ? ' 345rpx' : '0rpx'}">
        <div class="scroll-view-content" :style="{paddingBottom: is_IphoneX ? '162rpx' : '136rpx'}">
          <div class="jx-card">
            <div class="jx-order-title" @click="redirectTo('/pages/my-order/main', {orderStatus: 0})">
              <div class="jx-order-text">
                我的订单
              </div>
              <div class="jx-login-btn">
                查看全部订单
                <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
              </div>
            </div>
            <div class="jx-shoping-status">
              <div class="jx-shopping-status-item" @click="redirectTo('/pages/my-order/main', {orderStatus: 20})">
                <mp-badge :content="order.order_status20" v-if="order.order_status20 !== 0"></mp-badge>
                <img src="/static/icons/obligation-icon.png" alt="">
                <p>待付款</p>
              </div>
              <div class="jx-shopping-status-item" @click="redirectTo('/pages/my-order/main', {orderStatus: 70})">
                <mp-badge :content="order.order_status70" v-if="order.order_status70 * 1 !== 0"></mp-badge>
                <img src="/static/icons/send-goods-icon.png" alt="">
                <p>待发货</p>
              </div>
              <div class="jx-shopping-status-item" @click="redirectTo('/pages/my-order/main', {orderStatus: 80})">
                <mp-badge :content="order.order_status80" v-if="order.order_status80 * 1 !== 0"></mp-badge>
                <img src="/static/icons/wait-receiving-icon.png" alt="">
                <p>待收货</p>
              </div>
              <div class="jx-shopping-status-item" @click="redirectTo('/pages/my-order/main', {orderStatus: 99})">
                <mp-badge :content="order.order_status89" v-if="order.order_status89 * 1 !== 0"></mp-badge>
                <img src="/static/icons/off-stocks-icon.png" alt="">
                <p>已完成</p>
              </div>
              <div class="jx-shopping-status-item" @click="redirectTo('/pages/refund-list/main', {})">
                <mp-badge :content="order.order_customer_service" v-if="order.order_customer_service * 1 !== 0"></mp-badge>
                <img src="/static/icons/refund-icon.png" alt="">
                <p>退款/售后</p>
              </div>
            </div>
          </div>
          <div class="jx-card jx-select-list">
            <div class="jx-select-list-item" @click="redirectTo('/pages/me-leader/invite/main', {})" v-if="isShowLeader !== 0 && isLogin && isLeader">
              <p><img src="/static/icons/invite.png"><span>邀请码</span></p>
              <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
            </div>
            <div class="jx-select-list-item" @click="redirectTo('/pages/me-leader/taem/main', {})" v-if="isShowLeader !== 0 && isLogin && isLeader">
              <p><img src="/static/icons/team.png"><span>我的团队</span></p>
              <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
            </div>
            <div class="jx-select-list-item" @click="redirectTo('/pages/me-leader/fans/main', {})" v-if="isShowLeader !== 0 && isLogin && isLeader">
              <p><img src="/static/icons/fans.png"><span>我的粉丝</span></p>
              <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
            </div>
            <div class="jx-select-list-item" @click="leadredirectTo" v-if="isShowLeader !== 0 && isLogin && !isLeader">
              <p>团长中心</p>
              <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
            </div>
            <div class="jx-select-list-item" @click="redirectTo('/pages/address-list/main', {})">
              <p><img src="/static/icons/address.png" v-if="isLeader"><span>地址管理</span></p>
              <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
            </div>
            <div class="jx-select-list-item" @click="redirectTo('/pages/customer-service/main', {})">
              <p><img src="/static/icons/service.png" v-if="isLeader"><span>联系客服</span></p>
              <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
            </div>
            <div class="jx-select-list-item" @click="shareFriends">
              <p><img src="/static/icons/share1.png" v-if="isLeader"><span>分享好友</span></p>
              <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <vue-tab-bar selectNavIndex="2">
    </vue-tab-bar>
    <!-- <shouQuanModel :show.sync="loginDialogShow"></shouQuanModel> -->
    <mp-dialog title=" " ext-class="loginDialogWrap" :show="loginDialogShow" bindbuttontap="tapDialogButton" :buttons="dialogButtons">
      <div class="js-login-dialog">
        <p><img class="dialog-logo" :src="defaultLogo"></p>
        <p class="dialog-text-black">{{barTitle}}申请获得以下权限：</p>
        <p class="dialog-text1">获取你的公共信息（昵称、头像等）</p>
        <div class="jx-login-btn-box">
          <button @click="loginDialogShow = false" class="min-btn">
            暂不授权
          </button>
          <button open-type="getUserInfo" @getuserinfo="wxLogin" lang="zh_CN" class="jx-login-btn min-btn">
            去授权
          </button>
        </div>
      </div>
    </mp-dialog>
    <vueShareModel :show.sync="dialogShow" :type="4"></vueShareModel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setNavBarHeight } from '../../utils/index'
import vueTabBar from '../../components/jx-bottom-footer'
import vueShareModel from '../../components/share-model'
// import shouQuanModel from '../../components/authorization'

export default {
  data () {
    return {
      triggered: false,
      isLeader: false,
      titleBarHeight: 44,
      navBarHeight: 0,
      isLogin: false,
      dialogShow: false,
      loginDialogShow: false,
      userInfo: {
        avatarUrl: '',
        nickName: '',
      },
      order: {
        order_status20: 0,
        order_status70: 0,
        order_status80: 0,
        order_status89: 0,
        order_customer_service: 0,
      },
      refereeId: '',
      isApply: 0,
      isShowLeader: 0,
      userType: 0,
      auditStatus: 0, // 1 可以申请 2 申请中 3 团长
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
      'defaultLogo'
    ]),
  },
  onHide () {
    this.dialogShow = false
  },
  methods: {
    showMoad () {
      wx.showModal({
        title: '累计收益说明',
        content: '累计收益=已入账金额+未入账金额',
        showCancel: false,
        confirmText: '我知道了',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
    onRestore () {
      console.log('刷新完成')
    },
    uptatePage () {
      const _this = this;
      if (this._freshing) return
      this._freshing = true
      this.triggered = true
      wx.getSetting({
        success (res) {
          if (!res.authSetting['scope.userInfo']) {
            _this.loginModel();
            return
          } else {
            _this.getUserInfo()
            _this.getMyordernum()
            _this.loginDialogShow = false;
          }
        },
      })
    },
    wxLogin (e) {
      this.loginDialogShow = false
      const self = this;
      wx.login({
        success: (res) => {
          console.log(e);
          if (res.code) {
            self.postLoginbywechat(res.code, e.mp.detail)
          }
        },
      });
    },
    loginModel () {
      this.loginDialogShow = false;
      this.loginDialogShow = true
    },
    postLoginbywechat (code, userInfo) {
      const { rawData } = userInfo
      const params = {
        code,
        user_info: rawData,
        referee_id: this.refereeId * 1,
      }
      let leader = this.$store.state.leader * 1
      let user_parent = this.$store.state.shareUserId * 1
      if (leader > 0) {
        params.leader = leader
      }
      if (user_parent > 0) {
        params.user_parent = user_parent
      }
      console.warn(`授权参数:`, params);
      this.$http.post({
        url: '/loginbywechat',
        data: params,
      }).then(data => {
        // console.log(`后台交互拿回数据:`,res);
        if (data.code * 1 === 0) {
          this.isLogin = true
          const res = data.data
          this.userInfo = userInfo.userInfo
          if (res.hasOwnProperty('is_show_leader')) {
            if (res.is_show_leader * 1 === 1) {
              this.isShowLeader = res.is_show_leader
              this.auditStatus = 1
            }
          }
          wx.setStorageSync('token', res.token)
          wx.setStorageSync('userid', res.user_id)
          wx.setStorageSync('openId', res.open_id)

          this.getMyordernum()
          this.getUserInfo()
        } else {
          wx.showToast({
            title: '登录失败', //提示的内容,
            icon: 'none', //图标,
            duration: 1000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          });
          console.log(data);
        }
        // 获取到后台重写的session数据，可以通过vuex做本地保存
      })
    },
    refreshedUserInfo () {
      wx.showLoading({
        title: '信息更新中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      const self = this;
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.getUserInfo({
              success: function (info) {
                const { rawData, userInfo } = info
                const params = {
                  code: res.code,
                  user_info: rawData,
                }
                self.$http.post({
                  url: '/refreshwxinfo',
                  data: params,
                }).then(data => {
                  wx.hideLoading()
                  if (data.code * 1 === 0) {
                    wx.showToast({
                      title: '更新成功',
                      mask: true,
                    });
                    self.getUserInfo()
                  } else {
                    wx.showToast({
                      title: data.msg,
                      icon: 'none',
                      mask: true,
                    });
                  }
                })
              },
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '获取code失败',
              icon: 'none',
              mask: true,
            });
          }
        },
      });


    },
    redirectTo (url, params) {
      if (!this.isLogin) {
        this.loginModel()
        return
      }
      let paramsString = '?'
      for (let item in params) {
        paramsString += `${item}=${params[item]}&`
      }
      wx.navigateTo({
        url: url + paramsString,
      })
    },
    leadredirectTo () {
      if (!this.isLogin) {
        this.loginModel()
        return
      }
      console.log(this.auditStatus);
      if (this.auditStatus === 3) {
        wx.navigateTo({
          url: '/pages/head-pass/main',
        })
        return
      }
      if (this.auditStatus * 1 === 1) {
        wx.navigateTo({
          url: '/pages/mention-hint/main',
        })
        return
      }
      if (this.auditStatus * 1 === 2) {
        wx.navigateTo({
          url: `/pages/head-audit/main`,
        })
        return
      }
    },
    shareFriends () {
      if (!this.isLogin) {
        this.loginModel()
        return
      }
      this.dialogShow = true
    },
    getMyordernum () {
      this.$http.get({
        url: '/myordernum',
      }).then(res => {
        if (this._freshing) {
          this._freshing = false
          this.triggered = false
        }
        if (res.code * 1 === 0) {
          const data = res.data
          this.order = data
        }
      })
    },
    getUserInfo () {
      this.$http.get({
        url: '/getuserinfo',
      }).then(res => {
        if (res.code * 1 === 0) {
          this.isLogin = true
          this.userInfo = {
            avatarUrl: res.data.user_img_url,
            nickName: res.data.user_nickname,
            ...res.data,
            leve: this.getUserLeve(res.data.leader_level),
            nextLeve: this.getUserLeve(res.data.leader_level <= 1 ? 2 : res.data.leader_level + 1),
            Uplevel0: res.data.uplevel0,
            Uplevel1: res.data.uplevel1,
            Uplevel2: res.data.uplevel2,
            Uplevel3: res.data.uplevel3,
            content: res.data.content,
          }
          wx.setStorageSync('avatarUrl', res.data.user_img_url)
          wx.setStorageSync('userType', res.data.user_type)
          this.isLeader = res.data.user_type === 2

          this.$store.commit('setUserInfo', {
            avatarUrl: res.data.user_img_url,
            nickName: res.data.user_nickname,
            leve: res.data.leader_level,
            Uplevel0: res.data.uplevel0,
            Uplevel1: res.data.uplevel1,
            Uplevel2: res.data.uplevel2,
            Uplevel3: res.data.uplevel3,
            content: res.data.content,
          })
          this.userType = res.data.user_type
          if (res.data.is_apply === 1) {
            this.isShowLeader = 1
            this.auditStatus = 2
          }
          if (res.data.user_type == 2) this.auditStatus = 3
          this.isLogin = true
        } else {
          console.log(res);
        }
      })
    },
    getUserLeve (lv) {
      switch (lv) {
        case 0:
          return '实习店主'
          break;
        case 1:
          return '正式店主'
          break;
        case 2:
          return 'vip店主'
          break;
        case 3:
          return '运营商店主'
          break;
      }
    },
  },
  mounted () {
    setNavBarHeight(this)
  },
  onLoad (option) {
    if (option) {
      if (option.leader) {
        this.is_show_leader = 1
      }
      if (option.scene) {
        let qrId = decodeURIComponent(option.scene)
        let arr = qrId.split('#');
        for (var i = 0; i < arr.length; i++) {
          let newArr = arr[i].split('=');
          for (var j = 0; j < newArr.length; j++) {
            if (newArr[0] == 'leader') {
              this.is_show_leader = 1
            }
          }
        }
      }
    }
  },
  onShow () {
    const _this = this;
    let isLeader = wx.getStorageSync('userType')
    this.isLeader = isLeader == 2
    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.userInfo']) {
          _this.loginModel();
          return
        } else {
          _this.getUserInfo()
          _this.getMyordernum()
          _this.loginDialogShow = false;
        }
      },
    })
    this.refereeId = this.$store.state.refereeId
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
        console.log(res);
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
.loginDialogWrap {
  .weui-dialog__bd {
    display: flex;
    align-items: center;
  }
}
page {
  position: relative;
  height: 100%;
}
.jx-me-header {
  height: 355rpx;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.jx-me-title {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
}
.jx-me-title .jx-me-text {
  font-size: 38rpx;
  text-align: center;
}
.jx-user-login {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  height: 127rpx;
  align-items: center;
  .jx-user-nick-name {
    left: 200rpx;
  }
  .jx-refreshed-userinfo {
    position: absolute;
    right: 50rpx;
    img {
      width: 25rpx;
      height: 23rpx;
    }
  }
}
.jx-user-login .jx-login-btn {
  background-color: transparent;
  color: #fff;
  border: none;
  display: inline-block;
  font-size: 32rpx;
  box-sizing: border-box;
  line-height: 50rpx;
  height: 50rpx;
  margin-left: 16rpx;
  font-weight: 500;
  letter-spacing: 2rpx;
  img {
    width: 14rpx;
    height: 23rpx;
  }
}
.jx-user-login .jx-user-head {
  width: 127rpx;
  height: 127rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 40rpx;
}
.jx-body {
  position: absolute;
  top: 355rpx;
  left: 20rpx;
  right: 20rpx;
  bottom: 0;
}
.scroll-view-page {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 345rpx;
  .scroll-view-content {
    padding-bottom: 162rpx;
    height: auto;
  }
}
.jx-body-leader {
  top: 220rpx;
  background: #f1f1f1;
  border-radius: 16rpx;
  overflow: hidden;
  .profit {
    height: 325rpx;
    width: 100%;
    background-image: linear-gradient(270deg, #dfb58f 0%, #efd4b7 100%);
    margin: 0 auto 20rpx;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
    justify-content: space-between;
    align-items: center;
    .footer {
      height: 60rpx;
      .wrap {
        background-image: linear-gradient(180deg, #333333 0%, #000000 100%);
        border-radius: 8px 8px 0 0;
        height: 100%;
        width: 670rpx;
        align-items: center;
        font-size: 24rpx;
        color: #ffcea5;
        box-sizing: border-box;
        padding: 0 15rpx;
        display: flex;
        justify-content: space-between;
        margin: 0;
        & > div {
          display: flex;
          align-items: center;
          .vip {
            color: #ff4365;
          }
        }
        img {
          width: 32rpx;
          height: 32rpx;
          margin-right: 15rpx;
        }
      }
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0rpx 40rpx;
      box-sizing: border-box;
      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        .tips {
          display: flex;
          align-items: center;
          .item {
            margin: 0 5rpx;
          }
          .text {
            font-size: 24rpx;
            color: #652e03;
          }
          img:nth-of-type(1) {
            width: 36rpx;
            height: 36rpx;
          }
          img:nth-of-type(2) {
            width: 24rpx;
            height: 24rpx;
          }
        }
        .pric {
          font-size: 70rpx;
          color: #652e03;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10rpx 0;
          .text {
            font-size: 24rpx;
            color: #652e03;
          }
          .pric {
            color: #652e03;
            font-size: 36rpx;
          }
        }
      }
    }
  }
}
.jx-order-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26rpx 16rpx;
  border-bottom: 2px solid #f5f5f5;
  .jx-order-text {
    color: #333333;
    font-size: 36rpx;
  }
  .jx-login-btn {
    font-size: 26rpx;
    color: #767676;
  }
}
.jx-shoping-status {
  display: flex;
  justify-content: space-between;
  padding: 50rpx 40rpx;
  .jx-shopping-status-item {
    text-align: center;
    font-size: 26rpx;
    color: #333333;
    position: relative;
    img {
      width: 59rpx;
      height: 47rpx;
    }
    p {
      margin-top: 18rpx;
    }
    .weui-badge {
      position: absolute;
      top: -20rpx;
      right: 0;
    }
  }
}
.jx-right-arriw {
  width: 14rpx;
  margin-right: 10rpx;
  height: 23rpx;
  flex-shrink: 0;
}
.jx-select-list {
  margin-top: 20rpx;
}
.jx-select-list-item {
  display: flex;
  justify-content: space-between;
  margin-right: 10rpx;
  margin-left: 10rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  border-bottom: 1px solid #dedede;
  height: 112rpx;
  align-items: center;
  color: #767676;
  p {
    display: flex;
    align-items: center;
    flex-grow: 1;
    img {
      width: 50rpx;
      height: 50rpx;
      margin-right: 5px;
    }
  }
  &:last-child {
    border-bottom: none;
  }
}
.js-login-dialog {
  width: 560rpx;
  height: 400rpx;
  background-color: #fff;
  padding-top: 40rpx;
  position: relative;
  font-size: 40rpx;
  color: #333;
  border-radius: 10rpx;
  overflow: hidden;
  .dialog-logo {
    width: 144rpx;
    height: 144rpx;
    border-radius: 72rpx;
  }

  .dialog-text-black {
    padding-top: 5rpx;
    font-size: 35rpx;
    color: #000;
  }
  .dialog-text1 {
    padding-top: 8rpx;
    font-size: 25rpx;
    color: #75777a;
  }
  .jx-login-btn-box {
    display: flex;
    width: 100%;
    bottom: 0;
    margin-top: 10rpx;
    padding: 30rpx;
    box-sizing: border-box;
    .min-btn {
      height: 80rpx;
      width: 235rpx;
      margin: 0;
      padding: 0;
      border-radius: 10rpx;
      background-color: #f6f6f6;
      color: #75777a;
      line-height: 80rpx;
    }
    .jx-login-btn {
      margin-left: 30rpx;
      justify-content: center;
      background-color: #ff4365;
      color: #fff;
    }
  }
}
.jx-me-header-leader {
  height: 600rpx;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  .jx-user-login {
    position: static;
    .jx-user-login-wrap {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      height: 127rpx;
      align-items: center;
      .jx-user-head {
        border: 5rpx solid white;
        flex-shrink: 0;
      }
      .group {
        display: flex;
        flex-direction: column;
        padding-left: 20rpx;
        .leve {
          position: relative;
          margin-top: 10rpx;
          align-self: baseline;
          padding: 0 20rpx 0 45rpx;
          height: 32rpx;
          line-height: 32rpx;
          background-image: linear-gradient(270deg, #ce9e73 0%, #ffc281 100%);
          border-radius: 20px;
          font-size: 20rpx;
          color: #632b00;
          .left {
            position: absolute;
            width: 32rpx;
            height: 32rpx;
            border: 3rpx solid white;
            border-radius: 50%;
            left: 0;
            top: -2px;
            background-image: linear-gradient(-35deg, #f2ba88 7%, #d09f73 98%);
            box-shadow: 0 2px 4px 0 rgba(168, 111, 58, 0.5);
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
