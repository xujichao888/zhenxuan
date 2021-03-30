import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
let title,baseUrl,defaultImg1,defaultImg2,defaultLogo;
console.log(process.env.NODE_NAME)
switch ( process.env.NODE_NAME ) {
  case 'wxjx':
    title = '吉祥臻选'
    baseUrl = 'https://api.jx78.com'
    defaultImg1 = '/static/images/seat_jx_1.jpg'
    defaultImg2 = '/static/images/seat_jx_2.jpg'
    defaultLogo = '/static/images/logo_z.png'
    break;
  case 'wxjx2':
    title = '吉祥精选'
    baseUrl = 'https://api.jx78.com'
    defaultImg1 = '/static/images/seat_jx_selected_1.jpg'
    defaultImg2 = '/static/images/seat_jx_selected_2.jpg'
    defaultLogo = '/static/images/logo_select_j.png'
    break;
  case 'wxjx3':
    title = '吉祥遴选'
    baseUrl = 'https://api.jx78.com'
    defaultImg1 = '/static/images/yasuo2.jpg'
    defaultImg2 = '/static/images/yasuo1.jpg'
    defaultLogo = '/static/images/logoforlinxuan.png'
    break;
  case 'wxjx4':
      title = '好物采选'
      baseUrl = 'https://api.jx78.com'
      defaultImg1 = '/static/images/yasuo2.jpg'
      defaultImg2 = '/static/images/yasuo1.jpg'
      defaultLogo = '/static/images/haowu.png'
      break;
  case 'wxjx5':
        title = '速星精选'
        baseUrl = 'https://api.jx78.com'
        defaultImg1 = '/static/images/yasuo2.jpg'
        defaultImg2 = '/static/images/yasuo1.jpg'
        defaultLogo = '/static/images/suxing.png'
        break;
  case 'wxjx6':
          title = '速速精选'
          baseUrl = 'https://api.jx78.com'
          defaultImg1 = '/static/images/yasuo2.jpg'
          defaultImg2 = '/static/images/yasuo1.jpg'
          defaultLogo = '/static/images/susu.png'
          break;
 case 'wxjx7':
            title = '金文挑选'
            baseUrl = 'https://api.jx78.com'
            defaultImg1 = '/static/images/yasuo2.jpg'
            defaultImg2 = '/static/images/yasuo1.jpg'
            defaultLogo = '/static/images/jinwen.png'
            break;
case 'wxjx8':
              title = '宇科好物'
              baseUrl = 'https://api.jx78.com'
              defaultImg1 = '/static/images/yasuo2.jpg'
              defaultImg2 = '/static/images/yasuo1.jpg'
              defaultLogo = '/static/images/yuke.png'
              break;
        case 'wxjx9':
                title = '昊成集萃'
                baseUrl = 'https://api.jx78.com'
                defaultImg1 = '/static/images/yasuo2.jpg'
                defaultImg2 = '/static/images/yasuo1.jpg'
                defaultLogo = '/static/images/jicui.png'
                break;
  default:
    title = '吉祥严选'
    baseUrl = 'https://api.jixiangyanxuan.com'
    defaultImg1 = '/static/images/seat_1.jpg'
    defaultImg2 = '/static/images/seat_2.jpg'
    defaultLogo = '/static/images/logo.png'
    break;
}
const store = new Vuex.Store({
  state: {
    nodeNameType:process.env.NODE_NAME,
    title,
    baseUrl,
    leader: 0,
    shareUserId: 0,
    cartSum: 0,
    region: {},
    selectAddress: {},
    refereeId: 0,
    barBg: '',
    defaultImg1,
    defaultImg2,
    defaultLogo,
    errCode: {
      1000000: '系统错误',
      1000001: '接口未找到',
      1000002: '请求超时',
      1000003: '未授权',
      1000004: '参数错误',
      3000001: '用户已存在',
      3000002: '用户注册失',
      3000003: '用户不存在',
      3000004: '用户密码错误',
      3000005: '用户封停',
      3000009: '三方用户注册失败',
      3000010: '微信登录失败',
      3000011: '微信未授权',
      3000012: '已经是团长',
      3000013: '申请尚在审核中',
      3000014: '余额不足',
      4000001: '商品不存在',
      5000001: '创建订单失败',
      5000002: '商品不足',
      5000003: '商品已下架或时间失效',
      6000001: '文件上传参数解析失败',
      6000002: '文件上传失败',
    },
    editorAffress: {

    },
    userInfo: {},
    isIphoneX: false,
  },
  getters: {
    userInfo: state => state.userInfo,
    is_IphoneX: state => state.isIphoneX,
    update_bar_bg: state => state.barBg,
    barTitle: state => state.title,
    defaultImg1: state => state.defaultImg1,
    defaultImg2: state => state.defaultImg2,
    defaultLogo: state => state.defaultLogo
  },
  mutations: {
    setbarBg (state, base64) {
      state.barBg = base64
    },
    setShareUserId (state, userid) {
      state.shareUserId = userid
    },
    setLeader (state, leader) {
      state.leader = leader
    },
    setCartSum (state, value) {
      state.cartSum = value
    },
    setRegion (state, value) {
      state.region = value
    },
    setSelectAddress (state, value) {
      state.selectAddress = value
    },
    setRefereeId (state, value) {
      state.refereeId = value
    },
    setEditorAffress (state, value) {
      state.editorAffress = value
    },
    setUserInfo (state, value) {
      state.userInfo = value
    },
    setIsIphoneX (state, value) {
      state.isIphoneX = value
    },
  },
});
export default store