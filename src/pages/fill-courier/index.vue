<template>
  <div class="jx-address-editor">
    <div class="jx-address-from">
      <div class="jx-from-input">
        <picker style="width: 100%;" :value="index" :range="array" @change="bindPickerChange">
          <div class="picker">
            <div v-if="!courier">
              请选择快递
            </div>
            <div v-else>
              {{array[courier]}}
            </div>
          </div>
        </picker>
      </div>
      <div class="jx-from-input">
        <div class="jx-input-box">
          <input class="weui-input" placeholder="请输入快递单号" placeholder-class="placeholder" v-model.lazy="expressSn" />
        </div>
      </div>
      <div class="jx-from-input">
        <div>
          请输入快递运费
        </div>
        <div class="jx-input-box">
          ￥<input class="weui-input" style="display: inline-block; overflow: inherit;width: 100rpx;" v-model.lazy="refundExpress" />
        </div>
      </div>
    </div>
    <div class="jx-address-btn">
      <button class="mini-btn" type="primary" @click="save">
        提交
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      array: [],
      courier: '',
      refundId: 0,
      expressSn: '',
      refundExpress: 0,
    }
  },
  methods: {
    bindPickerChange (e) {
      console.log(e);
      this.courier = e.mp.detail.value
    },
    save () {
      const params = {
        id: this.refundId * 1,
        express_name: this.array[this.courier],
        express_sn: this.expressSn,
        refund_express: this.refundExpress * 100,
      }
      console.log(params)
      this.$http.post({
        url: '/refund/update/apply',
        data: params,
      }).then(res => {
        if (res.code * 1 === 0) {
          wx.navigateBack({
            delta: 1,
          })
          //wx.navigateTo({ url: `/pages/refund-detail/main?success=1` });
        } else {
          wx.showToast({
            title: '提交失败！', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
        }
      })
    },
    getAddrSelect () {

    },
    getExpressGetconfig () {
      this.$http.get({
        url: (process.env.NODE_NAME == 'wxjx' || process.env.NODE_NAME == 'wxjx2' || process.env.NODE_NAME == 'wxjx3' || process.env.NODE_NAME == 'wxjx4' || process.env.NODE_NAME == 'wxjx5' || process.env.NODE_NAME == 'wxjx6' || process.env.NODE_NAME == 'wxjx7' || process.env.NODE_NAME == 'wxjx8'  || process.env.NODE_NAME == 'wxjx9') ? `https://supplier.jx78.com/v1/express/getconfig` : `https://supplier.jixiangyanxuan.com/v1/express/getconfig`,  //http://supplier.jx78.com/v1/express/getconfig
      }).then(res => {
        console.log('res', res);
        if (res.status * 1 === 0) {
          this.array = []
          for (let item in res.data) {
            console.log(item);
            this.array.push(res.data[item])
          }
        } else {
          console.log(res);
        }
      })
    },
  },
  created () {
  },
  mounted () {
  },
  onShow () {
    this.array = []
    this.courier = ''
    this.refundId = 0,
      this.expressSn = ''
    this.refundExpress = 0
    if (this.$root.$mp.query.hasOwnProperty('refundId')) {
      this.refundId = this.$root.$mp.query.refundId
    }
    this.getExpressGetconfig()
  },
  onHide () {
    this.array = []
    this.courier = ''
    this.refundId = 0,
      this.expressSn = ''
    this.refundExpress = 0
  },
}
</script>

<style lang="scss" scope>
.jx-address-editor {
  background-color: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
  height: 100%;
  .jx-from-input {
    height: 90rpx;
    border-bottom: 1px solid #dedede;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .placeholder {
      color: #000;
    }
  }
  .jx-address-btn {
    position: fixed;
    bottom: 20rpx;
    left: 0;
    width: 100%;
    .mini-btn {
      width: 669rpx;
      height: 88rpx;
      border-radius: 44rpx;
      background-color: #ff4365;
      font-size: 34rpx;
      color: #fff;
    }
  }
}
</style>
