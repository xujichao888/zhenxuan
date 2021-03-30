<template>
  <div class="jx-tuan-poster">
    <!-- " v-bind:class="{'swiper-ipx': isIpx}"-->
    <div class="jx-swiper-box" v-bind:class="{'jx-swiper-box-ipx': isIpx}">
      <swiper interval="2000" duration="500" @change="swiperChange" v-bind:class="{'swiper-ipx': isIpx}">
        <div v-for="(item, index) in posterSave" :key="index">
          <swiper-item>
            <img :src="item" alt="" mode="scaleToFill">
          </swiper-item>
        </div>
      </swiper>
      <div class="jx-indicator-dots">
        <div :class="['jx-indicator-dots-item', currentIndex * 1 === index ? 'jx-indicator-dots-item-active': '']" v-for="(item, index) in posterSave" :key="index"></div>
      </div>
    </div>
    <div class="jx-btn">
      <button class="jx-save-img" @click="saveStatementImage">保存手机</button>
      <button class="jx-share-btn" open-type="share">分享好友</button>
    </div>
    <div class="jx-top-888">
      <painter :dirty="true" :customStyle="customStyle" @imgOK="onImgOk" :palette="template" />
      <canvas style="width: 240px; height: 240px;" canvas-id="canvasId"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSuccess: false,
      poster: [
        '/static/images/porter.jpg',
        // '/static/images/statement.jpg',
        // '/static/images/statement.jpg',
      ],
      posterSave: [],
      shareImg: '',
      currentIndex: 0,
      template: {},
      codeImgUrl: '',
      isIpx: false,
    }
  },
  methods: {
    homeBack () {
      wx.switchTab({
        url: '/pages/index/main',
      })
    },
    swiperChange (e) {
      this.shareImg = this.posterSave[e.mp.detail.current]
      this.currentIndex = e.mp.detail.current
    },
    saveStatementImage () {
      const _this = this
      if (this.currentIndex === 0) {
        this.shareImg = this.posterSave[this.currentIndex]
      }
      wx.saveImageToPhotosAlbum({
        filePath: _this.shareImg,
        success (res) {
          if (res.errMsg === 'saveImageToPhotosAlbum:ok') {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
            });
          } else {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
            });
          }
        },
        fail (error) {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
          });
          console.log(error)
        },
      })
    },
    getAccessToken (url) {
      if (this.isClick) return
      this.isClick = true
      wx.showLoading({
        title: '加载数据中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      this.$http.get({
        url: '/accesstoken',
      }).then(res => {
        console.log(res);
        if (res.code * 1 === 0) {
          this.getWXCode(res.data.access_token, url)
        }
      })
    },
    getWXCode (token, url) {
      const _this = this
      let leader = _this.$store.state.leader * 1
      let userid = wx.getStorageSync('userid')
      if (userid == '' || !userid) userid = 0
      wx.request({
        // step1
        url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + token,
        method: 'POST',
        data: JSON.stringify({
          path: `${_this.path}&leader=${leader}&userid=${userid}`,
          width: 280,
        }),
        responseType: 'arraybuffer',
        success (res) {
          console.log(res)
          // wx.getFileSystemManager().readFile({
          // 	filePath: '/static/images/wxcode.png', //选择图片返回的相对路径
          // 	encoding: 'base64', //编码格式
          // 	success: res => { //成功的回调
          // 		_this.qrCodeUrl = res.data
          // 		var save = wx.getFileSystemManager();
          // 		var number = Math.random();
          // 		save.writeFile({
          // 			filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
          // 			data: _this.qrCodeUrl,
          // 			encoding: 'base64',
          // 			success: res => {
          // 				console.log(res);
          // 				_this.codeImgUrl = wx.env.USER_DATA_PATH + '/pic' + number + '.png'
          // 				_this.getCodeImg(url)
          // 			}, fail: err => {
          // 				console.log(err)
          // 			},
          // 		})
          // 	},
          // })
          console.log(wx.arrayBufferToBase64(res.data))
          _this.qrCodeUrl = wx.arrayBufferToBase64(res.data);//res.data
          var save = wx.getFileSystemManager();
          var number = Math.random();
          save.writeFile({
            filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
            data: _this.qrCodeUrl,
            encoding: 'base64',
            success: res => {
              console.log(res);
              _this.codeImgUrl = wx.env.USER_DATA_PATH + '/pic' + number + '.png'
              _this.getCodeImg(url)
            }, fail: err => {
              console.log(err)
            },
          })
        },
        complete: function () {
          wx.hideLoading()
        },
      })
    },
    getCodeImg (url) {
      this.save(url)
    },
    onImgOk (e) {
      wx.showLoading({
        title: '正在生成中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      })
      // this.shareImg = e.mp.detail.path  // 生成的图片路径
      this.posterSave.push(e.mp.detail.path)
      this.template = {} // 重置,下次点击生成时重新生成
      wx.hideLoading()
    },
    save (url) {
      // 绘制样式
      const _this = this
      let views = []
      wx.getSystemInfo({
        success (system) {
          // eslint-disable-next-line no-console
          console.log(`system:`, system);
          const screenHeight = system.screenHeight
          const screenWidth = system.screenWidth
          const pixelRatio = system.pixelRatio
          const statusBarHeight = system.statusBarHeight
          const fontSizeSetting = system.fontSizeSetting
          const userInfo = _this.$store.state.userInfo
          let avatarUrl = ''
          if (JSON.stringify(userInfo) !== '{}') {
            avatarUrl = userInfo.avatarUrl
          } else {
            avatarUrl = wx.getStorageSync('avatarUrl')
          }
          views = [
            {
              type: 'image',
              url: avatarUrl,
              css: {
                top: 55 * (pixelRatio / 2) + statusBarHeight + 'rpx',
                left: 90 * (pixelRatio / 2) + 'rpx',
                width: 130 * (pixelRatio / 2) + 'rpx',
                height: 130 * (pixelRatio / 2) + 'rpx',
                borderRadius: 130 * (pixelRatio / 2) / 2 + 'rpx',
                borderWidth: '8rpx',
                borderColor: '#fff',
              },
            },
          ]
          views.push({
            type: 'image',
            url: _this.codeImgUrl,
            css: {
              bottom: 282 * (pixelRatio / 2) + statusBarHeight + 'rpx',
              left: ((screenWidth + fontSizeSetting) * pixelRatio) / 2 - (165 * (pixelRatio / 2)) / 2 + 'rpx',
              width: 165 * (pixelRatio / 2) + 'rpx',
              height: 165 * (pixelRatio / 2) + 'rpx',
            },
          })

          let bgUrl = url
          _this.template = {
            background: bgUrl,
            width: (screenWidth + fontSizeSetting) * pixelRatio + 'rpx',
            height: (screenHeight + statusBarHeight) * pixelRatio + 'rpx',
            views: views,
          }
          _this.$forceUpdate()
        },
      });
    },
  },
  created () {

  },
  mounted () {
    // this.shareImg = this.poster[0]
    this.posterSave = []
    this.poster.map(item => {
      if (this.codeImgUrl) {
        this.save(item)
      } else {
        this.getAccessToken(item)
      }
    })

  },
  onLoad () {
    var _this = this
    let model = ['iPhone X', 'iPhone XR', 'iPhone XS Max', 'iPhone11', 'iPhone11 pro', 'iphone11 pro Max']
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model);
        console.log(model.indexOf(res.model));
        if (res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone11') > -1) {
          console.log('if = ' + res.model.indexOf('iPhone X'))
          _this.isIpx = true;
        }
      },
    })
    console.log(this.isIpx)
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
      path: '/pages/index/main?leader=' + leader + '&userid=' + userid,
      imgUrl: this.shareImg,
      success: function (res) {
        // 转发成功之后的回调
        console.log(res);
        wx.showToast({
          title: '分享成功',
          icon: 'none',
        });
        console.log(res);
        // if (res.errMsg == 'shareAppMessage:ok') {
        //   _this.dialogShow = false
        //   console.log(_this.dialogShow);
        // }
      },
      fail: function (err) {
        // 转发失败之后的回调
        // if (res.errMsg == 'shareAppMessage:fail cancel') {
        // // 用户取消转发
        // } else if(res.errMsg == 'shareAppMessage:fail') {
        // // 转发失败，其中 detail message 为详细失败信息
        // }
        console.log(err);
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
.jx-tuan-poster {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  .jx-top-888 {
    position: absolute;
    bottom: -10000rpx;
  }
  swiper {
    height: 991rpx;
  }
  .swiper-ipx {
    height: 1190rpx;
  }
  .jx-swiper-box {
    height: 1037rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 23rpx 100rpx;
    background-color: #000000;
    position: relative;
  }
  .jx-swiper-box-ipx {
    height: 1290rpx;
    width: 100%;
    box-sizing: border-box;
    padding: 23rpx 100rpx;
    background-color: #000000;
    position: relative;
  }
  ._swiper-item {
    box-sizing: border-box;
  }
  .jx-btn {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 40rpx;
    box-sizing: border-box;
    margin-top: 50rpx;
    font-size: 34rpx;
    ._button {
      height: 90rpx;
      padding: 0;
      margin: 0;
      width: 321rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
    }
    .jx-share-btn {
      background-color: #ff4365;
      color: #fff;
    }
    .jx-save-img {
      background-color: #fff;
      border: 1rpx solid #ff4365;
      color: #ff4365;
    }
  }
  .jx-indicator-dots {
    position: absolute;
    bottom: 35rpx;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    .jx-indicator-dots-item {
      width: 15rpx;
      height: 15rpx;
      border-radius: 50%;
      background-color: #ffffff;
      margin-right: 10rpx;
    }
    .jx-indicator-dots-item-active {
      background-color: #ffe673;
    }
  }
}
</style>
