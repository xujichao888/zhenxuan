<template>
    <div>
        <div class="link-game" @click="testClick">
        微乐捕鱼
        </div>
           <div class="link-game" @click="testClick1">
        微乐扑克
        </div>
          <div class="link-game" @click="testClick2">
        微乐麻将
        </div>
          <div class="link-game" @click="testClick3">
        吉祥捕鱼
        </div>
          <div class="link-game" @click="testClick4">
        吉祥麻将
        </div>
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
    methods: {
        testClick(){
           wx.navigateTo({
                url: `/pages/minigame-redpacketcover/main?product_type=wlfish`
         })
        },
          testClick1(){
           wx.navigateTo({
                url: `/pages/minigame-redpacketcover/main?product_type=wlpoker`
         })
        },
          testClick2(){
           wx.navigateTo({
                url: `/pages/minigame-redpacketcover/main?product_type=wlmahjong`
         })
        },
          testClick3(){
           wx.navigateTo({
                url: `/pages/minigame-redpacketcover/main?product_type=jxfish`
         })
        },
          testClick4(){
           wx.navigateTo({
                url: `/pages/minigame-redpacketcover/main?product_type=jxmahjong`
         })
        },
    }
}
</script>
<style lang="scss" scoped>
    .link-game{
        width: 200rpx;
        height: 100rpx;
        background: chocolate;
        color: white;
        margin-bottom: 100rpx;
    }
</style>