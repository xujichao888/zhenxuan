<template>
	<div class="jx-confirm-order jx-order-details" v-if="isIn">
		<div class="jx-order-type">
			<div>
				<p class="jx-order-title">{{orderType[orderTypeValue].title}}</p>
				<p v-if="orderTypeValue === 20" class="time">
					<van-count-down @finish="timefinish(orderTypeValue)" 
					:time="countDown" 
					format=" mm 分 ss 秒 后自动关闭" />
				</p>
				<p v-else-if="orderTypeValue == 99">{{isService ? orderType[orderTypeValue].content : '订单已完成'}}</p>
				<p v-else>{{orderType[orderTypeValue].content}}</p>
			</div>
			<div class="jx-order-type-icon">
				<img :src="orderType[orderTypeValue].icon" alt="">
			</div>
		</div>
		<div class="jx-address" >
			<div class="jx-address-info">
				<div class="jx-address-icon" >
					<img src="/static/icons/address-icon.png" alt="">
				</div>
				<div class="jx-address-content">
					<div class="jx-address-title">
						<span>{{orderInfo.shipping_user}}</span>
						<span style="margin-left: 20rpx;" >{{orderInfo.telephone}}</span>	
					</div>
					<div class="jx-text-displays-ellipses">
						{{orderInfo.full_address}}
					</div>
				</div>
				<div class="jx-right-arrow">
					<!-- <img src="/static/icons/gray-right-arrow.png" alt=""> -->
				</div>
			</div>
			<div class="jx-line-img">
				<img src="/static/icons/address-line.png" alt="">
			</div>
		</div>
		<div class="jx-order-list">
			<div class="jx-goods-title jx-padding-30 jx-flex-align">
				<div class="jx-img">
					<img :src="orderInfo.brand_logo" alt="">
				</div>
				<span>{{orderInfo.brand_name}}</span>
			</div>
			<div v-for="(item, index) in orderInfo.list" :key="index">
				<div class="jx-goods-info jx-padding-30 jx-flex-align"  @click="goProducts(item.product_id)">
					<div class="jx-img">
						<img :src="item.product_logo" alt="">
					</div>
					<div class="jx-order-content">
						<div class="jx-text-displays-ellipses">
							{{item.product_name}}
						</div>
						<div class="jx-order-size">
							<!-- <span style="margin-right: 35rpx;">颜色: {{item.value_1}}</span>
							<span>尺码: {{item.value_2}}</span> -->
							<div>
								<span style="margin-right: 35rpx;" v-if="item.value_1">{{item.value_1}}</span>
								<span v-if="item.value_2">{{item.value_2}}</span>
							</div>
							<span>X{{item.product_cnt}}</span>
						</div>
						<div class="jx-money">
							￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{item.product_price / 100}}</span>
						</div>
					</div>
				</div>
				<div class="yx-refund-btn" v-if="isShowrefundBtn">
					<button 
						class="mini-btn" 
						type="primary" size="mini" 
						@click="drawback(orderInfo.order_id, item.product_id, item.attr_value_id, item.refund_status)" 
						v-if="item.refund_status === 40 && orderTypeValue === 70">
						退款拒绝
					</button>
					<button class="mini-btn" type="primary" size="mini" @click="refund(orderInfo.order_id, item.product_id, item.attr_value_id, item.refund_status)" v-else-if="item.refund_status">
						{{ refundStatusText[item.refund_status] }}
					</button>
					<button class="mini-btn" type="primary" size="mini" @click="refund(orderInfo.order_id, item.product_id, item.attr_value_id)" v-else-if="orderTypeValue == 99 && isService">
						{{ refundText }}
					</button>
					<button class="mini-btn" type="primary" size="mini" @click="refund(orderInfo.order_id, item.product_id, item.attr_value_id)" v-else-if="orderTypeValue != 99">
						{{ refundText }}
					</button>
				</div>
				<div class="yx-refund-btn" v-else-if="item.refund_status && (orderTypeValue != 99 || orderTypeValue == 99 && (isService || item.refund_status != 40 && item.refund_status != 200 && item.refund_status != 10))">
					<button class="mini-btn" type="primary" size="mini" @click="drawback(orderInfo.order_id, item.product_id, item.attr_value_id, item.refund_status)">
						{{ refundStatusText[item.refund_status] }}
					</button>
				</div>
			</div>
			<div class="jx-order-freight jx-padding-30 jx-flex-align">
				<div>商品总价:</div>
				<div>
					<div class="jx-money">
						￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{orderInfo.payment_money / 100}}</span>
					</div>
				</div>
			</div>
			<div class="jx-order-freight jx-padding-30 jx-flex-align">
				<div>{{orderTypeValue === 20 || orderTypeValue == 1 && orderInfo.auto_close < 2 ? '需付款' : '实付款'}}:</div>
				<div>
					<div class="jx-money">
						￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{orderInfo.payment_money / 100}}</span>
					</div>
				</div>
			</div>
			<div  style="margin-top: 20rpx;" class="jx-order-info">
				<div class="jx-order-freight jx-padding-30 jx-flex-align">
					<div>交易订单:</div>
					<div style="color: #222222;">
						{{orderInfo.order_sn}}
					</div>
				</div>
				<div class="jx-order-freight jx-padding-30 jx-flex-align">
					<div>下单时间:</div>
					<div style="color: #222222;">
						<!-- 2019-07-21 <span style="margin-left: 40rpx;">15:12:23</span> -->
						{{orderInfo.create_time}}
					</div>
				</div>
				<div class="jx-order-freight jx-padding-30 jx-flex-align" v-if="orderInfo.pay_time !== ''">
					<div>付款时间:</div>
					<div style="color: #222222;">
						{{orderInfo.pay_time}}
					</div>
				</div>
				<!-- <div class="jx-order-freight jx-padding-30 jx-flex-align" v-if="orderInfo.payment_method !== ''">
					<div>交易方式:</div>
					<div style="color: #222222;">
						{{payStatus[orderInfo.payment_method]}}
					</div>
				</div> -->
				<div class="jx-order-freight jx-padding-30 jx-flex-align" v-if="orderInfo.cancel_time === 2">
					<div>取消订单时间:</div>
					<div style="color: #222222;">
						{{orderInfo.cancel_time}}
					</div>
				</div>
				<div class="jx-order-freight jx-padding-30 jx-flex-align" v-if="orderInfo.shipping_time !== ''">
					<div>发货时间:</div>
					<div style="color: #222222;">
						{{orderInfo.shipping_time}}
					</div>
				</div>
				<div class="jx-order-freight jx-padding-30 jx-flex-align" v-if="orderInfo.receive_time !== ''">
					<div>确认收货时间:</div>
					<div style="color: #222222;">
						{{orderInfo.receive_time}}
					</div>
				</div>
			</div>
		</div>
		<div class="jx-handle-btn jx-padding-30" v-if="orderTypeValue * 1 === 20">
			<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="closeOrder">
				取消订单
			</button>
			<button class="mini-btn" type="primary" size="mini" @click="payOrder(orderInfo.order_id)">
				去支付
			</button>
		</div>
		<div class="jx-handle-btn jx-padding-30" v-if="orderTypeValue * 1 === 80">
			<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="lookLogistics(orderInfo.order_sn)">
				查看物流
			</button>
			<button class="mini-btn" type="primary" size="mini" @click="closeOrder">
				确认收货
			</button>
		</div>
		<mp-dialog title="test" ext-class="dialog-wrap" :show="dialogShow" :buttons="[]" :mask-closable="false">
			<div class="jx-dialog-content" v-if="orderTypeValue * 1 === 20">
				<p>确定取消该订单？</p>
				<div class="jx-dialog-btn">
						<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="closeOrderEvent">
							取消订单
						</button>
						<button class="mini-btn" type="primary" size="mini" @click="closeDialog">
							我再想想
						</button>
				</div>
			</div>
			<div class="jx-dialog-content" v-if="orderTypeValue * 1 === 80">
				<p>确定收到订单商品了吗？</p>
				<div class="jx-dialog-btn">
						<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="closeDialog">
							取消
						</button>
						<button class="mini-btn" type="primary" size="mini" @click="takeGoods">
							确定
						</button>
				</div>
			</div>
		</mp-dialog>
	</div>
