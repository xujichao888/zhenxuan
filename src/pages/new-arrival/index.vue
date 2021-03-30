<template>
  <div class="jx-new-arrival">
    <JXheader title="今日上新"></JXheader>
    <div class="jx-body jx-return-header-top">
      <div class="jx-card jx-share-tuan">
        <div class="jx-tuan-info">
          <div class="jx-portrait">
            <van-image fit="fill" width="100%" height="100%" radius="50%" :src="leaderInfo.user_img_url" use-loading-slot>
              <img slot="loading" :src="defaultImg2">
            </van-image>
          </div>
          <div class="jx-info-share">
            <p class="jx-info-share-title">{{leaderInfo.user_nickname}}</p>
            <p class="jx-info-share-count">{{leaderInfo.view}}人浏览过</p>
          </div>
        </div>
        <button class="mini-btn" type="primary" size="mini" @click="shareEvent">
          分享
          <img src="/static/icons/share-icon.png" alt="">
        </button>
      </div>
      <div class="jx-card jx-on-sale jx-margin-top-20" v-for="(item, _index) in newProduct" :key="_index" @click="bannerClick(item)">
        <div class="jx-on-sale-title">
          <div class="jx-on-sale-info">
            <div class="jx-on-sale-info-img">
              <van-image fit="fill" width="100%" height="100%" radius="50%" :src="item.brand_img" use-loading-slot>
                <img slot="loading" :src="defaultImg2">
              </van-image>
            </div>
            <div class="jx-on-sale-info-text">
              {{item.brand_name}}
            </div>
          </div>
          <button class="mini-btn" type="primary" size="mini">
            进入特卖会
          </button>
        </div>
        <div :class="['jx-on-sale-img', {'jx-on-sale-img-start': item.super_shops.length < 3}]">
          <div v-for="(k, index) in item.super_shops" :key="index">
            <div class="jx-on-sale-img-item" v-if="index < 3">
              <van-image fit="fill" width="100%" height="100%" :src="k.pic_url" use-loading-slot lazy-load>
                <img slot="loading" :src="defaultImg2">
              </van-image>
              <div class="jx-on-sale-img-price">
                ￥{{k.price / 100}}
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
            <van-count-down @finish="item.isLose = true" :time="item.countDownText" format="DD 天 HH 时 mm 分 ss 秒" />
          </div>
        </div>
      </div>
      <div class="jx-foot-bottom-text" v-if="bottomText">
        已经到底了~
      </div>
      <mp-loading :duration="900" type="dot-gray" :show="loadingShow" :animated="loadingAnimated"></mp-loading>
    </div>
    <vueShareModel :show.sync="dialogShow"></vueShareModel>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import JXheader from '../../components/header'
import { countDown } from '../../utils/index'
import vueShareModel from '../../components/share-model'

export default {
  data () {
    return {
      searchValue: '',
      loadingShow: false,
      loadingAnimated: true,
      newProduct: [],
      bottomText: false,
      page: 1,
      createInterval: [],
      createIntervalCount: 0,
      leaderInfo: {
        user_img_url: '',
        user_nickname: "",//this.$store.state.title,
        view: 0,
      },
      dialogShow: false,
    }
  },
  components: {
    JXheader,
    vueShareModel,
  },
  computed: {
    ...mapGetters([
      'defaultImg2',
    ]),
  },
  methods: {
    shareEvent () {
      this.dialogShow = !this.dialogShow
    },
    getBrandDetail () {
      this.$http.get({
        url: `/supersale/6?curr_page=${this.page}&page_size=10`,
      }).then(res => {
        if (res.code * 1 === 0) {
          let data = res.data || []
          data = data.map(item => {
            const endTime = +new Date(item.sale_end_time)
            const newDate = +new Date(item.server_time)
            return {
              ...item,
              isLose: endTime <= newDate,
            }
          })
          if (this.page === 1) {
            this.newProduct = data
            if (data.length < 10) (this.bottomText = true)
          } else {
            if (!data || data.length === 0) {
              this.page -= 1
              setTimeout(() => {
                this.bottomText = true
              }, 1000);
              return
            }
            data.map(item => {
              this.newProduct.push(item)
            })
          }
          this.newProduct.map(item => {
            this.endTimeCountDown(item)
          })
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
    bannerClick (item) {
      if (item.isLose) return
      let isLeader = wx.getStorageSync('userType')
      let page = isLeader != '' && isLeader == 2 ? 'special-sales-leader' : 'special-sales'
      wx.navigateTo({ url: `/pages/special/${page}/main?brandId=${item.brand_id}&saleEndTime=${item.sale_end_time}` });
    },
    goProducts (productsId) {
      let isLeader = wx.getStorageSync('userType')
      let page = isLeader != '' && isLeader == 2 ? 'products' : 'products-leader'
      wx.navigateTo({ url: `/pages/${page}/main?productsId=${productsId}` });
    },
  },
  created () {
  },
  mounted () {
  },
  onShow () {
    this.getBrandDetail()
    this.getView()
  },
  onHide () {
    for (let i = 0; i <= this.createInterval.length; i++) {
      clearInterval(this.createInterval[i]);
    }
    this.createInterval.splice(0, this.createInterval.length)
    this.createIntervalCount = 0
  },
  onReachBottom () {
    if (this.bottomText) return
    this.loadingShow = true
    this.page += 1
    this.getBrandDetail()
  },
}
</script>

<style lang="scss" scope>
.jx-return-header-top {
  padding-top: 205rpx;
  padding-bottom: 20rpx;
}
.jx-on-sale-info-text {
  max-width: 350rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
