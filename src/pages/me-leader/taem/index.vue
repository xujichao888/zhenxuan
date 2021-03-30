<template>
  <div class="taem" :style="{padding: parent.parent_id ? '20rpx' : '10rpx 20rpx 20rpx'}">
	<div class="view-item" v-if="parent.parent_id">
		<div class="left">
			我的团长：
			<span class="text">{{parent.parent_name}}</span>
		</div>
		<div class="right" @click="showCode({userUrl: parent.user_img_url, codeUrl: parent.content, name: parent.parent_name})">
			查看微信
		</div>
	</div>
	 <scroll-view scroll-x="true">
		<div class="taem-tab-scroll" :style="{padding: parent.parent_id ? '10rpx 0' : '0rpx'}">
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
		 :style="{top: parent.parent_id ? '230rpx' : '90rpx'}"
		 @scrolltolower="scollBottom" 
		 v-if="list.length"
		 lower-threshold="20">
		<div class="view-wrap" v-for="(item, index) in list" :key="index">
			<div class="view-item">
				<div class="left">
					<img :src="item.user_img_url" alt="">
					<div class="user">
						<div class="phone-wrap">
							<span class="phone">{{item.username}}</span>
							<span class="leve">{{item.leve_name}}</span>
						</div>
						<span class="time">{{item.created_time}}</span>
					</div>
				</div>
				<div class="right" @click="showCode({userUrl: item.user_img_url, codeUrl: item.content, name: item.user_nickname})">
					查看微信
				</div>
			</div>
			<div class="message">
				<div class="message-item">
					<span class="count">{{item.team_user}}</span>
					<span class="label">人数</span>
				</div>
				<div class="message-item">
					<span class="count">{{item.sales_money}}</span>
					<span class="label">销售总额</span>
				</div>
				<div class="message-item">
					<span class="count">{{item.team_sales_money}}</span>
					<span class="label">团队销售总额</span>
				</div>
			</div>
		</div>
		<van-loading v-if="loading != null" size="24rpx" type="spinner" text-size="24rpx" custom-class="loading-class">加载中...</van-loading>
		<div v-else class="empty">已经到底了~</div>
	  </scroll-view>
	  <div v-else-if="!list.length && isIn" class="empty-taem">
		  <img src="/static/images/null_taem.png" alt="">
		  <span>暂无团队</span>
	  </div>
	  <van-overlay :show="show" @click="show = false">
		  <scroll-view scroll-y="true" class="_overlay_wrap">
                <div class="_overlay_group">
					<div class="user_group">
						<img :src="userUrl" class="userImg">
						<span>{{userCodeNmae}}</span>
					</div>
					<img :src="codeUrl" class="code">
					<p class="tips">扫一扫上面的二维码图案，加我微信</p>
				</div>
				<div class="overlay_btn"  @click.stop="isWritePhotosAlbum">
					<img src="/static/icons/down-icon.png" alt="">
					保存图片
				</div>
          </scroll-view>
	  </van-overlay>
	  <painter :dirty="true" :customStyle="customStyle" @imgOK="onImgOk" :palette="template" />
  </div>
</template>

