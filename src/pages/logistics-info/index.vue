<template>
	<div class="jx-logistics-info">
		<div class="jx-logistics-list">
			<div class="jx-logistics-item" v-for="(item, index) in logisticsList" :key="index">
				<div class="jx-logistics-time">
					<p :class="{'jx-time-receive': index === 1}">{{item.timeDate}}</p>
					<p class="jx-time">{{item.timeTime}}</p>
				</div>
				<div
					:class="[
						'jx-logistics-icon', 
						{
							'jx-line-0': index === (logisticsList.length - 1),
							'jx-line-bottom': index !== (logisticsList.length - 1) && index !== 0,
							'jx-line-empty': index === 0,
						},
					]">
					<div class="jx-img" v-if="item.type">
						<img :src="logisticsType[item.type]" alt="">
					</div>
					<div class="jx-circle" v-else></div>
				</div>
				<div :class="['jx-logistics-item-info', {'jx-logistics-item-info-black': index === 0 || index === 1}]">
					<p class="jx-logistics-item-info-title">{{item.status}}</p>
					<p>{{item.context}}</p>
				</div>
			</div>
			<div v-if = "logisticsList.length === 0">
				<p style="text-align:center">暂无物流信息</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
			logisticsList: [
				// {
				// 	timeDate: '',
				// 	timeTime: '',
				// 	info: '[收货地址]福建省厦门市思明区台南路77号汇金国 际22楼下电梯左手边办公室',
				// 	type: 8,
				// 	title: '',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【厦门市】您的快件已送达',
				// 	type: 7,
				// 	title: '已签收',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 6,
				// 	title: '运输中',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 5,
				// 	title: '运输中',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 0,
				// 	title: '运输中',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 0,
				// 	title: '运输中',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 0,
				// 	title: '运输中',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 0,
				// 	title: '运输中',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 4,
				// 	title: '已揽件',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 3,
				// 	title: '已发货',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 2,
				// 	title: '已出库',
				// },
				// {
				// 	timeDate: '10-16',
				// 	timeTime: '14:19',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 1,
				// 	title: '已下单',
				// },
				// {
				// 	timeDate: '',
				// 	timeTime: '',
				// 	info: '【江苏盐城公司】的收件员【自动化扫描】已收件',
				// 	type: 0,
				// 	title: '',
				// },
				
			],
			logisticsType: {
				0: '', // 其他
				1: '/static/icons/ordering.png', // 已下单
				2: '/static/icons/storerooms.png', // 已出库
				3: '/static/icons/shipments.png', // 已发货
				4: '/static/icons/shipments.png', // 已揽件
				5: '/static/icons/transportation.png', // 运输中
				6: '/static/icons/transportation.png', // 运输中2
				7: '/static/icons/sign-in.png', // 已签收
				8: '/static/icons/receive.png', // 收货地址
			},
			orderSn: '',
    }
	},
	methods: {
		getExpressOrder () {
			this.logisticsList = []
			wx.showLoading({
				title: '获取物流信息中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.$http.get({
				url: '/express/order',
				data: {
					order_sn: this.orderSn,
				},
			}).then(res => {
				wx.hideLoading()
				if (res.code * 1 === 0) {
					console.log(res.code);
					res.data.data.map(item => {
						this.logisticsList.push({
							timeDate: item.time.split(' ')[0],
							timeTime: item.time.split(' ')[1],
							...item,
						})
					})
				} else {
					console.log(res)
				}
			})
		},
	},
  created () {
	},
	mounted () {
	},
	onShow () {
		if (this.$root.$mp.query.hasOwnProperty('orderSn')) {
			this.orderSn = this.$root.$mp.query.orderSn
			this.getExpressOrder()
		}
	},
}
</script>

<style lang="scss" scope>
	.jx-logistics-info {
		padding: 0 20rpx;
		width: 100%;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		.jx-logistics-list {			
			box-sizing: border-box;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 30rpx 20rpx;
			.jx-logistics-item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 40rpx;
				.jx-logistics-item-info {
					width: 520rpx;
					font-size: 24rpx;
					color: #b1b1b1;
					.jx-logistics-item-info-title {
						font-size: 28rpx;
						font-weight: bold;
					}
				}
				.jx-logistics-item-info-black, .jx-time-receive {
					color: #000;
				}
				.jx-logistics-time {
					width: 74rpx;
					font-size: 24rpx;
					color: #b1b1b1;
					text-align: right;
					padding-top: 33rpx; 
					.jx-time {
						font-size: 20rpx;
					}
				}
				.jx-logistics-icon {
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					.jx-circle {
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						background-color: #c9c9c9;
						z-index: 2;
						border: 3rpx solid #fff;
					}
					.jx-img {
						width: 42rpx;
						height: 42rpx;
						z-index: 2;
						border: 3rpx solid #fff;
					}
				}
				.jx-line-0::before {
					content: '';
					height: 4rpx;
					width: 2rpx;
					background-color: #d2d2d2;
					position: absolute;
					bottom: 20rpx;
					left: 0;
					right: 0;
					margin: auto;
				}
				.jx-line-bottom::before {
					content: '';
					height: 160rpx;
					width: 2rpx;
					background-color: #d2d2d2;
					position: absolute;
					top: 20rpx;
					left: 0;
					right: 0;
					margin: auto;
				}
				.jx-line-empty::before {
					content: ' ';
					width: 0;
					height: 110rpx;
					border-left: 2rpx dashed #d2d2d2;
					position: absolute;
					top: 20rpx;
					left: 0;
					right: 0;
					margin: auto;
					z-index: 1;
				}
			}
		}
	}
</style>