</template>

<script>
export default {
  data () {
    return {
			isService:false,
			isIn:false,
			countDown:0,
			orderType: {
				20: {
					icon: '/static/icons/obligation2.png',
					title: '待付款',
					content: '15分钟自动关闭',
				},
				70: {
					icon: '/static/icons/send-goods3.png',
					title: '待发货',
					content: '正在等待发货',
				},
				80: {
					icon: '/static/icons/wait-receiving4.png',
					title: '待收货',
					content: '七天后自动确认收货',
				},
				99: {
					icon: '/static/icons/off-stocks5.png',
					title: '已完成',
					content: '质量问题，7天内可申请退款',
				},
				1: {
					icon: '/static/icons/closed6.png',
					title: '已关闭',
					content: '订单已关闭',
				},
				2: {
					icon: '/static/icons/closed6.png',
					title: '已关闭',
					content: '订单已关闭',
				},
			},
			orderTypeValue: 2,
			dialogShow: false,
			orderId: 0,
			orderInfo: {},
			payStatus: {
				0: '微信支付',
				1: '现金支付',
				2: '余额支付',
				3: '网银支付',
				4: '支付宝支付',
				5: '微信支付',
			},
			refundText: '申请售后',
			isShowrefundBtn: false,
			refundPages: '',
			refundStatusText: {
				1: '退款待处理',
				10: '已关闭', 
				40: '退款拒绝',
				70: '待退货',
				80: '等待商家确认收货', 
				90: '待商家退款',
				100: '退款中',
				200: '退款成功',
			},
    }
	},
	methods: {
		timefinish (type){
			switch (type) {
				case 20:
					this.orderTypeValue = 1
					break;
				default:
					break;
			}
		},
		closeOrder () {
			this.dialogShow = true
		},
		closeDialog () {
			this.dialogShow = false
		},
		closeOrderEvent () {
			this.$http.post({
				url: '/order/cancel',
				data: {
					order_id: Number(this.orderId),
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					this.dialogShow = false
					wx.showToast({
						title: '取消成功',
						icon: 'none',
						duration: 1000,
					})
					setTimeout(()=>{
						wx.navigateBack({
							delta: 1,
						})
					},1000)
				}
			})
		},
		takeGoods () {
			this.$http.post({
				url: '/order/confirm',
				data: {
					order_id: this.orderId * 1,
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					this.dialogShow = false
					wx.showToast({
						title: '操作成功',
						icon: 'none',
						duration: 1000,
					})
					setTimeout(() => {
						this.getOrderDetails()
					}, 1000)
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none',
						duration: 1000,
					})
				}
			})
		},
		getOrderDetails () {
			this.$http.post({
				url: '/orderdetails',
				data: {
					order_id: this.orderId * 1,
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					const data =res.data
					this.orderInfo = data
					this.orderTypeValue = this.orderInfo.order_status
					if(this.orderTypeValue === 20){
						this.createCountdown()
					}
					this.isShowrefundBtn = false
					switch (this.orderInfo.order_status * 1) {
						case 70:
							this.refundText = '申请退款'
							this.refundPages = '/pages/refund/main?refundType=1'
							this.isShowrefundBtn = true
							break
						case 80:
							this.refundText = '申请售后'
							this.refundPages = '/pages/select-server/main'
							this.isShowrefundBtn = true
							break
						case 99:
							if (this.orderInfo.hasOwnProperty('receive_time')) {
								const endTimeArr = this.orderInfo.receive_time.replace(/-/g, '/')
								let now_time = this.orderInfo.server_time.replace(/-/g, '/') 
								const entTime = +new Date(endTimeArr)
								const newTime = +new Date(now_time)
								let cuntDownTime = newTime - entTime
								if (cuntDownTime < 3600 * 24 * 7 * 1000) {
									this.refundText = '申请售后'
									this.isShowrefundBtn = true
									this.isService = true
									this.refundPages = '/pages/select-server/main'
								} else {
									this.isService = false
								}
							}
							break
					}
					 this.$nextTick(() => {
						this.isIn = true
					 })
				} else {
					console.log(res)
				}
			})
		},
		createCountdown (){
			let createTime = this.orderInfo.create_time.replace(/-/g, '/')
			let newTime = this.orderInfo.server_time.replace(/-/g, '/') 
			newTime = +new Date(newTime)
			createTime = +new Date(createTime) 
			let endTime = new Date()
			endTime.setTime(createTime + 15000*60)
			if(new Date(endTime) - newTime <= 1000){
				this.orderTypeValue = 1
				return
			}
			this.countDown = new Date(endTime) - newTime
		},
		lookLogistics (id) {
			//this.isOrderStatus = true
			wx.navigateTo({ url: `/pages/logistics-info/main?orderSn=${id}`});
		},
		payOrder (ordderId) {
			wx.showLoading({
				title: '正在支付中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.$http.post({
				url: '/order',
				data: {
					order_id: ordderId,
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					const data = res.data
					this.requestPayment(data)
				} else {
					console.log(res);
					wx.showToast({
						title: res.msg, //提示的内容,
						icon: 'none', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					});
				}
			})
		},
		requestPayment (params) {
			wx.requestPayment({
				timeStamp: params.timeStamp.toString(),
				nonceStr: params.nonceStr,
				package: params.package,
				signType: 'MD5',
				paySign: params.paySign,
				success (res) { 
					console.log('success', res)
					// if (res.errMsg == 'requestPayment:ok') { 

					// }
					wx.redirectTo({
						url: '/pages/withdraw-status/main?status=1',
					})
				},
				fail (res) {
					console.log(res)
					wx.redirectTo({
						url: '/pages/withdraw-status/main?status=0',
					})
				},
			})
		},
		goProducts (productsId) {
      wx.navigateTo({ url: `/pages/products/main?productsId=${productsId}` });
		},
		drawback (orderId, productId, attrValueId, type){
			wx.navigateTo({ url: `/pages/refund-detail/main?orderId=${orderId}&productId=${productId}&attrValueId=${attrValueId}` })
		},
		refund (orderId, productId, attrValueId, type) {
			console.log(type);
			if (type) {
				this.refundPages = '/pages/refund-detail/main'
			}
			if (this.refundPages.indexOf('?') > -1) {
				wx.navigateTo({ url: `${this.refundPages}&orderId=${orderId}&productId=${productId}&attrValueId=${attrValueId}` });
			} else {
				wx.navigateTo({ url: `${this.refundPages}?orderId=${orderId}&productId=${productId}&attrValueId=${attrValueId}` });
			}
		},
	},
	onShow (){
		if (this.$root.$mp.query.hasOwnProperty('ordertype') && this.$root.$mp.query.hasOwnProperty('orderId')) {
			this.orderTypeValue = this.$root.$mp.query.ordertype
			this.orderId = this.$root.$mp.query.orderId
			this.getOrderDetails()
		}
	},
}
</script>

