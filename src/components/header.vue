<template>
  <header class="jx-defult-header" :style="{backgroundImage: bgImg ? '': 'linear-gradient(to right, #efd3b6, #dfb58f)'}">
    <img v-if="bgImg" src="/static/images/return-header-bg.png" alt="">
    <div class="jx-title">
      <div :style="{height: navBarHeight + 'px'}"></div>
      <div class="jx-title-text" :style="{height: titleBarHeight + 'px', lineHeight: titleBarHeight + 'px', color: titleColor}">
        <div class="jx-header-return" @click="returnTop">
          <img v-if="titleColor === 'white'" src="/static/icons/return.png" alt="">
          <img v-else-if="titleColor === 'black'" src="/static/icons/return-black.png" alt="">
        </div>
        {{title}}
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import { setNavBarHeight } from '../utils/index'
export default {
  props: {
    title: {
      required: false,
      default: this.barTitle,
    },
    bgImg: {
      reuired: false,
      default: true,
    },
    titleColor: {
      reuired: false,
      default: 'white',
    },
  },
  data () {
    return {
      titleBarHeight: 44,
      navBarHeight: 0,
    }
  },
  computed: {
    ...mapGetters([
      'barTitle',
    ]),
  },
  methods: {
    returnTop () {
      wx.navigateBack({
        delta: 1,
      });
    },
  },
  created () {
    setNavBarHeight(this)
  },
}
</script>

<style lang="scss" scope>
.jx-defult-header {
  width: 100%;
  height: 185rpx;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  font-size: 0;
  .jx-title {
    position: absolute;
    z-index: 10000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    &-text {
      font-size: 38rpx;
      text-align: center;
      position: relative;
    }
    .jx-header-return {
      width: 100rpx;
      height: 88rpx;
      position: absolute;
      left: 0;
      bottom: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 18rpx;
        height: 30rpx;
        line-height: 40rpx;
        display: block;
        // line-height: 40rpx;
        // position: absolute;
        // bottom: 25rpx;
        // left: 40rpx;
      }
    }
  }
}
</style>
