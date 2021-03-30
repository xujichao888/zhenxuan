<template>
  <div class="update" v-if="isIn">
	  <update-nav-bar 
	  	titleText="店主升级"
	  	backIcon="/static/icons/return.png"
		:background="`url(${update_bar_bg}) no-repeat 0 -10px`"
		:userInfo="userInfo"
		isupdate
		backgroundSize="100% auto"
		@back="back">
		<div class="stepsWrap">
			<jx-steps :steps="steps" :active="leve"></jx-steps>	
		</div>
	 </update-nav-bar>
	 <div class="section">
		 <div class="updatewWrap">
			 <div class="title">
				<span></span>
				<div>{{interests[leve]['title']}}权益</div>
				<span></span>
			 </div>
			 <div class="update-group">
				 <div class="update-item" v-for="(item, index) in interests[leve].info" :key="index">
					 <img :src="item.icon">
					 <span>{{item.label}}</span>
				 </div>
			 </div>
			 <div class="title">
				<span></span>
				<div>{{interests[leve]['title']}}任务</div>
				<span></span>
			 </div>
			 <div class="task">
				 <div class="task-item" v-for="(item, index) in progressData" :key="index">
					 <span class="task-title">{{item.label}}</span>
					 <div class="progressGroup">
						 <div class="progress">
							 <van-progress 
								:show-pivot="false" 
								color="#FF4365" 
								:percentage="item.percentage" />
						 </div>
						<div class="text">{{item.complete}} / {{item.total}} ({{item.unit}})</div>	
					 </div>
				 </div>
			 </div>
			 <div class="title" v-if="upLeader && upLeader.nickname">
				<span></span>
				<div>邀请人</div>
				<span></span>
			 </div>
			 <div class="userGroup" v-if="upLeader && upLeader.nickname">
				 <div class="user">
                    <div class="avatarUrl">
                        <img :src="upLeader.img_url" alt="">
                    </div>
                    <div class="nickName">
                        <span class="name">{{upLeader.nickname}}</span>
                    </div>
                </div>
				<img :src="upLeader.qrcode" alt="">
				<div class="btn" @click="saveImage">保存二维码</div>
			 </div>
		 </div>
	 </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import updateNavBar from '../../../components/updateNavBar'
