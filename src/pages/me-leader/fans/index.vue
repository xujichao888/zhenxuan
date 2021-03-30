<template>
  <div class="fans">
	 <scroll-view scroll-x="true">
		<div class="taem-tab-scroll">
			<div class="scroll-item" 
				:class="{'active': type === item.id}"
				v-for="item in tabList" 
				:key="item.id"
				@click="changeTab(item.id)"
			>
				{{item.name}}
			</div>
		</div>
	 </scroll-view>
	 <scroll-view scroll-y="true" 
	 	class="scroll-group" 
		 @scrolltolower="scollBottom" 
		 v-if="list.length"
		 lower-threshold="20">
		<div class="view-wrap" v-for="(item, index) in list" :key="index">
			<div class="view-item">
				<div class="left">
					<img :src="item.user_img_url" alt="">
					<div class="user">
						<div class="phone-wrap">
							<span class="phone">{{item.user_nickname}}</span>
						</div>
						<span class="time">{{item.register_time}}</span>
					</div>
				</div>
				<div class="right">
					<span class="order">成单数：{{item.order_count}}</span>
					<span class="invite">邀请数：{{item.invite_user}}</span>
				</div>
			</div>
		</div>
		<van-loading v-if="loading != null" size="24rpx" type="spinner" text-size="24rpx" custom-class="loading-class">加载中...</van-loading>
		<div v-else class="empty">已经到底了~</div>
	  </scroll-view>
	  <div v-else-if="!list.length && isIn" class="empty-taem">
		  <img src="/static/images/null_fans.png" alt="">
		  <span>暂无粉丝</span>
	  </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
			isIn: false,
			loading: false,
			type:0,
			curr_page: 1,
			page_size: 10,
			tabList:[
				{
					id: 0,
					name: '全部',
				},
				{
					id: 1,
					name: '直属粉丝',
				},
				{
					id: 2,
					name: '推荐粉丝',
				},
			],
			list:[],
		}
	},
	components: {
	},
	methods: {
		scollBottom (){
			if(this.loading === false){
				this.loading = true
				this.curr_page ++ 
				this.getInfo()
			}
		},
		changeTab (type){
			if(this.type !== type){
				this.type = type
				this.curr_page = 1
				this.getInfo()
			}
		},
		getInfo (){
			wx.showLoading({
				title: '加载数据中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			let leader_id = wx.getStorageSync('userid')
			this.$http.get({
				url: `/leader/fans?userid=${leader_id}&curr_page=${this.curr_page}&page_size=${this.page_size}&type=${this.type}`,
			}).then(res => {
				this.isIn = true
				wx.hideLoading();
				if (res.code * 1 === 0) {
					let data = res.data || []
					if(data.length === this.page_size) this.loading = false
					else this.loading = null
					if(this.curr_page === 1) this.list = data
					else this.list = this.list.concat(data) 
				} else {
					wx.showToast({
						title: '数据获取失败！', //提示的内容,
						icon: 'none', //图标,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
				}
			})
			.catch(err=>{
				wx.hideLoading();
				wx.showToast({
					title: '数据获取失败！', //提示的内容,
					icon: 'none', //图标,
					mask: true, //显示透明蒙层，防止触摸穿透,
				})
			})
		},
	},
	onLoad (option) {
		this.isIn = false
		this.getInfo()
	},
	onUnload (){
		this.show = false
	},
}
</script>

<style lang="scss" scope>
	.fans{
		.empty-taem{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			margin: 200rpx auto 0;
			img{
				width: 180rpx;
				height: 184rpx;
			}
			span{
				font-size: 32rpx;
				color: #909399;
				padding-top: 30rpx;
			}
		}
		.taem-tab-scroll{
			display: flex;
			padding: 10rpx 0;
			align-items: center;
			.scroll-item{
				flex-grow: 1;
				width: 0;
				flex-shrink: 0;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
				color: #606266;
				letter-spacing: 0;
				&.active{
					font-size: 32rpx;
					color: #16171C;
					position: relative;
					font-weight: 400;
					&::before{
						content: "";
						width: 30rpx;
						height: 6rpx;
						background: #FF5086;
						border-radius: 3rpx;
						display: block;
						position: absolute;
						bottom: 0;
						left: 50%;
						margin-left: -15rpx;
					}
				}
			}
		}
		.scroll-group{
			position: absolute;
			top: 90rpx;
			left: 0;
			right: 0;
			bottom: 0;
			box-sizing: border-box;
			padding-bottom: 20rpx;
			.view-wrap{
				margin-top: 20rpx;
				padding: 0 20rpx;
				.view-item{
					background: #FFFFFF;
					border-radius: 16rpx;
					padding: 30rpx 20rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.left{
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: #16171C;
						.text{
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						img{
							width: 80rpx;
							height: 80rpx;
							border-radius: 50%;
						}
						.user{
							display: flex;
							flex-direction: column;
							padding-left: 15rpx;
							justify-content: space-between;
							.phone-wrap{
								display: flex;
								align-items: center;
								.phone{
									font-size: 28rpx;
									color: #16171C;
									padding-right: 10rpx;
								}
								.leve{
									font-size: 24rpx;
									color: #FF4365;
									border: 1px solid #FF4365;
									border-radius: 17rpx;
									padding: 3rpx 10rpx;
								}
							}
							.time{
								padding-top: 5rpx;
								font-size: 24rpx;
								color: #909399;
							}
						}
					}
					.right{
						height: 70rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-end;
						font-size: 24rpx;
						color: #16171C;
						padding-bottom: 2px;
					}
				}
			}
		}
		.empty {
			padding-top: 20rpx;;
			text-align: center;
			font-size: 24rpx;
			color: #999999;
		}
	}
	.loading-class{
		width: 100%;
		text-align: center;
		padding-top: 20rpx;
	}
</style>
