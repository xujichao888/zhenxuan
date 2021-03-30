<template>
  <div class="profit">
	<div class="profit-group">
		<div class="profit-info">
			<span class="text">总收益（元）</span>
			<span class="pric">￥ {{profitInfo.rebateCount}}</span>
			<div class="recorded">
				<span>未入账： ￥ {{profitInfo.rebating}}</span>
				<span>可提现： ￥ {{profitInfo.withDraw}}</span>
			</div>
		</div>
		<div class="recorded-group">
			<span @click="redirectTo('/pages/reflect/main', {withDraw: profitInfo.withDraw})" class="border">申请提现</span>
			<span @click="redirectTo('/pages/withdrawal-subsidiary/main', {})">收益明细</span>
		</div>
	</div>
	<div class="section">
		<div class="title">收益概况</div>
		<div class="item">
			<div class="tl">
				<span class="pric">￥ {{profitInfo.total_award}}</span>
				<span class="text">累计收益</span>
			</div>
			<div class="tr">
				<span class="pric">￥ {{profitInfo.day_award}}</span>
				<span class="text">今日收益</span>
			</div>
			<div class="bl">
				<span class="pric">￥ {{profitInfo.week_award}}</span>
				<span class="text">本周收益</span>
			</div>
			<div class="br">
				<span class="pric">￥ {{profitInfo.month_award}}</span>
				<span class="text">本月收益</span>
			</div>
		</div>
	</div>
	<div class="section">
		<div class="title">销售额概况</div>
		<div class="item">
			<div class="tl">
				<span class="pric">￥ {{profitInfo.total_sale}}</span>
				<span class="text">累计销售额</span>
			</div>
			<div class="tr">
				<span class="pric">￥ {{profitInfo.day_sale}}</span>
				<span class="text">今日销售额</span>
			</div>
			<div class="bl">
				<span class="pric">￥ {{profitInfo.week_sale}}</span>
				<span class="text">本周销售额</span>
			</div>
			<div class="br">
				<span class="pric">￥ {{profitInfo.month_sale}}</span>
				<span class="text">本月销售额</span>
			</div>
		</div>
	</div>
  </div>
</template>

<script>

export default {
  data () {
    return {
			profitInfo:{
				rebateCount: "0.00",
				total_award: '0.00',
				rebating: '0.00',
				withDraw: '0.00',
				day_award: '0.00',
				week_award: '0.00',
				month_award: '0.00',
				total_sale: '0.00',
				day_sale: '0.00',
				week_sale: '0.00',
				month_sale: '0.00',
			},
    	}
	},
	components: {
		
	},
	onShow () {
		this.getLeaderCenter()
	},
	methods: {
		getLeaderCenter () {
			this.$Timer = setTimeout(()=>{
				wx.showLoading({
					title: '加载中...',
					mask: true,
				});
			},2000)
			this.$http.post({
				url: '/leader/center',
			}).then(res => {
				clearTimeout(this.$Timer)
				wx.hideLoading()
				if (res.code * 1 === 0) {
					this.profitInfo.rebateCount = (res.data.rebate_count / 100).toFixed(2)
					this.profitInfo.rebating = (res.data.rebating / 100).toFixed(2)
					this.profitInfo.total_award = (res.data.total_award / 100).toFixed(2)
					this.profitInfo.withDraw = (res.data.with_draw / 100).toFixed(2)
					this.profitInfo.day_award = (res.data.day_award / 100).toFixed(2)
					this.profitInfo.week_award = (res.data.week_award / 100).toFixed(2)
					this.profitInfo.month_award = (res.data.month_award / 100).toFixed(2)

					this.profitInfo.total_sale = (res.data.total_sale / 100).toFixed(2)
					this.profitInfo.day_sale = (res.data.day_sale / 100).toFixed(2)
					this.profitInfo.week_sale = (res.data.week_sale / 100).toFixed(2)
					this.profitInfo.month_sale = (res.data.month_sale / 100).toFixed(2)
				} else {
					console.log(res)
					wx.showToast({
						title: '获取数据失败', //提示的内容,
						icon: 'none',
					});
				}
			}).catch(()=>{
				clearTimeout(this.$Timer)
				wx.hideLoading()
			})
		},
		redirectTo (url, params) {
			let paramsString = '?'
			for (let item in params) {
				paramsString += `${item}=${params[item]}&`
			}
			wx.navigateTo({
				url: url + paramsString,
			})
		},
	},
}
</script>

<style lang="scss" scope>
	.profit{
		padding: 20rpx;
		.profit-group{
			padding: 20rpx 0 0 0rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			background-image: linear-gradient(270deg, #DFB58F 0%, #EFD4B7 100%);
			border-radius: 16rpx;
			width: 100%;
			box-sizing: border-box;
			.profit-info{
				padding: 40rpx 20rpx 0;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				.text{
					color: #652E03;
					font-size: 24rpx;
				}
				.pric{
					font-size: 60rpx;
					color: #652E03;
					padding: 10rpx 0 30rpx;
				}
				.recorded{
					display: flex;
					align-items: center;
					justify-content: center;
					padding-bottom: 40rpx;
					span{
						padding: 0 50rpx;
						font-size: 24rpx;
						color: #652E03;
					}
				}
			}
			.recorded-group{
				background-image: linear-gradient(-270deg, #dfc2a3 0%, #d2a780 100%);
				height: 100rpx;
				display: flex;
				align-items: center;
				color: #652E03;
				font-size: 32rpx;
				justify-content: center;
				border-radius: 0 0 16rpx 16rpx;
				span{
					flex-grow: 1;
					text-align: center;
					height: 60rpx;
					box-sizing: border-box;
					line-height: 60rpx;
					&.border{
						border-right: 1rpx solid #652E03;
					}
				}
			}
		}
		.section{
			margin-top: 20rpx;
			background: white;
			border-radius: 16rpx;
			.title{
				padding: 0 20rpx;
				background: #EDD1B3;
				border-radius: 16rpx 16rpx 0 0;
				font-family: PingFangSC-Medium;
				font-size: 24rpx;
				color: #652E03;
				letter-spacing: 0;
				height: 60rpx;
				line-height: 60rpx;
			}
			.item{
				background: white;
				padding: 20rpx 50rpx;
				display: flex;
				flex-wrap: wrap;
				&>div{
					width: 50%;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					padding: 20rpx 0;
					&.tl{
						border-right: 1rpx solid #f6f6f6;
						border-bottom: 1rpx solid #f6f6f6;
					}
					&.tr{
						border-bottom: 1rpx solid #f6f6f6;
					}
					&.bl{
						border-right: 1rpx solid #f6f6f6;
					}
					.pric{
						font-size: 36rpx;
						color: #16171C;
					}
					.text{
						font-size: 24rpx;
						color: #606266;
						padding-top: 10rpx;
					}
				}
			}
		}
	}
</style>
