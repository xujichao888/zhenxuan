<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs,
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  log () {
    // console.log(`log at:${Date.now()}`)
  },
  onLaunch (opt){
    console.warn(opt, 'onLaunch')
    let self = this
    wx.getSystemInfo({
      success (system) {
          if (system.model.indexOf('iPhone X') > -1) {
            self.$store.commit('setIsIphoneX', true)
          } else {
            self.$store.commit('setIsIphoneX', false)
          }
        },
    });

    let F = wx.getFileSystemManager();
    F.readFile({
      filePath: '/static/images/update_bg.png',
      encoding:'base64',
      success:res=>{
        let base64 = 'data:image/jpeg;base64,' + res.data
        this.$store.commit('setbarBg', base64)
      },
      fail (err){
        console.log(err, 'base64')
      },
    })
  },
}
</script>

<style lang="scss">
  @import 'styles/index.scss';
</style>
