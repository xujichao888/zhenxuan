<template>
  <div>
    <swiper v-if="imgUrls.length > 0" indidator-dots="imgUrls.length > 1" autoplay="true" interval="3000" indicator-dots="true">
      <block v-for="(item, index) in imgUrls" :key="index" >
        <swiper-item>
          <image class="img-ass" :src="item" mode="scaleToFill"></image>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created () {
  },
}
</script>

<style>
.log-list {
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}

.log-item {
  margin: 10rpx;
}
.img-ass {
  width: 100%;
}
</style>
