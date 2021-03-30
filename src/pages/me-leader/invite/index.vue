<template>
  <div class="invite" v-if="imgUrl">
	  <div class="tips">
		  店主邀请名额：总名额<span>{{inviteInfo.total_invite}}</span>   已邀请<span>{{inviteInfo.invited}}</span>   剩余<span>{{inviteInfo.total_invite - inviteInfo.invited}}</span>
	  </div>
	  <div v-if="list.length">
		  <div class="section" v-for="(item, index) in list" :key="index">
			<div class="top">
				<div class="bg" 
					@click="showModal(item.image)"
					:style="{background: item.bgurl, backgroundSize: '100% 100%'}"
				>
					<img :src="imgUrl">
				</div>
				<div class="text">
					{{item.content}}
				</div>
			</div>
			<div class="footer">
				<div class="saveImg" @click="isWritePhotosAlbum(item.image)"><img src="/static/icons/icon_Save_the_picture.png">保存图片</div>
				<div class="copy" @click="copyText(item.content)"><img src="/static/icons/copy.png">复制文案</div>
			</div>
		  </div>
	  </div>
	  <van-overlay :show="show" @click="closeModal">
		  <scroll-view scroll-y="true" class="_overlay_wrap">
                <div class="_overlay_group">
					<img :src="bg" class="bg">
					<img :src="imgUrl" class="code">
				</div>
				<div class="overlay_btn"  @click.stop="isWritePhotosAlbum()">
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
			bg:'',
			list:[],
			customStyle:"position: absolute; left: -9999rpx",
			show:false,
			inviteInfo:{},
			imgUrl:'',
			template: {},
		}
	},
	methods: {
		showModal (img){
			this.bg = img
			this.show = true
		},
		closeModal (){
			this.show = false
			this.bg = ''
		},
		copyText (text){
			wx.setClipboardData({
				data: text,
			})
		},
		getInfo (){
			wx.showLoading({
				title: '加载数据中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			let leader_id = wx.getStorageSync('userid')
			this.$http.get({
				url: `/leader/getinfo?leader_id=${leader_id}`,
			}).then(res => {
				wx.hideLoading();
				if (res.code * 1 === 0) {
					this.inviteInfo = res.data
					this.getToken()
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
		getToken (){
			this.getWXCode()
		},
		getWXCode () {
			let _this = this
			let user_leader = wx.getStorageSync('userid')
			let page = 'pages/head-application/main'
			let scene = `referee_id=${user_leader}`
			this.$http.get({
				url: `/qrcode?page=${encodeURIComponent(page)}&scene=${encodeURIComponent(scene)}`,
			},'arraybuffer').then(res => {
				_this.qrCodeUrl = wx.arrayBufferToBase64(res);
				var save = wx.getFileSystemManager();
					var number = Math.random();
					save.writeFile({
						filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
						data: _this.qrCodeUrl,
						encoding: 'base64',
						success: res => {
							_this.imgUrl = wx.env.USER_DATA_PATH + '/pic' + number + '.png'
						}, fail: err => {
							wx.showToast({
								title: err.errMsg, //提示的内容,
								icon: 'none',
							});
							_this.shareEvent()
						},
					})
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
		isWritePhotosAlbum (img) {
			if(img) this.bg = img
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
					views.push(	{
						type: 'image',
						url: _this.imgUrl,
						css: {
							width: 250 * pixelRatio+ 'rpx',
							height: 280 * pixelRatio + 'rpx',
							left : (630 - 250) / 2 * pixelRatio  + 'rpx',
							bottom : 50 * pixelRatio + 'rpx',
						},
					})
					_this.template = {
						background: _this.bg,
						borderRadius: 20 * pixelRatio + 'rpx',
						width:  630 * pixelRatio + 'rpx',
						height: 1100 * pixelRatio + 'rpx',
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
					console.log('saveImageToPhotosAlbum', res);
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
		getLeaderAd (){
			this.$http.get({
				url: '/leader/ad',
			}).then(res => {
				if (res.code * 1 === 0) {
					this.list = res.data.map(item=>{
						return {
							...item,
							bgurl:`url(${item.image}) no-repeat 0 0`,
						}
					})
					console.log(res.data, 'ddd')
				} else {
					wx.showToast({
						title: '获取文本失败！', //提示的内容,
						icon: 'none', //图标,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
				}
			})
		},
	},
	onLoad (option) {
		this.getInfo()
		this.getLeaderAd()
	},
	onUnload (){
		this.show = false
	},
}
</script>

<style lang="scss" scope>
	.invite{
		padding: 20rpx 30rpx;
		.tips{
			font-size: 28rpx;
			color: #595959;
			background: #FFFFFF;
			box-shadow: 0 5px 10px 0 rgba(0,0,0,0.05);
			border-radius: 50px;
			line-height: 80rpx;
			box-sizing: border-box;
			padding: 0 20rpx;
			span{
				color: #FF4365;
				padding-right: 10rpx;
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
			.footer{
				display: flex;
				align-items: center;
				padding-top: 20rpx;
				margin-top: 10rpx;
				div{
					height: 40rpx;
					flex-grow:1;
					width: 0;
					text-align: center;
					font-size: 24rpx;
					color: #16171C;
					box-sizing: border-box;
					img{
						width: 20rpx;
						height: 20rpx;
						margin-right: 10px;
					}
					&.saveImg{
						border-right: 1px solid #909399;
					}
				}
			}
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
	}
	._overlay_wrap{
		overflow-y: auto;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 50rpx;
		._overlay_group{
			width: 630rpx;
			height: 1100rpx;
			position: relative;
			margin: 20rpx auto;
			border-radius: 20rpx;
			overflow: hidden;
			.bg{
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-repeat: no-repeat;
				background-position: 0 0;
			}
			.code{
				position: absolute;
				width: 250rpx;
				height: 280rpx;
				left: 190rpx;
				bottom: 50rpx;
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
	
	
</style>
