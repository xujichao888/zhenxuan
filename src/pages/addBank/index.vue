<template>
    <div class="jx-bank">
        <div>
            <label>持卡人</label>
            <input type="text" maxlength="12" placeholder="请输入持卡人姓名" v-model.lazy="accountName" auto-focus>
            <div class="line"></div>
        </div>
        <div>
            <label>卡号</label>
            <input type="number" maxlength="19" placeholder="请输入储蓄卡号" v-model.lazy="bankAccount">
            <div class="line"></div>
        </div>
        <div>
            <label>银行</label>
            <input disabled="disabled" type="text" placeholder="请选择银行卡" v-model.lazy="bankName" @click="jumpSelectBank"><span @click="jumpSelectBank"></span>
            <div class="line"></div>
        </div>
        <div>
            <label>手机号</label>
            <input type="number" maxlength="11" placeholder="请输入银行预留手机号" v-model.lazy="phone">
            <div class="line"></div>
        </div>
        <div class="jx-bank-btn">
            <button type="primary" @click="save">确定</button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            bankid: '',
            accountName: '',//账户名
            bankAccount: '',//账号
            bankName: '',//银行名
            phone: '',//手机
        }
    },
    created () {
    },
    methods: {
        jumpSelectBank () {
            wx.redirectTo({
				url: "/pages/bankSelect/main",
			})
        },
        save () {
            let _this = this
            let sjReg = /^1[3456789]\d{9}$/
            if(this.accountName == ''){
                wx.showToast({
                    title: '持卡人姓名不能为空', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.bankAccount == ''){
                wx.showToast({
                    title: '储蓄卡号不能为空', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.bankName == ''){
                wx.showToast({
                    title: '银行卡不能为空', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.phone == ''){
                wx.showToast({
                    title: '手机号不能为空', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.phone != ''&& !sjReg.test(this.phone)){
                wx.showToast({
                    title: '手机号码格式错误', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            let params ={
                account_name : this.accountName,
                bank_account: this.bankAccount,
                bank_name: this.bankName,
                phone: this.phone,
            }
            if(this.bankid){
                params.id = this.bankid
            }
            wx.showModal({
                title: '为了您的资产安全，请确认填写的银行卡信息无误',
                //content: '这是一个模态弹窗',
                success (res) {
                    if (res.confirm) {
                        console.log(_this)
                        _this.$http.post({
                            url: '/leader/save/bank',
                            data: params,
                        }).then(res => {
                            if (res.code * 1 === 0) {
                                wx.showToast({
                                    title: '保存成功！', //提示的内容,
                                    icon: 'none', //图标,
                                    duration: 2000, //延迟时间,
                                    mask: true, //显示透明蒙层，防止触摸穿透,
                                })
                                setTimeout(() => {
                                    wx.navigateTo({
                                        url: `/pages/reflect/main?bank=${JSON.stringify(params)}`,
                                    })
                                }, 2000)
                            } else {
                                wx.showToast({
                                    title: '保存失败！', //提示的内容,
                                    icon: 'none', //图标,
                                    duration: 2000, //延迟时间,
                                    mask: true, //显示透明蒙层，防止触摸穿透,
                                })
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消',res.cancel)
                    }
                },
            })
            
        },
    },
    onLoad (options) {
        // this.accountName = ''//账户名
        // this.bankAccount= ''//账号
        // this.bankName= ''//银行名
        // this.phone= ''
        // this.bankid = ''
        console.log(Object.keys(options))
        if(Object.keys(options) < 1){
            this.accountName = ''//账户名
            this.bankAccount= ''//账号
            this.bankName= ''//银行名
            this.phone= ''
            this.bankid = ''
        }
    },
    onShow () {
        if (this.$root.$mp.query.hasOwnProperty('bank')) {
			this.bankName = JSON.parse(this.$root.$mp.query.bank).name;
        }
        if(this.$root.$mp.query.hasOwnProperty('bankInfo')){
            console.log('onShow')
            let bankInfo = JSON.parse(this.$root.$mp.query.bankInfo);
            console.log(bankInfo)
            this.accountName = bankInfo.account_name//账户名
            this.bankAccount= bankInfo.bank_account//账号
            this.bankName= bankInfo.bank_name//银行名
            this.phone= bankInfo.phone
            this.bankid = bankInfo.id
            console.log(this.accountName)
        }
    },
}
</script>
<style lang="scss" scoped>
.jx-bank{
    width: 100%;
    height: 100%;
    padding: 0rpx 39rpx;
    padding-top: 37rpx;
	background-color: #fff;
    font-size: 28rpx;
    color: #333333;
    line-height: 46rpx;
    box-sizing: border-box;
    div{
        width: 100%;
        margin-top: 36rpx;
        label{
            display: inline-block;
            width:176rpx;
        }
        input{
            display: inline-block;
            vertical-align: bottom;
        }
        span{
            float:right;
            width: 23rpx;
            height: 23rpx;
            margin-top: 12rpx;
            border-top: 2px solid #767676;
            border-right: 2px solid #767676;
            transform: rotate(45deg);
        }
        .line{
            height: 2rpx;
            margin-top: 36rpx;
            background-color: #d0d0d0;
        }
    }
    .jx-bank-btn{
        margin-top: 221rpx;
        button{
            width: 100%;
            height: 88rpx;
            background-color: #ff4365;
            border-radius: 43rpx;
        }
    }
    
}
</style>