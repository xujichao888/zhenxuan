<template>
	<div class="jx-confirm-order">
		<div class="jx-address" @click="selectAddress">
			<div class="jx-address-info">
				<div class="jx-address-icon" v-if="isAddress">
					<img src="/static/icons/address-icon.png" alt="">
				</div>
				<div class="jx-address-content">
					<div class="jx-address-title">
						<span>{{isAddress ? address.shipping_user : '请选择地址'}}</span>
						<span style="margin-left: 20rpx;" v-if="isAddress">{{address.telephone}}</span>	
					</div>
					<div class="jx-text-displays-ellipses" v-if="isAddress">
						{{address.full_address}}
					</div>
				</div>
				<div class="jx-right-arrow">
					<img src="/static/icons/gray-right-arrow.png" alt="">
				</div>
			</div>
			<div class="jx-line-img">
				<img src="/static/icons/address-line.png" alt="">
			</div>
		</div>
		<div class="jx-order-list" v-for="(item, index_) in goodsInfo" :key="index_">
			<div class="jx-goods-title jx-padding-30 jx-flex-align">
				<div class="jx-img">
					<img :src="item.brand_logo" alt="">
				</div>
				<span>{{item.brand_name}}</span>
			</div>
			<div class="jx-goods-info jx-padding-30 jx-flex-align" v-for="(k, index) in item.order_product" :key="index">
				<div class="jx-img">
					<img :src="k.product_img" alt="">
				</div>
				<div class="jx-order-content">
					<div class="jx-text-displays-ellipses jx-prod-name">
						{{k.product_name}}
					</div>
					<div class="jx-order-size  jx-product-money">
						<div class="specs">
							<span v-for="(k, index1) in k.specification" :key="index1"  style="margin-right: 35rpx;">{{k.text}}: {{k.value}}</span>
						</div>
						<span style="color: #666666;">
							X{{k.amount}}
						</span>
					</div>
					<div class="jx-money">
						<span>
							￥<span style="font-size: 30rpx;margin-left: 5rpx;">{{k.price}}</span>
						</span>
					</div>
				</div>
			</div>
			<div class="jx-order-ramark jx-padding-30 jx-flex-align">
					<div>备注</div>
					<div>
						<input class="weui-input" maxlength="60" placeholder="选填,60字以内" v-model="remarks"/>
					</div>
			</div>
			<div class="jx-order-freight jx-padding-30 jx-flex-align">
				<div>运费</div>
				<div>包邮</div>
			</div>
		</div>
		<div class="jx-order-pay jx-padding-30 jx-flex-align">
			<div class="jx-goods">
				<div>
					合计: <span class="jx-money">￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{totalMoney.money}}</span></span>
				</div>
				<div class="jx-goods-count">共{{totalMoney.count}}件商品</div>
			</div>
			<button class="mini-btn" type="primary" size="mini" @click="payOrder">
				立即支付
			</button>
		</div>
	</div>
</template>

<script>

// import { guid } from '../../utils/index'

