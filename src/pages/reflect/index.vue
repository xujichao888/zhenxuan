<template>
    <div class="jx-reflect">
        <div class="jx-reflect-bank">
            <p class="left-content">到账银行卡</p>
            <p class="right-content">
                <sapn v-if="banks.length < 1" @click="selectBank" 
                    style="display:inline-block;height:132rpx;width:100%;line-height:132rpx;text-align:right;">{{bankDetail}}</sapn>
                <picker v-else style="display:inline-block;height:100%;" :value="index" :range="pickerBanks" :range-key="'bank_names'" @change="bindPickerChange">
					<div class="picker">
						<div class="picker">
                            <div v-if="!courier">
                                {{bankDetail }} >
                            </div>
                            <div v-else>{{pickerBanks[courier].bank_names }} ></div>
                        </div>
					</div>
				</picker>
            </p>
        </div>
        <div class="jx-reflect-amount">
            <p class="jx-reflect-amount-text">提现金额</p>
            <p>
                <span>￥</span>
                <input type="digit" 
                    @focus="mountFocus" 
                    @blur="mountBlur"
                    :placeholder="placeholder" 
                    v-on:input="moneyChange" 
                    v-model="reflectAmount" 
                    auto-focus>
            </p>
            <p class="bottom-line"></p>
            <p class="all-amount">全部提现金额￥{{allAmount}} <span @click="reflectAllAmount">全部提现</span></p>
        </div>
        <div class="jx-reflect-btn">
            <button type="primary" @click="reflectMoney">提现</button>
        </div>
        <div class="jx-reflect-record">
            <p @click="jumpPage">提现记录</p>
        </div>
    </div>

