<template>
	<div class="jx-my-order">
		<div class="jx-order-navbar">
			<div class="jx-order-search">
				<img src="/static/icons/magnifying-icon.png" alt="">
				<input type="text" v-model.lazy="searchText" placeholder="商品名称/品牌" @blur="getMyOrder">
			</div>
			<vueTopTabNavbar :tabList="tabList" :selectTab.sync="selectTabIndex"></vueTopTabNavbar>
		</div>
		<div class="jx-order-list" v-if="orderList.length !== 0">
			<div v-for="(item, index_) in orderList" :key="index_">
				<!-- 待发货 -->
				<div class="jx-order-list-item" v-if="item.order_status === 70">
					<div class="leader-group" v-if="isLeader">
						<div class="leader-info">
							<div class="user-img">
								<img :src="item.user_imageurl">
								<div class="user-info">
									<div class="user_name">
										<span class="name">{{item.user_nickname}}</span>
										<span class="type" v-if="item.isSelf">自购</span>
									</div>
									<span class="orderSn">{{item.order_sn}}</span>
								</div>
							</div>
							<div class="com" v-if="!item.isSelf">赚佣：{{item.leader_reward}}元</div>
						</div>
					</div>
					<div class="jx-title" @click="goProducts(item.brand_id)">
						<div class="jx-order-title jx-order-padding-30 jx-order-flex">
							<div class="jx-order-title-content jx-order-flex">
								<span class="jx-order-img">
									<img :src="item.brand_logo" alt="">
								</span>
								<span class="jx-goods-img">
									{{item.brand_name}}
								</span>
								<span class="jx-arrow">
									<img src="/static/icons/gray-right-arrow.png" alt="">
								</span>
							</div>
							<div class="jx-order-status">
								{{tabListText[item.order_status]}}
							</div>
						</div>
					</div>
					<div class="jx-content jx-order-padding-30" 
						@click="orderDetails(item.order_status,  item.order_id, item.isSelf)"
						:class="{bgWhite: isLeader}" v-for="(k, index) in item.list" 
						:key="index">
						<div class="jx-img">
							<img :src="k.product_logo" alt="">
						</div>
						<div class="jx-order-content">
							<div class="jx-text-displays-ellipses">
								{{k.product_name}}
							</div>
							<div class="jx-order-size">
								<div>
									<span style="margin-right: 35rpx;" v-if="k.value_1">{{k.value_1}}</span>
									<span style="margin-right: 35rpx;" v-else>规格：默认</span>
									<span v-if="k.value_2">{{k.value_2}}</span>
								</div>
								<span>X{{k.product_cnt}}</span>
							</div>
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{k.product_price / 100}}</span>
							</div>
							<div class="jx-refund" v-if="k.refund_status">
								{{refundStatusText[k.refund_status]}}
							</div>
						</div>
					</div>
					<div class="jx-footer jx-padding-bottom jx-order-padding-30">
						<div class="jx-order-flex">
							共{{goodsNum[index_]}}件,商品合计: 
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{item.payment_money / 100}}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- 待付款 -->
				<div class="jx-order-list-item" v-if="item.order_status === 20">
					<div class="leader-group" v-if="isLeader">
						<div class="leader-info">
							<div class="user-img">
								<img :src="item.user_imageurl">
								<div class="user-info">
									<div class="user_name">
										<span class="name">{{item.user_nickname}}</span>
										<span class="type" v-if="item.isSelf">自购</span>
									</div>
									<span  class="orderSn">{{item.order_sn}}</span>
								</div>
							</div>
							<div class="com" v-if="!item.isSelf">赚佣：{{item.leader_reward}}元</div>
						</div>
					</div>
					<div class="jx-title" @click="goProducts(item.brand_id)">
						<div class="jx-order-payment-hint jx-order-padding-30">
							<div class="jx-hint-content">
								<div class="jx-hint-img">
									<img src="/static/icons/hint.png" alt="">
								</div>
								<div>
									超过15分钟未付款订单将自动取消关闭
								</div>
							</div>
						</div>
						<div class="jx-order-title jx-order-padding-30 jx-order-flex">
							<div class="jx-order-title-content jx-order-flex">
								<span class="jx-order-img">
									<img :src="item.brand_logo" alt="">
								</span>
								<span class="jx-goods-img">
									{{item.brand_name}}
								</span>
								<span class="jx-arrow">
									<img src="/static/icons/gray-right-arrow.png" alt="">
								</span>
							</div>
							<div class="jx-order-status">
								{{tabListText[item.order_status]}}
							</div>
						</div>
					</div>
					<div class="jx-content jx-order-padding-30" 
						:class="{bgWhite: isLeader}" 
						v-for="(k, index) in item.list" 
						:key="index"
						@click="orderDetails(item.order_status,  item.order_id, item.isSelf)"
					>
						<div class="jx-img">
							<img :src="k.product_logo" alt="">
						</div>
						<div class="jx-order-content">
							<div class="jx-text-displays-ellipses">
								{{k.product_name}}
							</div>
							<div class="jx-order-size">
								<div>
									<span style="margin-right: 35rpx;" v-if="k.value_1">{{k.value_1}}</span>
									<span style="margin-right: 35rpx;" v-else>规格：默认</span>
									<span v-if="k.value_2">{{k.value_2}}</span>
								</div>
								<span>X{{k.product_cnt}}</span>
							</div>
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{k.product_price / 100}}</span>
							</div>
							<div class="jx-refund" v-if="k.refund_status">
								{{refundStatusText[k.refund_status]}}
							</div>
						</div>
					</div>
					<div class="jx-footer jx-order-padding-30">
						<div class="jx-order-flex">
							共{{goodsNum[index_]}}件,商品合计: 
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{item.payment_money / 100}}</span>
							</div>
						</div>
						<div class="jx-order-footer-btn" v-if="item.isSelf">
							<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="cancelOrder(item)">
								取消订单
							</button>
							<button class="mini-btn" type="primary" size="mini" @click="payOrder(item.order_id)">
								去支付
							</button>
						</div>
					</div>
				</div>
				<!-- 待收货 -->
				<div class="jx-order-list-item" v-if="item.order_status === 80">
					<div class="leader-group" v-if="isLeader">
						<div class="leader-info">
							<div class="user-img">
								<img :src="item.user_imageurl">
								<div class="user-info">
									<div class="user_name">
										<span class="name">{{item.user_nickname}}</span>
										<span class="type" v-if="item.isSelf">自购</span>
									</div>
									<span class="orderSn">{{item.order_sn}}</span>
								</div>
							</div>
							<div class="com" v-if="!item.isSelf">赚佣：{{item.leader_reward}}元</div>
						</div>
					</div>
					<div class="jx-title" @click="goProducts(item.brand_id)">
						<div class="jx-order-title jx-order-padding-30 jx-order-flex">
							<div class="jx-order-title-content jx-order-flex">
								<span class="jx-order-img">
									<img :src="item.brand_logo" alt="">
								</span>
								<span class="jx-goods-img">
									{{item.brand_name}}
								</span>
								<span class="jx-arrow">
									<img src="/static/icons/gray-right-arrow.png" alt="">
								</span>
							</div>
							<div class="jx-order-status">
								{{tabListText[item.order_status]}}
							</div>
						</div>
					</div>
					<div class="jx-content jx-order-padding-30" @click="orderDetails(item.order_status,  item.order_id, item.isSelf)" :class="{bgWhite: isLeader}" v-for="(k, index) in item.list" :key="index">
						<div class="jx-img">
							<img :src="k.product_logo" alt="">
						</div>
						<div class="jx-order-content">
							<div class="jx-text-displays-ellipses">
								{{k.product_name}}
							</div>
							<div class="jx-order-size">
								<div>
									<span style="margin-right: 35rpx;" v-if="k.value_1">{{k.value_1}}</span>
									<span style="margin-right: 35rpx;" v-else>规格：默认</span>
									<span v-if="k.value_2">{{k.value_2}}</span>
								</div>
								<span>X{{k.product_cnt}}</span>
							</div>
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{k.product_price / 100}}</span>
							</div>
							<div class="jx-refund" v-if="k.refund_status">
								{{refundStatusText[k.refund_status]}}
							</div>
						</div>
					</div>
					<div class="jx-footer jx-order-padding-30">
						<div class="jx-order-flex">
							共{{goodsNum[index_]}}件,商品合计: 
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{item.payment_money / 100}}</span>
							</div>
						</div>
						<div class="jx-order-footer-btn" v-if="item.isSelf">
							<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="lookLogistics(item.order_sn)">
								查看物流
							</button>
							<button class="mini-btn" type="primary" size="mini" @click="cancelOrder(item)">
								确认收货
							</button>
						</div>
					</div>
				</div>
				<!-- 已关闭 -->
				<div class="jx-order-list-item"  v-if="item.order_status === 1">
					<div class="leader-group" v-if="isLeader">
						<div class="leader-info">
							<div class="user-img">
								<img :src="item.user_imageurl">
								<div class="user-info">
									<div class="user_name">
										<span class="name">{{item.user_nickname}}</span>
										<span class="type" v-if="item.isSelf">自购</span>
									</div>
									<span class="orderSn">{{item.order_sn}}</span>
								</div>
							</div>
							<div class="com" v-if="!item.isSelf">赚佣：{{item.leader_reward}}元</div>
						</div>
					</div>
					<div class="jx-title" @click="goProducts(item.brand_id)">
						<div class="jx-order-title jx-order-padding-30 jx-order-flex">
							<div class="jx-order-title-content jx-order-flex">
								<span class="jx-order-img">
									<img :src="item.brand_logo" alt="">
								</span>
								<span class="jx-goods-img">
									{{item.brand_name}}
								</span>
								<span class="jx-arrow">
									<img src="/static/icons/gray-right-arrow.png" alt="">
								</span>
							</div>
							<div class="jx-order-status">
								{{tabListText[item.order_status]}}
							</div>
						</div>
					</div>
					<div class="jx-content jx-order-padding-30" @click="orderDetails(item.order_status,  item.order_id, item.isSelf)" :class="{bgWhite: isLeader}" v-for="(k, index) in item.list" :key="index">
						<div class="jx-img">
							<img :src="k.product_logo" alt="">
						</div>
						<div class="jx-order-content">
							<div class="jx-text-displays-ellipses">
								{{k.product_name}}
							</div>
							<div class="jx-order-size">
								<div>
									<span style="margin-right: 35rpx;" v-if="k.value_1">{{k.value_1}}</span>
									<span style="margin-right: 35rpx;" v-else>规格：默认</span>
									<span v-if="k.value_2">{{k.value_2}}</span>
								</div>
								<span>X{{k.product_cnt}}</span>
							</div>
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{k.product_price / 100}}</span>
							</div>
							<div class="jx-refund" v-if="k.refund_status">
								{{refundStatusText[k.refund_status]}}
							</div>
						</div>
					</div>
					<div class="jx-footer jx-order-padding-30">
						<div class="jx-order-flex">
							共{{goodsNum[index_]}}件,商品合计: 
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{item.payment_money / 100}}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- 已完成 -->
				<div class="jx-order-list-item" v-if="item.order_status === 99">
					<div class="leader-group" v-if="isLeader">
						<div class="leader-info">
							<div class="user-img">
								<img :src="item.user_imageurl">
								<div class="user-info">
									<div class="user_name">
										<span class="name">{{item.user_nickname}}</span>
										<span class="type" v-if="item.isSelf">自购</span>
									</div>
									<span class="orderSn">{{item.order_sn}}</span>
								</div>
							</div>
							<div class="com" v-if="!item.isSelf">赚佣：{{item.leader_reward}}元</div>
						</div>
					</div>
					<div class="jx-title" @click="goProducts(item.brand_id)">
						<div class="jx-order-title jx-order-padding-30 jx-order-flex">
							<div class="jx-order-title-content jx-order-flex">
								<span class="jx-order-img">
									<img :src="item.brand_logo" alt="">
								</span>
								<span class="jx-goods-img">
									{{item.brand_name}}
								</span>
								<span class="jx-arrow">
									<img src="/static/icons/gray-right-arrow.png" alt="">
								</span>
							</div>
							<div class="jx-order-status">
								{{tabListText[item.order_status]}}
							</div>
						</div>
					</div>
					<div class="jx-content jx-order-padding-30" @click="orderDetails(item.order_status,  item.order_id, item.isSelf)" :class="{bgWhite: isLeader}" v-for="(k, index) in item.list" :key="index">
						<div class="jx-img">
							<img :src="k.product_logo" alt="">
						</div>
						<div class="jx-order-content">
							<div class="jx-text-displays-ellipses">
								{{k.product_name}}
							</div>
							<div class="jx-order-size">
								<!-- <span style="margin-right: 35rpx;" v-if="k.value_1">{{k.value_1}}</span> -->
								<!-- <span style="margin-right: 35rpx;" v-if="k.value_1">颜色: {{k.value_1}}</span> -->
								<div>
									<span style="margin-right: 35rpx;" v-if="k.value_1">{{k.value_1}}</span>
									<span style="margin-right: 35rpx;" v-else>规格：默认</span>
									<span v-if="k.value_2">{{k.value_2}}</span>
								</div>
								<span>X{{k.product_cnt}}</span>
							</div>
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{k.product_price / 100}}</span>
							</div>
							<div class="jx-refund" v-if="k.refund_status">
								{{refundStatusText[k.refund_status]}}
							</div>
							<div></div>
						</div>
					</div>
					<div class="jx-footer jx-padding-bottom jx-order-padding-30">
						<div class="jx-order-flex">
							共{{goodsNum[index_]}}件,商品合计: 
							<div class="jx-money">
								￥<span style="font-size: 36rpx;margin-left: 5rpx;">{{item.payment_money / 100}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<mp-loading :duration="900" type="dot-gray" :show="loadingShow" :animated="loadingAnimated"></mp-loading>
			<div class="jx-foot-bottom-text" v-if="bottomText">
        已经到底了~
      </div>
		</div>
		<div class="jx-order-null" v-else>
			<div class="jx-img-null">
				<img src="/static/images/order-null.png" alt="">
			</div>
			<p>暂时还没有订单哦~</p>
		</div>
		<mp-dialog title="test" ext-class="dialog-wrap" :show="dialogShow" :buttons="[]" :mask-closable="false">
			<div class="jx-dialog-content" v-if="cancelParams.orderStatus * 1 === 20">
				<p>确定取消该订单？</p>
				<div class="jx-dialog-btn">
						<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="closeOrderEvent">
							确定取消
						</button>
						<button class="mini-btn" type="primary" size="mini" @click="closeDialog">
							暂不取消
						</button>
				</div>
			</div>
			<div class="jx-dialog-content" v-if="cancelParams.orderStatus * 1 === 80">
				<p>确定收到订单商品了吗？</p>
				<div class="jx-dialog-btn">
						<button class="mini-btn jx-close-btn" type="primary" size="mini" @click="closeDialog">
							取消
						</button>
						<button class="mini-btn" type="primary" size="mini" @click="takeGoods">
							确定
						</button>
				</div>
			</div>
		</mp-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import vueTopTabNavbar from '../../components/topTabNavbar'
export default {
  data () {
    return {
			tabList: [
				{
					id: 0,
					name: '全部',
				},
				{
					id: 20,
					name: '待付款',
				},
				{
					id: 70,
					name: '待发货',
				},
				{
					id: 80,
					name: '待收货',
				},
				{
					id: 99,
					name: '已完成',
				},
				{
					id: 1,
					name: '已关闭',
				},
			],
			tabListText: {
				1: '已关闭',
				20: '待付款',
				70: '待发货',
				80: '待收货',
				90: '退款中',
				99: '已完成',
			},
			isLeader:false,
			selectTabIndex: 0,
			isOrderList: false,
			searchText: '',
			page: 1,
			orderList: [],
			loadingShow: false,
			loadingAnimated: true,
			dialogShow: false,
			cancelParams: {
				orderStatus: '',
				orderId: '',
			},
			bottomText: false,
			isOrderStatus: false,
			refundStatusText: {
				1: '退款待处理',
				10: '已关闭', 
				40: '退款拒绝',
				70: '待退货',
				80: '等待商家确认收货', 
				90: '待商家退款',
				100: '退款中',
				200: '退款成功',
			},
			refundStatusText1: {
				1: '售后处理中',
				2: '售后完成',
			},
			refundStatus: 1,
			goodsNum : [],//商品数量
    }
	},
	components: {
		vueTopTabNavbar,
	},
	computed: {
		...mapGetters([
			'userInfo',
		]),
	},
	watch: {
		selectTabIndex () {
			this.page = 1
			this.orderList = []
			this.getMyOrder()
		},
	},
	methods: {
		init () {
			if (this.$root.$mp.query.hasOwnProperty('orderStatus') && !this.isOrderStatus) {
				this.selectTabIndex = this.$root.$mp.query.orderStatus * 1
			}
			this.isOrderStatus = false
			this.bottomText = false
			this.page = 1
			this.getMyOrder()
		},
		orderDetails (ordertype, orderId, isSelf) {
			if(isSelf){
				this.isOrderStatus = true
				wx.navigateTo({ url: `/pages/order-details/main?ordertype=${ordertype}&orderId=${orderId}` });
			} else {
				wx.showToast({
					title: '非自购订单无法查看详情',
					icon: 'none',
				})
			}
		},
		toSpecial (brandId) {
			this.isOrderStatus = true
			let page = this.isLeader ? 'special-sales-leader' : 'special-sales'
			wx.navigateTo({ url: `/pages/special/${page}/main?brandId=${brandId}` });
		},
		lookLogistics (id) {
			this.isOrderStatus = true
			wx.navigateTo({ url: `/pages/logistics-info/main?orderSn=${id}`});
		},
		goProducts (brand_id) {
			this.isOrderStatus = true
			if(this.isLeader){
				wx.navigateTo({ url: `/pages/special/special-sales-leader/main?brandId=${brand_id}`});
			} else {
				wx.navigateTo({ url: `/pages/special/special-sales/main?brandId=${brand_id}`});
			}
      		
    },
		getMyOrder () {
			if (this.page === 1) {
				this.$Timer = setTimeout(()=>{
					wx.showLoading({
						title: '加载中...',
						mask: true,
					});
				},2000)
			}
			this.$http.post({
				url: '/myorder',
				data: {
					order_status: this.selectTabIndex,
					title: this.searchText,
					page_size: 10,
					curr_page: this.page,
				},
			}).then(res => {
				clearTimeout(this.$Timer)
				wx.hideLoading()
				let self_user_id = wx.getStorageSync('userid')
				if (res.code * 1 === 0) {
					const _d = res.data || []
					const data = _d.map(item=>{
						return {
							...item,
							leader_reward: (item.leader_reward / 100).toFixed(2),
							isSelf: self_user_id == item.user_id,
						}
					})
					this.loadingShow = false
					this.loadingAnimated = false
					if (this.page === 1) {
						this.orderList = data
					} else {
						if (!data.length) {
							this.page -= 1
							setTimeout(() => {
								this.bottomText = true
							}, 1000)
							return
						}
						data.map(item => {
							this.orderList.push(item)
						})
					}
					if(this.page === 1){
						this.goodsNum = [];
					}
					for(let i in data){
						let num = 0;
						let order = data[i];
						for(let j in order.list){
							num += order.list[j].product_cnt
						}
						this.goodsNum.push(num)
					}
				} else {
					console.log(res)
				}
			}).catch(()=>{
				clearTimeout(this.$Timer)
				wx.hideLoading()
			})
		},
		closeDialog () {
			this.dialogShow = false
		},
		cancelOrder (item) {
			this.dialogShow = true
			this.cancelParams.orderId = item.order_id
			this.cancelParams.orderStatus = item.order_status
		},
		closeOrderEvent () {
			this.$http.post({
				url: '/order/cancel',
				data: {
					order_id: this.cancelParams.orderId,
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					this.dialogShow = false
					this.page = 1
					this.getMyOrder()
					wx.showToast({
						title: '取消成功',
						icon: 'none',
						duration: 1000,
					})
				}else{
					this.dialogShow = false
					this.page = 1
					this.getMyOrder()
					wx.showToast({
						title: '取消失败',
						icon: 'none',
						duration: 1000,
					})
				}
			})
		},
		takeGoods () {
			this.$http.post({
				url: '/order/confirm',
				data: {
					order_id: this.cancelParams.orderId,
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					this.dialogShow = false
					this.page = 1
					this.getMyOrder()
					wx.showToast({
						title: '操作成功',
						icon: 'none',
						duration: 1000,
					})
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none',
						duration: 1000,
					})
				}
			})
		},
		payOrder (ordderId) {
			wx.showLoading({
				title: '正在支付中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.$http.post({
				url: '/order',
				data: {
					order_id: ordderId,
				},
			}).then(res => {
				if (res.code * 1 === 0) {
					const data = res.data
					this.requestPayment(data)
				} else {
					console.log(res);
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
			wx.requestPayment({
				timeStamp: params.timeStamp.toString(),
				nonceStr: params.nonceStr,
				package: params.package,
				signType: 'MD5',
				paySign: params.paySign,
				success (res) { 
					console.log('success', res)
					wx.navigateTo({
						url: '/pages/withdraw-status/main?status=1',
					})
				},
				fail (res) {
					console.log(res)
					wx.navigateTo({
						url: '/pages/withdraw-status/main?status=0',
					})
				},
			})
		},
	},
	onShow () {
		this.searchText = ''
		let isLeader = wx.getStorageSync('userType')
		this.isLeader = isLeader == 2
		this.init()
	},
	onReachBottom () {
		if (this.orderList.length < 10) {
      this.loadingShow = false
      this.bottomText = true
      return
    }
		this.page += 1
		this.loadingShow = true
		this.getMyOrder()
	},
}
</script>

<style lang="scss" scope>
	.jx-my-order {
		.jx-order-navbar {
			position: fixed;
			top: 0;
			left: 0;
			background-color: #fff;
			width: 100%;
			z-index: 99;
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
		.jx-order-list {
			padding-top: 180rpx;
			box-sizing: border-box;
			&-item {
				// padding-left: 30rpx;
				// padding-right: 30rpx;
				margin-bottom: 20rpx;
				.leader-group{
					background: white;
					padding: 0 30rpx;
					.leader-info{
						border-bottom: 1rpx solid #E7E7E7;
						padding: 20rpx 0;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.noSelf{
							width: 94rpx;
							color: #FF4365;
							font-size: 24rpx;
						}
						.user-img{
							display: flex;
							align-items: center;
							img{
								width: 80rpx;
								height: 80rpx;
								border-radius: 50%;
							}
							.user-info{
								display: flex;
								flex-direction: column;
								margin-left: 20rpx;
								.orderSn{
									font-family: PingFangSC-Regular;
									font-size: 24rpx;
									color: #909399;
									letter-spacing: 0;
								}
								.user_name{
									display: flex;
									align-content: center;
									.name{
										font-size: 28rpx;
										color: #16171C;
									}
									.type{
										width: 94rpx;
										height: 34rpx;
										line-height: 34rpx;
										text-align: center;
										border: 1px solid #FF4365;
										border-radius: 17px;
										color: #FF4365;
										font-size: 24rpx;
										margin-left: 15rpx;
									}
								}
							}
						}
						.com{
							background-image: linear-gradient(270deg, #DFB58F 0%, #EFD4B7 100%);
							border-radius: 30px;
							width: 220rpx;
							height: 50rpx;
							color: #652E03;
							font-size: 28rpx;
							line-height: 50rpx;
							text-align: center;
						}
					}
				}
				
				.jx-title {
					background-color: #fff;
					width: 100%;
					.jx-order-payment-hint {
						font-size: 28rpx;
						color: #ea6678;
						padding-top: 13rpx;
						.jx-hint-content {
							height: 72rpx;
							border-radius: 36rpx;
							background-color: #fef5e4;
							display: flex;
							justify-content: center;
							align-items: center;
							.jx-hint-img {
								width: 34rpx;
								height: 34rpx;
								font-size: 0;
								margin-right: 15rpx;
							}
						}
					}
					.jx-order-title {
						padding-top: 20rpx;
						padding-bottom: 20rpx;
						font-size: 28rpx;
						color: #333333;
						justify-content: space-between;
						.jx-order-title-content {
							span {
								display: inline-block;
							}
							.jx-order-img {
								width: 43rpx;
								height: 43rpx;
								border-radius: 5rpx;
								overflow: hidden;
								font-size: 0;
								margin-right: 20rpx;
							}
							.jx-goods-img{
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								max-width: 450rpx;
							}
							.jx-arrow {
								width: 13rpx;
								height: 23rpx;
								font-size: 0;
								margin-left: 20rpx;
							}
						}
						.jx-order-status {
							font-size: 24rpx;
							color: #ff4365;
						}
					}
				}
				.jx-content {
					padding-bottom: 24rpx;
					padding-top: 24rpx;
					display: flex;
					align-items: center;
					&.bgWhite{
						background: white;
					}
					.jx-img {
						height: 170rpx;
						width: 170rpx;
						overflow: hidden;
						border-radius: 10rpx;
					}
					.jx-order-content {
						width: 480rpx;
						margin-left: 30rpx;
						.jx-text-displays-ellipses {
							font-size: 26rpx;
							color: #333333;
							width: 100%;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.jx-order-size {
							color: #a9a9a9;
							font-size: 24rpx;
							margin-top: 5rpx;
							display: flex;
							justify-content: space-between;
						}
					}
				}
				.jx-footer {
					display: flex;
					padding-bottom: 40rpx;
					padding-top: 40rpx;
					background-color: #fff;
					flex-direction: column;
					align-items: flex-end;
					font-size: 28rpx;
					.jx-money {
						margin-left: 30rpx;
					}
					.jx-order-footer-btn {
						margin-top: 25rpx;
						.mini-btn {
							width: 153rpx;
							height: 57rpx;
							border-radius: 28.5rpx;
							background-color: #ff4365;
							font-size: 26rpx;
							color: #fff;
							line-height: 57rpx;
							padding: 0;
						}
						.jx-close-btn {
							margin-right: 20rpx;
							color: #a7a7a7;
							background-color: #fff;
							border: 2rpx solid #a7a7a7;
						}
					}
				}
				.jx-padding-bottom {
					padding-bottom: 74rpx;
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
			padding-top: 210rpx;
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
	.jx-refund {
		color: #f87b00;
		font-size: 24rpx;
		text-align: right;
	}
	.dialog-wrap{
		padding: 15px;
		.weui-dialog{
			width: 580rpx;
			align-items: center;
		}
	}
	.jx-dialog-content {
		box-sizing: border-box;
		width: 580rpx;
		height: 266rpx;
		border-radius: 30rpx;
		background-color: #fff;
		padding: 0 7rpx 5rpx;
		font-size: 35rpx;
		overflow: hidden;
		p {
			height: 160rpx;
			color: #000;
			text-align: center;
			line-height: 160rpx;
			border-bottom: 1rpx solid #E7E7E7;
			font-weight: bold;
			letter-spacing: 3rpx;
		}
		.jx-dialog-btn {
			width: 100%;
			display: flex;
			height: 100rpx;
			justify-content: space-between;
			.jx-close-btn {
				border-right: 1rpx solid #E7E7E7;
			}
			.mini-btn {
				background-color: #fff;
				color: #FF4365;
				border-radius: 0;
				margin: 0;
				font-size: 35rpx;
				padding: 0;
				width: 50%;
				line-height: 100rpx;
				font-weight: lighter;
				box-sizing: border-box;
				font-weight: bold;
			}
			.jx-close-btn {
				color: #909399;
			}
		}
	}
	.jx-foot-bottom-text {
    height: 40rpx;
    line-height: 40rpx;
  }
</style>