import jxSteps from '../../../components/jxSteps'
export default {
  data () {
    return {
			isIn:false,
			typeList:[
				'个人店铺销售满（含自购） /单',
				'直属正式店主达到/人',
				'团队正式店主达到（含直推）/人',
				'团队店铺累计默认佣金达/元',
				'个人店铺累计默认佣金达/元',
				'直属vip店主达到/人'
			],
			upLeader:{},
			progressData:[],
			interests:[
				{
					title:'升级VIP店主',
					info:[
						{
							label:'管理奖励',
							icon: '/static/icons/uodate1.png'
						},
						{
							label:'培养奖励',
							icon:'/static/icons/update2.png'
						},
						{
							label:'专属客服',
							icon:'/static/icons/update6.png'
						},
						{
							label:'宣传素材',
							icon:'/static/icons/update5.png'
						}
					]
				},
				{
					title:'升级运营商',
					info:[
						{
							label:'管理奖励',
							icon:'/static/icons/uodate1.png'
						},
						{
							label:'培养奖励',
							icon:'/static/icons/update2.png'
						},
						{
							label:'大咖指导',
							icon:'/static/icons/update3.png'
						},
						{
							label:'运营体系支撑',
							icon:'/static/icons/update4.png'
						}
					]
				}
			]
		}
	},
	components: {
		updateNavBar,
		jxSteps
	},
	computed: {
		...mapGetters([
			'userInfo',
			'update_bar_bg'
		]),
		steps(){
			let steps = []
			if(this.userInfo.avatarUrl){
				steps = [
					{
						text: '普通店主',
						desc: this.userInfo.Uplevel1 ? this.userInfo.Uplevel1.split(' ')[0] : this.userInfo.Uplevel0.split(' ')[0],
					},
					{
						text: 'vip店主',
						desc: this.userInfo.Uplevel2 == '' ? '' : this.userInfo.Uplevel2.split(' ')[0],
					},
					{
						text: '服务商',
						desc: '',
					}
				]
			}
			return steps
		},
		leve(){
			return (this.userInfo.leve == 0 || this.userInfo.leve == 1) ? 0 : this.userInfo.leve - 1
		}
	},
	methods: {
		back(){
			wx.navigateBack({  
                delta: 1  
            }) 
		},
		getInfo(){
			wx.showLoading({
				title: '加载数据中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			this.$http.get({
				url: '/leader/task',
			}).then(res => {
				wx.hideLoading();
				this.isIn = true
				if (res.code * 1 === 0) {
					this.upLeader = res.data.referee
					this.progressData = res.data.task.map(item=>{
						let label = this.typeList[item.type - 1]
						let unit = label.substr(label.length - 1, 1)
						return {
							...item,
							percentage: (item.complete / item.total * 100) > 100 ? 100 : item.complete / item.total * 100,
							label,
							unit: label.substr(label.length - 1, 1),
							complete: unit === '元' ?  (item.complete / 100).toFixed(2) : item.complete,
							total: unit === '元' ?  (item.total / 100).toFixed(2) : item.total
						}
					})
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
		saveImage(){
			wx.showLoading({
				title: '保存中...', 
				mask: true,
			});
			wx.downloadFile({
				url:this.userInfo.content,
				success: function(res) {
					if (res.statusCode === 200) {
						let img = res.tempFilePath;
						wx.saveImageToPhotosAlbum({
						filePath: img,
						success(res) {
							wx.hideLoading();
							wx.showToast({
								title: '保存成功',
								icon: 'success',
								duration: 2000
							});
						},
						fail(res) {
							wx.hideLoading();
							wx.showToast({
									title: '保存失败',
									icon: 'none',
									duration: 2000
								});
							}
						});
					}
				}
			});
		}
	},
	onLoad (option) {
		this.getInfo()
	}
}
</script>

<style lang="scss" scope>
	.update{
		.stepsWrap{
			padding-top: 35rpx;
		}
		.section{
			padding: 20rpx;
			.updatewWrap{
				background: white;
				border-radius: 16rpx;
				padding: 20rpx 0;
				.title{
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					color: #632B00;
					margin: 30rpx 0;
					div{
						padding: 0 30rpx;
					}
					span{
						width: 50rpx;
						height: 1rpx;
						background: #E0B18D;
					}
				}
				.update-group{
					display: flex;
					align-items: center;
					justify-content: center;
					padding-bottom: 15rpx;
					.update-item{
						flex-grow: 1;
						width: 0;
						display: flex;
						flex-direction: column;
						align-items: center;
						img{
							width: 88rpx;
							height: 88rpx;
						}
						span{
							font-size: 24rpx;
							color: #16171C;
							padding: 15rpx 0;
						}
					}
				}
			}
		}
		.task{
			padding: 0rpx 40rpx 20rpx 40rpx;
			.task-item{
				display: flex;
				flex-direction: column;
				padding-bottom: 15rpx;
				.task-title{
					padding-bottom:12rpx;
					font-size: 24rpx;
					color: #16171C;
				}
				.progressGroup{
					display: flex;
					align-items: center;
					.progress{
						flex-grow: 1;
					}
					.text{
						font-size: 20rpx;
						color: #606266;
						padding-left: 15rpx;
					}
				}
			}
		}
		.userGroup{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.user{
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 15rpx;
				.avatarUrl{
					border: 5rpx solid white;
					flex-shrink: 0;
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					overflow: hidden;
					img{
						width: 100%;
						height: 100%;
					}
				}
				.nickName{
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-left: 20rpx;
					.name{
						color: #16171C;
						font-size: 32rpx;
					}
					.leve{
						position: relative;
						margin-top: 10rpx;
						align-self: baseline;
						padding: 0 20rpx 0 45rpx;
						height: 32rpx;
						line-height: 32rpx;
						background-image: linear-gradient(270deg, #CE9E73 0%, #FFC281 100%);
						border-radius: 20px;
						font-size: 20rpx;
						color: #632B00;
						.left{
							position: absolute;
							width: 32rpx;
							height: 32rpx;
							border: 3rpx solid white;
							border-radius: 50%;
							left: 0;
							top: - 2px;
							background-image: linear-gradient(-35deg, #F2BA88 7%, #D09F73 98%);
							box-shadow: 0 2px 4px 0 rgba(168,111,58,0.50);
							text-align: center;
						}
					}
				}
			}
			img{
				width: 300rpx;
				height: 300rpx;
				margin-bottom: 15rpx;
			}
			.btn{
				width: 300rpx;
				color: white;
				background: #FF4365;
				border-radius: 40rpx;
				line-height: 70rpx;
				text-align: center;
			}
		}
	}
	
</style>
