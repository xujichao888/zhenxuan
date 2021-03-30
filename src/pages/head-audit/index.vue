<template>
	<div class="jx-head-audit">
		<div style="display: none;">团长审核</div>
		<div>
			<div class="jx-audit-content jx-audit-statuc">
				<img src="/static/icons/query-icon.png" alt="">
				<span>{{auditStatus * 1 === 0 ? '审核中' : '不通过'}}</span>
			</div>
			<div class="jx-audit-content">
				<span class="jx-title">手机号</span>
				<span class="jx-content">{{userInfo.tel}}</span>
			</div>
			<div class="jx-audit-content jx-audit-code">
				<span class="jx-title">
					个人微信二维码
				</span>
				<img :src="userInfo.wechatCode" alt="">
			</div>
		</div>
		<div class="jx-address-btn" v-if="auditStatus * 1 !== 0">
			<button class="mini-btn" type="primary" @click="resetPass">
				修改申请
			</button>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
			auditStatus: 0,
			userInfo: {
				name: '',
				tel: '',
				address: '',
				wechatCode: '',
				regain: '',
			},
    }
	},
	methods: {
		resetPass () {
			wx.navigateTo({
				url: `/pages/head-application/main?id=${this.userInfo.applyId}`,
			})
		},
		getLeaderCenter () {
			this.$http.post({
				url: '/leader/center',
			}).then(res => {
				if (res.code * 1 === 0) {
					const data = res.data
					this.userInfo.tel = data.tel
					this.userInfo.applyId = data.apply_id
					this.userInfo.wechatCode = data.wechat_code
					this.auditStatus = data.audit_status
				}
			})
		},
	},
	onShow () {
		this.getLeaderCenter()
	},
}
</script>

<style lang="scss" scope>
	.jx-head-audit {
		background-color: #fff;
		padding: 42rpx 40rpx 0;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		position: relative;
		.jx-audit-statuc {
			display: flex;
			align-items: center;
			span {
				margin-left: 18rpx;
				font-size: 38rpx;
				color: #ff4365;
			}
			img {
				width: 53rpx;
				height: 53rpx;
			}
		}
		.jx-audit-content {
			margin-bottom: 62rpx;
			font-size: 28rpx;
			color: #b8b8b8;
			display: flex;
			align-items: flex-start;
			span {
				display: inline-block;
			}
			.jx-title {
				width: 177rpx;
				color: #333333;
			}
			.jx-content {
				width: 452rpx;
			}
		}
		.jx-audit-code {
			flex-direction: column;
			.jx-title {
				width: 300rpx;
			}
			img {
				width: 325rpx;
				height: 325rpx;
				margin-top: 23rpx;
				margin: 23rpx auto;
			}
		}
		.jx-address-btn {
			position: absolute;
			bottom: 20rpx;
			left: 0;
			width: 100%;
			.mini-btn {
				width: 669rpx;
				height: 88rpx;
				background-color: #ff4365;
				font-size: 34rpx;
				color: #fff;
			}
		}
	}
</style>
