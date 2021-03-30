<template>
	<div class="jx-my-order jx-withdrawal">
		<JXheader title="资金明细"></JXheader>
		<div class="jx-order-navbar">
			<vueTopTabNavbar :tabList="tabList" :selectTab.sync="selectTabIndex"></vueTopTabNavbar>
		</div>
		<div class="jx-withdrawal-list" v-if="withdrawalList.length !== 0 && selectTabIndex != 'withdraw'">
			<div class="jx-withdrawal-list-item" v-for="(item, index) in withdrawalList" :key="index">
				<div class="jx-title">
					<p v-if="item.type == 1">我的店铺佣金</p>
					<p v-else-if="item.type ==2">团队店铺佣金</p>
					<p v-else-if="item.type == 3">我的店铺佣金-订单退款</p>
					<p v-else-if="item.type == 4">团队店铺佣金-订单退款</p>
					<p class="jx-money" v-if="item.money > 0">+{{item.money / 100}}</p>
					<p class="jx-money" v-else>{{item.money / 100}}</p>
				</div>
				<div class="jx-status">
					<p>{{item.date}}</p>
					<p v-if="selectTabIndex == 'rebating'">{{item.order_sn}}</p>
					<p v-else>{{withdrawalStatus[selectTabIndex]}}</p>
				</div>
			</div>
		</div>
		<div class="jx-withdrawal-list" v-if="withdrawalList.length !== 0 && selectTabIndex == 'withdraw'">
			<div class="jx-withdrawal-list-item" v-for="(item, index) in withdrawalList" :key="index">
				<div class="jx-title withdraw-group">
					<div class="item1">
						<span class="jx-money">￥{{item.apply_reward / 100}}</span>
						<span class="status">{{status[item.audit_status]}}</span>
					</div>
					<div class="item2">
						<span>{{item.user_name}}</span>
						<span> {{item.bank}}</span>
					</div>
					<div class="item3">{{item.apply_datetime}}</div>
					<div class="message" v-if="item.audit_status == 2">
						<span class="title">驳回原因：</span>
						<span class="info">{{item.audit_remark}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="jx-order-null" v-if="!withdrawalList || withdrawalList.length == 0">
			<div class="jx-img-null">
				<img src="/static/images/order-null.png" alt="">
			</div>
			<p v-if="selectTabIndex == 'withdraw'">还没提现记录哦~</p>
			<p v-else>还没到账记录哦~</p>
		</div>
	</div>
</template>

<script>
import vueTopTabNavbar from '../../components/topTabNavbar'
import JXheader from '../../components/header'
export default {
  data () {
    return {
			tabList: [
				{
					id: 'rebating',
					name: '即将到账',
				},
				{
					id: 'rebate',
					name: '已到账',
				},
				{
					id: 'withdraw',
					name: '提现',
				},
			],
			withdrawalStatus: {
				rebating: '即将到账',
				rebate: '已到账',
				withdraw: '提现',
			},
			status:[
				'待审核',
				'已转账',
				'已驳回',
			],
			selectTabIndex: 'rebate',
			isOrderList: true,
			withdrawalList: [],
			page: 1,
    }
	},
	components: {
		vueTopTabNavbar,
		JXheader,
	},
	watch: {
		selectTabIndex () {
			this.page = 1
			this.withdrawalList = []
			this.getLeaderBill()
		},
	},
	methods: {
		getLeaderBill () {
			this.$http.get({
				url: `/leader/bill/${this.selectTabIndex}`,
				data: {
					curr_page: this.page,
					page_size: 10,
				},
			}).then(res => {
				console.log(res);
				if (res.code * 1 === 0) {
					const data = res.data
					if (data) {
						if (this.page === 1) {
							this.withdrawalList = data
						} else {
							if (!data) this.page -= 1
							data.map(item => {
								this.withdrawalList.push(item)
							})
						}
					}
				} else {
					console.log(res);
				}
			})
		},
	},
  created () {
	},
	mounted () {
	},
	onShow () {
		this.getLeaderBill()
	},
	onReachBottom () {
		this.page += 1
		this.getLeaderBill()
	},
}
</script>

<style lang="scss" scope>
page {
	background-color: #fff;
}
	.jx-my-order {
		.jx-order-navbar {
			position: fixed;
			top: 185rpx;
			left: 0;
			background-color: #f1f1f1;
			width: 100%;
			.jx-order-search {
				position: relative;
				width: 100%;
				padding: 0 35rpx;
				box-sizing: border-box;
				margin-top: 10rpx;
				input {
					background-color: #fff;
					height: 60rpx;
					width: 100%;
					border-radius: 30rpx;
					font-size: 30rpx;
					background-color: #f1f1f1;
					border-radius: 30rpx;
					box-sizing: border-box;
					padding-left: 60rpx;
					color: #919191;
				}
				img {
					width: 29rpx;
					height: 29rpx;
					position: absolute;
					left: 55rpx;
					top: 17rpx;
				}
			}
		}

		.jx-order-null {
			color: #858585;
			font-size: 30rpx;
			display: flex;
			width: 100%;
			align-items: center;
			flex-direction: column;
			padding-top: 117rpx;
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
	.jx-withdrawal {
		background-color: #fff;
		height: 100%;
		padding-top: 273rpx;
		box-sizing: border-box;
		.jx-withdrawal-list {
			padding-left: 40rpx;
			padding-right: 40rpx;
			.jx-withdrawal-list-item {
				padding: 37rpx 0;
				border-bottom: 1rpx solid #d0d0d0;
				div {
					display: flex;
					justify-content: space-between;
				}
				.jx-title {
					font-size: 28rpx;
					color: #333333;
					.jx-money {
						font-size: 32rpx;
						color: #ff9743;
					}
					&.withdraw-group{
						display: flex;
						flex-direction: column;
						.item1{
							padding: 2px 0;
							.status{
								font-size: 26rpx;
							}
						}
						.item2,.item3{
							display: flex;
							align-items: center;
							justify-content: flex-start;
							font-size: 24rpx;
							color: #858585;
							span{
								padding-right: 15px;
							}
						}
						.item3{
							font-size: 24rpx;
							color: #858585;
						}
						.message{
							padding-top: 2px;
							font-size: 24rpx;
							color: #ff4365;
							display: flex;
							.title{
								width: 60px;
								flex-shrink: 0;
							}
							.info{
								flex-grow: 1;
							}
						}
					}
				}
				.jx-status {
					font-size: 26rpx;
					color: #b8b8b8;
				}
			}
		}
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
