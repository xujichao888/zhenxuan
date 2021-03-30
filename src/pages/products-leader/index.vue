<template>
  <div class="jx-products" v-if="isIn">
    <div class="jx-products-introduced jx-margin-bottom-20">
      <div class="jx-products-img">
        <div class="jx-is-lose" v-if="productsInfo.isLose">
          <!-- <img src="/static/images/sold-out.png" alt=""> -->
        </div>
        <swiper class="jx-swiper" :indicator-dots="productsInfo && productsInfo.product_img && productsInfo.product_img.length > 1">
          <div class="jx-swiper-box" v-if="productsInfo.product_img">
            <swiper-item v-for="(item, key) in productsInfo.product_img" :key="key">
              <van-image v-if="item" fit="fill" width="100%" height="100%" :src="item" use-loading-slot lazy-load @click="previewImage(productsInfo.product_img, key)">
                <img slot="loading" :src="defaultImg2">
              </van-image>
            </swiper-item>
          </div>
        </swiper>
      </div>
      <div class="jx-products-text jx-text-displays-ellipses jx-padding-left-right-20">
        {{productsInfo.product_name}}
      </div>
      <div class="jx-products-price jx-padding-left-right-20">
        <div class="jx-new-price">
          <div class="left">
            <div class="jx-new-price-item">
              <span class="price">￥{{selectGoods.goodsMoney}}</span>
              <span class="text">销售价</span>
            </div>
            <div class="jx-new-price-item" v-if="selectGoods.self_price">
              <span class="price">￥{{selectGoods.self_price}}</span>
              <span class="text">供货价</span>
            </div>
            <span v-if="productsInfo.pre_price" class="jx-search-list-item-oldrate">￥{{productsInfo.pre_price / 100}}</span>
          </div>
          <div class="share btn" @click="shareOpen(`pages/products/main?productsId=${productsId}`, 3, productsInfo)">
            <img src="/static/icons/share.png">
            <span>分享</span>
          </div>
        </div>
      </div>
    </div>
    <div class="jx-padding-left-right-20 jx-margin-bottom-20 jx-products-specification">
      <div class="jx-title-products">
        规格选择
      </div>
      <div class="jx-color-specification" v-for="(k, __index) in productsInfo.attributeInfos" :key="__index">
        <div class="_item-title" style="margin-left: 8rpx;font-weight: 400; font-size:28rpx;">{{k.text}}</div>
        <div style="margin-top: 18rpx; margin-left: 8rpx;">
          <span v-for="(item, index) in k.list" :key="index" :class="['jx-select-color', {'jx-select-color-action': item === selectSpecification[k.key]}]" @click="selectColorSize({value: item, key: k.key})">
            {{item}}
          </span>
        </div>
      </div>
      <div class="jx-specification-count">
        <div class="_item-title" style="margin-left: 8rpx;font-weight: 400; font-size:28rpx">购买数量</div>
        <div class="jx-specification-input-count">
          <span :class="['jx-input-count jx-subtracts', {'jx-forbid': isSubtracts, 'jx-allow': !isSubtracts}]" @click="subtractsGoods">-</span>
          <span style="background:rgba(246,246,246,1);margin:0 1rpx 0 1rpx" class="jx-input-count jx-count">{{goodsCount}}</span>
          <span class="jx-input-count jx-plus jx-allow" @click="plusGoods">+</span>
        </div>
      </div>
    </div>
    <div class="jx-padding-left-right-20 jx-margin-bottom-20 jx-products-specification jx-explains-products">
      <div class="jx-title-products">
        说明
      </div>
      <div class="jx-explains-text">
        最晚在9月30日发货，美妆产品，暂不支持退换货，质量有问题包退。
      </div>
    </div>
    <div class=" jx-margin-bottom-20 jx-products-specification jx-goods-products">
      <div class="jx-title-products">
        商品详情
      </div>
      <div style="margin-top:20rpx">
        <div class="jx-goods-products-img" v-html="productsInfo.descript">
          <!-- <img v-for="(item, index) in goodsProductsImg" :src="item" alt="" :key="index" mode="widthFix"> -->
        </div>
      </div>
      <div class="jx-buyer-reading">
        <div class="jx-buyer-reading-title">购物须知</div>
        <div class="jx-buyer-reading-content">
          <div style="margin-bottom: 45rpx;">
            <p style="margin-left: 10rpx;">【吉祥优选】</p>
            <p>为品牌特卖、所有产品均为限时特卖，个别品牌可能适时追加返场。</p>
          </div>
          <div style="margin-bottom: 45rpx;">
            <p style="margin-left: 10rpx;">【 关于库存尺码 】</p>
            <p>品牌特卖库存量不多，热销尺码容易被抢断货，个别尺码本身无库存，欲购从速。</p>
          </div>
          <div style="margin-bottom: 45rpx;">
            <p style="margin-left: 10rpx;">【关于购买】</p>
            <p>所有品牌都是限时特卖，活动时间一般为2天左右。活动结束即下架无法购买。付款成功后，订单进入系统抢购状态，状态转为待发货则表示订单抢购成功。当日24：00下单成功的订单可以自主申请取消，超过该时间段请联系客服。</p>
          </div>
          <div style="margin-bottom: 45rpx;">
            <p style="margin-left: 10rpx;">【 关于价格 】</p>
            <p>根据各品牌商的价格策略，商品价格实时更新，清库期间部份商品可能会有价格变动，因此，若任何商品在您购买后降价，我们是无法补差价的，感谢您的理解 </p>
          </div>
          <div style="margin-bottom: 45rpx;">
            <p style="margin-left: 10rpx;">【 关于发货 】</p>
            <p>品牌特卖，活动结束后7天内发货，不同品牌商稍有不同（公告处可获知具体日期）</p>
          </div>
          <div>
            <p style="margin-left: 10rpx;">【 关于售后 】</p>
            <p>1、漏发、缺货商品给予退款处理</p>
            <p>2、错发商品给予退货退款。</p>
            <p>3、非人为造成的质量问题给予退货处理。</p>
            <p>4、售后处理时效：发货后15天，偏远地区另外协商。 </p>
          </div>
        </div>
      </div>
    </div>
    <vueSpecificationModel v-if="specificationModel" :shortage="productsInfo.shortage" :show.sync="specificationModel" :data="productsInfo" @buyGoods="buyGoodsEvent" @selectColorSize="selectColorSize" :money="selectGoods" :selectSpecification="selectSpecification" :goodsCountTotal="goodsCountTotal"></vueSpecificationModel>
    <div class="jx-products-footer">
      <div class="jx-products-footer-content">
        <div class="jx-navbar-home">
          <div class="jx-shopping-cart" @click="btnSkip('/pages/shopping-cart/main')">
            <mp-badge :content="badgeCount" v-if="badgeCount !== 0"></mp-badge>
            <img src="/static/tabs/shop-cart.png" alt="">
            购物车
          </div>
          <div @click="btnSkip('/pages/index/main')">
            <img src="/static/tabs/home.png" alt="">
            首页
          </div>
        </div>
        <div class="jx-user-operate-btn">
          <button class="mini-btn jx-mini-btn-no" type="primary" size="mini" disabled v-if="productsInfo.isLose">
            已失效
          </button>
          <button class="mini-btn jx-mini-btn-no" type="primary" size="mini" disabled v-else-if="productsInfo.shortage">
            已售磬
          </button>
          <div class="jx-btn" v-else>
            <button class="mini-btn jx-mini-btn-asc" type="primary" size="mini" @click="userBuyGoods('cart')">
              加入购物车
            </button>
            <button class="mini-btn jx-mini-btn-shop" type="primary" size="mini" @click="userBuyGoods('buy')">
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
    <vueShareModel :show.sync="shareDialogShow" :type="shareType" :path="sharePath" :brandInfo="brandInfo" :goodsInfo="goodsInfo">
    </vueShareModel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vueSpecificationModel from '../../components/specification-model'
