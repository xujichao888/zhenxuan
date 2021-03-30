<template>
  <div class="jx-head-pass">
		<header class="jx-me-header">
			<img src="/static/images/me-header-bg.png" alt="">
			<div class="jx-me-title">
				<div :style="{height: navBarHeight + 'px'}"></div>
				<div class="jx-me-text" :style="{height: titleBarHeight + 'px', lineHeight: titleBarHeight + 'px'}">
					<div class="jx-header-return" @click="returnTop">
						<img src="/static/icons/return.png" alt="">
					</div>
					团长中心
				</div>
				<div class="jx-user-login">
						<div class="jx-user-head">
							<img :src="userInfo.avatarUrl" alt="">
						</div>
						<div class="jx-user-login jx-user-nick-name">
							{{userInfo.nickName}}
						</div>
						<div class="jx-refreshed-userinfo"  @click="refreshedUserInfo">
							刷新信息
							<img src="/static/icons/refreshed-icon.png" alt="">
						</div>
				</div>
			</div>
		</header>
		<div class="jx-body">
			<div class="jx-card">
				<div class="jx-shoping-status">
					<div class="jx-shopping-status-item jx-right-line">
						<p class="jx-money">￥{{rebateCount}}</p>
						<p>累计返利(元)</p>
					</div>
					<div class="jx-shopping-status-item" >
						<p class="jx-money">￥{{rebating}}</p>
						<p>即将到账返利(元)</p>
					</div>
				</div>
			</div>
			<div class="jx-card jx-select-list jx-withdraw">
				<div class="jx-money-box">
					<div>可提现(元)</div>
					<div class="jx-money">￥<span>{{withDraw}}</span></div>
				</div>
				<div>
					<button class="mini-btn" type="primary" size="mini" @click="withdrawDeposit">
						提现
					</button>
				</div>
			</div>
			<div class="jx-card jx-select-list ">
				<div class="jx-select-list-item" @click="redirectTo('/pages/withdrawal-subsidiary/main', {})">
					<p>资金明细</p>
					<img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
				</div>
				<div class="jx-select-list-item" @click="redirectTo('/pages/tuan-poster/main', {})">
					<p>团长海报</p>
					<img class="jx-right-arriw" src="/static/icons/gray-right-arrow.png" alt="">
				</div>
			</div>
		</div>
		<mp-dialog title="test" :show="dialogShow" :buttons="[]" :mask-closable="false">
			<div class="jx-dialog-content" >
				<div class="jx-input-money">
					<div class="jx-title">提现金额:</div>
					<div class="weui-cell weui-cell_input">
						<input class="weui-input" type="number" v-model="moneyNum" placeholder="请输入提现金额" />
					</div>
				</div>
				<div class="jx-dialog-btn">
						<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="dialogShow=false">
							取消
						</button>
						<button class="mini-btn" type="primary" size="mini" @click="postDeposit">
							确定
						</button>
				</div>
			</div>
		</mp-dialog>
		<div style="display: none;">团长通过审核</div>
  </div>
</template>

<script>
import { setNavBarHeight } from '../../utils/index'

export default {
  data () {
    return {
			titleBarHeight: 44,
			navBarHeight: 0,
			rebateCount: '0.00',
			rebating: '0.00',
			withDraw: '0.00',
			userInfo: {
				avatarUrl: '',
				nickName: '',
			},
			dialogShow: false,
			moneyNum: 0,
    }
	},
	methods: {
		redirectTo (url, params) {
			if (!this.isLogin) return
			let paramsString = '?'
			for (let item in params) {
				paramsString += `${item}=${params[item]}&`
			}
			wx.navigateTo({
				url: url + paramsString,
			})
		},
		getLeaderCenter () {
			this.$http.post({
				url: '/leader/center',
			}).then(res => {
					if (res.code * 1 === 0) {
						this.rebateCount = (res.data.rebate_count / 100).toFixed(2)
						this.rebating = (res.data.rebating / 100).toFixed(2)
						this.withDraw = (res.data.with_draw / 100).toFixed(2)
					} else {
						console.log(res)
					}
			})
		},
		refreshedUserInfo () {
			const _this = this
			wx.showLoading({
				title: '信息更新中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			wx.getUserInfo({
				success: function (res) {
					_this.userInfo = {}
					wx.hideLoading()
					setTimeout(() => {
						_this.userInfo = res.userInfo
					}, 500)
				},
			})
		},
		returnTop () {
			wx.navigateBack({
				delta: 1,
			});
		},
		withdrawDeposit () {
			if(this.withDraw * 1 == 0){
				// wx.showToast({
				// 	title: '提现金额不足！',
				// 	icon: 'none',
				// 	duration: 2000, 
				// 	mask: true, //显示透明蒙层，防止触摸穿透,
				// })
				//return
			}
			wx.navigateTo({url: '/pages/reflect/main?withDraw='+this.withDraw})
			//this.dialogShow = true
		},
		postDeposit () {
			this.$http.get({
				url: '/leader/withdraw',
				data: {
					amount: this.moneyNum * 1,
				},
			}).then(res => {
				this.dialogShow = false
				if (res.code * 1 === 0) {
					this.moneyNum = 0
					wx.navigateTo({
						url: '/pages/pay-status/main?status=1',
					})
				} else {
					console.log(res)
					wx.navigateTo({
						url: '/pages/pay-status/main?status=0',
					})
				}
			})
		},
	},
	created () {
	},
	mounted () {
		setNavBarHeight(this) 
	},
	onShow () {
		const _this = this
		wx.getSetting({
			success (res){
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
					wx.getUserInfo({
						success: function (res) {
							_this.isLogin = true
							_this.userInfo = res.userInfo
						},
					})
				}
			},
		})
		this.getLeaderCenter()
	},
}
</script>

