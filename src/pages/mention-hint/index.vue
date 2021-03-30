<template>
	<div class="jx-mention-hint">
		<div style="display: none;">团长说明</div>
		<div class="jx-hint-img">
			<img src="/static/images/banner-hint.png" alt="" mode="widthFix">
		</div>
		<div class="jx-hint-content">
			<p class="jx-title">如何成为团长？</p>
			<p>1、联系客服 </p>
			<p>2、提交店铺材料 </p>
			<p>3、获取专属团长码,获取收益 </p>
		</div>
		<div class="jx-hint-content jx-hint-text">
			<p class="jx-title">成为团长后有什么好处？</p>
			<p>1、邀请好友赚收益  </p>
			<p>2、好友成交后获得返利 </p>
			<p> 3、返利规则：按照好友成交金额的百分之一 抽取 </p>
		</div>
		<div class="jx-address-btn">
			<button class="mini-btn" type="primary" @click="editerAddress">
				开通团长
			</button>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
    }
	},
	methods: {
		editerAddress () {
			wx.navigateTo({
				url: `/pages/head-application/main`,
			})
		},
	},
  created () {
	},
	mounted () {
	},
	onShow () {
		wx.removeStorageSync('refereeId')
	},
}
</script>

<style lang="scss" scope>

	.jx-mention-hint {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: #fff;
		padding: 0 22rpx;
		box-sizing: border-box;
		.jx-hint-img {
			width: 100%;
			margin-top: 22rpx;
		}
		.jx-hint-content {
			font-size: 34rpx;
			color: #333333;
			width: 100%;
			p {
				padding: 0 41rpx;
				line-height: 50rpx;
				font-weight: 500;
			}
			.jx-title {
				font-size: 36rpx;
				font-weight: bold;
				text-align: center;
				margin-bottom: 35rpx;
			}
		}
		.jx-hint-content {
			margin-top: 85rpx;
		}
		.jx-hint-text {
			margin-top: 105rpx;
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
