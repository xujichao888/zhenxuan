<template>
  <div class="jx-refund">
    <JXheader title="申请退款"></JXheader>
    <div class="yx-goods-info">
      <div class="yx-goods-img">
        <img :src="productInfo.product_logo" alt="">
      </div>
      <div class="yx-goods-text">
        <p class="jx-text-displays-ellipses">{{ productInfo.product_name }}</p>
        <div class="yx-goods-specification">
          <p class="yx-goods-sockes">{{productInfo.value_1}}&nbsp;&nbsp;&nbsp;{{productInfo.value_2}}</p>
          <p>X{{productInfo.amount}}</p>
        </div>
      </div>
    </div>
    <div class="yx-goods-apply">
      <div class="yx-goods-apply-item yx-goods-apply-carse yx-flex" @click="selectCause">
        <div>
          <span>*</span> 退款原因
        </div>
        <div v-if="!selectCauseValue || !hashRefundType">
          请选择
          <img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
        </div>
        <div v-else>
          {{cause[selectCauseValue]}}
        </div>
      </div>
      <div class="yx-goods-apply-item yx-refund-money">
        <div>
          退款金额:
          <span style="color: #eb556a;font-size: 26rpx;margin-left: 30rpx;font-weight: bold;">
            <!-- ￥ <input type="text" placeholder="退款金额" @blur="moneyChange" v-model.lazy="refundMoney" style="font-size: 36rpx;width: 100rxp;padding-left:10rpx;"> -->
            <!-- ￥<span v-if="orderStatus === 70" style="font-size: 36rpx;">{{(productInfo.price * productInfo.amount) / 100}}</span> v-if="orderStatus !== 70"-->
            ￥<input :disabled="orderStatus === 70" type="text" placeholder="退款金额" @blur="moneyChange" v-model.lazy="refundMoney" style="font-size: 36rpx;width: 100rxp;padding-left:10rpx;">
          </span>
        </div>
        <div style="font-size: 26rpx;color: #9e9e9e;margin-top: 30rpx;margin-bottom: 40rpx;">
          最多￥{{(productInfo.price * productInfo.amount) / 100}},含发货邮费￥0.00
        </div>
        <div>
          退款说明:
          <input type="text" placeholder="选填" v-model.lazy="explainValue" maxlength="50">
        </div>
      </div>
      <div class="yx-goods-apply-item yx-apply-img">
        <div>
          上传凭证：<span style="font-size: 26rpx;color: #ababab;margin-left: 27rpx;">(最多3张)</span>
        </div>
        <div class="jx-apply-img-item">
          <div class="jx-apply-img-box" v-for="(item, index) in updateImageSrc" :key="index">
            <img class="yx-close" src="/static/icons/close-icon.png" alt="" @click="deleteImage(index)">
            <img class="yx-uploading" :src="item" alt="">
          </div>
          <img v-if="updateImageSrc.length < 3" class="yx-uploading" src="/static/images/img-btn.png" alt="" @click="updateImage()">
        </div>
      </div>
    </div>
    <div class="jx-address-btn">
      <button class="mini-btn" type="primary" @click="postRefundApply">
        提交申请
      </button>
    </div>
    <mp-dialog title="test" :show="dialogShow" :buttons="[]" @close="dialogClose">
      <div class="jx-dialog-content">
        <div class="jx-dialog-content-title">
          退款原因
        </div>
        <div class="jx-dialog-content-select">
          <radio-group class="radio-group" @change="radioChange">
            <div v-for="(item, index) in cause" :key="index" class="jx-select-radio" @click="selectCauseEvent(index)">
              <div>{{item}}</div>
              <radio class="radio" :value="index" color="#ff4365" :checked="index === selectCauseValue">
              </radio>
            </div>
          </radio-group>
        </div>
        <div class="jx-address-btn">
          <button class="mini-btn" type="primary" @click="dialogClose">
            关闭
          </button>
        </div>
      </div>
    </mp-dialog>
  </div>
</template>

