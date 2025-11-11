<template>
  <view class="content" @click="goNext">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">Peto</text>
    </view>
    <view class="tip">轻触屏幕进入</view>
  </view>
  </template>

<script>
export default {
  onShow(){
    // 自动在 800ms 后跳转
    setTimeout(()=>{ this.goNext() }, 800)
  },
  methods:{
    goNext(){
      const user = uni.getStorageSync('user')
      if (!user) { uni.redirectTo({ url: '/pages/login/index' }); return }
      const pets = uni.getStorageSync('pets_' + user.id) || []
      if (pets && pets.length>0) {
        uni.switchTab({ url: '/pages/home/index' })
      } else {
        uni.redirectTo({ url: '/pages/pet/add' })
      }
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.logo { height: 200rpx; width: 200rpx; margin-top: 200rpx; margin-bottom: 50rpx; }
.text-area { display: flex; justify-content: center; }
.title { font-size: 42rpx; color: #333; font-weight: 600; }
.tip { color: #888; margin-top: 20rpx; }
</style>