</template>
<script>
import { accMul } from '../../utils'
export default {
    data () {
        return {
            placeholder:'提现金额',
            courier: '',
            reflectAmount: '',//提现金额
            allAmount: 5000,//可提现的总金额
            selectedBankid: '',//银行卡id
            banks: [],//团长银行卡信息
            pickerBanks: [],
            bankDetail: '+添加银行卡',
        }
    },
    created () {
    },
    directives: {
        focus: {
            inserted: function (e) {
                e.focus()
            },
        },
    },
    methods: {
        mountFocus(){
            this.placeholder = ''
        },
        mountBlur(e){
            if(e.mp.detail.value == '') this.placeholder = '提现金额'
        },
        moneyChange (e) {
            console.log(e.mp.detail.value)
            var money = 0
            if (/^(\d?)+(\.\d{0,2})?$/.test(e.mp.detail.value * 1)) { //正则验证，提现金额小数点后不能大于两位数字
                //money = e.mp.detail.value * 1;
                console.log('小数点2位内')
            } else {
                money = e.mp.detail.value.substring(0, e.mp.detail.value.length - 1) * 1;
                console.log(e.mp.detail.value.substring(0, e.mp.detail.value.length - 1))
                this.reflectAmount = money
                console.log('小数点2位外')
            }
        },
        /**
         * 全部提现
         */
        reflectAllAmount () {
            this.reflectAmount = this.allAmount
        },
        jumpPage () {
            wx.navigateTo({
				url: "/pages/withdrawal-subsidiary/main",
			})
        },
        reflectMoney () {
            console.log()
            let bankid = ''
            if(!this.courier && this.banks.length < 1){
                wx.showToast({
                    title: '请添加银行卡！', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.reflectAmount == ''){
                wx.showToast({
                    title: '请输入提现金额！', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.reflectAmount == 0){
                wx.showToast({
                    title: '提现金额不能为0！', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.reflectAmount > this.allAmount){
                wx.showToast({
                    title: '提现金额不能大于提现全部金额！', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
                return
            }
            if(this.courier){
                bankid = this.pickerBanks[this.courier].id
            }else{
                bankid = this.banks[0].id
            }
            let params = {
                amount : accMul(this.reflectAmount, 100),
                bankid : bankid,
            }
            this.$http.get({
				url: '/leader/withdraw',
				data: params,
			}).then(res => {
				if (res.code * 1 === 0) {
					wx.showToast({
						title: '提现申请已提交！', //提示的内容,
						icon: 'none', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
					setTimeout(() => {
						wx.switchTab({
                            url: '/pages/me/main'
                        })
					}, 2000)
				} else {
					wx.showToast({
						title: res.msg, //提示的内容,
						icon: 'none', //图标,
						duration: 2000, //延迟时间,
						mask: true, //显示透明蒙层，防止触摸穿透,
					})
				}
			})
        }, 
        bindPickerChange (e){
            console.log(e)
            this.courier = e.mp.detail.value
            if(this.pickerBanks[this.courier].id == -1){
                wx.navigateTo({
                    url: "/pages/addBank/main",
                })
            }
            console.log(this.pickerBanks[this.courier])
            //this.courier = ''
        },
        selectBank () {
            let bankInfo = ''
            if(this.banks.length < 1){
                wx.navigateTo({
                    url: "/pages/addBank/main",
                })
                return
            }
            if(this.courier){
                bankInfo = JSON.stringify(this.pickerBanks[this.courier])
            }else{
                bankInfo = JSON.stringify(this.banks[0])
            }
            wx.navigateTo({
                url: "/pages/addBank/main?bankInfo="+bankInfo,
            })
        },
    },
    // watch: {
    //     inputs(newInputs) {
    //         // 比较是哪个val变化了，逻辑自己写吧
    //     }
    // },
    onShow () {
        this.pickerBanks = []
        this.courier= ''
        this.banks = []
        if(this.$root.$mp.query.hasOwnProperty('withDraw')){
            this.allAmount = this.$root.$mp.query.withDraw
        }
        console.log(this.$root.$mp.query)
        // if (this.$root.$mp.query.hasOwnProperty('bank')) {
        //     let data = JSON.parse(this.$root.$mp.query.bank)
        //     let bank = data.bank_name + '('+ data.bank_account.substring(data.bank_account.length-4)+')'
        //     this.bankDetail = bank
		// }else{
            this.$http.get({
                url: '/leader/bank',
            }).then(res => {
                if(res.code * 1 === 0){
                    this.banks = res.data
                    console.log(res)
                    if(this.banks.length > 0){
                        this.selectedBankid = this.banks[0].id
                        this.bankDetail = this.banks[0].bank_name + '('+this.banks[0].bank_account.substring(this.banks[0].bank_account.length-4)+')'
                    }else{
                        this.bankDetail = '+添加银行卡' 
                    }
                    for(let b in this.banks){
                        this.pickerBanks.push({
                            id: this.banks[b].id,
                            bank_names: this.banks[b].bank_name+'('+this.banks[b].bank_account.substring(this.banks[b].bank_account.length-4)+')',
                            bank_name: this.banks[b].bank_name,
                            bank_account: this.banks[b].bank_account,
                            account_name: this.banks[b].account_name,
                            phone: this.banks[b].phone,
                        })
                    }
                    this.pickerBanks.push({
                        id: -1,
                        bank_names: '使用新卡提现',
                    })
                }
            })
            
        //}
        
    },
}
</script>
<style lang="scss" scoped>
.jx-reflect{
    width: 100%;
    height: 100%;
    padding: 38rpx;
	background-color: #fff;
    text-align: center;
    box-sizing: border-box;
    .jx-reflect-bank{
        // position:fixed;
        width: 100%;
        height: 132rpx;
        background-color: #dcad70;
        border-radius: 10rpx;
        color: #fff;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-sizing: border-box;
        p{
            display:inline-block;
            box-sizing: border-box;
            width: 0;
        }
        .left-content{
            width: 150rpx;
            text-align: left;
        }
        .right-content{
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
            .bank{
                margin-left: 10rpx;
            }
            .picker{
                display: flex;
                align-items: center;
                text-align: left;
                height: 132rpx;
            }
        }
    }
    .jx-reflect-amount{
        width: 100%;
        margin-top: 70rpx;
        font-size: 28rpx;
        color: #333333;
        line-height: 46rpx;
        text-align: left;
        .jx-reflect-amount-text{
            margin-bottom: 34rpx;
        }
        input{
            display: inline-block;
            padding-left:12rpx;
            font-size: 44rpx;
        }
        .bottom-line{
            height: 2rpx;
            margin-top: 19rpx;
            background-color: #d0d0d0;
        }
        .all-amount{
            margin-top: 18rpx;
            color: #b8b8b8;
            span{
                margin-left: 55rpx;
                color: #ff4365;
            }
        }
    }
    .jx-reflect-btn{
        margin-top: 136rpx;
        button{
            width: 100%;
            height: 88rpx;
            background-color: #ff4365;
            border-radius: 43rpx;
        }
    }
    .jx-reflect-record{
        width: 100%;
        margin-top: 46rpx;
        p{
            font-size: 28rpx;
            line-height: 46rpx;
            color: #ff4365;
            // text-align: center;
        }
    }
}
</style>