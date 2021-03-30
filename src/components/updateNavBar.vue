<template>
    <div class="header">
        <header class='nav' :style="{'height' : status + navHeight + 'px'}"> 
            <div class='status' :style="{'height' : status + 'px',background:topBg}"></div>    
            <div class='navbar' :style="{'height' : navHeight + 'px',background, backgroundSize}"> 
                <div class='back-icon' v-if="backIcon" @click='back'>  
                    <image :src='backIcon'></image> 
                </div> 
                <div class='home-icon' v-if="homeIcon" @click='home'>  
                    <image :src='homeIcon'></image> 
                </div> 
                <div class='nav-icon' v-if="titleImg">  
                    <image :src='titleImg' :style="{width:iconWidth + 'px', height: iconHeight + 'px'}"></image> 
                </div>
                <div class='nav-title' v-if="titleText && !titleImg">
                    <text :style="{color,fontSize : fontSize + 'px'}">{{titleText}}</text>
                </div>
            </div>
        </header>
        <div :style="{paddingTop : status + navHeight + 'px'}"></div>
        <div v-if="showLvev" class="bg" :style="{background, backgroundSize:'100% auto', marginTop: '-44px'}">
            <div class="wrap">
                <div class="user">
                    <div class="avatarUrl">
                        <img v-if="!userInfo.avatarUrl" src="/static/images/defult-head.png" alt="">
                        <img v-else :src="userInfo.avatarUrl" alt="">
                    </div>
                    <div class="nickName">
                        <span class="name">{{userInfo.nickName ? userInfo.nickName : ''}}</span>
                        <div class="leve" v-if="leve">
                            <span class="left">{{leve[0]}}</span>
                            {{leve}}
                        </div>
                    </div>
                </div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	props: {
        userInfo:{
            type: Object,
            default(){
                return {}
            }
        },
		background: {  
            type: String,  
            default: 'rgba(255, 255, 255, 1)' 
        }, 
        backgroundSize: {
            type: String,  
            default: 'auto' 
        },
        color: {  
            type: String,  
            default: 'rgba(255, 255, 255, 1)' 
        }, 
        titleText: {  
            type: String,  
            default: '导航栏' 
        }, 
        titleImg: {  
            type: String,  
            default: '' 
        }, 
        backIcon: {  
            type: String,  
            default: '' 
        }, 
        homeIcon: {  
            type: String,  
            default: '' 
        }, 
        fontSize: {  
            type: Number,  
            default: 16 
        }, 
        iconHeight: {  
            type: Number,  
            default: 19 
        }, 
        iconWidth: {  
            type:Number,  
            default: 58 
        },
        showLvev:{
            type:Boolean,
            default:true
        },
        topBg:{
            type:String,
            default:'#292929'
        }, 
        isupdate:{
            type:Boolean,
            default:false
        }
	},
    data () {
        return {
                status:"",
                navHeight: "",
            }
    },
    computed:{
        leve(){
            if(this.userInfo && this.userInfo.leve != undefined) {
                if(this.isupdate && this.userInfo.leve < 2){
                    return '普通店主'
                }
                return this.getUserLeve(this.userInfo.leve)
            }
            return ''
        }
    },
    mounted () {
        this.setNavSize();
	},
	methods: {
		// 通过获取系统信息计算导航栏高度 
        setNavSize: function() {  
            var that = this  
            , sysinfo = wx.getSystemInfoSync()  
            , statusHeight = sysinfo.statusBarHeight  
            , isiOS = sysinfo.system.indexOf('iOS') > -1  
            , navHeight;  
            if (!isiOS) {  
                navHeight = 48;  
            } else {  
                navHeight = 44;  
            }  
            this.status = statusHeight,  
            this.navHeight = navHeight  
        }, 
        getUserLeve(lv){
			switch (lv) {
				case 0:
					return '实习店主'
					break;
				case 1:
					return '正式店主'
					break;
				case 2:
					return 'vip店主'
					break;
				case 3:
					return '运营商店主'
					break;
			}
		},
        back: function(){  
            this.$emit('back', {}); 
        }, 
        home: function() {  
            this.$emit('home', {}); 
        } 
	}
}
</script>

<style lang="scss" scope>
    .nav{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 10;
    }
	.navbar{
        position: relative;
    }
    .back-icon, .home-icon{
        width: 28px;
        height: 100%;
        position: absolute; 
        transform: translateY(-50%); 
        top: 50%; 
        display: flex;
    }
    .back-icon{ 
        left: 16px;
    }
    .home-icon{ 
        left: 34px
    }
    .back-icon image{ 
        width: 9px; 
        height: 15px; 
        margin: auto;
    }
    .home-icon image{ 
        width: 20px; 
        height: 20px; 
        margin: auto;
    }
    .nav-title, .nav-icon{ 
        position: absolute; 
        transform: translate(-50%, -50%); 
        left: 50%; 
        top: 50%; 
        font-size: 0; 
    }
    .bg{
        padding-top: 100rpx;
    }
    .wrap{
        background-image: linear-gradient(270deg, #DFB58F 0%, #EFD4B7 100%);
        box-shadow: 0 5px 10px 0 rgba(0,0,0,0.05);
        border-radius: 16rpx;
        margin: 15rpx auto 0;
        width: 710rpx;
        padding: 40rpx;
        box-sizing: border-box;
        .user{
            display: flex;
            align-items: center;
            .avatarUrl{
                border: 5rpx solid white;
                flex-shrink: 0;
                width: 127rpx;
                height: 127rpx;
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
                    color: #632B00;
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
    }
</style>
