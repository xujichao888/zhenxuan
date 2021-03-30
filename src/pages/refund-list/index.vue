<template>
	<div :class="['jx-refund-list', {'jx-refund-list-null': refundList.length === 0}]">
		<JXheader title="退款/售后"></JXheader>
		<div class="jx-refund-list-content" v-if="refundList.length !== 0">
			<div v-for="(item, index_) in refundList" :key="index_">
				<div class="jx-order-list-item">
					<div class="leader-group" v-if="isLeader">
						<div class="leader-info">
							<div class="user-img">
								<img :src="item.user_imageurl">
								<div class="user-info">
									<div class="user_name">
										<span class="name">{{item.user_nickname}}</span>
										<span class="type" v-if="item.isSelf">自购</span>
									</div>
									<span class="orderSn">{{item.order_sn}}</span>
								</div>
							</div>
							<div class="com" v-if="!item.isSelf">赚佣：{{item.leader_reward}}元</div>
						</div>
					</div>
					<div class="jx-title" @click="bannerClick(item.brand_id, item.isSelf)">
						<div class="jx-order-title jx-order-padding-30 jx-order-flex">
							<div class="jx-order-title-content jx-order-flex">
								<span class="jx-order-img">
									<img :src="item.brand_logo" alt="">
								</span>
								<span class="jx-goods-img">
									{{item.brand_name}}
								</span>
								<span class="jx-arrow">
									<img src="/static/icons/gray-right-arrow.png" alt="">
								</span>
							</div>
						</div>
					</div>
					<div class="jx-content jx-order-padding-30" @click="orderDetails(item.order_status,  item.order_id, item.isSelf)">
						<div class="jx-img">
							<img :src="item.product_pic_url" alt="">
						</div>
						<div class="jx-order-content">
							<div class="jx-text-displays-ellipses">
								{{item.product_name}}
							</div>
							<div class="jx-order-size">
								<div>
									<span style="margin-right: 35rpx;" v-if="item.value_1">{{item.value_1}}</span>
									<span v-if="item.value_2">{{item.value_2}}</span>
								</div>
								<span style="font-size: 30rxp;color: #333333;">X{{item.refund_count}}</span>
							</div>
						</div>
					</div>
					<div class="jx-footer jx-order-padding-30 ">
						<div class="jx-explain-refund">
							{{refundTypeText[item.refund_type]}}
							{{tabListText[item.refund_status]}}
							<div v-if="item.refund_status * 1 === 1" class="jxDowmTime_refund_list">
								<span> 还剩：</span>
            					<van-count-down @finish="resetState(item)" :time="item.countDownText" format="DD 天 HH 时 mm 分" />
							</div>
						</div>
						<div class="jx-order-footer-btn" v-if="item.isSelf">
							<button class="mini-btn" type="primary" size="mini" @click="goRefundDetail(item, item.isSelf)">
								查看详情
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="jx-order-null" v-else>
			<div class="jx-img-null">
				<img src="/static/images/refund-null.png" alt="">
			</div>
			<p>暂时还没有售后订单哦~</p>
		</div>
	</div>
</template>

