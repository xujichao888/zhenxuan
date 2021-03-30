<template>
    <div class="steps">
        <div class="steps-group" v-if="steps.length" >
            <div class="steps-item" 
                v-for="(item,index) in steps"
                :key="index"
                :class="{active: active >= index}"
            >
                <span class="text">{{item.text}}</span>
                <div class="radio" :class="{active: active >= index}"></div>
                <div class="desc">{{item.desc}}</div>
            </div>
            <div class="progress">
                <div class="progress-active" :style="{width: progressWdith + '%'}"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	props: {
        steps:{
            type: Array,
            default (){
                return []
            },
        },
        active:{
            type: Number,
            default: 0,
        },
	},
    data () {
        return {
               
            }
    },
    computed:{
        progressWdith (){
            let l = this.steps.length
            if(l > 0){
                let iw = 100 / l / 2
                if(this.active === 0){
                    return iw 
                } 
                if(this.active === l - 1){
                    return 100
                }
                return this.active * 2 * iw + iw
            }
            return 0
        },
    },
    mounted () {
        
	},
	methods: {
		
	},
}
</script>

<style lang="scss" scope>
    .steps{
        .steps-group{
            position: relative;
            display: flex;
            align-items: center;
            height: 100rpx;
            .steps-item{
                width: 0;
                position: relative;
                z-index: 2;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                height: 100rpx;
                font-size: 24rpx;
                color: #AD7134;
                &.active{
                    color: #632B00;
                }
                .radio{
                    width: 16rpx;
                    height: 16rpx;
                    background: #DDDDDD;
                    border-radius: 50%;
                    border: 2rpx solid #E9E9E9;
                    &.active{
                        background: linear-gradient(-35deg, #F2BA88 7%, #D09F73 98%);
                        box-shadow: 0 2rpx 4rpx 0 rgba(168,111,58,0.50);
                    }
                }
                .desc{
                    height: 25rpx;
                }
            }
            .progress{
                z-index: 1;
                position: absolute;
                height: 4px;
                border-radius: 3px;
                top: 0;
                transform: translateY(50rpx);
                display: flex;
                align-items: center;
                background: #DDDDDD;
                width: 100%;
                overflow: hidden;
                .progress-active{
                    width: 100%;
                    height: 100%;
                    background: #CD8C50;
                }
            }
        }
    }
</style>
