<template>
  <view class="container">
    <view class="header">历史记录</view>
    <view v-if="records.length === 0" class="empty">暂无历史记录</view>
    <view v-else class="timeline">
      <view v-for="r in records" :key="r.id" class="time-item">
        <view class="dot"></view>
        <view class="card">
          <view class="title">{{ r.title }}（{{ r.petName }}）</view>
          <view class="sub">完成时间：{{ formatDateTime(r.completedAt) }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { applyTabBarLocale } from '../../i18n/index.js'
export default {
  data() {
    return { user: null, records: [] }
  },
  onShow() {
    const user = uni.getStorageSync('user')
    if (!user) { uni.redirectTo({ url: '/pages/login/index' }); return }
    this.user = user
    this.records = (uni.getStorageSync('history_' + user.id) || []).sort((a, b) => b.completedAt - a.completedAt)
    // 设置导航标题与刷新 tabBar 文案
    try { uni.setNavigationBarTitle({ title: this.$t('nav.history') }) } catch (e) {}
    try { const locale = uni.getStorageSync('locale') || (this.$i18n ? this.$i18n.locale : 'en'); applyTabBarLocale(locale) } catch (e) {}
  },
  methods: {
    formatDateTime(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      const y = d.getFullYear(), m = (d.getMonth() + 1).toString().padStart(2, '0'), day = d.getDate().toString().padStart(2, '0')
      const hh = d.getHours().toString().padStart(2, '0'), mm = d.getMinutes().toString().padStart(2, '0')
      return `${y}-${m}-${day} ${hh}:${mm}`
    }
  }
}
</script>

<style>
.container {
  padding: 24rpx;
}

.header {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.timeline {
  position: relative;
  margin-left: 20rpx;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8rpx;
  top: 0;
  bottom: 0;
  width: 2rpx;
  background: #e5e5ea;
}

.time-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 7rpx;
  background: #007AFF;
  margin-right: 16rpx;
  position: relative;
  top: 16rpx;
}

.card {
  flex: 1;
  background: #fff;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 16rpx;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 28rpx;
  font-weight: 600;
}

.sub {
  font-size: 24rpx;
  color: #666;
  margin-top: 6rpx;
}

.empty {
  color: #888;
}
</style>