export default {
  data () {
    return {
			address: {},
			isAddress: false,
			productsId: 0,
			goodsInfo:[],
			totalMoney: {
				count: 0,
				money: 0,
			},
			remarks: '',
			orderArr: [],
			selectSpecification: {},
			userSelectOrderNum: {},
    }
	},
	methods: {
		resetParams () {
			this.$store.commit('setSelectAddress', {})
			this.address = {}
			this.isAddress = false
			this.productsId = 0
			this.totalMoney = {
				count: 0,
				money: 0,
			}
			this.remarks = ''
			this.orderArr = []
		},
		payOrder () {
			if (!this.isAddress) {
				wx.showToast({
					title: '请填写地址', //提示的内容,
					icon: 'none', //图标,
					duration: 2000, //延迟时间,
					mask: true, //显示透明蒙层，防止触摸穿透,
				});
				return
			}
			wx.showLoading({
				title: '正在支付中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			const product = []
			this.goodsInfo.map(item => {
				item.order_product.map(k => {
					product.push({
						product_id: k.product_id,
						product_name: k.product_name,
						attr_value_id: k.attr_value_id,
						amount: k.amount,
					})
				})
			})
			const params = {
				order_remarks: this.remarks,
				full_address: this.address.full_address,
				cart_ids: this.orderArr,
				payment_method: 5,
				product:product,
				...this.address,
				
			}
			this.$http.post({
				url: '/order',
				data: params,
			}).then(res => {
				if (res.code * 1 === 0) {
					const data = res.data
					this.requestPayment(data)
				} else {
					wx.showToast({
						title: res.msg, //提示的内容,
						icon: 'none', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					});
				}
			})
		},
		requestPayment (params) {
			//var _this = this
			wx.requestPayment({
				timeStamp: params.timeStamp.toString(),
				nonceStr: params.nonceStr,
				package: params.package,
				signType: 'MD5',
				paySign: params.paySign,
				success (res) { 
					console.log('success', res)
					// _this.$http.post({
					// 	url : '/user/updateleader',	
					// }).then(res => {
					// 	if(res.code * 1 === 0){
					// 		console.log('修改团长信息成功')
					// 	}else{
					// 		console.log('修改团长信息失败')
					// 	}
					// })
					// if (res.errMsg == 'requestPayment:ok') { 

					// }
					wx.redirectTo({
						url: '/pages/withdraw-status/main?status=1',
					})
				},
				fail (res) {
					console.log(res)
					wx.redirectTo({
						url: '/pages/withdraw-status/main?status=0',
					})
				},
			})
		},
		selectAddress () {
			wx.navigateTo({
				url: `/pages/address-list/main?productsId=${this.productsId}`,
			})
		},
		gitProductsInfo () {
			wx.showLoading({
				title: '数据请求中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.$http.get({
        url: `/goods/detail?product_id=${this.productsId}`,
      }).then( res => {
				wx.hideLoading()
				if (res.code * 1 === 0) {
					const selectGoods = JSON.parse(this.$root.$mp.query.selectGoods)
					this.goodsInfo = []
					const data = res.data
					this.goodsInfo.push({
						brand_logo: data.brand_logo,
						brand_name: data.brand_name,
						price: selectGoods.money,
						order_product: [],
					})
					this.goodsInfo[0].order_product.push({
						descript: data.descript,
						product_name: data.product_name,
						product_img: data.product_img[0],
						specification: selectGoods.specification,
						attr_value_id: selectGoods.attrValueId,
						price: selectGoods.money,
						amount: selectGoods.count,
						product_id: this.productsId * 1,
					})
					this.computeTotal(this.goodsInfo)
				} else {
					console.log(res)
				}
      });
		},
		computeTotal (list) {
			this.totalMoney = {
				count: 0,
				money: 0,
			}
			list.map(item => {
				if (item.order_product) {
					item.order_product.map(k => {
						this.totalMoney.money += k.price * 1 * k.amount
						this.totalMoney.count += k.amount
					})
				}
			})
			this.totalMoney.money = this.totalMoney.money.toFixed(2)
		},
		getAddrList () {
			this.$http.get({
				url: '/user/addr',
			}).then(res => {
				if (res.code * 1 === 0) {
					const data = res.data
					data.map(item => {
						if (item.is_default) {
							this.isAddress = true
							this.address = item
							this.address.full_address = `${item.province_name}${item.city_name}${item.district_name}${item.address}`
						}
					})
				} else {
					console.log(res)
				}
			})
		},
		getOrdercardList () {
			wx.showLoading({
				title: '数据请求中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
      this.$http.get({
        url: `/ordercard/list`,
      }).then( res => {
				wx.hideLoading()
        if (res.code * 1 === 0) {
					const data = res.data
					this.goodsInfo = []
          data.map(item => {
						let goodsInfoItem = {}
						const orderProduct = []
						item.price = 0
						if (item.order_product) {
							item.order_product.map((k, index) => {
								if (this.orderArr.indexOf(k.order_card_id) > -1) {
									k.product_amount = this.userSelectOrderNum[k.order_card_id]
									k.price = (k.self_price > 0 ? k.self_price : k.price + k.premium_price) / 100
									item.price += k.price
									goodsInfoItem = Object.assign({}, item)
									goodsInfoItem.order_product = []
									k.amount = k.product_amount
									k.specification = {}
									if (k.attr_name1) {
										k.specification[1] = {
											text: k.attr_name1,
											value: k.value_1,
										}
									}
									if (k.attr_name2) {
										k.specification[2] = {
											text: k.attr_name2,
											value: k.value_2,
										}
									}
									
									orderProduct.push(k)
									goodsInfoItem.order_product = orderProduct
								}
								if (item.order_product.length === (index + 1) && JSON.stringify(goodsInfoItem) !== '{}')  {
									this.goodsInfo.push(goodsInfoItem)
								}
							})
						}
					})
					this.computeTotal(this.goodsInfo)
        } else {
          console.log(res);
        }
      });
		},
	},
	onLoad () {
		this.remarks = ''
	},
	onShow () {
		if (JSON.stringify(this.$store.state.selectAddress) !== '{}') {
			this.isAddress = true
			this.address = this.$store.state.selectAddress
			this.address.full_address = `${this.address.province_name}${this.address.city_name}${this.address.district_name}${this.address.address}`
		} else {
			this.isAddress = false
			this.getAddrList()
		}
		if (this.$root.$mp.query.hasOwnProperty('productsId')) {
			this.productsId = this.$root.$mp.query.productsId
			this.gitProductsInfo()
		}
		if (this.$root.$mp.query.hasOwnProperty('order')) {
			this.orderArr = []
			this.$root.$mp.query.order.split(',').map(item => {
				this.orderArr.push(item * 1)
			})
			this.getOrdercardList()
		}
		if(this.$root.$mp.query.hasOwnProperty('userSelectOrderNum')){
			this.userSelectOrderNum = JSON.parse(this.$root.$mp.query.userSelectOrderNum)
			console.log(this.userShopList)
		}
	},
}
</script>

<style lang="scss" scope>
	.jx-confirm-order {
		box-sizing: border-box;
		padding-bottom: 170rpx;
		.jx-address {
			height: 213rpx;
			width: 100%;
			background-color: #fff;
			position: relative;
			&-info {
				width: 100%;
				height: 100%;
				padding: 35rpx 30rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.jx-address-content {
					width: 570rpx;
					font-size: 28rpx;
					color: #333333;
				}
				.jx-address-title {
					font-size: 34rpx;
					color: #333333;
					font-weight: bold;
				}
				.jx-text-displays-ellipses {
					margin-top: 25rpx;
				}
				.jx-address-icon {
					width: 34rpx;
					height: 42rpx;
					font-size: 0;
				}
				.jx-right-arrow {
					width: 14rpx;
					height: 23rpx;
					font-size: 0;
				}
			}
			.jx-line-img {
				position: absolute;
				bottom: -2rpx;
				width: 100%;
				height: 7rpx;
				left: 0;
				font-size: 0;
			}
		}
		.jx-order-list {
			margin-top: 20rpx;
			box-sizing: border-box;
			width: 100%;
			margin-bottom: 40rpx;
			.jx-goods-title {
				background-color: #fff;
				height: 78rpx;
				font-size: 28rpx;
				.jx-img {
					width: 43rpx;
					height: 43rpx;
					border-radius: 5rpx;
					margin-right: 20rpx;
				}
			}
			.jx-goods-info {
				height: 218rpx;
				.jx-img {
					width: 170rpx;
					height: 170rpx;
					border-radius: 10rpx;
					margin-right: 30rpx;
					overflow: hidden;
				}
				.jx-order-content {
					width: 490rpx;
					padding: 8rpx;
					height: 172rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.jx-text-displays-ellipses {
						font-size: 24rpx;
						font-weight: 500;
					}
					.jx-prod-name{
						flex-shrink: 0;
						line-height: 1.4
					}
					.jx-order-size {
						font-size: 20rpx;
						color: #9e9e9e;
					}
				}
			}
			.jx-order-ramark {
				border-bottom: 2rpx solid #f1f1f1;
				justify-content: space-between;
				input {
					width: 610rpx;
					text-align: right;
				}
			}
			.jx-order-freight {
				justify-content: space-between;
			}
			.jx-order-ramark, .jx-order-freight {
				background-color: #fff;
				padding-top: 30rpx;
				padding-bottom: 30rpx;
				color: #666666;
				font-size: 28rpx;
			}
		}
		.jx-order-pay {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			box-sizing: border-box;
			background-color: #fff;
			height: 150rpx;
			padding-top: 15rpx;
			justify-content: space-between;
			align-items: flex-start;
			z-index: 2;
			.jx-goods {
				font-size: 32rpx;
				color: #333333;
				&-count {
					font-size: 28rpx;
					color: #9e9e9e;
					margin-top: 10rpx;
				}
			}
			.mini-btn {
				margin: 0;
				width: 261rpx;
				height: 88rpx;
				background-color: #ff4365;
				border-radius: 44rpx;
				font-size: 36rpx;
				line-height: 88rpx;
			}
		}
		.jx-padding-30 {
			padding: 0 30rpx;
		}
		.jx-flex-align {
			display: flex;
			align-items: center;
		}
		.jx-money {
			font-size: 26rpx;
			font-weight: bold;
			color: #eb556a;
		}
		.jx-product-money {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.specs{
				display: flex;
				flex-direction: column;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				span{
					padding-right: 5px;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>
