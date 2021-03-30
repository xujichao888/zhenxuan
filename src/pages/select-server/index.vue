<template>
	<div class="jx-refund">
		<JXheader title="选择服务类型"></JXheader>
		<div class="yx-goods-info">
			<div class="yx-goods-img">
				<img :src="productInfo.product_logo" alt="">
			</div>
			<div class="yx-goods-text">
				<p class="jx-text-displays-ellipses">{{ productInfo.product_name }}</p>
				<div class="yx-goods-specification">
					<p class="yx-goods-sockes">{{productInfo.value_1}}&nbsp;&nbsp;{{productInfo.value_2}}</p>
					<p>X{{productInfo.amount}}</p>
				</div>
			</div>
		</div>
		<div class="yx-goods-apply">
			<div class="yx-select-box" @click="selectClick('/pages/refund/main', 2)">
				<div class="">
					<div class="yx-select-title">
						<img class="yx-select-icon" src="/static/icons/money.png" alt="">
						<span>我要退款(无需退货)</span>
					</div>
					<div style="padding-left: 60rpx;font-size: 26rpx;color: #9e9e9e;">
						未收到货，或与卖家协商同意无需退货只退款
					</div>
				</div>
				<div>
					<img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
				</div>
			</div>
			<div class="yx-select-box" @click="selectClick('/pages/refund/main', 3)">
				<div class="">
					<div class="yx-select-title" >
						<img class="yx-select-icon" src="/static/icons/tui.png" alt="">
						<span>我要退货退款</span>
					</div>
					<div style="padding-left: 60rpx;font-size: 26rpx;color: #9e9e9e;" >
						已收到货，需要退还收到的货物
					</div>
				</div>
				<div>
					<img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import JXheader from '../../components/header'
export default {
  data () {
    return {
			refundId: '',
			updateImageSrc: [
				'',
				'',
				'',
			],
			productInfo: {},
			params: {},
    }
	},
	components: {
		JXheader,
	},
	methods: {
		getProductInfo (params) {
			this.$http.get({
				url: '/refund/order/product',
				data: params,
			}).then(res => {
				if (res.code * 1 === 0) {
					const data =res.data
					this.productInfo = data.product
				} else {
					console.log(res);
				}
			})
		},
		selectClick (page, refundType) {
			let url = `${page}?orderId=${this.params.orderId}&productId=${this.params.productId}&attrValueId=${this.params.attrValueId}&refundType=${refundType}`
			if(this.refundId !== '') url += `&refundId=${this.refundId}&is_again=1`
			wx.redirectTo({ url });
		},
	},
  created () {
	},
	mounted () {
	},
	onShow () {
		console.log(this.$root.$mp.query)
		if (this.$root.$mp.query.hasOwnProperty('orderId')) {
			const query = this.$root.$mp.query
			if(query.refundId){
				this.refundId = query.refundId
			} else {
				this.refundId = ''
			}
			this.params = {
				orderId: query.orderId,
				productId: query.productId,
				attrValueId: query.attrValueId,
			}
			this.getProductInfo({
				order_id: this.params.orderId * 1,
				product_id: this.params.productId * 1,
				attr_value_id: this.params.attrValueId * 1,
			})
		}
	},
}
</script>

<style lang="scss" scope>
	.jx-refund {
		height: 100%;
		background-color: #fff;
		padding-top: 185rpx;
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
		.jx-right-arriw {
			width: 14rpx;
			margin-right: 10rpx;
			height: 23rpx;
		}
		.yx-select-icon {
			width: 42rpx;
			height: 42rpx;
			margin-right: 18rpx;
		}
		.yx-select-box {
			margin-left: 27rpx;
			margin-right: 27rpx;
			border-bottom: 1px solid #dedede;
			height: 125rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			.yx-select-title {
				display: flex;
				align-items: center;
			}
		}
	}
</style>
