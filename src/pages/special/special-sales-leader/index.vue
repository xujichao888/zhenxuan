<template>
  <div class="jx-special-sales jx-body" v-if="isIn">
    <JXheader :bg-img="false" titleColor="black" title="品牌特卖"></JXheader>
    <div class="jx-brand-name">
      <div class="jx-brand-name-wrap">
        <div class="jx-brand-bg">
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
                <button class="mini-btn jx-brown-mini-btn" type="primary" size="mini" @click="goSpecialSet">
                  设置会场
                </button>
                <button class="mini-btn" type="primary" size="mini" v-if="isNotSalesEnd" @click="shareOpen(`pages/special/special-sales/main?brandId=${brandId}`, 2)">
                  分享会场
                </button>
              </div>
            </div>
            <div class="jx-brand-explan">
              {{brandInfo.sale_content}}
            </div>
            <div class="jx-on-sale-time jxDowmTime_special_sales_leader" v-if="isNotSalesEnd">
              <span>距离结束</span>
              <van-count-down use-slot :time="brandInfo.countDownText" @finish="isNotSalesEnd = false" @change="onChangeTime">
                <div class="timeGroup">
                  <span class="days color">{{ timeData.days }}天</span>
                  <span class="hour itme">{{ timeData.hours }}</span>
                  <span class="color">:</span>
                  <span class="minute itme">{{ timeData.minutes }}</span>
                  <span class="color">:</span>
                  <span class="second itme">{{ timeData.seconds }}</span>
                </div>
              </van-count-down>
            </div>
            <div class="jx-on-sale-time" v-else>
              <span>已结束</span>
            </div>
          </div>
        </div>
        <div class="jx-search-list" v-if="commoditiesList.length !== 0">
          <div v-for="(item, index) in commoditiesList" :key="index" class="jx-search-list-item">
            <div class="jx-search-list-top">
              <div class="jx-search-list-item-img" @click="goProducts(item.id)">
                <van-image fit="fill" width="100%" height="100%" :src="item.pic_url" use-loading-slot lazy-load>
                  <img slot="loading" :src="defaultImg2">
                </van-image>
              </div>
              <div class="jx-search-list-top-pric" @click="goProducts(item.id)">
                <div>
                  <div class="jx-search-list-item-text">
                    {{item.product_name}}
                  </div>
                  <div class="jx-search-list-item-sales">
                    销量{{item.sale_num}}
                  </div>
                </div>
                <div class="jx-search-list-item-rate">
                  <div>
                    <span v-if="item.price">￥{{(item.price + item.premium_price) / 100}}</span>
                    <span v-else>￥0.00</span>
                    <span class="text">销售价</span>
                  </div>
                  <div>
                    <span v-if="item.self_price">￥{{item.self_price / 100}}</span>
                    <span v-else>￥0.00</span>
                    <span class="text">供货价</span>
                  </div>
                  <div v-if="item.pre_price">
                    <span class="jx-search-list-item-oldrate">￥{{item.pre_price / 100}}</span>
                    <span class="rebate">{{item.reckon_rebate}}折</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="jx-search-list-footer">
              <div class="add btn" @click="showAction(item.id)">加价</div>
              <div class="right">
                <div class="selfBuy btn" @click="selfBuyHandle(item)">自购( 省 {{item.reckon_self_buy}} )</div>
                <div class="share btn" @click="shareOpen(`pages/products/main?productsId=${item.id}`, 3, item)">分享赚( {{item.share_make}} )</div>
              </div>
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
    <vueShareModel :show.sync="shareDialogShow" :type="shareType" :path="sharePath" :brandInfo="brandInfo" :goodsInfo="goodsInfo"></vueShareModel>
    <van-action-sheet :show="actionSheetShow" zIndex="10001" title="修改商品售价" @close="closeActionSheet">
      <div class="actionSheetCentent">
        <div class="beforAddPric" v-if="beforAddPric > 0">上次加价:￥{{beforAddPric}}</div>
        <v-radio-group :actionSheetShow="actionSheetShow" :customPric.sync="customPric" :radioList="radioList" :premium_money.sync="premium_money" :type.sync="radioType" @noError="noError"></v-radio-group>
        <div class="tips">
          注：加价后，该品牌的每个商品都在建议销售价的基础上，加上加价金额，单个品牌设置的加价只针对该品牌生效
        </div>
        <div class="addRpricBtn" @click="setAddPric">保存</div>
      </div>
    </van-action-sheet>
    <goods-action-sheet :show="buyModalShow" @close="buyModalClose" :goods="goodsInfo" @result="result" :value.sync="actionSheetVal" @buyHandle="buyHandle" @addHandle="addHandle" :max.sync="max">
    </goods-action-sheet>
    <mp-dialog title=" " ext-class="loginDialogWrap" :show="loginDialogShow" bindbuttontap="tapDialogButton" :buttons="dialogButtons">
      <div class="js-login-dialog">
        <p><img class="dialog-logo" :src="defaultLogo"></p>
        <p class="dialog-text-black"> {{barTitle}}申请获得以下权限：</p>
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
import { accMul } from '../../../utils'
import goodsActionSheet from '../../../components/goodsActionSheet'
import JXheader from '../../../components/header'
import vRadioGroup from '../../../components/vRadioGroup'
import vueShareModel from '../../../components/share-model'
import { countDown } from '../../../utils/index'
export default {
  data () {
    return {
      isIn: false,
      sale_id: 0,
      timeData: {},
      max: 1000000,
      goodsInfo: {},
      shareType: 2,
      resultDta: {},
      actionSheetVal: 1,
      buyModalShow: false,
      loginDialogShow: false,
      sharePath: '',
      beforAddPric: 0,
      customPric: '',
      premium_money: '0',
      radioList: [
        {
          id: "0",
          value: "",
          label: "不加价",
        },
        {
          id: "500",
          value: "5.00",
          label: "加价￥",
        },
        {
          id: "1000",
          value: "10.00",
          label: "加价￥",
        },
        {
          id: "-1",
          value: "",
          label: "自定义加价￥",
          error: false,
        },
      ],
      actionSheetShow: false,
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
    }
  },
  components: {
    JXheader,
    vueShareModel,
    vRadioGroup,
    goodsActionSheet,
  },
  onHide () {
    this.shareDialogShow = false
    this.buyModalShow = false
  },
  computed: {
    ...mapGetters([
      'barTitle',
      'defaultImg2',
      'defaultLogo'
    ]),
  },
  watch: {
    commoditiesList: {
      handler (list) {
        for (let i = 0; i < list.length; i++) {
          let rebate = (list[i].price + list[i].premium_price) / (list[i].pre_price) * 10
          list[i].reckon_rebate = isNaN(rebate) ? '-' : rebate.toFixed(2)
          list[i].reckon_self_buy = ((list[i].price - list[i].self_price) / 100).toFixed(2)
          list[i].share_make = ((list[i].price + list[i].premium_price - list[i].self_price) / 100).toFixed(2)
        }
      },
      deep: true,
    },
  },
  methods: {
    onChangeTime (e) {
      this.timeData = e.mp.detail
    },
    buyHandle (data) {
      const params = {
        specification: this.selectSpeValue(),
        count: this.actionSheetVal == 0 ? 1 : this.actionSheetVal,
        attrValueId: this.resultDta.attr_value_id,
        money: (this.resultDta.self_price > 0 ? this.resultDta.self_price : this.resultDta.price + this.resultDta.premium_price) / 100,
      }
      wx.navigateTo({
        url: `/pages/confirm-order/main?productsId=${this.product_id}&selectGoods=${JSON.stringify(params)}`,
      })
    },
    selectSpeValue () {
      const value = {}
      let _d = this.goodsInfo.attributeInfos
      value[1] = {
        text: this.resultDta.attr_name1,
        value: this.resultDta.value_1,
      }
      if (this.resultDta.value_2) {
        value[2] = {
          text: this.resultDta.attr_name2,
          value: this.resultDta.value_2,
        }
      }
      return value
    },
    addHandle (data) {
      const params = {
        product_id: this.product_id * 1,
        attr_value_id: this.resultDta.attr_value_id * 1,
        product_amount: this.actionSheetVal * 1 === 0 ? 1 : this.actionSheetVal * 1,
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
          this.buyModalClose()
          wx.showToast({
            title: '添加成功', //提示的内容,
            duration: 1000,
            icon: 'success',
          })
        } else {
          wx.showToast({
            title: '添加失败', //提示的内容,
            duration: 1000,
            icon: 'none',
          });
          console.log(res)
        }
      });
    },
    result (data) {
      this.resultDta = data
    },
    selfBuyHandle (item) {
      this.product_id = item.id
      this.loginDialogShow = false
      let token = wx.getStorageSync('token')
      if (!token) {
        this.loginDialogShow = true
        return
      }
      wx.showLoading({
        title: '数据请求中...',
        mask: true,
      });
      this.$http.get({
        url: `/goods/detail?product_id=${item.id}`,
      }).then(res => {
        wx.hideLoading()
        if (res.code * 1 === 0) {
          let data = res.data
          if (data.attribute_infos) {
            for (let i = 0; i < data.attribute_infos.length; i++) {
              data.attribute_infos[i].price += item.premium_price
            }
          }
          if (!data.attribute_infos) {
            data.attribute_infos = [{
              attr_name1: "规格",
              value_1: "默认",
            }]
          } else if (data.attribute_infos.length === 1 && data.attribute_infos[0].attr_name1 === "") {
            data.attribute_infos[0].attr_name1 = "规格"
            data.attribute_infos[0].value_1 = "默认"
          }
          this.goodsInfo = data
          this.buyModalShow = true
        } else {
          console.log(res)
          wx.showToast({
            title: '商品信息获取失败',
            icon: 'none',
          });
        }
      });
    },
    buyModalClose () {
      this.buyModalShow = false
      this.goodsInfo = {}
      this.actionSheetVal = 1
      this.max = 1000000
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
    shareOpen (path, type, item) {
      this.shareType = type
      this.sharePath = `${path}`
      if (type === 2) this.goodsInfo = {}
      else {
        this.$http.get({
          url: `/goods/detail?product_id=${item.id}`,
        }).then(res => {
          if (res.code * 1 === 0) {
            item.goodsUrl = res.data.product_img
            this.goodsInfo = item
          } else {
            console.log(res)
          }
        });
      }
      this.shareDialogShow = true
    },
    noError (noOff) {
      let _c = this.radioList.find(item => item.id === "-1")
      _c.error = noOff
    },
    setAddPric () {
      if (this.premium_money === "-1") {
        if (this.customPric === '') {
          wx.showToast({
            title: '请输入加价金额',
            icon: 'none',
          });
          this.noError(true)
          return
        }
        let reg = /^([1-9]\d{1,9}|\d)(.\d{1,2})?$/
        if (!reg.test(this.customPric)) {
          wx.showToast({
            title: '输入错误',
            icon: 'none',
          });
          this.noError(true)
          return
        }
        if (this.customPric > 30) {
          wx.showToast({
            title: '加价金额不能大于30',
            icon: 'none',
          });
          this.noError(true)
          return
        }
      } else {
        this.noError(false)
        this.customPric = ""
      }
      this.addProdPric({ premium_money: this.premium_money === '-1' ? accMul(this.customPric, 100) : Number(this.premium_money) })
    },
    addProdPric ({ premium_money }) {
      wx.showLoading({
        title: '加载数据中...',
        mask: true,
      });
      this.$http.post({
        url: '/premium/product',
        data: { premium_money, product_id: Number(this.current_product_id) },
      }).then(res => {
        wx.hideLoading()
        if (res.code * 1 === 0) {
          wx.showToast({
            title: '保存成功！', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
          let item = this.commoditiesList.find(item => item.id === this.current_product_id)
          item.premium_price = premium_money
          item.share_make = ((item.price + premium_money - item.self_price) / 100).toFixed(2)
          this.closeActionSheet()
        } else {
          wx.showToast({
            title: '保存失败！', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
        }
      })
    },
    showAction (id) {
      this.loginDialogShow = false
      let token = wx.getStorageSync('token')
      if (!token) {
        this.loginDialogShow = true
        return
      }
      this.current_product_id = id
      this.actionSheetShow = true
      this.$http.get({
        url: `/premium/getGoods`,
        data: { product_id: id },
      }).then(res => {
        if (res.code * 1 === 0) {
          this.beforAddPric = res.data && res.data ? (res.data / 100).toFixed(2) : 0
        } else {
          console.log(res);
        }
      });
    },
    closeActionSheet () {
      this.noError(false)
      this.premium_money = '0'
      this.customPric = ''
      this.actionSheetShow = false
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
      wx.navigateTo({ url: `/pages/products-leader/main?productsId=${productsId}&brandInfo=${JSON.stringify(this.brandInfo)}` });
    },
    goSpecialSet (productsId) {
      wx.navigateTo({ url: `/pages/special/special-sales-set/main?brandId=${this.sale_id}` });
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
          this.sale_id = data.sale_id
          this.endTimeCountDown()
        } else {
          console.log(res);
        }
      });
    },
    getBrandProductUpdate () {
      this.page = 1
      this.getBrandProduct()
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
            this.commoditiesList = data.map(item => {
              let rebate = (item.price + item.premium_price) / (item.pre_price) * 10
              return {
                ...item,
                reckon_rebate: isNaN(rebate) ? '-' : rebate.toFixed(2),
                reckon_self_buy: ((item.price - item.self_price) / 100).toFixed(2),
                share_make: ((item.price + item.premium_price - item.self_price) / 100).toFixed(2),
              }
            })
          } else {
            if (!data || data.length <= 10) {
              setTimeout(() => {
                this.bottomText = true
              }, 1000);
              return
            }
            this.bottomText = false
            data.map(item => {
              let rebate = (item.price + item.premium_price) / (item.pre_price) * 10
              this.commoditiesList.push({
                ...item,
                reckon_rebate: isNaN(rebate) ? '-' : rebate.toFixed(2),
                reckon_self_buy: ((item.price - item.self_price) / 100).toFixed(2),
                share_make: ((item.price + item.premium_price - item.self_price) / 100).toFixed(2),
              })
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
  onLoad (option) {
    if (!this.$mp.page.refreshPage) {
      this.$mp.page.refreshPage = this.getBrandProductUpdate
    }
    if (option.brandId) {
      if (option.hasOwnProperty('leader')) {
        this.$store.commit('setLeader', option.leader * 1)
        this.$store.commit('setShareUserId', option.userid * 1)
      }
      this.brandId = option.brandId
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
    if (isLeader == '' || isLeader != 2) {
      wx.redirectTo({ url: `/pages/special/special-sales/main?brandId=${this.brandId}` });
    } else {
      this.getBrandInfo()
      this.getBrandProduct()
    }
  },
  onUnload () {
    this.shareDialogShow = false
    this.loginDialogShow = false
    clearInterval(this.createInterval)
  },
  onReachBottom () {
    if (this.bottomText || this.classifyListContent.length < 10) {
      this.loadingShow = false
      this.bottomText = true
      return
    }
    this.page += 1
    this.loadingShow = true
    this.getBrandProduct(1, this.$root.$mp.query.brandId)
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
.loginDialogWrap {
  .weui-dialog__bd {
    display: flex;
    align-items: center;
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
.jx-shopingCart-input-count {
  display: inline-block;
  width: 196rpx;
  height: 40rpx;
  line-height: 40rpx;
  border-radius: 10rpx;
  border: 2rpx solid #e5e5e5;
  overflow: hidden;
  display: flex;
  align-items: center;
  .jx-input-count {
    display: inline-block;
    height: 100%;
    text-align: center;
    line-height: 40rpx;
  }
  .jx-subtracts,
  .jx-plus {
    width: 55rpx;
    background-color: #f6f6f6;
    color: #bcbcbc;
    .jx-allow {
      color: #6e6e6e;
      background-color: #e6e6e6;
    }
  }
  .jx-count {
    width: 88rpx;
  }
}
.jx-body {
  padding-bottom: 0;
}
.jx-brand-name {
  padding-top: 205rpx;
  position: relative;
}
.jx-brand-name-bg {
  width: 100%;
  height: 338rpx;
}
.jx-brand-name-wrap {
  position: absolute;
  top: 185rpx;
  left: 0;
  right: 0;

  .jx-card {
    border-radius: 0;
    .jx-on-sale-info-img {
      border-radius: 0;
    }
  }
}
.jx-brand-bg {
  background: linear-gradient(to right, #efd3b6, #dfb58f);
  margin-bottom: 15rpx;
}
.jx-brand-name-content {
  background: white;
  margin: auto;
  width: 694rpx;
  // height: 347rpx;
  box-sizing: border-box;
  padding: 20rpx 20rpx 0;
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
    word-wrap: break-word;
    padding-bottom: 10px;
  }
  .jx-on-sale-time {
    border-top: 1rpx solid #c6c6c6;
    text-align: right;
    font-size: 26rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #c1885c;
    .text {
      display: flex;
      img {
        width: 30rpx;
        height: 30rpx;
        display: block;
        margin-right: 5rpx;
        margin-top: 3rpx;
      }
    }
  }
  .jx-time-circle {
    height: 37rpx;
    width: 37rpx;
    display: inline-block;
    background-color: #c1885c;
    color: #fff;
    text-align: center;
    line-height: 37rpx;
    border-radius: 50%;
  }
}
.jx-search-list {
  margin-left: 16rpx;
  margin-right: 16rpx;
  flex-direction: column;
  padding-top: 0;
  .jx-search-list-item {
    width: 100%;
    background: white;
    margin-bottom: 15rpx;
    padding: 20rpx;
    border-radius: 16rpx;
    box-sizing: border-box;
    .jx-search-list-top {
      display: flex;
      .jx-search-list-item-img {
        width: 220rpx;
        height: 220rpx;
        border-radius: 15rpx;
        overflow: hidden;
        flex-shrink: 0;
        margin-bottom: 0;
      }
      .jx-search-list-top-pric {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .jx-search-list-item-text {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.2;
          width: 420rpx;
          box-sizing: border-box;
          word-break: break-all;
        }
        .jx-search-list-item-rate {
          display: flex;
          align-items: center;
          padding-bottom: 15rpx;
          & > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 28rpx;
            padding-right: 30rpx;
            .text {
              font-size: 24rpx;
              color: #16171c;
            }
            .rebate {
              font-size: 20rpx;
              background: #ff4365;
              padding: 2rpx 15rpx;
              border-radius: 5rpx;
              color: white;
              margin-top: 3rpx;
            }
            .jx-search-list-item-oldrate {
              font-size: 26rpx;
            }
          }
          .jx-search-list-item-oldrate {
            margin-left: 0;
          }
        }
        .jx-search-list-item-sales {
          padding-top: 3px;
        }
      }
    }
    .jx-search-list-footer {
      padding-top: 20rpx;
      display: flex;
      justify-content: space-between;
      .right {
        display: flex;
      }
      .btn {
        line-height: 46rpx;
        height: 46rpx;
        font-size: 28rpx;
        border-radius: 30rpx;
        box-sizing: border-box;
        text-align: center;
        &.add {
          color: #ff4365;
          border: 1rpx solid #ff4365;
          width: 100rpx;
        }
        &.selfBuy {
          background: #efd4b7;
          color: black;
          width: 226rpx;
        }
        &.share {
          background: #ff4365;
          color: white;
          margin-left: 20rpx;
          width: 226rpx;
        }
      }
    }
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
.actionSheetCentent {
  .beforAddPric {
    color: rgb(242, 130, 106);
    padding: 25rpx 0 25rpx var(--cell-horizontal-padding, 16px);
    font-size: 28rpx;
  }
  .tips {
    color: #ff4365;
    font-size: 28rpx;
    color: #ff4365;
    padding: var(--cell-vertical-padding, 30px)
      var(--cell-horizontal-padding, 16px);
  }
  .addRpricBtn {
    margin: 50rpx auto 30rpx;
    width: 686rpx;
    height: 88rpx;
    line-height: 88rpx;
    color: white;
    text-align: center;
    background: #ff4365;
    border-radius: 8px;
  }
  .radioCell {
    flex-direction: row-reverse;
    align-items: center;
    .cellLabel {
      padding-left: 25rpx;
      .pric {
        color: #ff4365;
      }
    }
    .custom {
      display: flex;
      align-items: center;
    }
  }
}
</style>