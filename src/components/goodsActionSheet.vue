<template>
    <van-action-sheet 
        :show="show" 
        zIndex="10001"
        :title="title"
        @close="close">
        <div class="goodsGroup" v-if="goods.brand_id">
            <div class="goodsmes">
                <div class="img">
                    <img :src="goods.product_img[0]">
                </div>
                <div class="msg">
                    <div class="pric">
                        <span class="sell" v-if="computePrice.sellpric">￥{{computePrice.sellpric}}</span>
                        <span class="former" v-if="computePrice.formerprice">￥{{computePrice.formerprice}}</span>
                    </div>
                    <span class="text">{{goods.product_name}}</span>
                </div>
            </div>
            <div class="typeWrap">
                <div  v-if="list.length">
                    <div class="typeGroup" v-for="(item, index) in list" :key="index">
                        <span class="title">{{item.name}}</span>
                        <div class="type-item">
                            <div :class="{'active': index === 0 ? active_value_1 === v : active_value_2 === v}" @click="changeActive(index, v)" v-for="(v, i) in item.values" :key="i" class="item">{{v}}</div>
                        </div>
                    </div>
                </div>
                <div class="typeGroup">
                    <span class="title">数量</span>
                    <div class="type-item">
                        <van-stepper 
                            input-class="input_class"
                            plus-class="btn_class"
                            minus-class	="btn_class"
                            @change="changeNum" 
                            :value="value" 
                            integer 
                            min="1"
                            :max="max"
                            @overlimit="overlimit"
                        />
                    </div>
                </div>
            </div>
            <footer>
                <slot name="footer">
                    <template v-if="!disabled">
                        <div class="add btn" @click="addHandle">
                            加入购物车
                        </div>
                        <div class="buy btn" @click="buyHandle">
                            立即购买
                        </div>   
                    </template>
                    <template v-else>
                        <div class="empty btn">
                            已售磬
                        </div> 
                    </template>
                </slot>
            </footer>
        </div>
    </van-action-sheet>
</template>

<script>
  // import store from '../vuex/index'
  export default {
    props: {
        show:{
            type: Boolean,
            default:false
        },
        goods:{
            type: Object,
            default(){
                return {}
            }
        },
        title:{
            type: String,
            default: ""
        },
        value:{
            value: Number,
            default: 1
        },
        max:{
            value: Number,
            default: 1000000
        }
    },
    data () {
      return {
        disabled:false,
        active_value_1: "",
        active_value_2: "",
      }
    },
    computed:{
        list(){
            let hashInfo = this.goods.brand_id && this.goods.attribute_infos.length
            if(!hashInfo){
                this.active_value_1 = ""
                this.active_value_2 = ""
                return []
            } 
            let _i = this.goods.attribute_infos
            let arr = []
            if(_i[0].attr_name1){
                arr.push({
                    name: _i[0].attr_name1,
                    values : this.getVal(_i, 'value_1')
                })
                if(this.getVal(_i, 'value_1')[0] === "默认") this.active_value_1 = "默认"
            }
            if(_i[0].attr_name2){
                arr.push({
                    name: _i[0].attr_name2,
                    values : this.getVal(_i, 'value_2')
                })
            }
            return arr
        },
        computePrice(){
            if(this.list && this.list.length){
                let _i
                if(this.list.length > 1){
                     if(this.active_value_1 && this.active_value_2){
                         _i = this.goods.attribute_infos.find(item=>item.value_1 === this.active_value_1 && item.value_2 === this.active_value_2)
                         this.$emit("update:max", _i.current_cnt)
                         if(_i.current_cnt === 0){
                             this.disabled = true
                         } else {
                            this.disabled = false
                            if(this.value > this.max) this.$emit("update:value", this.max)
                         }
                         this.$emit("result", _i)
                     } else {
                         this.disabled = false
                         return {
                            sellpric:this.goods.price_range,
                            formerprice: this.goods.pre_price / 100
                        }
                     }
                } else {
                    if(this.active_value_1){
                         _i = this.goods.attribute_infos.find(item=>item.value_1 === this.active_value_1)
                         if(_i.attr_value_id == undefined){
                             this.disabled = true
                             return {
                                sellpric:this.goods.price_range,
                                formerprice: this.goods.pre_price / 100
                             }
                         }
                        this.$emit("result", _i)
                        this.$emit("update:max", _i.current_cnt)
                        if(_i.current_cnt <= 0){
                             this.disabled = true
                         } else {
                            this.disabled = false
                            if(this.value > this.max)  this.$emit("update:value", this.max)
                         }
                     } else {
                          this.disabled = false
                         return {
                            sellpric:this.goods.price_range,
                            formerprice: this.goods.pre_price / 100
                        }
                     }
                }
                return {
                    sellpric: _i.price / 100,
                    formerprice: this.goods.pre_price / 100
                }
                
            } 
            this.disabled = false
            if(this.goods.brand_id){
                return {
                    sellpric:this.goods.price_range,
                    formerprice: this.goods.pre_price / 100
                }
            }
            return {
                sellpric:"",
                formerprice: ""
            }
        }
    },
    methods: {
        addHandle(){
            if(this.list.length > 1 && (!this.active_value_1 || !this.active_value_2) || !this.active_value_1){
                wx.showToast({
					title: '请选择商品规格', //提示的内容,
					duration: 1000,
					icon: 'none',
				});
                return
            }
            this.$emit("addHandle", {value:this.value})
        },
        buyHandle(){
            if(this.list.length > 1 && (!this.active_value_1 || !this.active_value_2) || !this.active_value_1){
                wx.showToast({
					title: '请选择商品规格', //提示的内容,
					duration: 1000,
					icon: 'none',
				});
                return
            }
            this.$emit("buyHandle", {value:this.value})
            this.$nextTick(()=>{
                this.close()
            })
        },
        changeNum(e){
            this.$emit("update:value", e.mp.detail)
        },
        overlimit(e){
            this.$nextTick(() => {
                if(this.value === this.max){
                    wx.showToast({
						title: '库存不足', //提示的内容,
						icon: 'none',
					})
                }
            })
        },
        close(){
            this.$emit('close')
            this.active_value_1 = ""
            this.active_value_2 = ""
            this.disabled = false
        },
        getVal(arr, val){
            let _a = []
            for(let i=0; i<arr.length; i++){
                if(!_a.includes(arr[i][val])){
                    _a.push(arr[i][val])
                }
            }
            return _a
        },
        changeActive(i, v){
            this[`active_value_${i+1}`] = v
        }
    }
  }
