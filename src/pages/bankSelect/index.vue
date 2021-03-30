<template>
    <div class="jx-bank-select">
        <div class="bank-search">
            <div class="jx-search-input">
                <img src="/static/icons/magnifying-icon.png" alt="">
                <input type="text" placeholder="搜索" ref="searchInput" focus v-model.lazy="searchValue" @blur="bindKeyInput" @focus="!cancelShow">
                <span class="cancel" v-if="cancelShow" @click="cancel">取消</span>
            </div>
        </div>
        <div class="jx-bank-list">
            <scroll-view class="scroll-view" scroll-y :scroll-into-view="toView" enable-back-to-top @scroll="scroll" scroll-with-animation :scroll-top="scrollTop">
                <!-- <div v-for="item in bankList" :key="item.title" class="bank-group-list">
                    <div class="title">{{item.title}}</div>
                </div> -->
                <ul v-if="!cancelShow">
                    <li  class="bank-group-list" v-for="(item,index) in bankList" :key="index" :id="item.title">
                        <div class="title">{{item.firstLatter}}</div>
                        <ul class="bank-group">
                            <li class="bank-group-item" v-for="(bank,k) in item.items" :key="k" @click="getBank(bank)">
                                <!-- <img src="/static/icons/magnifying-icon.png" alt=""> --><label>{{bank.name}}</label>
                            </li>
                            
                        </ul>
                    </li>
                </ul>
                <ul v-else>
                    <li  class="bank-group-list">
                        <ul class="bank-group">
                            <li class="bank-group-item" v-for="(bank,k) in searchBankList" :key="k" @click="getBank(bank)">
                                <!-- <img src="/static/icons/magnifying-icon.png" alt=""> --><label>{{bank.name}}</label>
                            </li>
                        </ul>
                    </li>
                </ul>
            </scroll-view>
        </div>
        <div class="list-shortcut" v-if="!cancelShow">
            <ul>
                <li v-for="(item,index) in bankList" :key="index" :data-id="item.title" @click="scrollToview">{{item.firstLatter}}</li>
                
            </ul>
        </div>
    </div>
