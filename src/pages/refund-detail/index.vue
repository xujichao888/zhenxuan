<template>
	<div class="jx-refund-deatail">
		<div class="jx-refund-detail-header">
			<div style="font-size: 40rpx; font-weight: bold;margin-bottom: 18rpx;" v-if="refundDetail.refund_status === 1">
				请等待商家处理
			</div>
			<div style="font-size: 40rpx; font-weight: bold;margin-bottom: 18rpx;"  v-else-if="refundDetail.refund_status === 70">
				商家已同意退货，请填写快递信息
			</div>
			<div style="font-size: 40rpx; font-weight: bold;margin-bottom: 18rpx;"  v-else-if="refundDetail.refund_status !== 70 && refundDetail.refund_status !== 1">
				{{refundStatusText[refundDetail.refund_status]}}
			</div>
			<div v-if="refundDetail.refund_status === 90" style="padding-bottom:2px;">商家已同意您的申请，将尽快进行退款</div>
			<div v-if="refundDetail.refund_status === 1 || refundDetail.refund_status === 70" class="jxDowmTime_refund_detail">
				<span>还剩：</span>
            	<van-count-down @finish="resetState()" :time="refundDetail.countDownText" format="DD 天 HH 时 mm 分" />
				<span v-if="refundDetail.refund_status === 1">超时将自动退款</span>
			</div>
			<div v-else>
				{{refundDetail.modified_time}}
			</div>
			<div v-if="refundDetail.refund_status * 1 === 1">
				<span v-if="refundDetail.refund_type * 1 === 1 || refundDetail.refund_type * 1 === 2">您已成功发起退款申请，请耐心等待商家处理</span>
				<span v-else>您已成功发起退货退款申请，请耐心等待商家处理</span>
			</div>
		</div>
		<div class="jx-refund-money" v-if="refundDetail.refund_status * 1 === 200">
			<div style="border-bottom: 1rpx solid #f1f1f1;" >
				<div>
					退款总金额：
				</div>
				<div style="font-size: 26rpx;color: #eb556a;">
					￥<span style="margin-left: 5rxp; font-size: 36rpx;">{{refundDetail.real_refund / 100}}</span>
				</div>
			</div>
			<div>
				<div>
					退回路径
				</div>
				<div>
					原路退回
				</div>
			</div>
		</div>
		<div class="jx-refund-cause" v-if="refundDetail.refund_status * 1 === 40">
			<span class="label">拒绝原因：</span>
			<span class="info">{{refundDetail.audit_remark}}</span>
		</div>
		<div class="jx-refund-express" v-if="refundDetail.refund_status * 1 >= 80 && refundDetail.refund_status * 1 <= 100 && refundDetail.refund_type * 1 === 3">
			<div>
				<p>
					快递公司： {{refundDetail.express_name}}
				</p>
				<p>
					快递单号： {{refundDetail.express_sn}}
				</p>
				<p>
					运费： ￥{{refundDetail.refund_express / 100}}
				</p>
			</div>
			<div>
				<p>
					收货人：{{refundDetail.shipping_user}}
				</p>
				<p>联系电话：{{refundDetail.refund_phone}}</p>
				<p>
					退货地址：{{refundDetail.refund_address}}
				</p>
				<p>
					邮编：{{refundDetail.refund_postcode}}
				</p>
			</div>
		</div>
		<div class="jx-redund-address" v-if="refundDetail.refund_status * 1 === 70 && refundDetail.refund_type * 1 === 3">
			<div>
				<p>
					收货人：{{refundDetail.shipping_user}}
				</p>
				<p>联系电话：{{refundDetail.refund_phone}}</p>
				<p>
					退货地址：{{refundDetail.refund_address}}
				</p>
				<p>
					邮编：{{refundDetail.refund_postcode}}
				</p>
			</div>
			<div class="jx-address-btn">
				<button class="mini-btn" type="primary" @click="addressLogistics">
					请填写退货物流
				</button>
			</div>	
		</div>
		<div class="jx-refund-content">
			<div>
				<p style="padding-top: 30rpx;padding-bottom: 30rpx;font-size: 32rpx;">
					退款信息
				</p>
				<div class="jx-refund-goods">
					<div class="yx-goods-img">
						<img :src="refundDetail.product_pic_url" alt="">
					</div>
					<div class="yx-goods-text">
						<p class="jx-text-displays-ellipses">{{ refundDetail.product_name }}</p>
						<div class="yx-goods-specification">
							<p class="yx-goods-sockes">
								<span style="margin-right: 35rpx;" v-if="refundDetail.value_1">{{refundDetail.value_1}}</span>
								<span v-if="refundDetail.value_2">{{refundDetail.value_2}}</span>
							</p>
							<p>X{{refundDetail.refund_count}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="jx-refund-info">
				<p>退款原因:  {{cause[refundDetail.apply_reason]}}</p>
				<p>退款金额： ￥{{refundDetail.apply_refund / 100}}</p>
				<p>退款说明： {{refundDetail.description}}</p>
				<p>申请时间： {{refundDetail.apply_datetime}}</p>
				<p>退款编码： {{refundDetail.apply_sn}}</p>
				<p>凭证图片：</p>
				<div class="jx-refund-img">
					<img :src="item.pic_url" alt="" v-for="item in refundDetail.refund_proof" :key="item.id" >
				</div>
			</div>
			<div class="jx-handle-btn jx-padding-30" 
				v-if="refundDetail.refund_status * 1 === 1">
					<button class="mini-btn" 
						type="primary" 
						size="mini" 
						@click="closeOrder" 
						v-if="refundDetail.cancel_cnt < 1 && refundDetail.refund_type >= 2">
						撤销申请
					</button>
					<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="anewAppaly">
						修改申请
					</button>
			</div>
			<!-- && refundDetail.refund_type * 1 === 1 -->
			<div class="jx-handle-btn jx-padding-30" v-if="refundDetail.refund_status * 1 === 40">
				<button class="mini-btn" type="primary" size="mini" 
					@click="service" 
					v-if="refundDetail.order_status == 80 && refundDetail.isService">
					申请售后
				</button>
				<button 
					v-else-if="refundDetail.order_status == 99 && aftersales || refundDetail.order_status == 80"
					class="mini-btn" 
					type="primary" size="mini" 
					@click="service">
					再次申请
				</button>
				<button 
					v-else-if="refundDetail.order_status == 70"
					class="mini-btn" 
					type="primary" size="mini" 
					@click="anewAppaly({'is_again': 1})">
					重新申请
				</button>
				
			</div>	
			<div class="jx-handle-btn jx-padding-30" v-if="refundDetail.refund_status * 1 === 10 && (refundDetail.order_status == 99 && aftersales || refundDetail.order_status < 99 && refundDetail.order_status > 20)">
				<button 
					v-if="refundDetail.order_status == 70"
					class="mini-btn" 
					type="primary" size="mini" 
					@click="anewAppaly({'is_again': 1})"> 
					再次申请
				</button>
				<button 
					class="mini-btn" 
					type="primary" size="mini" 
					@click="service"> 
					再次申请
				</button>
			</div>	
		</div>
		<mp-dialog title="test" :show="dialogShow" :buttons="[]" :mask-closable="false">
			<div class="jx-dialog-content">
				<p>你仅能主动撤销一次,且超出售后期待将不能再次发起售后,确定取消吗?</p>
				<div class="jx-dialog-btn">
						<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="closeDialog">
							取消
						</button>
						<button class="mini-btn" type="primary" size="mini" @click="updatedRefund({'is_cancel': 1})">
							确定
						</button>
				</div>
			</div>
		</mp-dialog>
	</div>
</template>

<script>
import { countDown } from '../../utils/index'

export default {
  data () {
    return {
			orderId:0,
			dialogShow: false,
			params: {},
			refundDetail: {},
			refundStatusText: {
				1: '退款待处理',
				10: '已关闭', 
				40: '退款拒绝',
				70: '待退货',
				80: '等待商家确认收货', 
				90: '待商家退款',
				100: '退款中',
				200: '已退款',
			},
			cause:{
				0: '订单信息拍错了',
				1: '不喜欢/不想要了',
				2: '退运费',
				3: '地址信息填写错误',
				4: '商品与描述不符',
				5: '缺货',
				6: '少发/漏发',
				7: '假冒品牌',
				8: '货物破损',
				9: '空包裹',
				10: '快递/物流未送到',
				11: '未按约定时间送到',
				12: '其他原因',
			},
			createInterval: '',
			fillShow : false,
			aftersales: true,
    }
	},
	methods: {
		service (){
			wx.navigateTo({ url: `/pages/select-server/main?refundId=${this.refundDetail.id}&refundType=${this.refundDetail.refund_type}&orderId=${this.refundDetail.order_id}&productId=${this.refundDetail.product_id}&attrValueId=${this.refundDetail.attr_value_id}`})
		},
		closeOrder () {
			this.dialogShow = true
		},
		closeDialog () {
			this.dialogShow = false
		},
		addressLogistics () {
			wx.navigateTo({ url: `/pages/fill-courier/main?refundId=${this.refundDetail.id}` });
		},
		getRefundDetail (params) {
			this.$http.get({
				url: '/refund/order/applyinfo',
				data: params,
			}).then(res => {
				if (res.code * 1 === 0) {
					const data =res.data
					this.refundDetail = data
					if(data.apply_datetime && data.shipping_time){
						const apply_datetime = data.apply_datetime.replace(/-/g, '/')
						const shipping_time = data.shipping_time.replace(/-/g, '/')
						const apply = +new Date(apply_datetime)
						const shipping = +new Date(shipping_time)
						if(apply < shipping) this.refundDetail.isService = true
						else this.refundDetail.isService = false
					}
					if(this.refundDetail.product_attribute){
						const productAttribute = JSON.parse(this.refundDetail.product_attribute)
						this.refundDetail.value_1 = productAttribute.value_1
						if (productAttribute.value_2) {
							this.refundDetail.value_2 = productAttribute.value_2
						}
					}else{
						this.refundDetail.value_1 = '规格：默认'
					}
					if (this.refundDetail.refund_status === 1) {
						this.endTimeCountDown(this.refundDetail, this.refundDetail.apply_datetime, 2)
					}
					if (this.refundDetail.refund_status === 1 && this.refundDetail.refund_type === 3) {
						this.endTimeCountDown(this.refundDetail, this.refundDetail.apply_datetime, 3)
					}
					if (this.refundDetail.refund_status === 70 && this.refundDetail.refund_type === 3) {
						this.endTimeCountDown(this.refundDetail, this.refundDetail.modified_time, 5)
					}
					if (this.refundDetail.refund_status === 90) {
						this.endTimeCountDown(this.refundDetail, this.refundDetail.modified_time, 5)
					}
					//this.refundDetail.refund_status = 10
					this.$http.post({
						url: '/orderdetails',
						data: {
							order_id: this.orderId * 1,
						},
					}).then(res => {
						if (res.code * 1 === 0) {
							const data =res.data
							if(data.order_status * 1 == 99 && data.hasOwnProperty('receive_time')){
								const endTimeArr = data.receive_time.replace(/-/g, '/')
								const now_time = data.server_time.replace(/-/g, '/')
								const entTime = +new Date(endTimeArr)
								const newTime = +new Date(now_time)
								let cuntDownTime = newTime - entTime
								if (cuntDownTime < 3600 * 24 * 7 * 1000) {
									this.aftersales = true
								}else{
									this.aftersales = false
								}
							}
						} else {
							console.log(res)
						}
					})
					// console.log('修改')
					// this.refundDetail.refund_status = 40
					// console.log(this.refundDetail.refund_status)
				} else {
					console.log(res);
				}
			})
		},
		endTimeCountDown (item, time, day) {
			let now_time = item.server_time.replace(/-/g, '/')
			const endTimeArr = time.replace(/-/g, '/')
			const end_time = (+new Date(endTimeArr)) + day * 1 * 3600 * 24 * 1000
			now_time = +new Date(now_time)
			let down_time = end_time - now_time
			if(down_time <= 1000){
				item.countDownText = 0
				this.resetState()
				return
			}
			item.countDownText = down_time
		},
		resetState (){
			if(this.refundDetail.refund_status * 1 === 1){
				if(this.refundDetail.refund_type * 1 < 3){
					this.refundDetail.refund_status = 90
				} else {
					this.refundDetail.refund_status = 70
				}
			} else if(this.refundDetail.refund_status * 1 === 70){
				this.refundDetail.refund_status = 80
			} else if(this.refundDetail.refund_status * 1 === 90){
				this.refundDetail.refund_status = 200
			}
		},
		anewAppaly ({is_again = false}) {
			wx.navigateTo({ url: `/pages/refund/main?refundId=${this.refundDetail.id}&refundType=${this.refundDetail.refund_type}&orderId=${this.params.orderId}&productId=${this.params.productId}&attrValueId=${this.params.attrValueId}&is_again=${is_again ? is_again : ''}` })
			// if(this.aftersales){
			// 	wx.navigateTo({ url: `/pages/select-server/main?orderId=${this.params.orderId}&productId=${this.params.productId}&attrValueId=${this.params.attrValueId}` })
			// }else{
			// 	wx.navigateTo({ url: `/pages/refund/main?refundId=${this.refundDetail.id}&refundType=${this.refundDetail.refund_type}&orderId=${this.params.orderId}&productId=${this.params.productId}&attrValueId=${this.params.attrValueId}` })
			// }
			
		},
		updatedRefund (params) {
			this.$http.post({
				url: '/refund/update/apply',
				data: {
					id: this.refundDetail.id,
					...params,
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					let text = '申请成功！'
					if (params['is_cancel']) {
						text = '撤销成功!'
					}
					wx.showToast({
						title: text, //提示的内容,
						icon: 'none', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
					setTimeout(() => {
						if (params['is_cancel']) {
							this.dialogShow = false
							wx.navigateBack({
								delta: 1,
							})
						} else {
							this.getRefundDetail({
								order_id: this.params.orderId * 1,
								product_id: this.params.productId * 1,
								attr_value_id: this.params.attrValueId * 1,
							})
						}
					}, 2000)
				} else {
					wx.showToast({
						title: '申请失败！', //提示的内容,
						icon: 'none', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
				}
			})
		},
	},
	onShow () {
		if (this.$root.$mp.query.hasOwnProperty('orderId')) {
			const query = this.$root.$mp.query
			this.orderId = query.orderId
			this.params = {
				orderId: query.orderId,
				productId: query.productId,
				attrValueId: query.attrValueId,
				refundType: query.refundType,
			}
			this.getRefundDetail({
				order_id: this.params.orderId * 1,
				product_id: this.params.productId * 1,
				attr_value_id: this.params.attrValueId * 1,
			})
		}
		if(this.$root.$mp.query.hasOwnProperty('success')){
			this.fillShow = true
		}
	},
	onUnload () {
		clearInterval(this.createInterval)
	},
}
</script>

<style lang="scss" scope>
	.jx-refund-deatail {
		background-color: #fff;
		padding-bottom: 20rpx;
		.weui-dialog__wrp {
			.weui-dialog {
				display: flex;
				align-items: center;
			}
		}
		.jx-refund-cause {
			width: 100%;
			padding: 30rpx;
			font-size: 28rpx;
			border-bottom: 20rpx solid #f1f1f1;
			display: flex;
			box-sizing: border-box;
			.label{
				width: 140rpx;
				flex-shrink: 0;
			}
			.info {
				color: #666666;
				word-break:break-all
			}
		}
		.jx-refund-detail-header {
			background-color: #ff4365;
			padding-left: 30rpx;
			font-size: 28rpx;
			color: #fff;
			box-sizing: border-box;
			padding-top: 30rpx;
			padding-bottom: 30rpx;
		}
		.jx-refund-content {
			padding: 0 30rpx;
		}
		.jx-refund-goods {
			border-top: 1rpx solid #dedede;
			border-bottom: 1rpx solid #dedede;
			height: 231rpx;
			padding: 30rpx 0;
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
		.jx-refund-info {
			font-size: 28rpx;
			padding-top: 24rpx;
			p {
				margin-bottom: 20rpx;
			}
		}
		.jx-refund-img {
			margin-top: 30rpx;
			img {
				width: 176rpx;
				height: 176rpx;
				border-radius: 20rpx;
				margin-right: 45rpx;
			}
		}
	}
	.jx-refund-money {
		padding-left: 27rpx;
		padding-right: 27rpx;
		border-bottom: 20rpx solid #f1f1f1;
		font-size: 28rpx;
		& > div {
			display: flex;
			justify-content: space-between;
			height: 93rpx;
			align-items: center;
		}
	}
	.jx-refund-express {
		padding-left: 27rpx;
		padding-right: 27rpx;
		& > div {
			border-bottom: 1rpx solid #f1f1f1;
			padding-top: 28rpx;
			p {
				margin-bottom: 28rpx; 
			}
		}
	}
	.jx-redund-address {
		padding-left: 27rpx;
		padding-right: 27rpx;
		border-bottom: 20rpx solid #f1f1f1;
		padding-top: 27rpx;
		& > div {
			p {
				margin-bottom: 27rpx;
			}
		}
		.jx-address-btn {
			margin-bottom: 29rpx;
		}
	}
	.jx-handle-btn {
		margin-top: 79rpx;
		text-align: right;
		margin-bottom: 39rpx;
		.mini-btn {
			width: 251rpx;
			height: 87rpx;
			border-radius: 43.5rpx;
			background-color: #ff4365;
			font-size: 34rpx;
			color: #fff;
			line-height: 87rpx;
			padding: 0;
		}
		.jx-close-btn {
			margin-right: 20rpx;
			color: #ff748d;
			background-color: #fff;
			border: 2rpx solid #ff748d;
			margin-left: 20rpx;
		}
	}
	.jx-dialog-content {
		width: 580rpx;
		border-radius: 30rpx;
		background-color: #fff;
		padding: 0 7rpx 5rpx;
		font-size: 35rpx;
		overflow: hidden;
		p {
			padding: 20rpx 30rpx;
			color: #000;
			text-align: left;
			border-bottom: 1rpx solid #E7E7E7;
			letter-spacing: 3rpx;
		}
		.jx-dialog-btn {
			width: 100%;
			display: flex;
			height: 100rpx;
			margin-top: 5rpx;
			justify-content: space-between;
			.jx-close-btn {
				border-right: 1rpx solid #E7E7E7;
			}
			.mini-btn {
				background-color: #fff;
				color: #FF4365;
				border-radius: 0;
				margin: 0;
				font-size: 35rpx;
				padding: 0;
				width: 50%;
				line-height: 2.7;
				font-weight: lighter;
				box-sizing: border-box;
				font-weight: bold;
			}
			.jx-close-btn {
				color: #000;
			}
		}
	}
	.jx-address-btn {
		// position: fixed;
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
