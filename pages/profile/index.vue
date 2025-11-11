<template>
  <view class="container">
    <view class="hero">
      <view class="avatar">{{ user?.phone ? user.phone.slice(-4) : '未' }}</view>
      <view class="header">我的</view>
    </view>
    <view class="info">
      <view class="info-card">
        <view class="label">手机号</view>
        <view class="value">{{ user?.phone || '未登录' }}</view>
      </view>
      <view class="info-card">
        <view class="label">宠物数量</view>
        <view class="value">{{ petCount }}</view>
      </view>
      <view class="info-card">
        <view class="label">语言设置</view>
        <view class="value" style="display:flex; gap: 12rpx;">
          <button class="btn" @click="changeLocale('zh-CN')">简体中文</button>
          <button class="btn" @click="changeLocale('en')">English</button>
        </view>
      </view>
    </view>
    <button class="btn danger" @click="logout">退出登录</button>
  </view>
</template>

<script>
export default {
  data(){ return { user: null, petCount: 0 } },
  onShow(){
    const user = uni.getStorageSync('user')
    if (!user) { uni.redirectTo({ url: '/pages/login/index' }); return }
    this.user = user
    const pets = uni.getStorageSync('pets_' + user.id) || []
    this.petCount = pets.length
  },
  methods:{
    logout(){
      uni.removeStorageSync('user')
      uni.redirectTo({ url: '/pages/login/index' })
    },
    changeLocale(locale){
      const current = uni.getStorageSync('locale')
      if (current === locale) {
        uni.showToast({ title: '已是该语言', icon: 'none' })
        return
      }
      uni.setStorageSync('locale', locale)
      // 尝试立即切换（Vue2 可用），否则重启/刷新以全局生效
      if (this.$i18n) {
        this.$i18n.locale = locale
        uni.showToast({ title: '语言已切换', icon: 'none' })
        return
      }
      // H5刷新；APP重启；小程序/其他则重启页面
      // #ifdef H5
      if (typeof location !== 'undefined' && location.reload) {
        location.reload()
        return
      }
      // #endif
      // #ifdef APP-PLUS
      try {
        if (typeof plus !== 'undefined' && plus.runtime && plus.runtime.restart) {
          plus.runtime.restart()
          return
        }
      } catch(e) {}
      // #endif
      uni.reLaunch({ url: '/pages/login/index' })
    }
  }
}
</script>

<style>
.container { padding: 24rpx; }
.hero { display:flex; align-items:center; gap: 16rpx; padding: 24rpx; border-radius: 16rpx; background: linear-gradient(135deg, #fef6f6 0%, #ffffff 100%); box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.06); margin-bottom: 20rpx; }
.avatar { width: 72rpx; height: 72rpx; border-radius: 36rpx; background:#ffddde; color:#c0392b; display:flex; align-items:center; justify-content:center; font-weight: 700; }
.header { font-size: 36rpx; font-weight: 700; }
.info { display:grid; grid-template-columns: 1fr; gap: 12rpx; }
.info-card { background:#fff; border: 1rpx solid #eee; border-radius: 12rpx; padding: 16rpx; box-shadow: 0 6rpx 12rpx rgba(0,0,0,0.05); }
.label { font-size: 24rpx; color:#666; }
.value { font-size: 28rpx; font-weight: 600; color:#1c1c1e; }
.btn { padding: 14rpx 22rpx; border-radius: 10rpx; background:#eee; }
.btn.danger { background:#ff3b30; color:#fff; }
</style>