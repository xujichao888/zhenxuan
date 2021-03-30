<template>
  <mp-dialog title=" " :show="show" bindbuttontap="tapDialogButton" @close="closeDialog" :buttons="dialogButtons" class="jx-specification">
      <div class="jx-content">
        <div class="jx-goods-info">
					<div>
						<!-- <img :src="!selectSize ?  :  data.colorImg[selectSize]" alt=""> -->
						<img :src="data.product_img[0]" alt="">
					</div>
					<div class="jx-goods-text">
						<p class="jx-text-displays-ellipses jx-goods-name">
							{{data.product_name}}
						</p>
						<p>
							<span class="jx-new-price">￥ <span>{{money.goodsMoney}}</span></span>
							<span class="jx-old-price" v-if="money.oldMoney">￥{{money.oldMoney}}</span>
						</p>
					</div>
				</div>
        <div class=" jx-margin-bottom-20 jx-products-specification">
					<div class="jx-color-specification" v-for="(k, __index) in data.attributeInfos" :key="__index">
						<div>
							<span style="font-weight: 400;">
								{{k.text}}
							</span>
							<span style="color: #9e9e9e;margin-left: 30rpx;">
								已选择 
								<span style="margin-left: 5rpx;" v-if="selectSpecification[k.key]">"{{selectSpecification[k.key]}}"</span>
							</span>
						</div>
						<div style="margin-top: 18rpx;">
							<span
								v-for="(item, index) in k.list"
								:key="index"
								:class="['jx-select-color', {'jx-select-color-action': item === selectSpecification[k.key]}]"
								@click="selectColorEvent(item, k.key)">
									{{item}}
							</span>
						</div>
					</div>
					<div class="jx-specification-count">
						<div style="font-weight: 400;">购买数量</div>
						<div class="jx-specification-input-count">
							<span :class="['jx-input-count jx-subtracts', {'jx-forbid': isSubtracts, 'jx-allow': !isSubtracts}]" @click="subtractsGoods">-</span>
							<span class="jx-input-count jx-count">{{goodsCount}}</span>
							<span class="jx-input-count jx-plus jx-allow" @click="plusGoods">+</span>
						</div>
					</div>
				</div>
        		<div class="jx-btn">
					<button class="mini-btn" type="primary" @click="postSelect" v-if="!shortage">
							确定
					</button>
					<button class="mini-btn empty" style="background-color: #989898;" type="primary" v-else>
							已售罄
					</button>
				</div>
				<div style="height: 30rpx;" v-if="isIphoneX"></div>
      </div>
    </mp-dialog>
</template>

<script>
export default {
	props: {
		show: {
			required: true,
			default: false,
			type: Boolean,
		},
		data: {
			required: true,
		},
		buyGoods: {
			required: true,
		},
		selectColorSize: {
			required: true,
		},
		money: {
			required: true,
			default: {
				goodsMoney: 0,
				oldGoodsMoney: 0,
			},
		},
		selectSpecification: {
			required: true,
		},
		goodsCountTotal: {
			required: true,
		},
		shortage:{
			type: Boolean,
			default: false,
		},
	},
  data () {
    return {
			dialogButtons: [],
			goodsCount: 1,
			isSubtracts: true,
			selectColor: '',
			selectSize: '',
			isIphoneX: false,
    }
	},
	methods: {
		closeDialog () {
			this.selectSize = ''
			this.selectColor = ''
			this.isSubtracts = ''
			this.goodsCount = 1
			this.$forceUpdate()
			this.$emit('update:show', false)
		},
		subtractsGoods () {
			if (this.goodsCount === 1) return 
			this.goodsCount -= 1
			if (this.goodsCount === 1) this.isSubtracts = true
		},
		plusGoods () {
			if (this.goodsCountTotal !== 0 && this.goodsCountTotal === this.goodsCount) {
				wx.showToast({
					title: '超出商品库存', //提示的内容,
					duration: 1000,
					icon: 'none',
				});
				return
			}
			this.goodsCount += 1
			this.isSubtracts = false
		},
		selectColorEvent (value, key) {
			this.$emit('selectColorSize', {value: value, key: key})
		},
		postSelect () {
			this.$emit('buyGoods', {color: this.selectColor, size: this.selectSize, count: this.goodsCount})
		},
	},
  mounted () {
		this.isIphoneX = this.$store.state.isIphoneX
	},
}
</script>

<style lang="scss" scope>
	.jx-specification {
		.weui-dialog__wrp {
      bottom: 0;
      left: 0;
			right: 0;
			display: inline-block;
			.weui-dialog  {
				width: 100%;
				position: absolute;
				bottom: 0;
				left: 0;
				text-align: left;
				.weui-dialog__bd {
					padding: 0;
					margin-bottom: 0;
				}
			}
		}
		.jx-content {
			width: 100%;
			background-color: #fff;
			border-top-right-radius: 30rpx;
			border-top-left-radius: 30rpx;
			padding: 40rpx 40rpx 20rpx;
			box-sizing: border-box;
			.jx-products-specification {
				color: #333333;
				font-size: 28rpx;
			}
			.jx-goods-info {
				display: flex;
				.jx-goods-text {
					margin-left: 25rpx;
					.jx-goods-name {
						font-size: 30rpx;
						color: #333333;
						margin-bottom: 20rpx;
					}
					.jx-new-price {
						font-size: 26rpx;
						color: #eb556a;
						span {
							font-size: 36rpx;
							margin-left: 10rpx;
						}
					}
					.jx-old-price {
						margin-left: 22rpx;
						font-size: 24rpx;
						color: #a4a4a4;
						text-decoration: line-through;
					}
				}
				img {
					height: 160rpx;
					width: 160rpx;
				}
			}
			.mini-btn {
				height: 87rpx;
				background-color: #ff4365;
				border-radius: 43.5rpx;
			}
		}
	}
</style>