<style lang="scss" scope>
	.jx-confirm-order {
		height: 100%;
		box-sizing: border-box;
		.jx-address {
			height: 213rpx;
			width: 100%;
			background-color: #fff;
			position: relative;
			&-info {
				width: 100%;
				height: 100%;
				padding: 35rpx 30rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.jx-address-content {
					width: 570rpx;
					font-size: 28rpx;
					color: #333333;
				}
				.jx-address-title {
					font-size: 34rpx;
					color: #333333;
					font-weight: bold;
				}
				.jx-text-displays-ellipses {
					margin-top: 25rpx;
				}
				.jx-address-icon {
					width: 34rpx;
					height: 42rpx;
					font-size: 0;
				}
				.jx-right-arrow {
					width: 14rpx;
					height: 23rpx;
					font-size: 0;
				}
			}
			.jx-line-img {
				position: absolute;
				bottom: -2rpx;
				width: 100%;
				height: 7rpx;
				left: 0;
				font-size: 0;
			}
		}
		.jx-order-list {
			margin-top: 20rpx;
			box-sizing: border-box;
			width: 100%;
			.jx-order-info {
				
			}
			.jx-goods-title {
				background-color: #fff;
				height: 78rpx;
				font-size: 28rpx;
				.jx-img {
					width: 43rpx;
					height: 43rpx;
					border-radius: 5rpx;
					margin-right: 20rpx;
				}
			}
			.jx-goods-info {
				height: 218rpx;
				.jx-img {
					width: 170rpx;
					height: 170rpx;
					border-radius: 10rpx;
					margin-right: 30rpx;
					overflow: hidden;
				}
				.jx-order-content {
					width: 490rpx;
					padding: 8rpx;
					height: 172rpx;
					box-sizing: border-box;
					.jx-text-displays-ellipses {
						font-size: 30rpx;
						font-weight: 500;
					}
					.jx-order-size {
						font-size: 26rpx;
						color: #9e9e9e;
						display: flex;
						justify-content: space-between;
					}
				}
			}
			.yx-refund-btn {
				height: 91rpx;
				background-color: #fff;
				align-items: center;
				justify-content: flex-end;
				display: flex;
				border-bottom: 1px solid #f1f1f1;
				padding-right: 20rpx;
				.mini-btn {
					margin: 0;
					height: 58rpx;
					border-radius: 29rpx;
					background-color: #ff4365;
					padding-right: 32rpx;
					padding-left: 32rpx;
					line-height: 58rpx;
				}
			}
			.jx-order-ramark {
				border-bottom: 2rpx solid #f1f1f1;
				justify-content: space-between;
				input {
					width: 610rpx;
					text-align: right;
				}
			}
			.jx-order-freight {
				justify-content: space-between;
				border-bottom: 2rpx solid #f1f1f1;
			}
			.jx-order-ramark, .jx-order-freight {
				background-color: #fff;
				padding-top: 30rpx;
				padding-bottom: 30rpx;
				color: #666666;
				font-size: 28rpx;
			}
		}
		.jx-padding-30 {
			padding: 0 30rpx;
		}
		.jx-flex-align {
			display: flex;
			align-items: center;
		}
		.jx-money {
			font-size: 26rpx;
			font-weight: 500;
			color: #eb556a;
		}
	}
	.jx-order-details {
		.jx-order-type {
			width: 100%;
			height: 150rpx;
			box-sizing: border-box;
			padding: 34rpx 70rpx 34rpx 85rpx;
			background-color: #ff4365;
			font-size: 30rpx;
			color: #fff;
			display: flex;
			justify-content: space-between;
			.time{
				.van-count-down{
					color: white;
				}
			}
			.jx-order-title {
				font-size: 40rpx;
				margin-bottom: 10rpx;
			}
			.jx-order-type-icon {
				font-size: 0;
				width: 163rpx;
				height: 123rpx;
				margin-top: -10rpx;
			}
		}
		.jx-handle-btn {
			margin-top: 39rpx;
			text-align: right;
			padding-bottom: 39rpx;
			.mini-btn {
				width: 153rpx;
				height: 57rpx;
				border-radius: 28.5rpx;
				background-color: #ff4365;
				font-size: 26rpx;
				color: #fff;
				line-height: 57rpx;
				padding: 0;
			}
			.jx-close-btn {
				margin-right: 20rpx;
				color: #a7a7a7;
				background-color: #fff;
				border: 2rpx solid #a7a7a7;
			}
		}
	}
	.dialog-wrap{
		padding: 15px;
		.weui-dialog{
			width: 580rpx;
			align-items: center;
		}
	}
	.jx-dialog-content {
		box-sizing: border-box;
		width: 580rpx;
		border-radius: 30rpx;
		background-color: #fff;
		padding: 0 7rpx 5rpx;
		font-size: 35rpx;
		overflow: hidden;
		p {
			height: 160rpx;
			color: #000;
			text-align: center;
			line-height: 160rpx;
			border-bottom: 1rpx solid #c6c6c6;
			font-weight: bold;
			letter-spacing: 3rpx;
		}
		.jx-dialog-btn {
			width: 100%;
			display: flex;
			height: 100rpx;
			margin-top: 5rpx;
			justify-content: space-between;
			.jx-close-btn {
				border-right: 1rpx solid #c6c6c6;
			}
			.mini-btn {
				background-color: #fff;
				color: #de4e22;
				border-radius: 0;
				margin: 0;
				font-size: 35rpx;
				padding: 0;
				width: 50%;
				font-weight: lighter;
				box-sizing: border-box;
				line-height: 100rpx;
				font-weight: bold;
			}
			.jx-close-btn {
				color: #000;
			}
		}
	}
</style>