import vueShareModel from '../../components/share-model'
export default {
  data () {
    return {
      isIn: false,
      prodMoney: 0,
      brandId: 0,
      prod_tips: [],
      shareDialogShow: false,
      brandInfo: {},
      goodsInfo: {},
      sharePath: '',
      shareType: 2,
      self_price: '',
      goodsCount: 1,
      isSubtracts: true,
      specificationModel: false,
      selectColor: '',
      selectSize: '',
      productsInfo: {
        isLose: false,
        shortage: false,
        name: '',
        newPrice: '',
        oldPrice: '',
        discounts: '',
        maxCount: 0,
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
        self_price: 0,
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
    vueShareModel,
  },
  computed: {
    ...mapGetters([
      'barTitle',
      'defaultImg2',
      'defaultLogo'
    ]),
  },
  methods: {
    previewImage (urls, index) {
      let sources = urls.map(item => {
        return {
          url: item,
        }
      })
      wx.previewMedia({
        current: index,
        sources,
        fail () {
          wx.showToast({
            title: '预览失败',
            icon: 'none',
          });
        },
      })
    },
    shareOpen (path, type, item) {
      this.shareType = type
      item.goodsUrl = item.product_img
      this.goodsInfo = item
      this.sharePath = `${path}`
      this.shareDialogShow = true
    },
    initParams () {
      this.selectColor = ''
      this.selectSize = ''
      this.goodsCount = 1
      this.specificationModel = false
      this.selectGoods = {
        attr_value_id: 0,
        goodsMoney: 0,
        oldGoodsMoney: 0,
        self_price: 0,
      }
      this.productsInfo = {
        isLose: false,
        shortage: false,
        name: '',
        newPrice: '',
        oldPrice: '',
        discounts: '',
        maxCount: 0,
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
    selectColorSize (value) {
      this.goodsCount = 1
      this.selectSpecification[value.key] = value.value
      this.setAttrValueId()
      this.$forceUpdate()
    },
    selectSpeValue () {
      const value = {}
      for (let item in this.selectSpecification) {
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
          money: this.prodMoney,
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
          money: this.prodMoney,
        }
        wx.navigateTo({
          url: `/pages/confirm-order/main?productsId=${this.productsId}&selectGoods=${JSON.stringify(params)}`,
        })
      }
    },
    gitProductsInfo () {
      this.$Timer = setTimeout(() => {
        wx.showLoading({
          title: '加载中...',
          mask: true,
        });
      }, 2000)
      this.$http.get({
        url: `/goods/detail?product_id=${this.productsId}`,
      }).then(res => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
        if (res.code * 1 === 0) {
          const data = res.data
          this.productsInfo = data
          this.brandId = data.brand_id
          this.getBrandInfo()
          if (this.productsInfo.descript) {
            this.prod_tips = []
            let _tr = this.productsInfo.descript.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi)
            if (_tr && _tr.length) {
              for (let i = 0; i < _tr.length; i++) {
                let _td = _tr[i].match(/<td[^>]*>[\s\S]*?<\/td>/gi)
                this.prod_tips.push({
                  label: _td[0].replace(/<\/?.+?>/g, ""),
                  value: _td[1].replace(/<\/?.+?>/g, ""),
                })
              }
            }
          }
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

          if (data.attribute_infos.length === 1 && data.attribute_infos[0].attr_name1 === '') {
            this.selectGoods.goodsMoney = (data.attribute_infos[0].price + data.attribute_infos[0].premium_price) / 100
            this.prodMoney = (data.attribute_infos[0].self_price > 0 ? data.attribute_infos[0].self_price : data.attribute_infos[0].price + data.attribute_infos[0].premium_price) / 100
          } else {
            this.selectGoods.goodsMoney = data.price_range
          }
          this.isIn = true
        } else {
          console.log(res)
        }
      }).catch(() => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
      })
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
          this.getOrdercardList()
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
    getOrdercardList () {
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
            this.prodMoney = (item.self_price > 0 ? item.self_price : item.price + item.premium_price) / 100
            this.selectGoods.self_price = item.self_price / 100
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
            this.prodMoney = (item.self_price > 0 ? item.self_price : item.price + item.premium_price) / 100
            this.selectGoods.self_price = item.self_price / 100
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
              this.getOrdercardList()
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
        }
        // 获取到后台重写的session数据，可以通过vuex做本地保存
      })
    },
    getBrandInfo () {
      this.$http.get({
        url: `/brand/detail?brand_id=${this.brandId}`,
      }).then(res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.brandInfo = data
          this.brandInfo.saleEndTime = data.sale_end_time
        } else {
          console.log(res);
        }
      });
    },
  },
  onUnload () {
    this.initParams()
  },
  onLoad (option) {
    if (option.productsId) {
      if (option.hasOwnProperty('leader')) {
        this.$store.commit('setLeader', option.leader * 1)
        this.$store.commit('setShareUserId', option.userid * 1)
      }
      this.productsId = option.productsId
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
          if (newArr[0] == 'productsId') {
            this.productsId = newArr[1] * 1
          }
        }
      }
    }
    let isLeader = wx.getStorageSync('userType')
    if (isLeader == '' || isLeader != 2) {
      wx.redirectTo({ url: `/pages/products/main?productsId=${this.productsId}` });
    }
    this.isIphoneX = this.$store.state.isIphoneX
    this.gitProductsInfo()
    this.getOrdercardList()
    const _this = this;
    setTimeout(() => {
      wx.getSetting({
        success (res) {
          if (!res.authSetting['scope.userInfo']) {
            _this.loginDialogShow = true;
            return
          } else {
            _this.loginDialogShow = false;
          }
        },
      })
    }, 1500)
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
      path: '/pages/products/main?leader=' + leader + '&userid=' + userid + '&productsId=' + this.productsId,
      imgUrl: '',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
        });
      },
      fail: function () {
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
.jx-products {
  & > div {
    background-color: #ffffff;
    width: 100%;
    box-sizing: border-box;
  }
  .jx-products-introduced {
    width: 100%;
    box-sizing: border-box;
    .jx-products-img {
      margin-bottom: 20rpx;
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
        height: 690rpx;
        overflow: hidden;
      }
    }
    .jx-products-text {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #16171c;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 15rpx;
      text-indent: 10rpx;
      box-sizing: border-box;
      word-break: break-all;
    }
    .jx-products-price {
      padding-bottom: 50rpx;
      display: flex;
      justify-content: space-between;
      color: #ff4365;
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
      .jx-new-price {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .share {
          font-size: 28rpx;
          color: #ff4365;
          padding-top: 10rpx;
          display: flex;
          img {
            width: 30rpx;
            height: 32rpx;
            margin-top: 3rpx;
          }
          span {
            padding-left: 5rpx;
          }
        }
        .left {
          display: flex;
          .jx-new-price-item {
            padding-right: 40rpx;
            display: flex;
            flex-direction: column;
            .price {
              font-size: 40rpx;
            }
            .text {
              color: #909399;
              font-size: 28rpx;
              text-indent: 10rpx;
            }
          }
          .jx-search-list-item-oldrate {
            font-size: 28rpx;
            color: #909399;
            text-decoration: line-through;
            padding-top: 10rpx;
          }
        }
      }
    }
  }
  .jx-products-select-size {
    width: 100%;
    height: 562rpx;
  }
  .jx-explains-products {
    .jx-explains-text {
      font-size: 28rpx;
      color: #8d8d8d;
      padding-bottom: 38rpx;
      padding-top: 20rpx;
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
  box-shadow: 2rpx 4rpx 8rpx 4rpx #d7d7d7;
  bottom: 0;
  background-color: #fff;
  padding-left: 30rpx;
  padding-right: 30rpx;
  .jx-products-footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
      width: 218rpx;
      height: 90rpx;
      color: #fff;
      font-size: 32rpx;
      line-height: 90rpx;
      border-radius: 0;
    }
    .jx-mini-btn-asc {
      background-image: linear-gradient(270deg, #dfb58f 0%, #efd4b7 100%);
      padding: 0;
      color: #16171c;
    }
    .jx-mini-btn-shop {
      background: #ff4365;
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
</style>
<style lang="scss" scoped>
.jx-products-specification {
  padding-top: 0 !important;
  .jx-title-products {
    font-size: 32rpx;
    color: #16171c;
    font-weight: bold;
    border-bottom: 1rpx solid #e7e7e7;
    padding: 32rpx 0;
    margin-bottom: 0;
  }
  ._item-title {
    font-size: 28px;
    color: #16171c;
    padding-top: 20rpx;
  }
  .jx-color-specification {
    font-size: 28rpx;
    .jx-select-color {
      height: 70rpx;
      border-radius: 5rpx;
      display: inline-block;
      line-height: 70rpx;
      text-align: center;
      border: 1px solid #f6f6f6;
      background-color: #f6f6f6;
      color: #606266;
      margin-right: 20rpx;
      margin-bottom: 10rpx;
    }
    .jx-select-color-action {
      color: #ff4365;
      border-color: #ff4365;
    }
  }
  .jx-specification-count {
    display: block;
    margin-top: 0rpx;
    padding-bottom: 70rpx;
    .jx-specification-input-count {
      width: 100%;
      margin-top: 9px;
      margin-left: 4px;
      height: 70rpx;
      border-radius: 5rpx;
      border: 0;
      overflow: hidden;
      .jx-input-count {
        height: 70rpx !important;
        text-align: center;
        line-height: 70rpx !important;
      }
      .jx-subtracts,
      .jx-plus {
        width: 70rpx;
        background-color: #f6f6f6;
        color: #bcbcbc;
        &.jx-allow {
          color: #6e6e6e;
          background-color: rgba(246, 246, 246, 1);
        }
      }
      .jx-count {
        width: 88rpx;
      }
    }
  }
  .jx-sizes-specification {
    margin-top: 69rpx;
  }
}
</style>