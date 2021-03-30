<template>
  <div class="jx-products">
    <div class="jx-mini-products">
      <div class="parop_name">
        <img src="/static/icons/shop-car.png" alt="">
        <div v-if="prodName">
          {{prodName}}
        </div>
      </div>
      <div class="jx-new-price">
        <span style="font-size: 34rpx;">￥{{query.money / 100}}</span>
      </div>
    </div>
    <!-- <div class="jx-products-introduced jx-padding-left-right-20 jx-margin-bottom-20">
      <div class="jx-products-img">
        <swiper class="jx-swiper">
          <div class="jx-swiper-box">
            <swiper-item>
              <van-image fit="fill" width="100%" height="100%" src="http://cloudimg.jixiangyanxuan.com/system/buy.jpg" use-loading-slot lazy-load>
                <img slot="loading" :src="defaultImg2">
              </van-image>
            </swiper-item>
          </div>
        </swiper>
      </div>
      <div class="miniProdGroup">
        <div class="jx-products-text jx-text-displays-ellipses" v-if="prodName">
          {{prodName}}
        </div>
        <div class="jx-products-price" v-if="prodName">
          <div class="jx-new-price">
            <span style="font-size: 34rpx;">￥{{query.money / 100}}</span>
          </div>
        </div>
      </div>

    </div> -->
    <vueSpecificationModel v-if="specificationModel" :show.sync="specificationModel" :data="productsInfo" @buyGoods="buyGoodsEvent" @selectColorSize="selectColorSize" :money="selectGoods" :selectSpecification="selectSpecification" :goodsCountTotal="goodsCountTotal"></vueSpecificationModel>
    <div class="jx-products-footer">
      <div class="jx-products-footer-content">
        <div class="jx-user-operate-btn">
          <div class="jx-btn">
            <button class="mini-btn jx-mini-btn-shop" type="primary" size="mini" @click="payOrder">
              立即购买
            </button>
          </div>
        </div>
      </div>
      <div style="height: 30rpx;" v-if="isIphoneX"></div>
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
import vueSpecificationModel from '../../components/specification-model'
export default {
  data () {
    return {
      prodName: '',
      query: {},
      goodsCount: 1,
      isSubtracts: true,
      specificationModel: false,
      selectColor: '',
      selectSize: '',
      productsInfo: {
        isLose: false,
        shortage: false,
        name: '商品名称商品名称商品名称商品名称商品名称商品名称商品名商品名称商品名称商品名称商品名称商品名称商品名称商品名',
        newPrice: '50.00',
        oldPrice: '80.00',
        discounts: '1.8',
        maxCount: 15,
        color: [],
        size: [],
        attributeInfos: {},
      },
      goodsProductsImg: [],
      badgeCount: 0,
      attributeInfos: [],
      selectGoods: {
        attr_value_id: 0,
        goodsMoney: 0,
        oldGoodsMoney: 0,
      },
      productsId: '',
      btnType: '',
      selectSpecification: {},
      goodsCountTotal: 0,
      isIphoneX: false,
      loginDialogShow: false,
    }
  },
  components: {
    vueSpecificationModel,
  },
  computed: {
    ...mapGetters([
      'barTitle',
      'defaultImg2',
      'defaultLogo'
    ]),
  },
  methods: {
    payOrder () {
      this.loginDialogShow = false
      // let token = wx.getStorageSync('token')
      // if (!token) {
      //   this.loginDialogShow = true
      //   return
      // }
      wx.showLoading({
        title: '正在支付中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });

      const self = this;
      wx.login({
        success: (res) => {
          if (res.code) {
            self.$http
              .post({
                url: `/getwechatopenid/${res.code}`,
              })
              .then((data) => {
                if (data.code * 1 === 0) {
                  const result = data.data;
                  let json ={
                        app_id: this.query.from,
                        order_no: this.query.orderid,
                        product_name: this.query.name,
                        price: Number(this.query.money),
                        open_id: result,
                        userid:this.query.userid || ''
                  }
                  if(this.query.v == 2){
                    json['userid']= parseInt(this.query.userid);
                    json['goodstag']=this.query.goodstag;
                    json['v']=2;
                  }
                  self.$http
                    .post({
                      url: "/gameorder",
                      data: json,
                    })
                    .then((res) => {
                      if (res.code * 1 === 0) {
                        const data = res.data;
                        self.requestPayment(data);
                      } else {
                        wx.showToast({
                          title: res.msg,
                          icon: "none",
                        });
                      }
                    })
                    .catch((err) => {
                      wx.showToast({
                        title: err.errMsg,
                        icon: "none",
                      });
                    });
                } else {
                  wx.showToast({
                    title: "登录失败", //提示的内容,
                    icon: "none", //图标,
                    duration: 1000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                  });
                }
              });
          }
        },
      });


    },
    requestPayment (params) {
      let that = this
      wx.requestPayment({
        timeStamp: params.timeStamp.toString(),
        nonceStr: params.nonceStr,
        package: params.package,
        signType: 'MD5',
        paySign: params.paySign,
        success (res) {
          wx.navigateTo({
            url: '/pages/withdraw-status/main?status=1&game=1',
          })
        },
        fail (err) {
          that.$http.post({
            url: '/gamefialorder',
            data: {
              order_no: that.query.orderid,
              app_id: that.query.from,
            },
          }).then(data => {
            if (data.code * 1 == 0) {
              wx.navigateTo({
                url: '/pages/withdraw-status/main?status=0&game=1',
              })
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none', //图标,
              });
            }
          }).catch(err => {
            console.log(err, 'err')
            wx.showToast({
              title: err,
              icon: 'none', //图标,
            });
          })
        },
      })
    },
    initParams () {
      this.prodName = ''
      this.query = {}
      this.selectColor = ''
      this.selectSize = ''
      this.goodsCount = 1
      this.specificationModel = false
      this.selectGoods = {
        attr_value_id: 0,
        goodsMoney: 0,
        oldGoodsMoney: 0,
      }
      this.productsInfo = {
        isLose: false,
        shortage: false,
        name: '商品名称商品名称商品名称商品名称商品名称商品名称商品名商品名称商品名称商品名称商品名称商品名称商品名称商品名',
        newPrice: '50.00',
        oldPrice: '80.00',
        discounts: '1.8',
        maxCount: 15,
        color: [],
        size: [],
        attributeInfos: {},
      }
    },
    subtractsGoods () {
      if (this.goodsCount === 1) return
      this.goodsCount -= 1
      if (this.goodsCount === 1) this.isSubtracts = true
    },
    plusGoods () {
      if (this.goodsCountTotal === 0) {
        wx.showToast({
          title: '请选择商品规格', //提示的内容,
          duration: 1000,
          icon: 'none',
        });
        return
      }
      if (this.goodsCountTotal === this.goodsCount) {
        wx.showToast({
          title: '超出商品库存', //提示的内容,
          duration: 1000,
          icon: 'none',
        });
        return
      }
      this.goodsCount += 1
      this.isSubtracts = false
    },
    btnSkip (url) {
      wx.reLaunch({
        url: url,
      })
    },
    selectColorSize (value) {
      this.goodsCount = 1
      this.selectSpecification[value.key] = value.value
      this.setAttrValueId()
      this.$forceUpdate()
    },
    selectSpeValue () {
      const value = {}
      console.log(this.productsInfo.attributeInfos);
      for (let item in this.selectSpecification) {
        console.log(item);
        value[item] = {
          text: this.productsInfo.attributeInfos[item].text,
          value: this.selectSpecification[item],
        }
      }
      return value
    },
    buyGoodsEvent (standards) {
      let isSelect = false
      for (let item in this.selectSpecification) {
        if (this.selectSpecification[item] === '') isSelect = true
      }
      if (isSelect) {
        wx.showToast({
          title: '请选择商品类型', //提示的内容,
          duration: 1000,
          icon: 'none',
        })
        return
      }
      this.goodsCount = standards.count
      if (this.btnType === 'cart') {
        this.addOrdercard()
      } else if (this.btnType === 'buy') {
        const params = {
          specification: this.selectSpeValue(),
          count: this.goodsCount,
          attrValueId: this.selectGoods.attr_value_id,
          money: this.selectGoods.goodsMoney,
        }
        wx.navigateTo({
          url: `/pages/confirm-order/main?productsId=${this.productsId}&selectGoods=${JSON.stringify(params)}`,
        })
      }
    },
    userBuyGoods (type) {
      this.loginDialogShow = false
      let token = wx.getStorageSync('token')
      if (!token) {
        this.loginDialogShow = true
        return
      }
      this.btnType = type
      let isSelect = false
      for (let item in this.selectSpecification) {
        if (this.selectSpecification[item] === '') isSelect = true
      }
      if (isSelect) {
        this.specificationModel = true
        return
      }
      if (type === 'cart') {
        this.addOrdercard()
      } else if (type === 'buy') {
        const params = {
          specification: this.selectSpeValue(),
          count: this.goodsCount,
          attrValueId: this.selectGoods.attr_value_id,
          money: this.selectGoods.goodsMoney,
        }
        wx.navigateTo({
          url: `/pages/confirm-order/main?productsId=${this.productsId}&selectGoods=${JSON.stringify(params)}`,
        })
      }
    },
    gitProductsInfo () {
      wx.showLoading({
        title: '数据请求中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      })
      this.$http.get({
        url: `/goods/detail?product_id=${this.query.product_id}`,
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.productsInfo = data
          const endTimeArr = data.sale_end_time.replace(/-/g, '/')
          let now_time = data.server_time.replace(/-/g, '/')
          const endTime = +new Date(endTimeArr)
          const newTime = +new Date(now_time)
          this.productsInfo.isLose = endTime <= newTime
          this.selectSpecification = {}
          if (data.attribute_infos.length === 1) {
            this.productsInfo.attributeInfos = {}
            if (data.attribute_infos[0].attr_name1 !== '') {
              this.selectSpecification[data.attribute_infos[0].attr_id1] = data.attribute_infos[0].value_1
              this.productsInfo.attributeInfos[data.attribute_infos[0].attr_id1] = {
                key: data.attribute_infos[0].attr_id1,
                text: data.attribute_infos[0].attr_name1 ? data.attribute_infos[0].attr_name1 : '规格',
                list: [data.attribute_infos[0].value_1],
              }
            } else {
              this.selectSpecification[data.attribute_infos[0].attr_id1] = '默认'
              this.productsInfo.attributeInfos[data.attribute_infos[0].attr_id1] = {
                key: data.attribute_infos[0].attr_id1,
                text: data.attribute_infos[0].attr_name1 ? data.attribute_infos[0].attr_name1 : '规格',
                list: ['默认'],
              }
            }
            if (data.attribute_infos[0].attr_name2 !== '') {
              this.selectSpecification[data.attribute_infos[0].attr_id2] = data.attribute_infos[0].value_2
              this.productsInfo.attributeInfos[data.attribute_infos[0].attr_id2] = {
                key: data.attribute_infos[0].attr_id2,
                text: data.attribute_infos[0].attr_name2 ? data.attribute_infos[0].attr_name2 : '规格',
                list: [data.attribute_infos[0].value_2],
              }
            }
            if (!data.attribute_infos[0].hasOwnProperty('current_cnt') || !data.attribute_infos[0].current_cnt) {
              this.productsInfo.shortage = true
            } else {
              this.goodsCountTotal = data.attribute_infos[0].current_cnt
            }
            this.setAttrValueId()
          } else {
            this.specification(data.attribute_infos)
          }
          // if (data.attribute_infos.length === 1) {
          // 	this.selectColor = data.attribute_infos[0].value_1
          // 	this.selectSize = data.attribute_infos[0].value_2
          // }.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
          this.productsInfo.descript = this.productsInfo.descript.replace(/<img/gi, '<img style="max-width:100%;height:auto" ')
          this.attributeInfos = data.attribute_infos
          this.selectGoods.goodsMoney = data.price_range
        } else {
          console.log(res)
        }
      });
    },
    addOrdercard () {
      const params = {
        product_id: this.productsId * 1,
        attr_value_id: this.selectGoods.attr_value_id,
        product_amount: this.goodsCount,
      }
      wx.showLoading({
        title: '正在加入购物车...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      this.$http.post({
        url: '/ordercard/add',
        data: params,
      }).then(res => {
        wx.hideLoading()
        if (res.code * 1 === 0) {
          wx.showToast({
            title: '添加成功', //提示的内容,
            duration: 1000,
            icon: 'success',
          })
          this.specificationModel = false
        } else {
          wx.showToast({
            title: '添加失败', //提示的内容,
            duration: 1000,
            icon: 'none',
          });
          console.log(res)
        }
        // setTimeout(() => {
        // 	this.getOrdercardList()
        // }, 1000);
      });
    },
    getOrdercardList () {
      this.initParams()
      this.$http.get({
        url: `/ordercard/list`,
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          let count = 0
          if (data) {
            data.map(item => {
              count += item.order_product.reduce((total, current) => {
                return total + current.product_amount
              }, 0)
            })
          }
          this.$store.commit('setCartSum', count)
          this.badgeCount = this.$store.state.cartSum
          this.gitProductsInfo()
        } else {
          console.log(res)
        }
      });
    },
    specification (list) {
      this.productsInfo.attributeInfos = {}
      if (list[0].attr_name1 !== '') {
        this.selectSpecification[list[0].attr_id1] = ''
        this.productsInfo.attributeInfos[list[0].attr_id1] = {
          key: list[0].attr_id1,
          text: list[0].attr_name1,
          list: [],
        }
      }
      if (list[0].attr_name2 !== '') {
        this.selectSpecification[list[0].attr_id2] = ''
        this.productsInfo.attributeInfos[list[0].attr_id2] = {
          key: list[0].attr_id2,
          text: list[0].attr_name2,
          list: [],
        }
      }
      list.map(item => {
        if (item.attr_id1 && this.productsInfo.attributeInfos[item.attr_id1].list.indexOf(item.value_1) === -1) {
          this.productsInfo.attributeInfos[item.attr_id1].list.push(item.value_1)
        }
        if (this.productsInfo.attributeInfos.hasOwnProperty(item.attr_id2)) {
          if (item.attr_id2 !== '' && this.productsInfo.attributeInfos[item.attr_id2].list.indexOf(item.value_2) === -1) {
            this.productsInfo.attributeInfos[item.attr_id2].list.push(item.value_2)
          }
        }
      })
    },
    setAttrValueId () {
      this.attributeInfos.map(item => {
        if (this.selectSpecification.hasOwnProperty(item.attr_id1) && this.selectSpecification.hasOwnProperty(item.attr_id2)) {
          if (item.value_1 === this.selectSpecification[item.attr_id1] && item.value_2 === this.selectSpecification[item.attr_id2]) {
            this.selectGoods.attr_value_id = item.attr_value_id
            this.selectGoods.goodsMoney = (item.price + item.premium_price) / 100
            this.goodsCountTotal = item.current_cnt * 1
            if (!item.current_cnt || item.current_cnt === 0) {
              this.productsInfo.shortage = true
            } else {
              this.productsInfo.shortage = false
            }
          }
        } else {
          if (item.value_1 === this.selectSpecification[item.attr_id1]) {
            this.selectGoods.attr_value_id = item.attr_value_id
            this.selectGoods.goodsMoney = (item.price + item.premium_price) / 100
            this.goodsCountTotal = item.current_cnt * 1
            if (!item.current_cnt || item.current_cnt === 0) {
              this.productsInfo.shortage = true
            } else {
              this.productsInfo.shortage = false
            }
          }
        }
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
        // console.log(`后台交互拿回数据:`,res);
        if (data.code * 1 === 0) {
          const res = data.data
          wx.setStorageSync('token', res.token)
          wx.setStorageSync('userid', res.user_id)
          wx.setStorageSync('openId', res.open_id)
          this.$http.get({
            url: '/getuserinfo',
          }).then(res => {
            if (res.code * 1 === 0) {
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
              this.payOrder()
            } else {
              console.log(res);
            }
          })
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
  },
  onLoad (option) {
    let query = this.$root.$mp.query
    if (query.hasOwnProperty('from')) {
      this.prodName = decodeURIComponent(query.name)
      this.query = query
      this.payOrder()
    } else {
      wx.showToast({
        title: '缺少参数',
        duration: 1000,
        icon: 'none',
      })
    }
  },
  onUnload () {
    this.initParams()
  },
}
</script>

<style lang="scss" scope>
page {
  background: white;
  box-sizing: border-box;
}
.loginDialogWrap {
  .weui-dialog__bd {
    display: flex;
    align-items: center;
  }
}
.jx-products {
  background: white;

  & > div {
    background-color: #ffffff;
    width: 100%;
    box-sizing: border-box;
  }
  .jx-products-introduced {
    width: 100%;
    box-sizing: border-box;
    .jx-products-img {
      margin-bottom: 48rpx;
      position: relative;
      .jx-is-lose {
        width: 395rpx;
        height: 395rpx;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 147rpx;
        z-index: 88;
      }
      .jx-swiper-box,
      .jx-swiper {
        border-radius: 20rpx;
        height: 690rpx;
        overflow: hidden;
      }
      img {
        border-radius: 20rpx;
      }
    }
    .miniProdGroup {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-bottom: 10px;
      padding-top: 10px;
    }
    .jx-products-text {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #333;
      font-size: 40rpx;
      box-sizing: border-box;
      word-break: break-all;
      box-sizing: border-box;
      padding-right: 10px;
    }
    .jx-products-price {
      display: flex;
      justify-content: space-between;
      color: #eb556a;
      font-size: 18rpx;
      align-items: flex-end;
      .jx-radius-pink {
        padding: 0 13rpx;
        height: 30rpx;
        line-height: 30rpx;
        background-color: #fae6e6;
        border-radius: 15rpx;
        margin: 0 10rpx 0 20rpx;
      }
      .jx-old-price {
        font-size: 24rpx;
        color: #9e9e9e;
      }
    }
  }
  .jx-products-select-size {
    width: 100%;
    height: 562rpx;
  }
  .jx-title-products {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
  }
  .jx-explains-products {
    .jx-title-products {
      margin-bottom: 20rpx;
    }
    .jx-explains-text {
      font-size: 28rpx;
      color: #8d8d8d;
      padding-bottom: 38rpx;
    }
  }
  .jx-goods-products {
    padding-left: 15rpx;
    padding-right: 15rpx;
    padding-bottom: 150rpx;
    margin-bottom: 0;
    &-img {
      width: 100%;
      img {
        margin-bottom: 20rpx;
        width: 100%;
        height: auto;
      }
    }
    .jx-buyer-reading {
      margin-left: 10rpx;
      margin-right: 10rpx;
      border-radius: 20rpx;
      padding-bottom: 45rpx;
      margin-top: 20rpx;
      border: 2rpx solid #eeeeee;
      &-title {
        font-size: 32rpx;
        text-align: center;
        color: #333333;
        padding-top: 22rpx;
        padding-bottom: 15rpx;
        border-bottom: 2rpx solid #eeeeee;
        font-weight: bold;
      }
      &-content {
        color: #666666;
        font-size: 26rpx;
        padding: 40rpx 20rpx 0;
        letter-spacing: 2rpx;
      }
    }
  }
}
.jx-padding-left-right-20 {
  padding-right: 20rpx;
  padding-left: 20rpx;
}
.jx-margin-bottom-20 {
  margin-bottom: 20rpx;
}
.jx-products-footer {
  position: fixed;
  z-index: 20;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  padding-left: 30rpx;
  padding-right: 30rpx;
  .jx-products-footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 125rpx;
  }
  .jx-navbar-home {
    width: 200rpx;
    display: flex;
    justify-content: space-between;
    font-size: 22rpx;
    color: #999999;
    .jx-shopping-cart {
      position: relative;
      .weui-badge {
        position: absolute;
        top: -5rpx;
        right: -5rpx;
      }
    }
    img {
      height: 54rpx;
      width: 54rpx;
      display: block;
    }
  }
  .jx-user-operate-btn {
    .jx-btn {
      display: flex;
    }
    .mini-btn {
      width: 375rpx;
      height: 90rpx;
      color: #fff;
      font-size: 32rpx;
      line-height: 90rpx;
      border-radius: 0;
    }
    .jx-mini-btn-asc {
      background-color: #edbc45;
      border-top-left-radius: 45rpx;
      border-bottom-left-radius: 45rpx;
      margin-right: 2rpx;
      padding: 0;
    }
    .jx-mini-btn-shop {
      background-color: #ff4365;
      border-radius: 45rpx;
      float: right;
    }
    .jx-mini-btn-no {
      width: 438rpx;
      border-radius: 45rpx;
      background-color: #989898;
    }
  }
  .jx-goods-products-img {
    overflow: hidden;
    width: 100%;
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

.jx-products-footer {
  position: fixed;
  z-index: 20;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  .jx-products-footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 125rpx;
  }
  .jx-navbar-home {
    width: 200rpx;
    display: flex;
    justify-content: space-between;
    font-size: 22rpx;
    color: #999999;
    .jx-shopping-cart {
      position: relative;
      .weui-badge {
        position: absolute;
        top: -5rpx;
        right: -5rpx;
      }
    }
    img {
      height: 54rpx;
      width: 54rpx;
      display: block;
    }
  }
  .jx-user-operate-btn {
    .jx-btn {
      display: flex;
    }
    .mini-btn {
      width: 375rpx;
      height: 90rpx;
      color: #fff;
      font-size: 32rpx;
      line-height: 90rpx;
      border-radius: 0;
    }
    .jx-mini-btn-asc {
      background-color: #edbc45;
      border-top-left-radius: 45rpx;
      border-bottom-left-radius: 45rpx;
      margin-right: 2rpx;
      padding: 0;
    }
    .jx-mini-btn-shop {
      background-color: #ff4365;
      border-radius: 45rpx;
      float: right;
    }
    .jx-mini-btn-no {
      width: 438rpx;
      border-radius: 45rpx;
      background-color: #989898;
    }
  }
  .jx-goods-products-img {
    overflow: hidden;
    width: 100%;
  }
}

.jx-mini-products {
  padding-top: 40%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .parop_name {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 40rpx;
    img {
      width: 60rpx;
      height: 60rpx;
    }
    div {
      padding-left: 10px;
    }
  }
  .jx-new-price {
    color: #ff4365;
    padding: 10px 0;
  }
}
</style>