<script>
import JXheader from '../../components/header'
import { countDown } from '../../utils/index'
export default {
  data () {
    return {
			isLeader:false,
			refundList: [],
			page: 1,
			tabListText: {
				1: '退款待处理',
				10: '已关闭', 
				40: '退款拒绝',
				70: '待退货',
				80: '等待商家确认收货', 
				90: '待商家退款',
				100: '退款中',
				200: '已退款',
			},
			refundTypeText: {
				1: '待发货退款',
				2: '售后退款(退款不退货)',
				3: '退货退款',
			},
			createInterval: [],
			createIntervalCount: 0,
    }
	},
	components: {
		JXheader,
	},
	methods: {
		getRefundOrderBill () {
			this.$Timer = setTimeout(()=>{
				wx.showLoading({
					title: '加载中...',
					mask: true,
				});
			},2000)
			this.$http.get({
				url: `/refund/order`,
				data: {
					curr_page: this.page,
					page_size: 10,
				},
			}).then(res => {
				clearTimeout(this.$Timer)
				wx.hideLoading()
				if (res.code * 1 === 0) {
					let self_user_id = wx.getStorageSync('userid')
					const data = res.data.map(item=>{
						return {
							...item,
							isSelf: self_user_id == item.user_id,
							leader_reward: (item.leader_reward / 100).toFixed(2),
						}
					})
					if (data) {
						if (this.page*1 === 1) {
							this.refundList = data
						} else {
							if (!data) this.page -= 1
							data.map(item => {
								this.refundList.push(item)
							})
						}
						data.map((item) => {
							console.log(item)
							if(item.product_attribute){
								const productAttribute = JSON.parse(item.product_attribute)
								item.value_1 = productAttribute.value_1
								if (productAttribute.value_2) {
									item.value_2 = productAttribute.value_2
								}
							}else{
								item.value_1 = '规格：默认'
							}
							
							if (item.refund_status === 1) {
								this.endTimeCountDown(item, item.modified_time, 2)
							}
							if(item.refund_status === 1 && item.refund_type === 3){
								this.endTimeCountDown(item, item.modified_time, 3)
							}
							if(item.refund_status === 70 && item.refund_type === 3){
								this.endTimeCountDown(item, item.modified_time, 5)
							}
						})
						
					}
					console.log(this.refundList)
				} else {
					console.log(res);
					wx.showToast({
						title: res.msg, //提示的内容,
						icon: 'none',
					});
				}
			}).catch(()=>{
				clearTimeout(this.$Timer)
				wx.hideLoading()
			})
		},
		bannerClick (id, isSelf) {
			let page = this.isLeader ? 'special-sales-leader' : 'special-sales'
			wx.navigateTo({ url: `/pages/special/${page}/main?brandId=${id}` });
		},
		goProducts (productsId) {
			let page = this.isLeader ? 'products-leader' : 'products'
			this.isOrderStatus = true
     		 wx.navigateTo({ url: `/pages/${page}/main?productsId=${productsId}` });
		},
		goRefundDetail (item, isSelf) {
			if(isSelf){
				wx.navigateTo({ url: `/pages/refund-detail/main?orderId=${item.order_id}&productId=${item.product_id}&attrValueId=${item.attr_value_id}` })
			} else {
				wx.showToast({
					title: '非自购订单无法查看详情',
					icon: 'none',
				})
			}
			
		},
		orderDetails (ordertype, orderId, isSelf) {
			if(isSelf){
				wx.navigateTo({ url: `/pages/order-details/main?ordertype=${ordertype}&orderId=${orderId}` });
			} else {
				wx.showToast({
					title: '非自购订单无法查看详情',
					icon: 'none',
				})
			}
			
		},
		endTimeCountDown (item, time, day) {
			let now_time = item.server_time.replace(/-/g, '/')
			const endTimeArr = time.replace(/-/g, '/')
			const end_time = (+new Date(endTimeArr)) + day * 1 * 3600 * 24 * 1000
			now_time = +new Date(now_time)
			let down_time = end_time - now_time
			if(down_time <= 1000){
				item.countDownText = 0
				this.resetState(item)
				return
			}
			item.countDownText = down_time
		},
		resetState (item){
			item.refund_status = 100
		},
	},
	onLoad () {
		let isLeader = wx.getStorageSync('userType')
		this.isLeader = isLeader != '' && isLeader == 2 
	},
	onShow () {
		this.getRefundOrderBill()
	},
	onReachBottom () {
		this.page += 1
		this.getRefundOrderBill()
	},
	onHide () {
		this.page = 1
	},
}
</script>

