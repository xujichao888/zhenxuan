<template>
  <div class="special-sales-set" v-if="into">
	  <update-nav-bar 
			titleText="设置会场"
			backIcon="/static/icons/return-black.png"
			color="#333333"
			:showLvev="false"
			background="#f1f1f1"
			topBg="#f1f1f1"
			@back="back"
		>
	</update-nav-bar>
	<van-toast id="van-toast" />
	<div class="actionSheetCentent">
		<div class="beforAddPric" v-if="beforAddPric > 0">上次加价:￥{{beforAddPric}}</div>
		<v-radio-group 
		isSpace
		:customPric.sync="customPric"
		:radioList="radioList"
		:premium_money.sync="premium_money"
		:type.sync="radioType"
		@noError="noError"
		></v-radio-group>
		<div class="tips">
			注：加价后，该品牌的每个商品都在建议销售价的基础上，加上加价金额，单个品牌设置的加价只针对该品牌生效
		</div>
		<div class="addRpricBtn" @click="setAddPric">保存</div>
	</div>	
  </div>
</template>

<script>
import { accMul } from '../../../utils'
import updateNavBar from '../../../components/updateNavBar'
import vRadioGroup from '../../../components/vRadioGroup'
import Toast from '../../../../static/vant/toast/toast';
export default {
	components: {
		vRadioGroup,
		updateNavBar,
	},
	onLoad (option){
		this.supersale_id = Number(option.brandId)
		this.showAction()
	},
	onUnload () {
		this.closeActionSheet()
	},
  data () {
	return {
		into:false,
		supersale_id:0,
		beforAddPric: 0,
		customPric:'',
		premium_money: '0',
		radioList: [
			{
				id: "0",
				value: "",
				label: "不加价",
			},
			{
				id: "500",
				value: "5.00",
				label: "加价￥",
			},
			{
				id: "1000",
				value: "10.00",
				label: "加价￥",
			},
			{
				id: "-1",
				value: "",
				label: "自定义加价￥",
				error: false,
			},
		],
	  }
	},
	methods: {
		noError (noOff){
			let _c = this.radioList.find(item=>item.id === "-1")
			_c.error = noOff
		},
		setAddPric (){
			if(this.premium_money === "-1"){
				if(this.customPric === ''){
					wx.showToast({
						title: '请输入加价金额',
						icon: 'none',
					});
					this.noError(true)
					return
				} 
				let reg = /^([1-9]\d{1,9}|\d)(.\d{1,2})?$/
				if(!reg.test(this.customPric)){
					wx.showToast({
						title: '输入错误',
						icon: 'none',
					});
					this.noError(true)
					return
				} 
				if(this.customPric > 30){
					wx.showToast({
						title: '加价金额不能大于30',
						icon: 'none',
					});
					this.noError(true)
					return
				}
			} else {
				this.noError(false)
				this.customPric = ""
			}
			this.addProdPric({premium_money : this.premium_money === '-1' ? accMul(this.customPric, 100) : Number(this.premium_money)})
		},
		addProdPric ({premium_money}){
			wx.showLoading({
				title: '加载数据中...', 
				mask: true,
			});
			this.$http.post({
				url: '/premium/supersale',
				data: {premium_money, supersale_id : this.supersale_id},
			}).then(res => {
				wx.hideLoading()
				if (res.code * 1 === 0) {
					let _this = this
					Toast.success({
						message: '保存成功',
						forbidClick: true,
						onClose (){
							setTimeout(()=>{
								_this.closeActionSheet()
								wx.navigateBack({
									delta: 1,
									success (){
										let page = getCurrentPages().pop();
										if (page == undefined || page == null) return;
										page.refreshPage()
									},
								});
							},500)
						},
					});
				} else {
					wx.showToast({
						title: '保存失败！', //提示的内容,
						icon: 'none', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
				}
			})
		},
		showAction (){
			this.$http.get({
				url: `/premium/getSuperSale`,
				data: {supersale_id : this.supersale_id},
			}).then( res => {
				if (res.code * 1 === 0) {
					this.beforAddPric = res.data && res.data ? (res.data / 100).toFixed(2) : 0
					this.$nextTick(() => {
						this.into = true
					})
				} else {
					console.log(res);
				}
			});
		},
		closeActionSheet (){
			this.noError(false)
			this.premium_money = '0'
			this.customPric = ''
			this.beforAddPric = 0
		},
		back (){
			wx.navigateBack({  
                delta: 1,  
            }) 
		},
	},
}
</script>
<style lang="scss" scope>
.actionSheetCentent{
	.beforAddPric{
		color: rgb(242, 130, 106);
		padding: 25rpx 0 25rpx var(--cell-horizontal-padding,16px);
		font-size: 28rpx;
	}
	.tips{
		color: #FF4365;
		font-size: 28rpx;
		color: #FF4365;
		padding: var(--cell-vertical-padding,30px) var(--cell-horizontal-padding,16px);
	}
	.addRpricBtn{
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: white;
		text-align: center;
		background: #FF4365;
		border-radius: 8px;
		position: fixed;
		left: 32rpx;
		bottom: 30rpx;
	}
	.radioCell{
		flex-direction: row-reverse;
		align-items: center;
		.cellLabel{
			padding-left: 25rpx;;
			.pric{
				color: #FF4365;
			}
		}
		.custom{
			display: flex;
			align-items: center;;
		}
	}
}
</style>
