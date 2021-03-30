<template>
  <div class="jx-shop-cart">
    <scroll-view class="scroll-view-page" refresher-enabled :showScrollbar="false" scroll-y :refresher-triggered="triggered" @refresherrefresh="uptatePage" @refresherrestore="onRestore">
      <div class="jx-body" :style="{paddingBottom: is_IphoneX ? '236rpx' : '208rpx'}">
        <mp-checkbox-group prop="checkbox" multi="true" v-if="userShopList.length !== 0 || invalidList.length !== 0">
          <div class="jx-card jx-shop-list" v-for="(item, index_) in userShopList" :key="index_">
            <div class="jx-shop-brand" v-if="!item.isLose">
              <div class="jx-shop-brand-content">
                <mp-checkbox label=" " :value="item.id" color="#ff4365" :checked="item.isChecked" @change="parentChange(item)"></mp-checkbox>
                <div class="jx-brand-name" @click="bannerClick(item)">
                  <div class="jx-brand-name-img">
                    <van-image fit="fill" width="100%" height="100%" radius="50%" :src="item.brand_logo" use-loading-slot>
                      <img slot="loading" :src="defaultImg2">
                    </van-image>
                  </div>
                  <span>{{item.brand_name}}</span>
                </div>
              </div>
              <div class="jx-right-arrow" @click="bannerClick(item)">
                <img src="/static/icons/gray-right-arrow.png" alt="" mode="widthFix">
              </div>
            </div>
            <div class="jx-shop-brand jx-shop-lose" v-else>
              <div>已失效不能购买商品{{item.order_product.length}}件</div>
              <div class="jx-shop-lose-text" @click="clearLoseGoods(index_)">清空失效商品</div>
            </div>
            <div class="jx-shop-item" v-for="k in item.order_product" :key="k.order_card_id">
              <mp-slideview :buttons="slideButtons" @bindbuttontap="slideButtonTap(k.order_card_id, k)">
                <div class="jx-shop-item-slideview">
                  <mp-checkbox v-if="(!item.isLose && k.publish_status * 1 === 1)" label=" " :value="item.id +'_' + k.id" color="#ff4365" :checked="k.isChecked" @change="parentChange(k)"></mp-checkbox>
                  <div v-else class="jx-is-lose"></div>
                  <div class="jx-shop-info-box">
                    <div class="jx-shop-img" @click="goProducts(k.product_id, item.sale_end_time, k)">
                      <van-image fit="fill" width="100%" height="100%" :src="k.product_img" use-loading-slot lazy-load>
                        <img slot="loading" :src="defaultImg2">
                      </van-image>
                      <img src="/static/images/shop-lose.png" alt="" class="jx-shop-lose-img" v-if="item.isLose || k.publish_status * 1 === 2 || k.publish_status * 1 === -1">
                      <img src="/static/images/sold-out.png" alt="" class="jx-shop-lose-img" v-else-if="k.publish_status * 1 === 0">
                    </div>
                    <div class="jx-shop-content">
                      <p class="jx-shop-explant" @click="goProducts(k.product_id, item.sale_end_time, k)">{{k.product_name}}</p>
                      <div class="jx-shop-info">
                        <span class="itemGroup">
                          <span>{{k.value_1}}</span>
                          <span>{{k.value_2}}</span>
                        </span>
                        <span class="jx-shop-info-count" v-if="item.isLose || k.publish_status * 1 !== 1">X{{k.product_amount}}</span>
                        <div class="jx-shopingCart-input-count" style="float:right;" v-if="!item.isLose && k.publish_status * 1 === 1">
                          <span :class="['jx-input-count jx-subtracts', {'jx-forbid': isSubtracts, 'jx-allow': !isSubtracts}]" @click="subtractsGoods(k)">-</span>
                          <span class="jx-input-count jx-count">{{k.product_amount}}</span>
                          <span :class="['jx-input-count jx-plus jx-allow', {'jx-forbid': isPlus, 'jx-allow': !isPlus}]" @click="plusGoods(k)">+</span>
                        </div>
                      </div>
                      <div class="jx-shop-money" style="position: flex;">
                        <div style="float:left;font-size:32rpx;">￥{{(k.self_price > 0 ? k.self_price : k.price + k.premium_price) / 100}}</div>
                        <div style="float:right; margin-right: 12rpx;" v-if="k.product_amount * 1 > k.current_cnt * 1">库存不足</div><!--  v-if="k.product_amount * 1 > k.current_cnt * 1" -->
                      </div>
                    </div>
                  </div>
                </div>
              </mp-slideview>
            </div>
          </div>

          <div class="jx-card jx-shop-list" v-if="invalidList.length">
            <div class="jx-shop-brand jx-shop-lose">
              <div>已失效不能购买商品{{invalidList.length}}件</div>
              <div class="jx-shop-lose-text" @click="clearLoseGoodsAll()">清空失效商品</div>
            </div>
            <div class="jx-shop-item" v-for="k in invalidList" :key="k.order_card_id">
              <mp-slideview :buttons="slideButtons" @bindbuttontap="clearLoseGoodsAll([k.order_card_id])">
                <div class="jx-shop-item-slideview">
                  <div class="jx-is-lose"></div>
                  <div class="jx-shop-info-box">
                    <div class="jx-shop-img" @click="goProducts(k.product_id, k.sale_end_time, k)">
                      <van-image fit="fill" width="100%" height="100%" :src="k.product_img" use-loading-slot lazy-load>
                        <img slot="loading" :src="defaultImg2">
                      </van-image>
                      <img src="/static/images/shop-lose.png" alt="" class="jx-shop-lose-img" v-if="k.invalid_status === 1 || k.invalid_status === 2 || k.invalid_status === -1">
                      <img src="/static/images/sold-out.png" alt="" class="jx-shop-lose-img" v-else-if="k.invalid_status === 0">
                    </div>
                    <div class="jx-shop-content">
                      <p class="jx-shop-explant" @click="goProducts(k.product_id, item.sale_end_time, k)">{{k.product_name}}</p>
                      <div class="jx-shop-info" style="padding-bottom:30rpx;">
                        <span>{{k.value_1}} {{k.value_2}}</span>
                        <span class="jx-shop-info-count">X{{k.product_amount}}</span>
                      </div>
                      <div class="jx-shop-money" style="position: flex;">
                        <div style="float:left;font-size:32rpx;">￥{{(k.self_price > 0 ? k.self_price : k.price + k.premium_price) / 100}}</div>
                        <div style="float:right; margin-right: 12rpx;" v-if="k.invalid_status === 1 || k.invalid_status === 2 || k.invalid_status === -1">已失效</div>
                        <div style="float:right; margin-right: 12rpx;" v-if="k.invalid_status === 0">已售罄</div>
                      </div>
                    </div>
                  </div>
                </div>
              </mp-slideview>
            </div>
          </div>

        </mp-checkbox-group>
        <div class="jx-order-null" v-else>
          <div class="jx-img-null">
            <img src="/static/images/order-null.png" alt="">
          </div>
          <p>购物车空空如也~</p>
        </div>
      </div>
    </scroll-view>
    <!-- 这是底部 -->
    <div :class="['jx-shop-footer', {'jx-shop-footer-bottom': isIphoneX}]" v-if="userShopList.length !== 0">
      <mp-cells>
        <mp-checkbox-group prop="checkbox" @bindchange="btnAllCheckbox">
          <mp-checkbox label="全选" value="all" color="#ff4365" :checked="allCheckBox" :disabled="isDisabledAll"></mp-checkbox>
        </mp-checkbox-group>
      </mp-cells>
      <div class="jx-all-settled">
        <div class="jx-all-settled-text">
          合计: <span class="jx-all-money">￥{{totalMoney / 100}}</span>
        </div>
        <div>
          <button class="mini-btn jx-mini-btn-asc" type="primary" size="mini" @click="settleAccounts">
            结算({{totalCount}})
          </button>
        </div>
      </div>
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
    <mp-dialog title=" " :show="dialogShow" bindbuttontap="tapDialogButton" :buttons="dialogButtons" class="dialog-clear">
      <div>已清理成功</div>
    </mp-dialog>
    <vue-tab-bar selectNavIndex="1" :badgeCount="badgeCount">
    </vue-tab-bar>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Toast from '../../../static/vant/toast/toast';