<style lang="scss" scope>
	.jx-refund-list {
		background-color: #f1f1f1;
		.jx-refund-list-content {
			padding-top: 185rpx;
		}
		.jx-order-null {
			color: #858585;
			font-size: 30rpx;
			display: flex;
			width: 100%;
			align-items: center;
			flex-direction: column;
			padding-top: 390rpx;
			.jx-img-null {
				width: 268rpx;
				height: 284rpx;
				margin-top: 45rpx
			}
			p {
				margin-top: 55rpx;
			}
		}
	}
	.jx-order-list-item {
		// padding-left: 30rpx;
		// padding-right: 30rpx;
		margin-bottom: 20rpx;
		.leader-group{
			background: white;
			padding: 0 30rpx;
			.leader-info{
				border-bottom: 1rpx solid #E7E7E7;
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.noSelf{
					width: 94rpx;
					color: #FF4365;
					font-size: 24rpx;
				}
				.user-img{
					display: flex;
					align-items: center;
					img{
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}
					.user-info{
						display: flex;
						flex-direction: column;
						margin-left: 20rpx;
						.orderSn{
							font-family: PingFangSC-Regular;
							font-size: 24rpx;
							color: #909399;
							letter-spacing: 0;
						}
						.user_name{
							display: flex;
							align-content: center;
							.name{
								font-size: 28rpx;
								color: #16171C;
							}
							.type{
								width: 94rpx;
								height: 34rpx;
								line-height: 34rpx;
								text-align: center;
								border: 1px solid #FF4365;
								border-radius: 17px;
								color: #FF4365;
								font-size: 24rpx;
								margin-left: 15rpx;
							}
						}
					}
				}
				.com{
					background-image: linear-gradient(270deg, #DFB58F 0%, #EFD4B7 100%);
					border-radius: 30px;
					width: 220rpx;
					height: 50rpx;
					color: #652E03;
					font-size: 28rpx;
					line-height: 50rpx;
					text-align: center;
				}
			}
		}
		.jx-title {
			background-color: #fff;
			width: 100%;
			.jx-order-payment-hint {
				font-size: 28rpx;
				color: #ea6678;
				padding-top: 13rpx;
				.jx-hint-content {
					height: 72rpx;
					border-radius: 36rpx;
					background-color: #fef5e4;
					display: flex;
					justify-content: center;
					align-items: center;
					.jx-hint-img {
						width: 34rpx;
						height: 34rpx;
						font-size: 0;
						margin-right: 15rpx;
					}
				}
			}
			.jx-order-title {
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				font-size: 28rpx;
				color: #333333;
				justify-content: space-between;
				.jx-order-title-content {
					span {
						display: inline-block;
					}
					.jx-order-img {
						width: 43rpx;
						height: 43rpx;
						border-radius: 5rpx;
						overflow: hidden;
						font-size: 0;
						margin-right: 20rpx;
					}
					.jx-arrow {
						width: 13rpx;
						height: 23rpx;
						font-size: 0;
						margin-left: 20rpx;
					}
				}
				.jx-order-status {
					font-size: 24rpx;
					color: #ff4365;
					span{
						padding-right: 5px;
					}
				}
			}
		}
		.jx-content {
			padding-bottom: 24rpx;
			padding-top: 24rpx;
			display: flex;
			align-items: center;
			.jx-img {
				height: 170rpx;
				width: 170rpx;
				overflow: hidden;
				border-radius: 10rpx;
			}
			.jx-order-content {
				width: 480rpx;
				margin-left: 30rpx;
				height: 170rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.jx-text-displays-ellipses {
					font-size: 30rpx;
					color: #333333;
					display: -webkit-box;
					-webkit-line-clamp:2;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					word-break: break-all;
				}
				.jx-order-size {
					color: #a9a9a9;
					font-size: 26rpx;
					margin-top: 5rpx;
					margin-bottom: 10rpx;
					display: flex;
					justify-content: space-between;
				}
			}
		}
		.jx-footer {
			display: flex;
			padding-bottom: 18rpx;
			padding-top: 30rpx;
			background-color: #fff;
			flex-direction: column;
			align-items: flex-end;
			font-size: 28rpx;
			.jx-money {
				margin-left: 30rpx;
			}
			.jx-explain-refund {
				align-self: flex-start;
				border-bottom: 1px solid #dedede;
				font-size: 28rpx;
				color: #333333;
				padding-bottom: 30rpx;
				width: 100%;
				flex-shrink: 1;
				display: flex;
				align-items: flex-start;
			}
			.jx-order-footer-btn {
				margin-top: 25rpx;
				.mini-btn {
					width: 186rpx;
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
		.jx-padding-bottom {
			padding-bottom: 74rpx;
		}
	}
	.jx-refund-list-null {
		background-color: #ffffff;
		height: 100%;
	}
	.jx-order-padding-30 {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	.jx-order-flex {
		display: flex;
		align-items: center;
	}
	.jx-money {
		font-size: 26rpx;
		font-weight: bold;
		color: #eb556a;
	}
</style>
