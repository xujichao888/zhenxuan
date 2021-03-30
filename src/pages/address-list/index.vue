<template>
	<div :class="['jx-address-list', {'jx-address-list-bg': addressList.lenght !== 0}]">
		<div class="jx-address-box" v-if="addressList.length !== 0">
			<div class="jx-address-item" v-for="item in addressList" :key="item.id">
				<div class="jx-address-info" @click="selectAddress(item)">
					<div class="jx-title">
						<span style="width: 200rpx;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;">{{item.shipping_user}}</span>
						<span style="margin-left: 20rpx;">{{item.telephone}}</span>
					</div>
					<div class="jx-text-displays-ellipses">
						<span class="jx-is-default" v-if="!!item.is_default">默认</span>
						{{item.province_name}}{{item.city_name}}{{item.district_name}}{{item.address}}
					</div>
				</div>
				<div class="jx-address-editor" @click="editerAddress(item)">编辑</div>
			</div>
		</div>
		<div class="jx-is-none-address" v-else>
			<div class="jx-img">
				<img src="/static/images/address-null.png" alt="">
			</div>
			<p>你还没有添加地址呢~</p>
		</div>
		<div class="jx-address-btn">
			<button class="mini-btn" type="primary" @click="editerAddress({id: 0})">
				新增地址
			</button>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
			addressList: [],
			province: {},
    }
	},
	methods: {
		editerAddress (item) {
			this.$store.commit('setEditorAffress', item)
			wx.navigateTo({
				url: `/pages/address-editor/main?add=${item.id===0 ? 1 : 0}`,
			})
		},
		selectAddress (item) {
			if (!this.$root.$mp.query.hasOwnProperty('productsId')) return
			this.$store.commit('setSelectAddress', item)
			wx.navigateBack({
				delta: 1,
			})
		},
		getAddrList () {
			wx.showLoading({
				title: '数据请求中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.$http.get({
				url: '/user/addr',
			}).then(res => {
				if (res.code * 1 === 0) {
					const data = res.data
					this.addressList = data || []
					this.addressList.sort((a, b) => {
						return b.is_default - a.is_default
					})
					wx.hideLoading();
					if(this.addressList.length == 1){
						let params ={
							id : this.addressList[0].id * 1,
							province: this.addressList[0].province * 1,
							city: this.addressList[0].city * 1,
							district: this.addressList[0].district * 1,
							address: this.addressList[0].address,
							telephone: this.addressList[0].telephone,
							is_default: 1,
							shipping_user: this.addressList[0].shipping_user,
						}
						this.$http.post({
							url: '/user/update/addr',
							data: params,
						}).then(res => {
							this.addressList[0].is_default = 1
							console.log(res)
						})
					}
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
		this.getAddrList()
	},
}
</script>

<style lang="scss" scope>

.jx-address-list {
		background-color: #fff;
		height: 100%;
		padding-bottom: 140rpx;
		box-sizing: border-box;
		.jx-address-box {
			height: 100%;
			overflow: scroll;
			padding-bottom: 140rpx;
		}
		.jx-address-item {
			width: 100%;
			height: 188rpx;
			margin-bottom: 20rpx;
			background-color: #fff;
			padding: 34rpx 42rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.jx-address-info {
				width: 565rpx;
				color: #333333;
				.jx-title {
					font-size: 34rpx;
					font-weight: bold;
					margin-bottom: 25rpx;
					display: flex;
				}
				.jx-text-displays-ellipses {
					font-size: 28rpx;
					.jx-is-default {
						width: 72rpx;
						height: 31rpx;
						border-radius: 15.5rpx;
						background-color: #ff4365;
						color: #fff;
						font-size: 24rpx;
						display: inline-block;
						margin-right: 10rpx;
						text-align: center;
						line-height: 31rpx;
					}
				}
			}
			.jx-address-editor {
				width: 100rpx;
				height: 55rpx;
				font-size: 28rpx;
				color: #c1c1c1;
				border-left: 1rpx solid #c1c1c1;
				line-height: 55rpx;
				text-align: center;
				margin-top: 25rpx;
				box-sizing: border-box;
				padding-left: 10rpx;
			}
		}
		.jx-is-none-address {
			font-size: 30rpx;
			color: #858585;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			height: 100%;
			.jx-img {
				width: 268rpx;
				height: 284rpx;
				margin-top:215rpx;
				margin-bottom: 50rpx;
			}
		}
		.jx-address-btn {
			position: fixed;
			bottom: 0rpx;
			left: 0;
			width: 100%;
			background-color: #fff;
			padding: 20rpx 0;
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
.jx-address-list-bg {
	background-color: #f1f1f1;
}
</style>
