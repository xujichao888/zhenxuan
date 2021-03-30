<template>
  <div class="jx-search">
    <div class="jx-search-box">
      <div class="jx-search-input">
        <img src="/static/icons/magnifying-icon.png" alt="">
        <input type="text" :placeholder="placeholder" ref="searchInput" @focus="placeholder = ''" focus v-model="searchValue" @blur="bindKeyInput">
        <img v-if="searchValue !== ''" class="jx-search-close" src="/static/icons/close-btn.png" alt="" @click="closeInput">
      </div>
    </div>
    <div class="jx-search-null-box" v-if="searchList.length === 0 && !isIn">
      <div class="jx-search-null">
        <img src="/static/images/search-null.png" alt="">
      </div>
      <p>暂无匹配结果</p>
    </div>
    <div class="jx-search-list" v-else>
      <div v-for="item in searchList" :key="item.id" class="jx-search-list-item jx-card" @click="goProducts(item.id)">
        <div class="jx-search-list-item-img">
          <van-image v-if="item" fit="fill" width="100%" height="100%" :src="item.pic_url" use-loading-slot lazy-load>
            <img slot="loading" :src="defaultImg2">
          </van-image>
        </div>
        <div class="jx-search-list-item-text">
          {{item.product_name}}
        </div>
        <div class="jx-search-list-item-sales">
          销量{{item.sales_volume}}
        </div>
        <div class="jx-search-list-item-rate">
          <span>￥{{(item.price + item.premium_price) / 100}}</span>
          <span class="jx-search-list-item-oldrate" v-if="item.pre_price">￥{{(item.pre_price + item.premium_price) / 100}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      placeholder: '商品名称/品牌',
      searchValue: '',
      searchList: [],
      isIn: true,
    }
  },
  onLoad () {
    this.isIn = true
  },
  computed: {
    ...mapGetters([
      'defaultImg2',
    ]),
  },
  methods: {
    closeInput () {
      this.placeholder = '商品名称/品牌'
      this.searchValue = '';
      wx.hideKeyboard();
      this.getSearchList('', 1)
    },
    bindKeyInput () {
      if (this.searchValue === '') this.placeholder = '商品名称/品牌'
      setTimeout(() => {
        if (this.value === this.max) {
          this.isIn = false
          this.getSearchList(this.searchValue, 1)
        }
      }, 200)
    },
    getSearchList (content, currPage) {
      if (!content) {
        this.isIn = true
        this.searchList = []
        return
      }
      this.$http.get({
        url: `/goods/search?curr_page=${currPage}&page_size=10&content=${content}`,
      }).then(res => {
        console.log(res)
        const data = res.data
        this.searchList = data
      });
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
    //this.getSearchList('',1);
  },
  onUnload () {
    this.searchValue = ''
    this.searchList = []
  },
}
</script>

<style lang="scss" scope>
.jx-search-box {
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
}
.jx-search-input {
  position: relative;
  padding-right: 30rpx;
  padding-left: 30rpx;
  input {
    height: 70rpx;
    background-color: #f7f7f7;
    border-radius: 35rpx;
    padding-left: 80rpx;
    padding-right: 70rpx;
  }
  img {
    width: 29rpx;
    height: 29rpx;
    position: absolute;
    left: 59rpx;
    top: 23rpx;
  }
  .jx-search-close {
    width: 31rpx;
    height: 31rpx;
    right: 59rpx;
    left: auto;
  }
}
.jx-search-null-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
  .jx-search-null {
    width: 268rpx;
    height: 284rpx;
  }
  p {
    margin-top: 50rpx;
    font-size: 30rpx;
    color: #858585;
  }
}
</style>