<style lang="scss" scope>
	.jx-head-pass {
		width: 100%;
	}
	.jx-me-header {
		height: 355rpx;
		width: 100%;
		position: relative;
		overflow: hidden;
	}
	.jx-me-title {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		right: 0;
		color: #fff;
	}
	.jx-me-title .jx-me-text {
		font-size: 38rpx;
		text-align: center;
		position: relative;
		.jx-header-return {
			width: 100rpx;
			height: 80rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			cursor: pointer;
			img {
				width: 18rpx;
				height: 30rpx;
				line-height: 40rpx;
				display: block;
				line-height: 40rpx;
				position: absolute;
				bottom: 30rpx;
				left: 40rpx;
			}
		}
	}
	.jx-user-login {
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		height: 127rpx;
		align-items: center;
		.jx-user-nick-name {
			left: 200rpx;
		}
		.jx-refreshed-userinfo {
			position: absolute;
			right: 50rpx;
			img {
				width: 25rpx;
				height: 23rpx;
			}
		}
	}
	.jx-user-login .jx-login-btn {
		background-color: transparent;
		color: #fff;
		border: none;
		display: inline-block;
		font-size: 32rpx;
		box-sizing: border-box;
		line-height: 50rpx;
		height: 50rpx;
		margin-left: 16rpx;
		font-weight: 500;
		letter-spacing: 2rpx;
		img {
			width: 14rpx;
			height: 23rpx;
		}
	}
	.jx-user-login .jx-user-head {
		width: 127rpx;
		height: 127rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-left: 40rpx;
	}
	.jx-body {
		margin: 20rpx 20rpx auto;
	}
	.jx-order-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 26rpx 16rpx;
		border-bottom: 2px solid #f5f5f5;
		.jx-order-text {
			color: #333333;
			font-size: 36rpx;
		}
		.jx-login-btn {
			font-size: 26rpx;
			color: #767676;
		}
	}
	.jx-shoping-status {
		display: flex;
		justify-content: space-around;
		padding: 50rpx 40rpx;
		.jx-shopping-status-item {
			text-align: center;
			font-size: 30rpx;
			color: #666666;
			position: relative;
			width: 50%;
			height: 126rpx;
			.jx-money {
				font-size: 44rpx;
				color: #333333;
				margin-bottom: 11rpx;
			}
		}
		.jx-right-line {
			border-right: 3rpx solid #f5f5f5;
		}
	}
	.jx-right-arriw {
		width: 14rpx;
		margin-right: 10rpx;
		height: 23rpx;
	}
	.jx-select-list {
		margin-top: 20rpx;
	}
	.jx-select-list-item {
		display: flex;
		justify-content: space-between;
		margin-right: 10rpx;
		margin-left: 10rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		border-bottom: 1px solid #dedede;
		height: 112rpx;
		align-items: center;
		color: #767676;
		&:last-child {
			border-bottom: none;
		}
	}
	.jx-withdraw {
		display: flex;
		padding: 35rpx 30rpx;
		height: 160rpx;
		align-items: center;
		justify-content: space-between;
		font-size: 30rpx;
		color: #666666;
		.mini-btn {
			width: 215rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background: #ff4365;
			line-height: 88rpx;
			font-size: 34rpx;
			justify-content: center;
			padding: 0;
		}
		.jx-money-box {
			div {
				display: inline-block;
			}
		}
		.jx-money {
			margin-left: 20rpx;
			font-size: 36rpx;
			color: #ff9743;
			font-weight: bold;
		}
	}
	.weui-dialog {
		widows:  630rpx !important;
	}
	.weui-dialog .weui-dialog__bd {
			padding: 0;
		}
	.jx-dialog-content {
		width: 630rpx;
		height: 286rpx;
		border-radius: 20rpx;
		background-color: #fff;
		padding: 0 7rpx 5rpx;
		font-size: 32rpx;
		overflow: hidden;
		box-sizing: border-box;
		.jx-input-money {
			height: 200rpx;
			line-height: 160rpx;
			border-bottom: 1rpx solid #c6c6c6;
			letter-spacing: 3rpx;
			display: flex;
			align-items: center;
			div	{
				height: 50rpx;
			}
			.jx-title {
				line-height: 50rpx;
				margin-left: 20rpx;
				margin-right: 20rpx;
				padding-top: 10rpx;
			}
			input {
				border: 1px solid #c6c6c6;
				border-radius: 10rpx;
				text-align: left;
				padding: 10rpx;
			}
		}
		.jx-dialog-btn {
			width: 100%;
			display: flex;
			height: 80rpx;
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
				font-size: 30rpx;
				padding: 0;
				width: 50%;
				font-weight: lighter;
				box-sizing: border-box;
				font-weight: bold;
			}
			.jx-close-btn {
				color: #000;
			}
		}
	}
	
</style>
