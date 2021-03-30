<template>
  <div class="actionSheetCentent">
    <van-radio-group :value="premium_money" @change="changeRadio">
        <van-cell-group :class="{'space': isSpace}">
            <van-cell 
                style="margin-bottom:20px;"
                v-for="(item, index) in radioList" 
                :key="index"
                custom-class="radioCell" 
                clickable 
                :border="!isSpace"
                :dataName="item.id" 
                @click="clickCell(item.id)"
            >
                <div class="cellLabel custom" slot="title" :class="{'inputCell': item.id === '-1'}">
                    <div>{{item.label}}<span class="pric">{{item.value}}</span></div>
                    <van-field
                        v-if="item.id === '-1'"
                        :value="value"
                        type="digit"
                        placeholder="请输入加价金额(¥0-30.00)"
                        :border="error"
                        :error="item.error"
                        :error-message="item.error_message"
                        clearable
                        :placeholderStyle="placeholderStyle"
                        @input="inputCustomPric"
                    />
                </div>
                <van-radio 
                    checked-color="#FF4365"
                    slot="right-icon" 
                    :name="item.id" />
            </van-cell>
        </van-cell-group>
    </van-radio-group>
  </div>
</template>

<script>
  // import store from '../vuex/index'
  export default {
    props: {
        isSpace:{
            type: Boolean,
            default:false,
        },
        radioList:{
            type:Array,
            default:[],
        },
        customPric:{
            type: String,
            default:'',
        },
        premium_money:{
            type: String,
            default:'0',
        },
    },
    data () {
      return {
        placeholderStyle:"font-size:24rpx",
        value: this.customPric,
      }
    },
    watch:{
        premium_money (v){
            this.value = ""
        },
    },
    methods: {
        changeRadio (e){
            this.$emit('update:premium_money', e.mp.detail)
            this.$emit('update:customPric', "")
            this.$emit('noError', false)
            this.value = ""

        },
        clickCell (id){
            this.$emit('update:premium_money', id)
            this.$emit('noError', false)
			if(id !== '-1'){
                this.value = ""
                this.$emit('update:customPric', "")
                this.$emit('noError', false)
            } 
        },
        inputCustomPric (e){
            this.$emit('update:customPric', e.mp.detail)
            this.value = e.mp.detail
		},
    },
  }
</script>

<style lang="scss">
  .actionSheetCentent{
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
    .space{
        .radioCell{
            margin-bottom: 20rpx;
        }
    }
    .inputCell{
        .van-cell{
            padding: 0;
        }
    }
}
</style>