import vueTabBar from '../../components/jx-bottom-footer'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      invalidList: [],
      triggered: false,
      dialogShow: false,
      dialogButtons: [],
      dialogButtons1: [],
      slideButtons: [{
        type: 'warn',
        text: '删除',
        extClass: 'test',
        src: '',
        key: 'delete',
      }],
      userShopList: [],
      userShopListCopy: [],
      allCheckBox: false,
      totalMoney: 0,
      totalCount: 0,
      userSelectOrder: [],
      slideviewShow: {},
      isDisabledAll: false,
      isIphoneX: false,
      loginDialogShow: false,
      isSubtracts: true,
      isPlus: true,
      saleStatus: [],
    }
  },
  components: {
    vueTabBar,
  },
  computed: {
    ...mapGetters([
      'is_IphoneX',
      'barTitle',
      'defaultImg2',
      'defaultLogo'
    ]),
    badgeCount () {
      let iLen = 0;
      let uLen = 0
      iLen = this.invalidList.reduce((acc, cur) => {
        return acc + cur.product_amount
      }, 0)
      for (let i = 0; i < this.userShopList.length; i++) {
        uLen += this.userShopList[i].order_product.reduce((acc, cur) => {
          return acc + cur.product_amount
        }, 0)
      }
      return iLen + uLen
    },
  },
  methods: {
    uptatePage () {
      if (this._freshing) return
      this._freshing = true
      this.triggered = true
      this.getOrdercardList()
    },
    onRestore () {
      this.allCheckBox = false
      this.totalMoney = 0
      this.totalCount = 0
      this.userSelectOrder = []
      console.log('刷新完成')
    },
    slideButtonTap (e, item) {
      let _this = this
      wx.showModal({
        title: '',
        content: '确定删除该商品',
        success (res) {
          if (res.confirm) {
            _this.clearLoseGoods(0, e)
          }
        },
      })
    },
    btnAllCheckbox (e) {
      if (e.target.value.indexOf('all') > -1) {
        this.allCheckBox = true
        this.allCheckBoxEvent(this.userShopList, true)
      } else {
        this.allCheckBox = false
        this.allCheckBoxEvent(this.userShopList, false)
      }
    },
    allCheckBoxEvent (list, value) {
      list.map(item => {
        item.isChecked = value
        if (!item.isLose) {
          if (item.hasOwnProperty('order_product')) {
            item.order_product.map(k => {
              k.isChecked = value
              if (k.publish_status * 1 === 1) {
                console.log('产品id是否在选中的userSelectOrder', this.userSelectOrder.indexOf(k.order_card_id))
                if (value) {
                  if (this.userSelectOrder.indexOf(k.order_card_id) < 0) {
                    this.totalMoney += (k.self_price > 0 ? k.self_price : k.price + k.premium_price) * 1 * k.product_amount
                    this.totalCount += k.product_amount
                    this.userSelectOrder.push(k.order_card_id)
                  }
                } else {
                  this.totalMoney -= (k.self_price > 0 ? k.self_price : k.price + k.premium_price) * 1 * k.product_amount
                  this.totalCount -= k.product_amount
                  this.userSelectOrder.splice(this.userSelectOrder.indexOf(k.order_card_id), 1)
                }
              }
            })
          } else {
            if (!item.isLose) {
              if (value) {
                this.totalMoney += (item.self_price > 0 ? item.self_price : item.price + item.premium_price) * 1 * item.product_amount
                this.totalCount += item.product_amount
                this.userSelectOrder.push(item.order_card_id)
              } else {
                this.totalMoney -= (item.self_price > 0 ? item.self_price : item.price + item.premium_price) * 1 * item.product_amount
                this.totalCount -= item.product_amount
                this.userSelectOrder.splice(this.userSelectOrder.indexOf(item.order_card_id), 1)
              }
            }
          }
        }

      })
    },
    parentChange (e) {
      e.isChecked = !e.isChecked
      const arr = []
      arr.push(e)
      this.allCheckBoxEvent(arr, e.isChecked)
      this.isAllChecked()
    },
    isAllChecked () {
      let parentAllChecked = []
      let isLostArr = []
      this.userShopList.map(item => {
        let isAllCheckedArr = []
        let isLosChildArr = []
        item.order_product.map(k => {
          if (k.isChecked && isAllCheckedArr.indexOf(k.order_card_id) === -1 && k.publish_status == 1) {
            isAllCheckedArr.push(k.order_card_id)
          }
          if (k.publish_status !== 1 && isLostArr.indexOf(k.order_card_id)) {
            isLosChildArr.push(k.order_card_id)
          }
        })
        item.isChecked = item.order_product.length - isLosChildArr.length === isAllCheckedArr.length

        if (item.isLose) {
          isLostArr.push(item.brand_id)
        } else {
          if (item.isChecked && parentAllChecked.indexOf(item.brand_id) === -1) {
            parentAllChecked.push(item.brand_id)
          }
        }
      })
      this.allCheckBox = (this.userShopList.length - isLostArr.length) === parentAllChecked.length
      //this.allCheckBox = this.userShopList.length  === parentAllChecked.length
    },
    clearLoseGoodsAll (ids) {
      let arr = []
      if (!ids) {
        arr = this.invalidList.map(item => {
          return item.order_card_id
        })
      } else {
        arr = ids
      }
      wx.showLoading({
        title: '正在提交中...', //提示的内容, 
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      this.$http.post({
        url: `/ordercard/clear`,
        data: {
          ids: arr,
        },
      }).then(res => {
        wx.hideLoading()
        if (res.code * 1 === 0) {
          this.dialogShow = true
          setTimeout(() => {
            this.dialogShow = false
            if (!ids) {
              this.invalidList = []
            } else {
              let _index = this.invalidList.findIndex(item => item.order_card_id == ids[0])
              this.invalidList.splice(_index, 1)
              let _u = JSON.parse(JSON.stringify(this.invalidList))
              this.invalidList = []
              this.$nextTick(() => {
                this.invalidList = _u
              })
            }
          }, 1000)
        } else {
          console.log(res)
        }
      })
    },
    // 清除失效商品
    clearLoseGoods (index, id) {
      const ids = []
      if (id) {
        ids.push(id)
      } else {
        console.log(index);
        this.userShopList[index].order_product.map(item => {
          ids.push(item.order_card_id)
        })
      }
      wx.showLoading({
        title: '正在提交中...', //提示的内容, 
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      this.$http.post({
        url: `/ordercard/clear`,
        data: {
          ids: ids,
        },
      }).then(res => {
        wx.hideLoading()
        if (res.code * 1 === 0) {
          this.dialogShow = true
          setTimeout(() => {
            this.dialogShow = false
            this.clearGoods(ids)
            //this.getOrdercardList()
          }, 1000)
        } else {
          console.log(res)
        }
      })
      // this.userShopList.splice(index, 1)
    },
    clearGoods (ids) {
      for (let i = 0; i < this.userShopList.length; i++) {
        let _shopList = this.userShopList[i]
        let _productList = _shopList.order_product
        for (let j = 0; j < _productList.length; j++) {
          let _item = _productList[j]
          if (ids.includes(_item.order_card_id)) {
            _productList.splice(j, 1)
            j--
          }
        }
        if (!_productList.length) {
          this.userShopList.splice(i, 1)
          i--
        }
      }
      this.isAllChecked()
      this.resetPric()
    },
    resetPric () {
      let pric = 0, count = 0;
      for (let i = 0; i < this.userShopList.length; i++) {
        let _shopList = this.userShopList[i]
        let _productList = _shopList.order_product
        for (let j = 0; j < _productList.length; j++) {
          let _item = _productList[j]
          if (_item.isChecked) {
            pric += (_item.self_price > 0 ? _item.self_price : _item.price + _item.premium_price) * 1 * _item.product_amount
            count += _item.product_amount
          }
        }
      }
      this.totalMoney = pric
      this.totalCount = count
      let _u = JSON.parse(JSON.stringify(this.userShopList))
      this.userShopList = []
      this.$nextTick(() => {
        this.userShopList = _u
      })
    },
    settleAccounts () {
      if (this.userSelectOrder.length === 0) {
        wx.showToast({
          title: '您未选择商品',
          icon: 'none',
        });
        setTimeout(() => {
          wx.hideToast();
        }, 3000)
        return
      }
      let userSelectOrderNum = {}
      let storageLess = 0
      this.userShopList.map(item => {
        if (item.order_product) {
          item.order_product.map((k) => {
            if (k.product_amount > k.current_cnt && k.isChecked) {
              Toast(k.product_name + '库存不足')
              storageLess = 1
              return
            }
            if (this.userSelectOrder.indexOf(k.order_card_id) > -1 && !userSelectOrderNum.hasOwnProperty(k.order_card_id)) {
              userSelectOrderNum[k.order_card_id] = k.product_amount
            }
          })
        }
      })
      if (!storageLess) {
        console.log('跳转', userSelectOrderNum)
        wx.navigateTo({
          url: `/pages/confirm-order/main?order=${this.userSelectOrder}&userSelectOrderNum=${JSON.stringify(userSelectOrderNum)}`,
        })
      }

    },
    getOrdercardList () {
      this.$Timer = setTimeout(() => {
        wx.showLoading({
          title: '加载中...',
          mask: true,
        });
      }, 2000)
      this.$http.get({
        url: `/ordercard/list`,
      }).then(res => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
        if (this._freshing) {
          this._freshing = false
          this.triggered = false
        }
        if (res.code * 1 === 0) {
          let data = res.data || []
          let _invalid = []
          for (let i = 0; i < data.length; i++) {
            let _p = data[i]
            const endTimeArr = _p.sale_end_time.replace(/-/g, '/')
            const now_time = _p.server_time.replace(/-/g, '/')
            const endTime = +new Date(endTimeArr)
            const newDate = +new Date(now_time)
            if (endTime <= newDate) {
              let _c = data.splice(i, 1)[0]
              _c.order_product.forEach(element => {
                element.invalid_status = 1  //已失效
                element.sale_end_time = _p.sale_end_time
              });
              _invalid.push(..._c.order_product)
              i--
              continue;
            }
            for (let j = 0; j < _p.order_product.length; j++) {
              let _item = _p.order_product[j]
              if (_item.publish_status == 2) {
                let _c = _p.order_product.splice(j, 1)[0]
                _c.invalid_status = 2  //已下架
                _c.sale_end_time = _p.sale_end_time
                _invalid.push(_c)
                j--
              } else if (_item.publish_status == 0) {
                let _c = _p.order_product.splice(j, 1)[0]
                _c.invalid_status = 0
                _c.sale_end_time = _p.sale_end_time
                _invalid.push(_c)  //已售空
                j--
              } else if (_item.publish_status == -1) {
                let _c = _p.order_product.splice(j, 1)[0]
                _c.invalid_status = -1
                _c.sale_end_time = _p.sale_end_time
                _invalid.push(_c)  //已失效
                j--
              }
            }
            if (!_p.order_product.length) {
              data.splice(i, 1)
              i--
            }
          }

          this.invalidList = _invalid
          this.userShopList = data || []
          //this.userShopList[0].order_product[0].product_amount = 31
          this.userShopList.map(item => {
            //this.saleStatus.push(item.order_product[0].sale_status);
            let failure = 0
            item.order_product.map(k => {
              if (k.attr_value_id == 0) {
                k.value_1 = "规格：默认"
              }
              if (k.publish_status * 1 !== 1) {
                failure += 1
              }
            })
            if (failure == item.order_product.length) {
              this.saleStatus.push(0)
            } else {
              this.saleStatus.push(1)
            }
            if (item.sale_end_time) {
              const endTimeArr = item.sale_end_time.replace(/-/g, '/')
              let now_time = item.server_time.replace(/-/g, '/')
              const endTime = +new Date(endTimeArr)
              const newDate = +new Date(now_time)
              item.isLose = endTime <= newDate
              this.isDisabledAll = endTime <= newDate
            }
            if (!item.sale_end_time) {
              item.isLose = true
              this.isDisabledAll = true
            }
          })
          this.addIsChecked(this.userShopList)
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
            icon: 'none',
          });
          this.userShopList = []
          console.log(res);
        }
      }).catch(() => {
        clearTimeout(this.$Timer)
        wx.hideLoading()
      });
    },
    addIsChecked (list) {
      for (let i in list) {
        let cur = list[i];
        cur.isChecked = false;
        if (!cur.hasOwnProperty('order_product')) {
          this.slideviewShow[cur.order_card_id] = false
        }
        //console.log(cur.order_product);
        if (cur.order_product.length > 0) {
          for (let j in cur.order_product) {
            cur.order_product[j].isChecked = false;
            if (!cur.order_product[j].hasOwnProperty('order_product')) {
              this.slideviewShow[cur.order_product[j].order_card_id] = false
            }
          }
        }

      }
    },
    goProducts (productsId, saleEndTime, k) {
      if (k.invalid_status === 1 || k.invalid_status === 2) {
        wx.showToast({
          title: '商品已失效',
          icon: 'none',
        })
        return
      }
      if (k.invalid_status === 0) {
        wx.showToast({
          title: '商品已售罄',
          icon: 'none',
        })
        return
      }
      let isLeader = wx.getStorageSync('userType')
      let page = isLeader != '' && isLeader == 2 ? 'products-leader' : 'products'
      wx.navigateTo({ url: `/pages/${page}/main?productsId=${productsId}&saleEndTime=${saleEndTime}` });
    },
    bannerClick (item) {
      let isLeader = wx.getStorageSync('userType')
      let page = isLeader != '' && isLeader == 2 ? 'special-sales-leader' : 'special-sales'
      wx.navigateTo({ url: `/pages/special/${page}/main?brandId=${item.brand_id}&saleEndTime=${item.sale_end_time}` });
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
          this.getOrdercardList();
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
    /**
     * 加数量
     */
    plusGoods (k) {
      console.log(k)
      if (k.product_amount * 1 > k.current_cnt * 1) {
        wx.showToast({
          title: '超出商品库存', //提示的内容,
          duration: 1000,
          icon: 'none',
        });
        this.isPlus = true
        return
      }
      k.product_amount += 1;

      if (k.isChecked == true) {
        this.totalMoney += (k.self_price > 0 ? k.self_price : k.price + k.premium_price) * 1
        this.totalCount += 1
        // this.allCheckBoxEvent(arr, temp.isChecked)
        // this.isAllChecked()
      }

      this.isSubtracts = false
      this.changeProd(k, 'add')
    },
    /**
     * 减数量
     */
    subtractsGoods (k) {
      if (k.product_amount === 1) {
        wx.showToast({
          title: '宝贝不能再减少了',
          duration: 1000,
          icon: 'none',
        });
        return
      }
      k.product_amount -= 1
      if (k.isChecked == true) {
        this.totalMoney -= (k.self_price > 0 ? k.self_price : k.price + k.premium_price) * 1
        this.totalCount -= 1
      }
      if (k.product_amount === 1) this.isSubtracts = true;
      this.changeProd(k, 'cut')
    },
    changeProd (item, type) {
      const params = {
        product_id: item.product_id,
        attr_value_id: item.attr_value_id,
        product_amount: type === 'add' ? 1 : -1,
      }
      this.$http.post({
        url: '/ordercard/add',
        data: params,
      }).then(res => {
        wx.hideLoading()
        if (res.code * 1 !== 0) {
          wx.showToast({
            title: '添加失败',
            icon: 'none',
          });
        }
      });
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.isIphoneX = this.$store.state.isIphoneX
    })
  },
  onLoad () {
    const _this = this;
    if (this.triggered) {
      this.triggered = false
    }
    wx.getSetting({
      success (res) {
        console.log('onLoad')
        console.log(res.authSetting['scope.userInfo'])
        if (!res.authSetting['scope.userInfo']) {
          _this.loginDialogShow = true;
          return
        } else {
          _this.loginDialogShow = false;
          _this.getOrdercardList()
        }
      },
    })
    this.allCheckBox = false
    this.totalMoney = 0
    this.totalCount = 0
    this.userSelectOrder = []
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
.jx-shop-cart {
  position: absolute;
  left: 10rpx;
  right: 10rpx;
  bottom: 0;
  top: 0;
  .scroll-view-page {
    width: 100%;
    height: 100%;
  }
  .jx-shop-list {
    padding: 18rpx 22rpx 40rpx;
    margin-bottom: 20rpx;
    .jx-shop-lose {
      font-size: 28rpx;
      .jx-shop-lose-text {
        color: #f65c7a;
      }
    }
    .jx-shop-item {
      .weui-slideview__btn {
        display: flex;
        align-items: center;
        background-color: #ff4365;
        height: 160rpx;
        margin-top: 22rpx;
      }
      .jx-shop-item-slideview {
        display: flex;
        align-items: center;
        padding-top: 22rpx;
        margin-right: 20rpx;
        .jx-shop-info-box {
          display: flex;
          align-items: center;
        }
        .jx-is-lose {
          width: 0;
          margin-right: 65rpx;
        }
        .jx-shop-img {
          width: 158rpx;
          height: 158rpx;
          border-radius: 10rpx;
          font-size: 0;
          overflow: hidden;
          margin-right: 22rpx;
          position: relative;
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
        }
        .jx-shop-content {
          width: 453rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 24rpx;
          color: #666666;
          .jx-shop-explant {
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            width: 450rpx;
            padding-right: 10px;
            box-sizing: border-box;
            word-break: break-all;
          }
          .jx-shop-info {
            position: relative;
            margin-right: 20rpx;
            .jx-shop-info-count {
              position: absolute;
              right: 0;
            }
            .itemGroup {
              display: flex;
              padding-right: 5px;
              span {
                flex-shrink: 0;
                max-width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 5px;
                box-sizing: border-box;
              }
            }
          }
          div {
            font-size: 22rpx;
          }
          .jx-shop-money {
            font-size: 26rpx;
            color: #eb556a;
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .jx-body {
    padding-bottom: 220rpx;
    padding-top: 20rpx;
    .weui-cell {
      padding: 0;
      position: static;
    }
    .jx-shop-brand {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .jx-shop-brand-content {
        display: flex;
      }
      .jx-brand-name {
        display: flex;
        align-items: center;
        .jx-brand-name-img {
          width: 44rpx;
          height: 44rpx;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 20rpx 0 0;
          display: inline-block;
        }
        span {
          font-size: 28rpx;
          color: #414141;
          font-weight: bold;
        }
      }
      .jx-right-arrow {
        width: 14rpx;
      }
    }
  }
  .jx-shop-footer {
    width: 100%;
    height: 95rpx;
    position: fixed;
    bottom: 112rpx;
    background-color: #fff;
    z-index: 999;
    display: flex;
    left: 0;
    justify-content: space-between;
    .jx-all-settled {
      display: flex;
      height: 100%;
      justify-content: space-between;
      align-items: center;
      margin-right: 28rpx;
      .jx-all-settled {
        font-size: 32rpx;
        color: #333333;
      }
      .jx-all-settled-text {
        font-weight: bold;
      }
      .jx-all-money {
        font-size: 30rpx;
        color: #eb556a;
        margin-right: 30rpx;
      }
      .jx-mini-btn-asc {
        height: 80rpx;
        background-color: #ff4365;
        color: #fff;
        padding: 0;
        line-height: 1;
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: -10rpx;
        font-size: 30rpx;
        font-weight: bold;
        padding-left: 24rpx;
        padding-right: 24rpx;
      }
    }
  }
  .jx-shop-footer-bottom {
    bottom: 142rpx;
  }
  .jx-tabBar-nav {
    box-shadow: none;
  }
  ._mp-checkbox {
    line-height: 90rpx;
    view {
      line-height: 1;
      height: 100%;
      font-size: 28rpx;
      color: #666666;
    }
    .weui-icon-checkbox_circle,
    .weui-icon-checkbox_success {
      margin-right: 20rpx;
    }
  }
  .dialog-clear {
    .weui-dialog {
      width: 330rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 55rpx;
      background-color: #171717;
      .weui-dialog__hd,
      .weui-dialog__ft {
        display: none;
      }
      .weui-dialog__bd {
        width: 334rpx;
        height: 110rpx;
        padding: 0;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        border-radius: 55rpx;
        background-color: #171717;
        color: #fff;
        justify-content: center;
      }
    }
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
</style>