</script>

<style lang="scss">
.goodsGroup{
    padding: 30rpx 30rpx 40rpx 30rpx;
    .goodsmes{
        display: flex;
        .img{
            width: 200rpx;
            height: 200rpx;
            flex-shrink: 0;
        }
        .msg{
            padding-left: 10rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            .pric{
                .sell{
                    font-size: 32rpx;
                    color: #FF4365;
                }
                .former{
                    font-size: 28rpx;
                    color: #909399;
                    text-decoration:line-through;
                    padding-left: 10rpx;
                }
            }
            .text{
                padding: 10rpx 0 5rpx 5rpx;
                font-size: 28rpx;
                color: #16171C;
            }
        }
    }
    .typeWrap{
        padding: 20rpx 0;
        .typeGroup{
            padding-top: 20rpx;
            .title{
                padding-top: 20rpx;
                font-size: 28rpx;
                color: #16171C;
            }
            .type-item{
                display: flex;
                flex-wrap: wrap;
                padding-top: 20rpx;
                .item{
                    min-width: 127rpx;
                    background: #F6F6F6;
                    color: #606266;
                    padding: 0 15px;
                    height: 70rpx;
                    line-height: 70rpx;
                    text-align: center;
                    border-radius: 8rpx;
                    margin-right: 10rpx;
                    margin-bottom: 10rpx;
                    transition: .3s;
                    border: 1rpx solid #F6F6F6;
                    box-sizing: border-box;
                    &.active{
                        color: #FF4365;
                        border-color: #FF4365;
                    }
                }
            }
            .input_class{
                width: 120rpx;
                height: 70rpx;
            }
            .btn_class{
                height: 70rpx;
                width: 70rpx;
            }
        }
    }
    footer{
        padding-top: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn{
            width: 343rpx;
            height: 88rpx;
            line-height: 88rpx;
            text-align: center;
            font-size: 32rpx;
        }
        .add{
            color: #16171C;
            background-image: linear-gradient(#DFB58F, #EFD4B7);
            border-radius: 10rpx 0 0 10rpx;
        }
        .buy{
            color: white;
            background: #FF4365;
            border-radius: 0 10rpx 10rpx 0;
        }
        .empty{
            width: 100%;
            border-radius: 10rpx;
            background-color: #989898;
            color: white;
        }
    }
}
</style>
