<template>
  <div class="jx-brand-classifi jx-body">
    <div class="jx-brand-calssifi-list">
      <scroll-view scroll-y="true">
        <div v-for="item in brandClassifiList" :key="item.id" @click="selectBrandClassify(item.id)" class="jx-brand-classfi-item-box">
          <div :class="['jx-brand-classfi-item', {'jx-brand-classfi-item-active': item.id === brandClassifiActive}]">
            {{item.name}}
          </div>
        </div>
      </scroll-view>
    </div>
    <div class=" jx-brand-content">
      <p>为你推荐</p>
      <div class="jx-card jx-brand-sroll-box">
        <scroll-view class="jx-brand-list-scroll" scroll-y="true">
          <div :class="['jx-brand-item-box',  {'jx-brand-item-box-start': brandList.length < 3}]">
            <div v-for="item in brandList" :key="item.id" :class="['jx-brand-list-item', {'jx-brand-list-item-margin': brandList.length < 3}]" @click="bannerClick(item)">
              <div class="jx-brand-list-item-img">
                <img :src="item.brand_logo" alt="">
              </div>
              <p class="jx-brand-item-name">{{item.brand_name}}</p>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      brandList: [],
      brandClassifiList: [],
      brandClassifiActive: 1,
    }
	},
	methods: {
    selectBrandClassify (id) {
      console.log(id);
      this.brandClassifiActive = id;
      this.getCategoryBrand()
    },
    getCategory () {
      wx.showLoading({
        title: '数据请求中...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      this.$http.get({
        url: '/category',
      }).then( res => {
        if (res.code * 1 === 0) {
          const data = res.data
          this.brandClassifiList = data.title_bar
          this.brandClassifiActive = this.brandClassifiList[0].id
          this.getCategoryBrand()
        } else {
          console.log(res)
        }
      });
    },
    getCategoryBrand () {
      this.$http.get({
        url: '/category',
        data: {
          category_id: this.brandClassifiActive,
        },
      }).then( res => {
        wx.hideLoading()
        if (res.code * 1 === 0) {
          const data = res.data
          this.brandList = data
        } else {
          console.log(res)
        }
      });
    },
    bannerClick (item) {
      let isLeader = wx.getStorageSync('userType')
      let page = isLeader != '' && isLeader == 2 ? 'special-sales-leader' : 'special-sales'
      wx.navigateTo({ url: `/pages/special/${page}/main?brandId=${item.id}` });
    },
	},
  created () {
	},
	mounted () {
  },
  onShow () {
    this.getCategory()
  },
}
</script>

<style lang="scss" scope>
  .jx-body {
    padding-bottom: 0;
  }
  .jx-brand-classifi {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
     .jx-brand-calssifi-list {
      width: 187rpx;
      background-color: #fff;
      height: 100%;
      border-top: 4rpx solid #f1f1f1;
      box-sizing: border-box;
      ._scroll-view {
        height: 100%;
      }
      .jx-brand-classfi-item-box {
        height: 100rpx;
        padding-top: 30rpx;
        padding-bottom: 30rpx;
        box-sizing: border-box;
      }
      .jx-brand-classfi-item {
        font-size: 30rpx;
        color: #000;
        height: 50rpx;
        width: 128rpx;
        line-height: 50rpx;
        text-align: center;
        margin: 0 auto;
        padding: 0;
      }
      .jx-brand-classfi-item-active {
        background-color: #fe5c7a;
        border-radius: 31rpx;
        color: #fff;
        padding-top: 0rpx;
        padding-bottom: 0rpx;
      }
    }
    .jx-brand-content {
      width: 600rpx;
      background-color: #f1f1f1;
      padding-top: 40rpx;
      padding-left: 20rpx;
      padding-right: 20rpx;
      .jx-brand-sroll-box {
        height: 95%;
      }
      .jx-brand-list-scroll {
        height: 100%;       
        .jx-brand-item-box {
          width: 520rpx;
          padding: 20rpx;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .jx-brand-item-box-start {
          justify-content: flex-start;
        }
        .jx-brand-list-item {
          text-align: center;
          width: 135rpx;
          margin-bottom: 30rpx;
        }
        .jx-brand-list-item-margin {
           margin-right: 55rpx;
        }
        .jx-brand-list-item-img {
          width: 135rpx;
          height: 135rpx;
          border-radius: 50%;
          overflow: hidden;
          background-color: #efefef;
          font-size: 0;
        }
        .jx-brand-item-name {
          color: #9f9e9e;
          font-size: 24rpx;
          margin-top: 20rpx;
          width: 100%;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
      }
      & > p {
        font-size: 28rpx;
        margin-bottom: 20rpx;
      }
    }
  }
</style>
