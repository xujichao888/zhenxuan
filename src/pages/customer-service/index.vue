<template>
	<div class="jx-pay-status">
		<p>扫描二维码添加微信客服</p>
		<div class="jx-img" >
			<img src="/static/images/code.jpg" alt="">
		</div>
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
}
</script>

<style lang="scss" scope>
	.jx-pay-status {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 203rpx;
		box-sizing: border-box;
		.jx-img {
			width: 544rpx;
			height: 544rpx;
		}
		p {
			font-size: 34rpx;
			color: #333333;
			margin-bottom: 30rpx;
		}
	}
</style>