<script>
import JXheader from '../../components/header'
import { accMul } from '../../utils'
export default {
  data () {
    return {
      refundId: '',
      updateImageSrc: [],
      dialogShow: false,
      cause: {
        0: '订单信息拍错了',
        1: '不喜欢/不想要了',
        3: '地址等信息填写错误',
        5: '缺货',
        12: '其他原因',
      },
      selectCauseValue: '',
      explainValue: '',
      productInfo: {},
      params: {},
      refundMoney: 0,
      orderStatus: 0,
      hashRefundType: false,
    }
  },
  components: {
    JXheader,
  },
  watch: {
    selectCauseValue (val) {
      if (val !== '' && this.cause[val]) this.hashRefundType = true
      else this.hashRefundType = false
    },
    cause (arr) {
      if (this.selectCauseValue !== '' && arr[this.selectCauseValue]) this.hashRefundType = true
      else this.hashRefundType = false
    },
  },
  methods: {
    initData () {
      this.hashRefundType = false
      this.selectCauseValue = ''
      this.refundId = ''
      this.explainValue = ''
      this.updateImageSrc = []
      this.refundMoney = 0
    },
    moneyChange () {
      console.log(this.refundMoney, (this.productInfo.price * this.productInfo.amount) / 100);
      if (this.refundMoney == 0 || this.refundMoney > ((this.productInfo.price * this.productInfo.amount) / 100)) {
        wx.showToast({
          title: '退款金额不能超过实际付款金额或者为0', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
      }
    },
    getProductInfo (params) {
      this.$http.get({
        url: '/refund/order/product',
        data: params,
      }).then(res => {
        console.log(res);
        if (res.code * 1 === 0) {
          const data = res.data
          this.productInfo = data.product
          this.refundMoney = (this.productInfo.price * this.productInfo.amount) / 100
        } else {
          wx.showToast({
            title: res.msg, //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
          console.log(res);
        }
      })
    },
    postRefundApply () {
      if (!this.selectCauseValue || !this.hashRefundType) {
        wx.showToast({
          title: '请填写退款原因', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
        return
      }
      if (this.refundMoney == 0 || this.refundMoney > ((this.productInfo.price * this.productInfo.amount) / 100)) {
        wx.showToast({
          title: '退款金额不能超过实际付款金额或者为0', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
        return
      }
      let params = {
        order_id: this.params.orderId * 1,
        refund_reason: this.cause[this.selectCauseValue],
        remark: this.explainValue,
        pic_url: this.updateImageSrc,
        apply_refund: accMul(this.refundMoney, 100),
        apply_reason: this.selectCauseValue * 1,
        refund_type: this.params.refundType * 1,
        refund_count: this.productInfo.amount * 1,
        amount: this.productInfo.amount,
        attr_value_id: this.productInfo.attr_value_id,
        price: accMul(this.refundMoney, 100),
        product_id: this.productInfo.product_id,
        product_logo: this.productInfo.product_logo,
        product_name: this.productInfo.product_name,
        value_1: this.productInfo.value_1,
        value_2: this.productInfo.value_2,
      }
      let url = '/refund/apply'
      if (this.$root.$mp.query.hasOwnProperty('refundId')) {
        url = '/refund/update/apply'
        params = {
          order_id: this.params.orderId * 1,
          //refund_reason: this.cause[this.selectCauseValue],
          description: this.explainValue,
          pic_url: this.updateImageSrc,
          apply_refund: accMul(this.refundMoney, 100),
          apply_reason: this.selectCauseValue * 1,
          refund_type: this.params.refundType * 1,
          refund_count: this.productInfo.amount * 1,
        }
        if (this.$root.$mp.query && this.$root.$mp.query.is_again) params.is_again = 1
        params.id = this.$root.$mp.query.refundId * 1
      } else {
        params = {
          order_id: this.params.orderId * 1,
          //refund_reason: this.cause[this.selectCauseValue],
          description: this.explainValue,
          pic_url: this.updateImageSrc,
          apply_refund: accMul(this.refundMoney, 100),
          apply_reason: this.selectCauseValue * 1,
          refund_type: this.params.refundType * 1,
          refund_count: this.productInfo.amount * 1,
          amount: this.productInfo.amount,
          attr_value_id: this.productInfo.attr_value_id,
          price: accMul(this.refundMoney, 100),
          product_id: this.productInfo.product_id,
          product_logo: this.productInfo.product_logo,
          product_name: this.productInfo.product_name,
          value_1: this.productInfo.value_1,
          value_2: this.productInfo.value_2,
        }
      }
      console.log(params, url)
      console.log(params)
      this.$http.post({
        url: url,
        data: params,
      }).then(res => {
        if (res.code * 1 === 0) {
          wx.showToast({
            title: '申请成功！', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
          setTimeout(() => {
            if (params.id) {
              wx.navigateBack({
                delta: 1,
              })
            } else {
              wx.redirectTo({ url: `/pages/refund-detail/main?orderId=${this.params.orderId}&productId=${this.params.productId}&attrValueId=${this.params.attrValueId}` })
            }
          }, 2000)
        } else {
          wx.showToast({
            title: res.msg + '！', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
        }
      })
    },
    deleteImage (index) {
      this.updateImageSrc.splice(index, 1)
      this.$forceUpdate()
    },
    updateImage (index) {
      const _this = this
      wx.chooseImage({
        count: 3 - _this.updateImageSrc.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          const tempFilePaths = res.tempFilePaths
          _this.uploadFile(tempFilePaths)
        },
      })
    },
    uploadFile (imgs) {
      wx.showLoading({
        title: '上传中...',
        mask: true,
      });
      const _this = this
      let _ps = []
      for (let i = 0; i < imgs.length; i++) {
        let _p = new Promise((resolve, reject) => {
          const fileNameArry1 = imgs[i].split('/')
          const fileName = fileNameArry1[fileNameArry1.length - 1]
          wx.uploadFile({
            url: `${_this.$stroe.state.baseUrl}/upload/file`,
            filePath: imgs[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              "token": wx.getStorageSync('token'),
            },
            formData: {
              file_name: `leader/img/${fileName}`,
            },
            success (res) {
              const data = JSON.parse(res.data)
              if (data.code * 1 === 0) {
                resolve(data.data.file_path)
              } else {
                reject(`图片${i + 1}上传失败`)
              }
            },
          })
        })
        _ps.push(_p)
      }
      Promise.all([..._ps]).then((result) => {
        wx.hideLoading()
        _this.updateImageSrc.push(...result)
        _this.$forceUpdate()
      }).catch((error) => {
        console.error(error)
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 2000,
        })
      })
    },
    selectCause () {
      this.dialogShow = true
    },
    dialogClose () {
      this.dialogShow = false
    },
    selectCauseEvent (index) {
      this.selectCauseValue = index
      this.hashRefundType = true
      this.dialogClose()
    },
    radioChange (e) {
      console.log(e);
    },
    save () { },
    getRefundDetail (params) {
      this.$http.get({
        url: '/refund/order/applyinfo',
        data: params,
      }).then(res => {
        console.log(res);
        if (res.code * 1 === 0) {
          const data = res.data
          this.selectCauseValue = data.apply_reason
          this.explainValue = data.description
          data.refund_proof.map((item, index) => {
            this.updateImageSrc[index] = item.pic_url
          })
        } else {
          console.log(res);
        }
      })
    },
  },
  onLoad () {
    if (this.$root.$mp.query.hasOwnProperty('orderId')) {
      const query = this.$root.$mp.query
      this.params = {
        orderId: query.orderId,
        productId: query.productId,
        attrValueId: query.attrValueId,
        refundType: query.refundType,
      }
      this.getProductInfo({
        order_id: this.params.orderId * 1,
        product_id: this.params.productId * 1,
        attr_value_id: this.params.attrValueId * 1,
      })
      this.getRefundDetail({
        order_id: this.params.orderId * 1,
        product_id: this.params.productId * 1,
        attr_value_id: this.params.attrValueId * 1,
      })
    }
    this.$http.post({
      url: '/orderdetails',
      data: {
        order_id: this.params.orderId * 1,
      },
    }).then(res => {
      if (res.code * 1 === 0) {
        const data = res.data
        this.orderStatus = data.order_status
        if (data.order_status == 70) {//待发货
          this.cause = {
            0: '订单信息拍错了',
            1: '不喜欢/不想要了',
            3: '地址等信息填写错误',
            5: '缺货',
            12: '其他原因',
          }
        } else if (data.order_status == 80 || data.order_status == 99) {//已发货
          if (this.params.refundType == 2) {//仅退款
            this.cause = {
              8: '货物破损',
              1: '不喜欢/不想要了',
              9: '空包裹',
              10: '快递/物流未送到',
              11: '未按约定时间送达',
              12: '其他原因',
            }
          } else {
            this.cause = {//退货退款的
              1: '不喜欢/不想要了',
              2: '退运费',
              4: '商品与描述不符',
              6: '少发/漏发',
              7: '假冒品牌',
              12: '其他原因',
            }
          }

        }

      } else {
        console.log(res)
      }
    })
  },
  onUnload () {
    this.initData()
  },
}
</script>

<style lang="scss" scope>
.jx-refund {
  height: 100%;
  background-color: #fff;
  padding-top: 185rpx;
  box-sizing: border-box;
  .yx-flex {
    display: flex;
    justify-content: space-between;
    align-items: cetner;
  }
  .yx-goods-info {
    height: 231rpx;
    padding: 42rpx 30rpx;
    background-color: #f1f1f1;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    .yx-goods-img {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      overflow: hidden;
    }
    .yx-goods-text {
      width: 493rpx;
      font-size: 30rpx;
      height: 170rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .yx-goods-sockes {
        font-size: 26rpx;
        color: #9e9e9e;
      }
      .yx-goods-specification {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .yx-goods-apply {
    .jx-right-arriw {
      width: 14rpx;
      margin-right: 10rpx;
      height: 23rpx;
    }
    .yx-goods-apply-carse {
      height: 83rpx;
      border-bottom: 1px solid #dedede;
      div {
        line-height: 83rpx;
        span {
          color: #ff4465;
          position: relative;
          left: 10rpx;
        }
      }
    }
    .yx-goods-apply-item {
      margin-left: 27rpx;
      margin-right: 27rpx;
      font-size: 28rpx;
    }
    .yx-refund-money {
      padding-top: 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1px solid #dedede;
      input {
        display: inline-block;
        overflow: initial;
        padding-left: 30rpx;
        height: 30rpx;
      }
    }
    .yx-apply-img {
      padding-top: 30rpx;
      .jx-apply-img-item {
        margin-top: 35rpx;
        display: flex;
        align-content: center;
        .yx-uploading {
          width: 176rpx;
          height: 176rpx;
        }
        .jx-apply-img-box {
          width: 176rpx;
          height: 176rpx;
          position: relative;
          display: inline-block;
          margin-right: 48rpx;
          .yx-close {
            width: 54rpx;
            height: 54rpx;
            position: absolute;
            top: -16rpx;
            right: -26rpx;
          }
          .yx-uploading {
            border-radius: 20rpx;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .weui-dialog__wrp {
    bottom: 0;
    left: 0;
    right: 0;
    display: inline-block;
  }
  .weui-dialog__wrp .weui-dialog {
    bottom: 0;
    position: absolute;
    width: 100%;
  }
  .weui-dialog__bd {
    padding: 0;
    margin-bottom: 0;
  }
  .jx-dialog-content {
    // height: 526rpx;
    background-color: #fff;
    padding: 0 27rpx 140rpx;
    .jx-dialog-content-title {
      text-align: center;
      line-height: 108rpx;
      font-size: 38rpx;
      border-bottom: 1px solid #dedede;
    }
    .jx-dialog-content-select {
      .jx-select-radio {
        display: flex;
        justify-content: space-between;
        height: 96rpx;
        align-items: center;
        border-bottom: 1rpx solid #dedede;
        font-size: 30rxp;
        color: #333333;
      }
    }
  }
  radio .wx-radio-input {
    border: 2rpx solid #909090;
  }
  radio .wx-radio-input.wx-radio-input-checked::before {
    content: "";
    /* background: #fff; */
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    /* background: red; */
    background-color: #ff4365;
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
</style>