<script>
export default {
  data () {
    return {
			isIn: false,
			parent:{},
			loading: false,
			customStyle:"position: absolute; left: -9999rpx",
			show:false,
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
					name: '直属队员',
				},
				{
					id: 2,
					name: '间接队员',
				},
			],
			list:[],
			codeUrl:'',
			userUrl:'',
			userCodeNmae: '',
			template: {},
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
			let url = `/leader/team?userid=${leader_id}&curr_page=${this.curr_page}&page_size=${this.page_size}&type=${this.type}`
			this.$http.get({
				url,
			}).then(res => {
				this.isIn = true
				wx.hideLoading();
				if (res.code * 1 === 0) {
					if(res.data.parent_id){
						this.parent.parent_id = res.data.parent_id
						this.parent.content = res.data.content
						this.parent.parent_name = res.data.parent_name
					} else {
						this.parent = {}
					}
					let data = res.data.data || []
					data = data.map(item=>{
						return {
							...item,
							leve_name: this.getUserLeve(item.level),
							team_sales_money: (item.team_sales_money / 100).toFixed(2),
							sales_money: (item.sales_money / 100).toFixed(2),  
						}
					})
					if(data.length === this.page_size) this.loading = false
					else this.loading = null
					if(this.curr_page === 1) this.list = data
					else this.list = this.list.concat(data) 
				} else {
					wx.showToast({
						title: res.msg + '！', //提示的内容,
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
		showCode ({userUrl, codeUrl, name}){
			this.userUrl = userUrl || ''
			this.codeUrl = codeUrl
			this.userCodeNmae = name
			this.show = true
		},
		getToken (){
			this.$http.get({
				url: '/accesstoken',
			}).then(res => {
				if (res.code * 1 === 0) {
					this.getWXCode(res.data.access_token)
				} else {
					wx.hideLoading();
					wx.showToast({
						title: '获取token失败！', //提示的内容,
						icon: 'none', //图标,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
				}
			})
		},
		getUserLeve (lv){
			switch (lv) {
				case 0:
					return '实习店主'
					break;
				case 1:
					return '正式店主'
					break;
				case 2:
					return 'vip店主'
					break;
				case 3:
					return '运营商店主'
					break;
			}
		},
		getWXCode (token) {
			let _this = this
			let user_leader = wx.getStorageSync('userid')
			let url = 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token='+ token
			wx.request({
				url,
				method: 'POST',
				data: JSON.stringify({
					path: 'pages/index/main&leader=' + user_leader,
					width: 280,
				}),
				responseType: 'arraybuffer',
				success (res) {
					let qrCodeUrl= wx.arrayBufferToBase64(res.data);
					var file = wx.getFileSystemManager();
					var number = Math.random();

					file.writeFile({
						filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
						data: qrCodeUrl,
						encoding: 'base64',
						success: res => {
							wx.hideLoading()
							_this.codeUrl = wx.env.USER_DATA_PATH + '/pic' + number + '.png'
						}, fail: err => {
							wx.hideLoading()
							wx.showToast({
								title: '读取二维码失败！', //提示的内容,
								icon: 'none', //图标,
								mask: true, //显示透明蒙层，防止触摸穿透,
							})
						},
					})
				},
			})
		},
		saveImage (){
			wx.showLoading({
				title: '保存中...', 
				mask: true,
			});
			wx.downloadFile({
				url:this.userInfo.content,
				success: function (res) {
					if (res.statusCode === 200) {
						let img = res.tempFilePath;
						wx.saveImageToPhotosAlbum({
						filePath: img,
						success (res) {
							wx.hideLoading();
							wx.showToast({
								title: '保存成功',
								icon: 'success',
								duration: 2000,
							});
						},
						fail (res) {
							wx.hideLoading();
							wx.showToast({
									title: '保存失败',
									icon: 'none',
									duration: 2000,
								});
							},
						});
					}
				},
			});
		},
		isWritePhotosAlbum () {
			let _this = this
			wx.getSetting({
				success (res) {
					if (res.authSetting['scope.writePhotosAlbum']) {
						_this.downLoad();
					} else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
						wx.authorize({
							scope: 'scope.writePhotosAlbum',
							success () {
								_this.downLoad();
							},
							fail (){
								wx.showToast({
									title: '您没有授权，无法保存到相册',
									icon: 'none',
								})
							},
						})
					}else {
						wx.openSetting({
							success (res) {
								if (res.authSetting['scope.writePhotosAlbum']) {
									_this.downLoad();
								}else{
									wx.showToast({
										title:'您没有授权，无法保存到相册',
										icon:'none',
									})                           
								}
							},
						})
					}
				},
			})
		},
		downLoad (){
			const _this = this
			let views = []
			wx.getSystemInfo({
				success (system) {
					const screenHeight = system.screenHeight
					const screenWidth = system.screenWidth
					const pixelRatio = system.pixelRatio
					const statusBarHeight = system.statusBarHeight
					const fontSizeSetting = system.fontSizeSetting
					views.push(
						{
							type: 'image',
							url: _this.codeUrl,
							css: {
								width: 500 * pixelRatio+ 'rpx',
								height: 500 * pixelRatio + 'rpx',
								left : (630 - 500) / 2 * pixelRatio  + 'rpx',
								top : 160 * pixelRatio + 'rpx',
							},
						},
						{
							type: 'image',
							url: _this.userUrl,
							css: {
								width: 120 * pixelRatio+ 'rpx',
								height: 120 * pixelRatio + 'rpx',
								left : 20 * pixelRatio  + 'rpx',
								top : 20 * pixelRatio + 'rpx',
								borderRadius: 10 * pixelRatio + 'rpx',
							},
						},
						{
							type: 'text',
							text: _this.userCodeNmae,
							css: {
								top : 66 * pixelRatio + 'rpx',
								left: 155  * pixelRatio + 'rpx',
								fontSize: 28 * pixelRatio + 'rpx',
							},
						},
						{
							type: 'text',
							text: '扫一扫上面的二维码图案，加我微信',
							css: {
								bottom : 50 * pixelRatio + 'rpx',
								fontSize: 20 * pixelRatio + 'rpx',
								left: 630 / 2 * pixelRatio + 'rpx',
								color: '#999999',
								align: 'center',
							},
						}
					)
					_this.template = {
						width:  630 * pixelRatio + 'rpx',
						height: 816 * pixelRatio + 'rpx',
						views: views,
					}
					_this.$forceUpdate()
				},
			});
		},
		onImgOk (e) {
			const _this = this
			wx.showLoading({
				title: '正在下载...', 
				mask: true, 
			});
			let shareImg = e.mp.detail.path 
			wx.saveImageToPhotosAlbum({
				filePath: shareImg,
				success: res => {
					wx.hideLoading()
					wx.showToast({
						title: '图片已保存，可到相册中查看', 
						duration: 1000,
						icon: 'none',
					});
					this.show = false
				},
				fail: err => {
					console.log('saveImageToPhotosAlbum', err) 
					wx.hideLoading()
				},
			})
			this.template = {}
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
	.taem{
		.empty-taem{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			margin: 200rpx auto 0;
			img{
				width: 234rpx;
				height: 184rpx;
			}
			span{
				font-size: 32rpx;
				color: #909399;
				padding-top: 30rpx;
			}
		}
		padding: 20rpx;
		.taem-tab-scroll{
			display: flex;
			padding: 10rpx 0;
			.scroll-item{
				width: 236.66rpx;
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
				background: #FF4365;
				border-radius: 30px;
				width: 180rpx;
				height: 60rpx;
				text-align: center;
				line-height: 60rpx;
				color: white;
			}
		}
		.scroll-group{
			position: absolute;
			top: 230rpx;
			left: 0;
			right: 0;
			bottom: 0;
			box-sizing: border-box;
			padding-bottom: 20rpx;
			.view-wrap{
				margin-top: 20rpx;
				padding: 0 20rpx;
				.view-item{
					border-radius: 16rpx 16rpx 0 0;
				}
				.message{
					display: flex;
					align-items: center;
					border-radius:  0 0 16rpx 16rpx;
					background: white;
					padding: 20rpx;
					border-top: 1rpx solid #F6F6F6;
					.message-item{
						flex-grow: 1;
						width: 0;
						display: flex;
						flex-direction: column;
						align-items: center;
						box-sizing: border-box;
						border-right: 1rpx solid #F6F6F6;
						&:last-of-type{
							border: 0;
						}
						.label{
							font-size: 24rpx;
							color: #606266;
						}
						.count{
							font-size: 28rpx;
							color: #FF4365;
						}
					}
				}
			}
		}
		.section{
			margin-top: 20rpx;
			background: #FFFFFF;
			box-shadow: 0 5px 10px 0 rgba(0,0,0,0.05);
			border-radius: 16rpx;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			.top{
				display: flex;
				.bg{
					width: 253rpx;
					height: 130rpx;
					flex-shrink: 0;
					display: flex;
					justify-content: center;
					padding-top: 311rpx;
					border-radius: 10rpx;
					img{
						width: 100rpx;
						height: 110rpx;
					}
				}
				.text{
					flex-flow: 1;
					font-size: 28rpx;
					color: #595959;
					letter-spacing: 0;
					padding: 0 20rpx;
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
	._overlay_wrap{
		width: 100%;
		padding-bottom: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		._overlay_group{
			width: 630rpx;
			height: 836rpx;
			margin: 20rpx auto;
			overflow: hidden;
			background: white;
			padding: 20rpx;
			box-sizing: border-box;
			.user_group{
				display: flex;
				align-items: center;
				.userImg{
					width: 120rpx;
					height: 120rpx;
					border-radius: 10rpx;
				}
				span{
					font-size: 28rpx;
					color: #333333;
					padding-left: 15rpx;
				}
			}
			.code{
				width: 500rpx;
				height: 500rpx;
				display: block;
				margin: 40rpx auto;
			}
			.tips{
				text-align: center;
				font-size: 22rpx;
				color: #999999;
				padding-top: 20rpx;
			}
		}
		.overlay_btn{
			background-image: linear-gradient(0deg, #FF4365 0%, #FF8399 100%);
			border-radius: 50px;
			width: 630rpx;
			line-height: 100rpx;
			color: white;
			text-align: center;
			margin: 40rpx auto 0;
			display: flex;
			align-items: center;
			justify-content: center;
			img{
				width: 26rpx;
				height: 26rpx;
				margin-right: 10rpx;
			}
		}
	}
	.loading-class{
		width: 100%;
		text-align: center;
		padding-top: 20rpx;
	}
</style>
