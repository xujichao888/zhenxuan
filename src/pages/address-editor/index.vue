<template>
	<div class="jx-address-editor">
		<div class="jx-address-from">
			<div class="jx-from-input">
				<div>收件人</div>
				<div class="jx-input-box">
					<input class="weui-input" placeholder="姓名" v-model.lazy="name" maxlength="30"/>		
				</div>
			</div>
			<div class="jx-from-input">
				<div>手机号</div>
				<div class="jx-input-box">
					<input class="weui-input" placeholder="手机或电话号码" data-field="mobile" v-model.lazy="mobile" maxlength="11"/>		
				</div>
			</div>
			<div class="jx-from-input">
				<div>地区</div>
				<div class="jx-input-box">
					<picker mode="region" :value="region" @change="pickerChange">
						<div class="picker">
								<div v-if="!region[0]">
									请选择地区
								</div>
								<div v-else>
									{{region[0]}}{{region[1]}}{{region[2]}}
								</div>
						</div>
					</picker> 	
				</div>
			</div>
			<div class="jx-from-input">
				<div>详细地址</div>
				<div class="jx-input-box">
					<input class="weui-input" placeholder="街道地址" v-model.lazy="address"/>		
				</div>
			</div>
			<div class="jx-from-input">
				<div>默认地址</div>
				<div  class="jx-input-box">
					<switch class="jx-input-switch" type="switch" :checked="switch2Checked" @change="switch2Change" color="#ff4365"/>
				</div>
			</div>
		</div>
		<div class="jx-address-btn">
			<button class="mini-btn" type="primary" @click="save">
				保存
			</button>
			<button v-if="removeBtnShow" class="mini-btn jx-address-delete" type="primary" style="margin-top: 20rpx;" @click="confirmDelete">
				删除
			</button>
		</div>
	</div>
</template>

<script>
export default {
  data () {
    return {
			removeBtnShow:true,
			isSuccess: false,
			switch2Checked: false,
			region: [],
			regionCode: [],
			mobile: '',
			address: '',
			name: '',
			addressId: 0,
			province: {},
			btnDisabled: false,
			isClick: false,
    }
	},
	methods: {
		switch2Change (e) {
			this.switch2Checked = e.target.value
		},
		pickerChange (e) {
			console.log(e.target.value);
			this.region = e.target.value
			this.regionCode = e.target.code
		},
		save () {
			if (this.isClick) return
			this.isClick = true
			if (this.name === '') {
				wx.showToast({
					title: '请输入姓名',
					icon: 'none',
					duration: 2000,
				})
				this.isClick = false
				return
			}
			if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.mobile)) {
				wx.showToast({
					title: '请填写正确的手机号',
					icon: 'none',
					duration: 2000,
				})
				this.isClick = false
				return
			}
			if (!this.region[0]) {
				wx.showToast({
					title: '请选择地区',
					icon: 'none',
					duration: 2000,
				})
				this.isClick = false
				return
			}
			if (!this.address) {
				wx.showToast({
					title: '请输入详细地址',
					icon: 'none',
					duration: 2000,
				})
				this.isClick = false
				return
			}
			console.log(this.address)
			wx.showLoading({
				title: '数据提交中...', //提示的内容,
				mask: true, //显示透明蒙层，防止触摸穿透,
			});
			const params = {
					province: this.regionCode[0] * 1,
					city: this.regionCode[1] * 1,
					district: this.regionCode[2] * 1,
					address: this.address,
					telephone: this.mobile,
					is_default: this.switch2Checked ? 1 : 0,
					shipping_user: this.name,
			}
			console.log(params, 'paramsparams')
			let url = '/user/add/addr'
			if (this.addressId !== 0) {
				params.id = this.addressId
				url = '/user/update/addr'
			}
			this.$http.post({
				url: url,
				data: params,
			}).then(res => {
				wx.hideLoading()
				if (res.code === 0) {
					if (this.addressId === 0) {
						wx.showToast({
							title: '创建地址成功！',
							icon: 'none',
							duration: 1000,
						})
					} else {
						wx.showToast({
							title: '修改地址成功！',
							icon: 'none',
							duration: 1000,
						})
					}
					this.$store.commit('setEditorAffress', {})
					setTimeout(() => {
						wx.navigateBack({
							delta: 1,
						})
					}, 1000)
				}
			})
		},
		confirmDelete () {
			const _this = this
			wx.showModal({
				title: '提示',
				content: '确定删除该地址',
				success (res) {
					if (res.confirm) {
						_this.addressDelete()
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				},
			})
		},
		addressDelete () {
			this.$http.post({
				url: '/user/update/addr',
				data: {
					id: this.addressId,
					delete_flag: 1,
				},
			}).then(res => {
				wx.hideLoading()
				if (res.code === 0) {
					wx.showToast({
						title: '删除地址成功！',
						icon: 'none',
						duration: 1000,
					})
					setTimeout(() => {
						wx.navigateBack({
							delta: 1,
						})
					}, 1000)
					if(this.$store.state.selectAddress && this.$store.state.selectAddress.id == this.addressId){
						console.log('清除store中的地址')
						this.$store.commit('setSelectAddress', {})
					}
				} else {
					wx.showToast({
						title: '删除地址成功！',
						icon: 'none',
						duration: 1000,
					})
				}
			})
		},
		getAddrSelect () {
			const editorAddress = this.$store.state.editorAffress
			this.name = editorAddress.shipping_user
			this.mobile = editorAddress.telephone
			this.address = editorAddress.address
			this.addressId = editorAddress.id * 1
			this.switch2Checked = !!editorAddress.is_default
			this.regionCode = [editorAddress.province, editorAddress.city, editorAddress.district]
			this.region = [editorAddress.province_name, editorAddress.city_name, editorAddress.district_name]
		},
	},
  created () {
	},
	onLoad (opt) {
		if(opt.add === '1') this.removeBtnShow = false
		else this.removeBtnShow = true
	},
	onShow (opt) {
		this.getAddrSelect()
		this.isClick = false
	},
}
</script>

<style lang="scss" scope>
	.jx-address-editor {
		background-color: #fff;
		padding: 0 40rpx;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		.jx-address-from {
			.jx-from-input {
				display: flex;
				justify-content: space-between;
				height: 100rpx;
				align-items: center;
				border-bottom: 1rpx solid #d0d0d0;
				font-size: 28rpx;
				.jx-input-box {
					width: 500rpx;
					color: #b8b8b8;
					.jx-input-switch {
						height: 40rpx;
						float: right;
					}
					.wx-switch-input{
						height:40rpx !important;
						width: 85rpx !important;
						border-radius: 20rpx;
					}
					.wx-switch-input::before{
							height: 38rpx !important;
							width: 85rpx !important;
							border-radius: 20rpx;
					}
					/*绿色样式（true的样式）*/
					.wx-switch-input::after{
							height: 30rpx !important;
							width: 30rpx !important;
							margin-top: 3rpx;
					}
				}
			}
		}
		.jx-address-btn {
			position: fixed;
			bottom: 20rpx;
			left: 0;
			width: 100%;
			.mini-btn {
				width: 669rpx;
				height: 88rpx;
				border-radius: 44rpx;
				background-color: #ff4365;
				font-size: 34rpx;
				color: #fff;
			}
			.jx-address-delete {
					background-color: #fff;
					border: 1rpx solid #ff4365;
					color: #ff4365;
			}
		}
	}
</style>
