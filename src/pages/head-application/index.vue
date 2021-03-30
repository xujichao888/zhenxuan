<template>
  <div class="jx-address-editor">
    <update-nav-bar titleText="会员升级" :homeIcon="referee_id > 0 || referee_id == -1 ? '/static/tabs/home.png' : ''" :backIcon="referee_id == 0 ? '/static/icons/return-black.png' : ''" color="#333333" :showLvev="false" background="#f1f1f1" topBg="#f1f1f1" @home="toMePage" @back="back">
    </update-nav-bar>
    <div class="refereeInfo" v-if="referee_id > 0">
      <img :src="refereeInfo.user_img_url" alt="">
      <span class="name">{{refereeInfo.user_nickname}}</span>
      <span class="tips">邀请您成为{{barTitle}}店主</span>
    </div>
    <van-cell-group custom-class="cell-group">
      <van-field :value="mobile" label="手机号" placeholder="请输入您的手机号" :errorMessage="mobile_err" type="number" focus @focus="mobile_err = ''" @clear="clear('mobile')" auto-focus clearable required @input="inputHandle($event, 'mobile')" />
      <van-field type="number" :value="code" @focus="code_err = ''" @clear="clear('code')" @input="inputHandle($event, 'code')" required center clearable placeholder="请输入短信验证码" :error-message="code_err">
        <div slot="label" class="label">短信验证码</div>
        <div slot="button" v-if="!isCodeLoding" class="codeBtn" @click="getCode">获取验证码</div>
        <div v-else class="codeBtn" slot="button">
          <van-count-down :time="time" format="ss 秒" use-slot @finish="finishTime" @change="changeTime">
            <span class="codeBtn">{{ timeData.seconds }} 秒</span>
          </van-count-down>
        </div>
      </van-field>
    </van-cell-group>
    <p style="font-size: 28rpx; margin: 35rpx 0;">请上传个人微信二维码（方便您的粉丝联系您）</p>
    <div class="jx-update-img">
      <img @click="updateImage" src="/static/images/img-btn.png" alt="" v-if="!updateImageSrc">
      <img @click="updateImage" :src="updateImageSrc" alt="" v-else>
    </div>
    <div class="jx-address-btn">
      <button class="mini-btn" :class="{disabled: disableBtn && referee_id > 0}" :disabled="disableBtn && referee_id > 0" type="primary" @click="save">
        立即升级
      </button>
    </div>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import updateNavBar from '../../components/updateNavBar'
