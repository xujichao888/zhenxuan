<template>
	<div class="jx-pay-status">
		<div class="jx-img" >
			<img src="/static/images/success.png" alt="" v-if="isSuccess">
			<img src="/static/images/fail.png" alt="" v-else>
		</div>
		<p>{{isSuccess ? '提现成功' : '提现失败'}}</p>
	</div>
</template>

<script>
export default {
  data () {
    return {
			isSuccess: false,
    }
	},
	methods: {
	},
  created () {
	},
	mounted () {
	},
	onShow () {
		this.isSuccess = !!(this.$root.$mp.query.status * 1)
		wx.setNavigationBarTitle({
      title: this.isSuccess ? '提现成功' : '提现失败',
    })
	},
}
</script>

<style lang="scss" scope>
	.jx-pay-status {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		.jx-img {
			width: 204rpx;
			height: 204rpx;
			margin-top: 223rpx;
		}
		p {
			font-size: 40rpx;
			color: #333333;
			margin: 40rpx 0 145rpx;
		}
		.mini-btn {
			width: 416rpx;
			height: 87rpx;
			border-radius: 43.5rpx;
			line-height: 87rpx;
			background-color: #ff4365;
		}
	}
</style>
