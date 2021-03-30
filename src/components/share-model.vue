<template>
  <div>
		<mp-dialog title=" " :show="show" bindbuttontap="tapDialogButton" :buttons="dialogButtons" class="jx-share" @close="shareEvent">
      <div class="jx-share-model">
        <p class="jx-dialog-title">分享</p>
        <div class="jx-dialog-content">
          <div>
            <button class="mini-btn" type="primary" data-name="shareBtn" open-type="share">
              <img src="/static/images/wechat.png" alt="">
              <p>微信好友</p>
            </button>
          </div>
          <div @click="isWritePhotosAlbum">
            <img src="/static/images/poster.png" alt="">
            <p>生成图片海报</p>
          </div>
        </div>
        <!-- <button class="mini-btn" type="primary" @click="getCode"> -->
        <button class="mini-btn" type="primary" @click="shareEvent">
            取消
        </button>
				<painter :dirty="true" :customStyle="customStyle" @imgOK="onImgOk" :palette="template" />
				<canvas style="width: 240px; height: 240px;" canvas-id="canvasId"></canvas>
      </div>
    </mp-dialog>
	</div>
</template>

<script>
export default {
	props: {
		show: {
			required: true,
			default: false,
			type: Boolean,
		},
		closeFn: {
			required: true,
		},
		path: {
			required: false,
			default: 'pages/index/main?',
		},
		brandInfo: {
			required: false,
		},
		goodsInfo:{
			type: Object,
			required: false,
		},
		type: {
			required: true,
			default: 1,
		},
	},
  data () {
    return {
			dialogButtons: [],
			shareImg: '',
			template: {},
			src: '',
			// 画布的宽高要和object里面的宽高保持一致
			codeObject: {
				text: 'https://uu.ghaoqi.com/v3/index.html#/cece2-start?id=2', // 二维码的内容
				width: 100, // 二维码的宽
				height: 100, // 二维码的高
				canvasId: 'canvasId', //canvas的ID（唯一标识）
			},
			qrCodeUrl: '',
			imgUrl: '',
			placardBrand: [
			],
			isClick: false,
    }
	},
	methods: {
		getCode () {
			// 调用生成二维码的函数
			// const _this = this
		
			// console.log(ctx)
						console.log(this.brandInfo);

		},
		isWritePhotosAlbum () {
			let _this = this
			wx.getSetting({
				success (res) {
					if (res.authSetting['scope.writePhotosAlbum']) {
						_this.getAccessToken();
					} else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
						wx.authorize({
							scope: 'scope.writePhotosAlbum',
							success () {
								_this.getAccessToken();
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
									_this.getAccessToken();
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
		getAccessToken (){
			if (this.isClick) return
			this.isClick = true
			wx.showLoading({
				title: '加载数据中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.getWXCode()
		},
		getWXCode () {
			const _this = this
			let leader = _this.$store.state.leader * 1
			let userid = wx.getStorageSync('userid')
			if (userid == '' || !userid) userid = 0
			this.$http.get({
				url: '/view',
			}).then( res => {
				if (res.code * 1 === 0) {
					if(res.data.user_type == 2){
						leader = userid
					}
					let url = _this.path.split('?')
					let page = url[0]
					let scene = `leader=${leader}&userid=${userid}`
					if(url[1]) scene += `&${url[1]}`
					wx.showLoading({
						title: '加载数据中...', //提示的内容,
						mask: true, //显示透明蒙层，防止触摸穿透,
					});
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
									_this.save()
								}, fail: err => {
									wx.showToast({
										title: err.errMsg, //提示的内容,
										icon: 'none',
									});
									_this.shareEvent()
								},
							})
					})
				} else {
				console.log(res)
				}
			});
			
		},
		shareEvent () {
      this.$emit('update:show', false)
		},
		onImgOk (e) {
			const _this = this
			wx.showLoading({
				title: '正在生成中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.shareImg = e.mp.detail.path  // 生成的图片路径
			wx.saveImageToPhotosAlbum({
				filePath: this.shareImg,
				success: res => {
					console.log('saveImageToPhotosAlbum', res);
					wx.hideLoading()
					wx.showToast({
						title: '海报图片已保存，可到相册中查看', //提示的内容,
						duration: 1000,
						icon: 'none',
					});
					setTimeout(() => {
						_this.isClick = false
						wx.previewImage({
							current: '', // 当前显示图片的http链接
							urls: [this.shareImg], // 需要预览的图片http链接列表
						})
					}, 1000)
				},
				fail: err => {
					console.log('saveImageToPhotosAlbum', err) 
					wx.hideLoading()
				},
			})
			this.template = {} // 重置,下次点击生成时重新生成
		},
		save () {
			// 绘制样式
			const _this = this
			let views = []
			wx.getSystemInfo({
				success (system) {
						// eslint-disable-next-line no-console
						console.log(`system:`, system);
						const screenHeight = system.screenHeight
						const screenWidth = system.screenWidth
						const pixelRatio = system.pixelRatio
						const statusBarHeight = system.statusBarHeight
						const fontSizeSetting = system.fontSizeSetting
						if (_this.type === 1) {
							views.push(	{
								type: 'image',
								url: _this.imgUrl,
								css: {
									bottom: 36 * (pixelRatio / 2) + statusBarHeight -10 + 'rpx',
									left: 38 * (pixelRatio / 2) +'rpx',
									width: 140 * (pixelRatio / 2) + 'rpx',
									height: 150 * (pixelRatio / 2) + 'rpx',
								},
							})
						} else if(_this.type == 2) {
							const userInfo = _this.$store.state.userInfo
							let avatarUrl = ''
							if (JSON.stringify(userInfo) !== '{}') {
								avatarUrl = userInfo.avatarUrl
							} else {
								avatarUrl = wx.getStorageSync('avatarUrl')
							}
							views = [
								{
									type: 'image',
									url: avatarUrl,
									css: {
										top: 65 * (pixelRatio / 2) + statusBarHeight + 'rpx',
										left: 90 * (pixelRatio / 2) +'rpx',
										width: 98 * (pixelRatio / 2) + 'rpx',
										height: 98 * (pixelRatio / 2) + 'rpx',
										borderRadius: 98 * (pixelRatio / 2) / 2 + 'rpx',
										borderWidth: '4rpx',
										borderColor: '#fff',
									},
								},
								{
									type: 'image',
									url: _this.brandInfo.brand_logo,
									css: {
										top: 292 * (pixelRatio / 2) + statusBarHeight + 'rpx',
										left: 184 * (pixelRatio / 2)   +'rpx',
										width: 400 * (pixelRatio / 2) + 'rpx',
										height: 400 * (pixelRatio / 2) + 'rpx',
										borderRadius: 400 * (pixelRatio / 2) / 2 + 'rpx',
										borderWidth: '8rpx',
										borderColor: '#dd6491',
									},
								},
								{
									type: 'text',
									text: _this.brandInfo.brand_name,
									css: {
										top: 732 * (pixelRatio / 2) + statusBarHeight + 'rpx',
										left: 40 * pixelRatio + 'rpx',
										width: (screenWidth + fontSizeSetting - 80) * pixelRatio + 'rpx',
										fontSize: '48rpx',
										fontWeight: 'bold',
										textAlign: 'center',
										maxLines: 1,
									},
								},
								{
									type: 'text',
									text: `${_this.brandInfo.modified_time}  至  ${_this.brandInfo.saleEndTime}`,
									css: {
										top: 815 * (pixelRatio / 2) + statusBarHeight + 'rpx',
										left: 400  * (pixelRatio / 2)  + 'rpx',
										fontSize: '30rpx',
										align: 'center',
										color: '#333333',
									},
								},
							]
							views.push({
								type: 'image',
								url: _this.imgUrl,
								css: {
									bottom: 219 * (pixelRatio / 2) + statusBarHeight + 'rpx',
									left: 96 * (pixelRatio / 2) +'rpx',
									width: 165 * (pixelRatio / 2) + 'rpx',
									height: 165 * (pixelRatio / 2) + 'rpx',
								},
							})
						} else if (_this.type === 3){
							let _iw = (screenWidth + fontSizeSetting - 40 - 3 * 15) / 3
							views = [
								{
									id: 'logo-image',
									type: 'image',
									url: _this.brandInfo.brand_logo,
									css: {
										top: 20 * pixelRatio + 'rpx',
										left: 20 * pixelRatio + 'rpx',
										width: 40 * pixelRatio + 'rpx',
										height: 40 * pixelRatio + 'rpx',
									},
								},
								{
									type: 'text',
									text: _this.brandInfo.brand_name,
									css: {
										top: 29 * pixelRatio + 'rpx',
										left: 70 * pixelRatio + 'rpx',
										fontSize: 18 * pixelRatio + 'rpx',
										textAlign: 'left',
										color:'#16171C',
									},
								},
								{
									type: 'image',
									url: _this.goodsInfo.goodsUrl[0],
									css: {
										top: 80 * pixelRatio + 'rpx',
										left: 20 * pixelRatio + 'rpx',
										width: (screenWidth + fontSizeSetting - 40) * pixelRatio + 'rpx',
										height: (screenWidth - 40) * pixelRatio  + 'rpx',
										borderRadius: 10 * pixelRatio + 'rpx',
									},
								},
								{
									type: 'rect',
									css: {
										color: "#ffffff",
										top: (screenWidth + 40) * pixelRatio + 'rpx',
										left: 20 * pixelRatio + 'rpx',
										width: (screenWidth + fontSizeSetting - 40) * pixelRatio + 'rpx',
										height: (_iw * 2) * pixelRatio + 'rpx',
										borderRadius: 10 * pixelRatio + 'rpx',
									},
								},
								{
									type: 'rect',
									css: {
										color: "#ffffff",
										top: (screenWidth + 30) * pixelRatio + 'rpx',
										left: 20 * pixelRatio + 'rpx',
										width: (screenWidth + fontSizeSetting - 40) * pixelRatio + 'rpx',
										height: 20 * pixelRatio + 'rpx',
									},
								},
								{
									id: 'text_0',
									type: 'text',
									text: _this.goodsInfo.product_name,
									css: {
										top: (screenWidth + 40) * pixelRatio + 'rpx',
										left: 35 * pixelRatio + 'rpx',
										width: (screenWidth + fontSizeSetting - 70) * pixelRatio + 'rpx',
										fontSize: 16 * pixelRatio + 'rpx',
										textAlign: 'left',
										color:'#16171C',
										lineHeight: 20 * pixelRatio + 'rpx',
									},
								},
								{
									id:'text_1',
									type: 'text',
									text: "疯抢价",
									css: {
										top: [(screenWidth + 60) * pixelRatio + 'rpx', 'text_0'],
										left: 35 * pixelRatio + 'rpx',
										fontSize: 12 * pixelRatio + 'rpx',
										textAlign: 'left',
										color:'#FF4365',
									},
								},
								{
									id:'text_2',
									type: 'text',
									text: "￥" + (_this.goodsInfo.price ? (_this.goodsInfo.price + _this.goodsInfo.premium_price) / 100 : _this.goodsInfo.price_range),
									css: {
										top: [(screenWidth + 52) * pixelRatio + 'rpx', 'text_0'],
										left: [35 * pixelRatio + 'rpx', 'text_1'],
										fontSize: 22 * pixelRatio + 'rpx',
										textAlign: 'left',
										color:'#FF4365',
									},
								},
							]
							if(_this.goodsInfo.pre_price && !isNaN(_this.goodsInfo.pre_price)){
								views.push(
									{
										type: 'text',
										text: "￥" + _this.goodsInfo.pre_price / 100,
										css: {
											top: [(screenWidth + 60) * pixelRatio + 'rpx', 'text_0'],
											left: [80 * pixelRatio + 'rpx', 'text_2'],
											fontSize: 12 * pixelRatio + 'rpx',
											textAlign: 'left',
											color:'#909399',
											textDecoration: 'line-through',
										},
									}
								)
							}
							if(_this.goodsInfo.reckon_rebate && !isNaN(_this.goodsInfo.reckon_rebate)){
								views.push(
									{
									type: 'image',
									url: '/static/icons/zk.png',
									css: {
										top: [(screenWidth + 55) * pixelRatio + 'rpx', 'text_0'],
										left: [120 * pixelRatio + 'rpx', 'text_2'],
										width: 50 * pixelRatio + 'rpx',
									},
								},
								{
									type: 'text',
									text: _this.goodsInfo.reckon_rebate + '折',
									css: {
										top: [(screenWidth + 58) * pixelRatio + 'rpx', 'text_0'],
										left: [130 * pixelRatio + 'rpx', 'text_2'],
										fontSize: 12 * pixelRatio + 'rpx',
										textAlign: 'left',
										color:'#ffffff',
									},
								}
								)
							}
							let _imgs = _this.DrowImg({screenWidth,pixelRatio,statusBarHeight,screenHeight, fontSizeSetting, _iw})
							if(_imgs.length){
								views.push(..._imgs)
							}
							views.push(
								{
									id:'code',	
									type: 'image',
									url: _this.imgUrl,
									css: {
										top: (screenWidth + _iw + 30) * pixelRatio + 'rpx',
										left: _imgs.length ? (_imgs.length * _iw + _imgs.length * 20 + 35) * pixelRatio + 'rpx' : (screenWidth + fontSizeSetting - (_iw - 35)) / 2 * pixelRatio + 'rpx',
										width: (_iw - 35) * pixelRatio + 'rpx',
										height: (_iw - 35) * pixelRatio + 'rpx',
									},
								},
								{
									type: 'text',
									text: "长按识别",
									css: {
										top: (screenWidth + 5 + _iw * 2 ) * pixelRatio + 'rpx',
										left: _imgs.length ? (_imgs.length * _iw + _imgs.length * 20 + 35) * pixelRatio + 'rpx' : (screenWidth + fontSizeSetting - (_iw - 35)) / 2 * pixelRatio + 'rpx',
										fontSize: 12 * pixelRatio + 'rpx',
										width: (_iw - 35) * pixelRatio + 'rpx',
										color:'#16171C',
										textAlign: 'center',
									},
								}
							)
						} else if (_this.type === 4){
							const userInfo = _this.$store.state.userInfo
							let avatarUrl = ''
							if (JSON.stringify(userInfo) !== '{}') {
								avatarUrl = userInfo.avatarUrl
							} else {
								avatarUrl = wx.getStorageSync('avatarUrl')
							}
							views = [
								{
									type: 'image',
									url: avatarUrl,
									css: {
										top: screenHeight / 568 * 25 * pixelRatio + 'rpx',
										left: 25 * pixelRatio  +'rpx',
										width: 68 * pixelRatio + 'rpx',
										height: 68 * pixelRatio  + 'rpx',
										borderWidth: '4rpx',
										borderColor: '#fff',
									},
								},
							]
							views.push({
								type: 'image',
								url: _this.imgUrl,
								css: {
									left : (screenWidth + fontSizeSetting) / 2 * pixelRatio + 'rpx',
									bottom: screenHeight / 568 * 110 * pixelRatio + 'rpx',
									width: 100 * pixelRatio + 'rpx',
									height: 110 * pixelRatio + 'rpx',
									align: 'center',
								},
							})
						}
						let bgUrl = '/static/images/placard.jpg'
						if (_this.type == 2) {
							bgUrl = '/static/images/placard1.jpg'
						} else if(_this.type === 3){
							bgUrl = 'linear-gradient(-90deg, #eed3b6 0%,#dfb58f 100%)'
						} else if(_this.type === 4){
							bgUrl = '/static/images/porter.jpg'
						}
						_this.template = {
							background: bgUrl,
							width: (screenWidth + fontSizeSetting) * pixelRatio + 'rpx',
							height: (screenHeight + statusBarHeight) * pixelRatio + 'rpx',
							views: views,
						}
						_this.$forceUpdate()
				},
			});
		},
		DrowImg ({screenWidth,pixelRatio,statusBarHeight,screenHeight, fontSizeSetting, _iw}){
			let _a =  []
			for(let i=1; i<this.goodsInfo.goodsUrl.length && i < 3; i++){
				_a.push({
					type: 'image',
					url: this.goodsInfo.goodsUrl[i],
					css: {
						top: (screenWidth + 25 + _iw) * pixelRatio + 'rpx',
						left: ((i-1) * _iw + 35 + (i-1) * 15) * pixelRatio + 'rpx',
						width: _iw * pixelRatio + 'rpx',
						height: _iw * pixelRatio + 'rpx',
						borderRadius: 5 * pixelRatio + 'rpx',
					},
				})
			}
			return _a
		},
	},
  created () {
	},
	onShow () {
		
	},
}
</script>

<style lang="scss">
	.jx-share {
    .weui-dialog__wrp {
      bottom: 0;
      left: 0;
      right: 0;
			font-size: 30rpx;
			.jx-share-model {
				overflow: hidden;
				height: 513rpx;
				.jx-dialog-content {
					display: flex;
					justify-content: space-around;
					color: #4e4e4e;
					img {
						height: 125rpx;
						width: 125rpx;
					}
					.mini-btn {
						margin-top: 0;
						font-size: 30rpx;
						background: #fff;
						line-height: 1;
						flex-direction: column;
						justify-content: start;
						height: auto;
						padding: 0;
						margin-bottom: 0;
						p {
							color: #4e4e4e;
							margin-top: 17rpx;
						}
					}
				}
				.jx-dialog-title {
					text-align: left;
					margin-top: 20rpx;
					color: #333333;
					margin-bottom: 77rpx;
				}
				.mini-btn {
					margin-top: 87rpx;
					font-size: 34rpx;
					color: #818181;
					background: #efefef;
					border-radius: 15rpx;
					height: 90rpx;
					justify-content: center;
					margin-bottom: 100rpx;
				}
			}
      .weui-dialog {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 513rpx;
        background-color: #fff;
        border-top-left-radius: 30rpx;
        border-top-right-radius: 30rpx;
        .weui-dialog__bd {
          padding: 0 40rpx;
          margin-bottom: 0;
        }
      }
    }
  }
</style>