export default {
  data () {
    return {
      loginDialogShow: false,
      disableBtn: false,
      refereeInfo: {},
      referee_id: 0,
      timeData: {},
      isCodeLoding: false,
      mobile_err: '',
      code_err: '',
      code: '',
      updateImageSrc: '',
      name: '',
      mobile: '',
      applyId: 0,
      time: 0,
      reqUrl: '',
      reqParams: {},
    }
  },
  components: {
    updateNavBar,
  },
  computed: {
    ...mapGetters([
      'barTitle',
      'defaultLogo'
    ]),
  },
  methods: {
    back () {
      wx.navigateBack({
        delta: 1,
      })
    },
    changeTime (e) {
      this.timeData = e.mp.detail
    },
    finishTime () {
      this.isCodeLoding = false
    },
    getCode () {
      if (this.mobile === '') {
        this.mobile_err = '请填写手机号'
        wx.showToast({
          title: '请填写手机号',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      let reg = /^1[3456789]\d{9}$/
      if (!reg.test(this.mobile)) {
        this.mobile_err = '手机号填写不正确'
        wx.showToast({
          title: '请填写正确的手机号',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      wx.showLoading({
        title: '发送中...',
        mask: true,
      });
      this.$http.get({
        url: `/leader/phonecode?phone=${this.mobile}`,
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发送成功',
        });
        if (res.code * 1 === 0) {
          this.isCodeLoding = true
          let newTime = +new Date()
          let createTime = +new Date()
          let endTime = new Date()
          endTime.setTime(createTime + 1000 * 60)
          this.time = new Date(endTime) - newTime
        } else {
          wx.showToast({
            title: '发送失败',
            icon: 'none',
          });
        }
      })
    },
    clear (type) {
      this[type] = ''
      this[`${type}_err`] = ''
    },
    inputHandle (e, type) {
      this[type] = e.mp.detail
    },
    updateImage () {
      const _this = this
      wx.chooseImage({
        count: 1,
        success (res) {
          const tempFilePaths = res.tempFilePaths
          _this.updateImageSrc = tempFilePaths[0]
          _this.uploadFile()
        },
      })
    },
    uploadFile () {
      if (this.updateImageSrc === '') {
        wx.showToast({
          title: '请上传微信二维码',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      const _this = this
      const fileNameArry1 = this.updateImageSrc.split('/')
      const fileName = fileNameArry1[fileNameArry1.length - 1]
      wx.uploadFile({
        url: `${_this.$stroe.state.baseUrl}/upload/file`,
        filePath: this.updateImageSrc,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          "token": wx.getStorageSync('token'),
        },
        formData: {
          file_name: `leader/ img / ${fileName}`,
        },
        success (res) {
          const data = JSON.parse(res.data)
          if (data.code * 1 === 0) {
            _this.updateImageSrc = data.data.file_path
          } else {
            wx.showToast({
              title: '请二维码上传失败',
              icon: 'none',
              duration: 2000,
            })
          }
        },
      })
    },
    getLeaderCenter () {
      this.$http.post({
        url: '/leader/center',
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.mobile = data.tel
          this.applyId = data.apply_id
          this.updateImageSrc = data.wechat_code
        }
      })
    },
    save () {
      if (this.mobile === '') {
        this.mobile_err = '手机号不能为空'
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      let reg = /^1[3456789]\d{9}$/
      if (!reg.test(this.mobile)) {
        this.mobile_err = '手机号填写不正确'
        wx.showToast({
          title: '请填写正确的手机号',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      if (this.code === '') {
        this.code_err = '验证码不能为空'
        wx.showToast({
          title: '验证码不能为空',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      if (this.code.length !== 6) {
        this.code_err = '请输入6位数验证码'
        wx.showToast({
          title: '请输入6位数验证码',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      if (this.updateImageSrc === '') {
        wx.showToast({
          title: '请上传个人微信二维码',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      let leader_id = this.$store.state.leader * 1
      const params = {
        tel: this.mobile,
        code: this.code,
        wechat_code: this.updateImageSrc,
        leader_id: leader_id && leader_id > 0 ? Number(leader_id) : 0,
      }
      let url = '/leader/apply'
      if (this.applyId !== 0) {
        params.id = this.applyId * 1
        url = '/leader/update'
      } else {
        params.referee_id = this.$store.state.refereeId * 1
      }
      let _this = this
      wx.getSetting({
        success (res) {
          if (!res.authSetting['scope.userInfo']) {
            _this.reqUrl = url
            _this.reqParams = params
            _this.loginModel();
          } else {
            _this.loginDialogShow = false;
            _this.updaeVip(url, params)
          }
        },
      })

    },
    updaeVip (url, params) {
      wx.showLoading({
        title: '加载中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      this.$http.post({
        url: url,
        data: params,
      }).then(res => {
        wx.hideLoading();
        if (res.code === 0) {
          wx.showToast({
            title: '提交成功！',
            icon: 'none',
            duration: 1000,
          })
          setTimeout(() => {
            if (this.referee_id > 0 || this.referee_id == -1) {
              this.toMePage()
              return
            }
            wx.navigateBack({
              delta: 2,
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
        }
      })
    },
    getSurplusCode () {
      wx.showLoading({
        title: '加载数据中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      this.$http.get({
        url: `/ leader / getinfo ? leader_id = ${this.referee_id}`,
      }).then(res => {
        wx.hideLoading();
        if (res.code * 1 === 0) {
          this.refereeInfo = res.data
          if (res.data.total_invite - res.data.invited <= 0) {
            this.disableBtn = true
            wx.showModal({
              showCancel: false,
              confirmText: '我知道了',
              title: '提示',
              content: '邀请码已失效',
              success (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/index/main',
                  })
                }
              },
            })
          }
        } else {
          wx.showToast({
            title: res.msg, //提示的内容,
            icon: 'none', //图标,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
        }
      })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: '数据获取失败！', //提示的内容,
            icon: 'none', //图标,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
        })
    },
    toMePage () {
      wx.switchTab({
        url: '/pages/me/main',
      })
    },
    loginModel () {
      this.loginDialogShow = true
    },
    wxLogin (e) {
      this.loginDialogShow = false
      const self = this;
      wx.login({
        success: (res) => {
          if (res.code) {
            self.postLoginbywechat(res.code, e.mp.detail)
          }
        },
      });
    },
    postLoginbywechat (code, userInfo) {
      const { rawData } = userInfo
      const params = {
        code,
        user_info: rawData,
        referee_id: this.$store.state.refereeId * 1,
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
        if (data.code * 1 === 0) {
          const res = data.data
          wx.setStorageSync('token', res.token)
          wx.setStorageSync('userid', res.user_id)
          wx.setStorageSync('openId', res.open_id)
          this.getUserInfo()
        } else {
          wx.showToast({
            title: '登录失败', //提示的内容,
            icon: 'none', //图标,
            duration: 1000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          });
        }
      })
    },
    getUserInfo () {
      this.$http.get({
        url: '/getuserinfo',
      }).then(res => {
        if (res.code * 1 === 0) {
          this.userInfo = {
            avatarUrl: res.data.user_img_url,
            nickName: res.data.user_nickname,
            ...res.data,
          }
          wx.setStorageSync('avatarUrl', res.data.user_img_url)
          wx.setStorageSync('userType', res.data.user_type)

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
          let isLeader = res.data.user_type
          if (isLeader != '' && isLeader == 2) {
            wx.showToast({
              title: '您已经是店主了，正在跳转...',
              icon: 'none',
              mask: true,
              duration: 2000,
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/main',
              })
            }, 2000)
            return
          }
          this.updaeVip(this.reqUrl, this.reqParams)
        } else {
          wx.showToast({
            title: res.msg, //提示的内容,
            icon: 'none', //图标,
            mask: true, //显示透明蒙层，防止触摸穿透,
          });
          console.log(res);
        }
      })
    },
  },
  onLoad (options) {
    if (options.referee_id) {
      let isLeader = wx.getStorageSync('userType')
      if (isLeader != '' && isLeader == 2) {
        wx.showToast({
          title: '您已经是店主了，正在跳转...',
          icon: 'none',
          mask: true,
          duration: 2000,
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/main',
          })
        }, 2000)
        return
      }
      this.$store.commit('setRefereeId', options.referee_id * 1)
      this.referee_id = options.referee_id * 1
      if (this.referee_id > 0) {
        this.getSurplusCode()
      }
    }
    if (options.scene) {
      let qrId = decodeURIComponent(options.scene)
      let arr = qrId.split('#');
      for (var i = 0; i < arr.length; i++) {
        let newArr = arr[i].split('=');
        for (var j = 0; j < newArr.length; j++) {
          if (newArr[0] == 'referee_id') {
            let isLeader = wx.getStorageSync('userType')
            if (isLeader != '' && isLeader == 2) {
              wx.showToast({
                title: '您已经是店主了，正在跳转...',
                icon: 'none',
                mask: true,
                duration: 2000,
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/index/main',
                })
              }, 2000)
              return
            }
            this.$store.commit('setRefereeId', newArr[1] * 1)
            this.referee_id = newArr[1] * 1
            if (this.referee_id > 0) {
              this.getSurplusCode()
            }
          }
        }
      }
    }
    if (this.$root.$mp.query.hasOwnProperty('id')) {
      this.applyId = this.$root.$mp.query.id
      this.getLeaderCenter()
    }
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
.jx-address-editor {
  background-color: #fff;
  padding: 0 40rpx;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .refereeInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0 0 0;
    img {
      width: 160rpx;
      height: 160rpx;
      border: 3rpx solid white;
      border-radius: 50%;
      box-shadow: 0rpx 6rpx 3rpx 1rpx rgba(192, 192, 192, 0.3);
    }
    .name {
      font-family: PingFangSC-Regular;
      font-size: 28rpx;
      color: #0c101b;
      letter-spacing: 0;
      padding: 5px 0;
    }
    .tips {
      font-family: PingFangSC-Regular;
      font-size: 36rpx;
      color: #0c101b;
      letter-spacing: 0;
    }
  }
  .cell-group {
    margin-top: 40px;
    .van-cell {
      display: flex;
      align-items: flex-start;
    }
    .codeBtn {
      font-size: 28rpx;
      color: #ff4365;
    }
  }

  .jx-address-from {
    .jx-from-input {
      display: flex;
      justify-content: space-between;
      height: 100rpx;
      align-items: center;
      border-bottom: 1rpx solid #d0d0d0;
      font-size: 28rpx;
      .jx-input-box {
        width: 500rpx;
        color: #b8b8b8;
        .jx-input-switch {
          height: 40rpx;
          float: right;
        }
        .wx-switch-input {
          height: 40rpx !important;
          width: 85rpx !important;
          border-radius: 20rpx;
        }
        .wx-switch-input::before {
          height: 38rpx !important;
          width: 85rpx !important;
          border-radius: 20rpx;
        }
        /*绿色样式（true的样式）*/
        .wx-switch-input::after {
          height: 30rpx !important;
          width: 30rpx !important;
          margin-top: 3rpx;
        }
      }
    }
  }
  .jx-update-img {
    img {
      width: 126rpx;
      height: 126rpx;
      border-radius: 10rpx;
    }
  }
  .jx-address-btn {
    position: fixed;
    bottom: 20rpx;
    left: 0;
    width: 100%;
    .mini-btn {
      width: 669rpx;
      height: 88rpx;
      background-color: #ff4365;
      font-size: 34rpx;
      color: #fff;
      &.disabled {
        background-color: #666666;
      }
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
}
</style>
