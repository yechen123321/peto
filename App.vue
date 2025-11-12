<script>
export default {
  onLaunch() {
    console.log('App Launch')
    const stored = uni.getStorageSync('locale')
    const chosen = stored || 'zh-CN'
    this.applyLocale(chosen)
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  methods: {
    applyLocale(locale) {
      uni.setStorageSync('locale', locale)
      // 尝试立即切换（Vue2可用），否则重启应用使配置生效
      if (this.$i18n) {
        this.$i18n.locale = locale
        return
      }
      this.restartApp()
    },
    restartApp() {
      // #ifdef APP-PLUS
      try {
        if (typeof plus !== 'undefined' && plus.runtime && plus.runtime.restart) {
          plus.runtime.restart()
          return
        }
      } catch (e) { }
      // #endif
      // #ifdef H5
      if (typeof location !== 'undefined' && location.reload) {
        location.reload()
        return
      }
      // #endif
      uni.reLaunch({ url: '/pages/login/index' })
    }
  }
}
</script>

<style>
/*每个页面公共css */
</style>