</template>
<script>
import { ConvertPinyin } from '../../utils/pinyin.js'
export default {
    data () {
        return {
            searchValue: '',//搜索
            toView:'',
            scrollTop:0,
            HOT_NAME:'热',
            HOT_SINGER_LEN:10,
            listHeight:[],
            currentIndex:0,
            fixedTitle:'',
            fixedTop:0,
            bankList: [],
            TITLE_HEIGHT : 30,
            ANCHOR_HEIGHT : 18,
            list: [],//银行信息
            cancelShow: false,
            searchBankList: [],
        }
    },
    created () {
    },
    methods: {
        bindKeyInput () {
            let _this = this
            _this.searchBankList = []
            _this.cancelShow = true
            console.log(this.searchValue);
            if(this.searchValue == ""){
                _this.cancelShow = false
                return
            }
            this.bankList.forEach((item,index) => {
                if(index == 0){
                    return
                }
                item.items.forEach((value) => {
                    if(value.name.indexOf(_this.searchValue) > -1){
                        _this.searchBankList.push(value)
                    }
                })
            })
        },
        cancel () {
            this.searchValue = ''
            this.cancelShow = false
            this.searchBankList = []
        },
        getBank (bank) {
            wx.redirectTo({
				url: `/pages/addBank/main?bank=${JSON.stringify(bank)}`,
			})
        },
        /**
         * 重组数据，变成按首字符排序和合并
         */
        _normalizeSinger (list) {
            let map = {
                hot: {
                    title: 'A_',
                    firstLatter: this.HOT_NAME,
                    items: [],
                },
            }
            list.forEach((item) => {
                if (item.name.indexOf('中国') > -1) {
                    map.hot.items.push({
                        id: item.id,
                        name: item.name,
                        code: item.code,
                        avatar: item.ico,
                    })
                }
                const key = ConvertPinyin(item.name).substr(0,1)
                if (!map[key]) {
                    map[key] = {
                        title: ConvertPinyin(item.name).substr(0,1),
                        firstLatter: ConvertPinyin(item.name).substr(0,1),
                        items: [],
                    }
                }
                map[key].items.push({
                    id: item.id,
                    name: item.name,
                    code: item.code,
                    avatar: item.ico,
                })
            })
            // 为了得到有序列表，我们需要处理 map
            let ret = []
            let hot = []
            for (let key in map) {
            let val = map[key]
            if (val.title.match(/[#a-zA-Z]/)) {
                ret.push(val)
            } else if (val.title === this.HOT_NAME) {
                hot.push(val)
            }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            console.log('重组数据',ret)
            return hot.concat(ret)
        },
        /**
         * 滑动事件
         */
        scroll (e) {
            //console.log(e)
            let newY = e.mp.detail.scrollTop;
            console.log(newY)
            //this.scrollY(newY);
        },
        scrollY (newY) {
            console.log(newY);
            const listHeight = this.listHeight
            // 当滚动到顶部，newY>0
            if (newY == 0 || newY < 0) {
                this.currentIndex= 0
                this.fixedTitle= ''
                return
            }
            // 在中间部分滚动
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (newY >= height1 && newY < height2) {
                    this.currentIndex= i,
                    this.fixedTitle= this.bankList[i].title
                    this.fixedTt(height2 - newY);
                    return
                }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限
            this.currentIndex= listHeight.length - 2,
            this.fixedTitle= this.bankList[listHeight.length - 2].title
        },
        fixedTt (newVal) {
            let fixedTop = (newVal > 0 && newVal < this.TITLE_HEIGHT) ? newVal - this.TITLE_HEIGHT : 0
            if (this.fixedTop === fixedTop) {
                return
            }
            this.fixedTop= fixedTop
        },
        _calculateHeight () {
            var lHeight = [],
                that = this;
            let height = 0;
            lHeight.push(height);
            var query = wx.createSelectorQuery();
            query.selectAll('.bank-group-list').boundingClientRect(function (rects) {
                var rect = rects,
                    len = rect.length;
                for (let i = 0; i < len; i++) {
                    height += rect[i].height;
                    lHeight.push(height)
                }
                
            }).exec();
            var calHeight = setInterval(function () {
            if (lHeight != [0]) {
                that.listHeight= lHeight
                clearInterval(calHeight);
            } 
            },1000)
        },
        scrollToview (e) {
            console.log(e.mp.target.dataset.id)
            var id = e.mp.target.dataset.id
            // if (id == '#' || id == '') {
            //     this.scrollTop= 0
            // } else {
                this.toView= id
            //}
            console.log(e)
        },
    },
    onLoad () {
        // var that = this,
        // list = that.list;
        // wx.hideLoading();
        // console.log(this._normalizeSinger(list))
        // that.bankList= this._normalizeSinger(list)
        // that._calculateHeight()
    },
    onShow () {
        this.$http.get({
            url: '/banks',
        }).then(res => {
            if (res.code * 1 === 0) {
                this.list = res.data
                this.bankList= this._normalizeSinger(this.list)
                this._calculateHeight()
                console.log(res)
            } else {
                wx.showToast({
                    title: '获取银行列表失败！', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                })
            }
        })
        console.log(wx.getSystemInfoSync())
    },
}
</script>
<style lang="scss" scoped>
.jx-bank-select{
    width: 100%;
    height: 100%;
    padding: 19rpx 22rpx;
    background-color: #fff;
    box-sizing: border-box;
    .bank-search{
        width:100%;
        // height: 100rpx;
        padding: 16rpx 19rpx;
        border-top-left-radius: 10rpx;
        border-top-right-radius: 10rpx;
        background-color: #dfdee3;
        box-sizing: border-box;
        .jx-search-input{
            position: relative;
            width:100%;
            height: 64rpx;
            padding-left:15rpx;
            border-radius: 8rpx;
            background-color: #fff;
            line-height: 64rpx;
            box-sizing: border-box;
            img{
                width:30rpx;
                height: 30rpx;
                vertical-align: middle;
            }
            input{
                display:inline-block;
                padding-left:10rpx;
                text-align: left;
                vertical-align: middle;
            }
            .cancel{
                float: right;
                margin-right:10rpx;
                color:royalblue;
            }
        }
    }
    .jx-bank-list{
        width:100%;
        font-size: 28rpx;
        .scroll-view{
            height: 1081rpx;
            white-space:nowrap;
            .bank-group-list{
                width: 100%;
                .title{
                    height: 64rpx;
                    padding-left:20rpx;
                    line-height: 64rpx;
                    background-color: #f1f1f1;
                    color: #666666;
                }
                .bank-group{
                    .bank-group-item{
                        height: 65rpx;
                        padding:20rpx;
                        border-bottom: 2rpx solid #d0d0d0;
                        line-height: 65rpx;
                        color: #333333;
                        img{
                            width:40rpx;
                            height: 40rpx;
                            margin-right: 46rpx;
                            vertical-align: middle;
                        }
                    }
                }
                
            }
        }
        
    }
    .list-shortcut{
        position: fixed;
        z-index: 30;
        right: 48rpx;
        top: 53%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 20rpx;
        padding: 20rpx 0;
        border-radius: 10rpx;
        text-align: center;
        font-family: Helvetica;
        ul{
            li{
                padding: 3rpx;
                line-height: 1;
                color: #666;
                font-size: 20rpx; 
                line-height: 30rpx;
            }
            .current{
                color: #ffcd32 !important;
            }
        }
    }
}
</style>