<template>
  <div :class="['jx-tabbar', {'jx-tabbar-height': isIphoneX}]">
    <div class="jx-tabBar-nav">
      <div v-for="(item, index) in navList" :key="index" class="jx-tabBar-nav-item" @click="selectNavItem(index, item.pagePath)">
        <div class="jx-tabBar-nav-item-img">
           <mp-badge :content="badgeCount" extClass="badgeGroup" v-if="badgeCount && badgeCount > 0 && index === 1"></mp-badge>
          <img :src="selectNavIndex * 1 === index ? item.selectedIconPath : item.iconPath" alt="">
        </div>
        <span class="jx-badge" v-if="false"></span>
        <span :class="['jx-tabBar-nav-item-text', {'jx-tabBar-nav-item-text-active': selectNavIndex * 1 === index}]">
          {{item.text}}
        </span>
      </div>
    </div>
    <div style="height: 30rpx;" v-if="isIphoneX"></div>
  </div>
</template>

<script>
  // import store from '../vuex/index'

  export default {
    props: ['selectNavIndex', 'badgeCount'],
    data () {
      return {
        navList: [
          {
						"text": "首页",
						"pagePath": "/pages/index/main",
						"iconPath": "/static/tabs/home.png",
						"selectedIconPath": "/static/tabs/home-active.png",
					}, {
						"text": "购物车",
						"pagePath": "/pages/shopping-cart/main",
						"iconPath": "/static/tabs/shop-cart.png",
						"selectedIconPath": "/static/tabs/shop-cart-active.png",
					}, {
						"text": "我的",
						"pagePath": "/pages/me/main",
						"iconPath": "/static/tabs/me.png",
						"selectedIconPath": "/static/tabs/me-active.png",
					},
        ],
        isIphoneX: false,
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.isIphoneX = this.$store.state.isIphoneX
      })
      console.log(this.isIphoneX);
    },
    methods: {
      /**
       * 点击导航栏
       * @param index
       */
      selectNavItem (index, pagePath) {
        if (index === this.selectNavIndex) {
          return false;
        }
        if (index == 0 && this.selectNavIndex == -1) {
          this.$emit("fetch-index");
        }
        this.bindViewTap(pagePath);
      },

      /**
       * 路由跳转
       */
      bindNavigateTo (url) {
        wx.navigateTo({
          url,
        })
      },

      /**
       * tabBar路由跳转
       */
      bindViewTap (url) {
        // 回到顶部
        if (url === '../index/main') {
          // store.commit('setGroupsID', '');
        }
        wx.switchTab({
          url,
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            if(page.route === url.replace(/\//, '')){
              page.onLoad();
            }
          },
        })
      },
    },
  }
</script>

<style lang="scss">
  .jx-tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 115rpx;
    border-top: 1px solid #eee;
    background-color: #fff;
    box-shadow: 2rpx 4rpx 8rpx 4rpx #d7d7d7;
    box-sizing: border-box;
    // display: flex;
    // align-items: center;
    z-index: 998;
  }
  .jx-tabbar-height {
    height: 145rpx;
  }

  .jx-tabBar-nav {
    width: 100%;
    display: flex;

    .jx-tabBar-nav-item {
      flex: 1;
      text-align: center;
      position: relative;
    }
    .jx-tabBar-nav-item-text {
      color: #999999;
      font-size: 22rpx;
    }
    .jx-tabBar-nav-item-text-active {
      color: #fd4c6d;
    }
    .jx-tabBar-nav-item-img {
      width: 54rpx;
      height: 54rpx;
      margin: 0 auto;
      position: relative;
      .badgeGroup{
        position: absolute;
        right: -5px;
        top: 1px;
        padding: .1em .4em;
        line-height: 1.2;
        font-size: 10px;
      }
    }
    .jx-badge {
      display: inline-block;
      width: auto;
      height: 32rpx;
      font-size: 24rpx;
      padding: 10rpx;
      border-radius: 12rpx;
      background-color: #ff4465;
      position: absolute;
    }
  }
</style>
