<template>
  <view class="bg-background-light dark:bg-background-dark font-display min-h-screen w-full overflow-hidden">
    <!-- 顶部栏 -->
    <view
      class="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-200/50 dark:border-white/10">
      <text class="text-gray-900 dark:text-gray-50 text-xl font-bold leading-tight tracking-[-0.015em] flex-1">Peto</text>
      <view class="flex items-center justify-end">
        <button
          class="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary/20 text-primary"
          @click="toAddPet">
          <text class="material-symbols-outlined !font-light !text-[28px]">add</text>
        </button>
      </view>
    </view>

    <!-- 主内容：宠物卡片走马灯 -->
    <view class="flex-1 flex flex-col justify-center overflow-hidden">
      <view class="flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&:scrollbar]:hidden py-8">
        <view class="flex items-center gap-4 px-4 sm:px-8">
          <view v-for="p in pets" :key="p.id"
            class="flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 shadow-lg min-w-[75vw] sm:min-w-[300px] max-w-[320px] snap-center relative">
            <view class="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-t-xl" :style="photoStyle(p)"></view>
            <view class="flex flex-col flex-1 justify-between p-4 pt-2 gap-4">
              <view>
                <text class="text-gray-900 dark:text-gray-50 text-2xl font-bold leading-normal">{{ p.name }}</text>
                <view class="flex flex-col gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <view class="flex items-center gap-2">
                    <text class="material-symbols-outlined !text-base text-gray-500 dark:text-gray-400">pets</text>
                    <text>{{ p.breed || '未设置' }}</text>
                  </view>
                  <view class="flex items-center gap-2">
                    <text class="material-symbols-outlined !text-base text-gray-500 dark:text-gray-400">cake</text>
                    <text>{{ ageText(p.birthday) }}</text>
                  </view>
                  <view class="flex items-center gap-2">
                    <text class="material-symbols-outlined !text-base text-gray-500 dark:text-gray-400">{{ p.gender === 'female' ? 'female' : 'male' }}</text>
                    <text>{{ p.gender === 'female' ? '母' : '公' }}</text>
                  </view>
                </view>
              </view>
              <view class="flex items-center gap-3">
                <button
                  class="flex-1 flex min-w-0 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-serene-blue/20 dark:bg-serene-blue/30 text-serene-blue text-sm font-bold leading-normal gap-2"
                  @click="toHealth(p)">
                  <text class="material-symbols-outlined !text-base">health_and_safety</text>
                  <text class="truncate">健康档案</text>
                </button>
                <button
                  class="flex-1 flex min-w-0 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm font-bold leading-normal">
                  <text class="truncate">查看档案</text>
                </button>
              </view>
            </view>
          </view>
          <view v-if="pets.length === 0" class="px-4 text-gray-600 dark:text-gray-400">暂无宠物，先添加一个吧～</view>
        </view>
      </view>

      <!-- 页面指示器 -->
      <view class="flex w-full flex-row items-center justify-center gap-3 pb-5">
        <view v-for="(p, idx) in pets" :key="p.id"
          :class="idx === 0 ? 'h-2 w-4 rounded-full bg-primary' : 'h-2 w-2 rounded-full bg-gray-300 dark:bg-slate-700'">
        </view>
      </view>
    </view>

    <!-- 底部导航改用原生 tabBar（见 pages.json 配置） -->
  </view>
</template>

<script>
const PRESETS = [
  { title: '体内驱虫', cycleDays: 30 },
  { title: '体外驱虫', cycleDays: 30 },
  { title: '疫苗接种', cycleDays: 365 },
  { title: '洗澡护理', cycleDays: 14 },
  { title: '修剪指甲', cycleDays: 21 }
]

export default {
  data() {
    return {
      user: null,
      pets: [],
      reminders: [],
      showAddReminder: false,
      reminderForm: { title: '', cycleDays: 0, note: '', petId: null },
    }
  },
  onShow() {
    const user = uni.getStorageSync('user')
    if (!user) {
      uni.redirectTo({ url: '/pages/login/index' })
      return
    }
    this.user = user
    this.loadPets()
    this.loadReminders()
  },
  computed: {
    petOptions() { return this.pets.map(p => p.name) },
    filteredReminders() {
      const list = [...this.reminders]
      if (this.selectedPetId) return list.filter(x => x.petId === this.selectedPetId)
      return list
    },
    urgentReminders() {
      const { endToday } = this.dayBounds()
      return this.filteredReminders.filter(r => (r.nextDueAt || 0) <= endToday).sort((a, b) => (a.nextDueAt || 0) - (b.nextDueAt || 0))
    },
    next7Reminders() {
      const { endToday } = this.dayBounds()
      const end7 = endToday + 7 * 24 * 3600 * 1000
      return this.filteredReminders.filter(r => (r.nextDueAt || 0) > endToday && (r.nextDueAt || 0) <= end7).sort((a, b) => (a.nextDueAt || 0) - (b.nextDueAt || 0))
    }
  },
  methods: {
    toAddPet() { uni.navigateTo({ url: '/pages/pet/add' }) },
    toHistory() { uni.switchTab({ url: '/pages/history/index' }) },
    toHealth(p) {
      const id = p?.id || (this.pets[0]?.id || '')
      const url = '/pages/health/index' + (id ? ('?petId=' + encodeURIComponent(id)) : '')
      uni.navigateTo({ url, animationType: 'slide-in-right', animationDuration: 200 })
    },
    loadPets() {
      this.pets = uni.getStorageSync('pets_' + this.user.id) || []
    },
    loadReminders() {
      this.reminders = uni.getStorageSync('reminders_' + this.user.id) || []
    },
    petName(petId) {
      const p = this.pets.find(x => x.id === petId)
      return p ? p.name : ''
    },
    formatDate(ts) {
      if (!ts) return '未设置'
      const d = new Date(ts)
      const y = d.getFullYear(), m = (d.getMonth() + 1).toString().padStart(2, '0'), day = d.getDate().toString().padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    ageText(birthday) {
      if (!birthday) return '未设置'
      const d = new Date(birthday)
      if (isNaN(d.getTime())) return birthday
      const now = new Date()
      let years = now.getFullYear() - d.getFullYear()
      const m = now.getMonth() - d.getMonth()
      const da = now.getDate() - d.getDate()
      if (m < 0 || (m === 0 && da < 0)) years--
      return years <= 0 ? '未满1岁' : `${years}岁`
    },
    photoStyle(p) {
      const url = p.photo || p.avatar || p.photoUrl || ''
      return url ? `background-image: url('${url}');` : ''
    },
    openAddReminder() {
      if (this.pets.length === 0) {
        uni.showToast({ title: '请先添加宠物', icon: 'none' })
        return
      }
      this.reminderForm = { title: '', cycleDays: 0, note: '', petId: this.pets[0].id }
      this.showAddReminder = true
    },
    closeAddReminder() { this.showAddReminder = false },
    onPetSelect(e) {
      const idx = e.detail.value
      const pet = this.pets[idx]
      this.reminderForm.petId = pet?.id || null
    },
    saveReminder() {
      const f = this.reminderForm
      if (!f.title || !f.cycleDays || !f.petId) {
        uni.showToast({ title: '请完整填写提醒信息', icon: 'none' })
        return
      }
      const now = Date.now()
      const item = { id: now, title: f.title, cycleDays: Number(f.cycleDays), note: f.note, petId: f.petId, lastDoneAt: null, nextDueAt: now + Number(f.cycleDays) * 24 * 3600 * 1000, preset: false }
      const key = 'reminders_' + this.user.id
      const list = uni.getStorageSync(key) || []
      list.push(item)
      uni.setStorageSync(key, list)
      this.loadReminders()
      this.closeAddReminder()
      uni.showToast({ title: '已添加', icon: 'none' })
    },
    addPresetBatch() {
      if (this.pets.length === 0) { return }
      const petId = this.reminderForm.petId || this.pets[0].id
      const key = 'reminders_' + this.user.id
      const list = uni.getStorageSync(key) || []
      const now = Date.now()
      PRESETS.forEach(p => {
        const exists = list.find(x => x.title === p.title && x.petId === petId)
        if (!exists) {
          list.push({ id: now + Math.random(), title: p.title, cycleDays: p.cycleDays, note: '', petId, lastDoneAt: null, nextDueAt: now + p.cycleDays * 24 * 3600 * 1000, preset: true })
        }
      })
      uni.setStorageSync(key, list)
      this.loadReminders()
      uni.showToast({ title: '预设已添加', icon: 'none' })
    },
    markDone(r) {
      r.lastDoneAt = Date.now()
      r.nextDueAt = r.lastDoneAt + r.cycleDays * 24 * 3600 * 1000
      const key = 'reminders_' + this.user.id
      const list = (uni.getStorageSync(key) || []).map(x => x.id === r.id ? r : x)
      uni.setStorageSync(key, list)
      // 写入历史
      const hKey = 'history_' + this.user.id
      const hist = uni.getStorageSync(hKey) || []
      hist.unshift({ id: Date.now(), reminderId: r.id, title: r.title, petId: r.petId, petName: this.petName(r.petId), completedAt: r.lastDoneAt })
      uni.setStorageSync(hKey, hist)
      this.loadReminders()
      this.swipedId = null
      uni.showToast({ title: '已完成', icon: 'none' })
    }
    , dayBounds() {
      const d = new Date()
      const startToday = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      const endToday = startToday + 24 * 3600 * 1000 - 1
      return { startToday, endToday }
    }
    , onTouchStart(e, r) {
      this.touchStartX = e.changedTouches[0].clientX
      this.swipedId = null
    }
    , onTouchMove(e, r) {
      const dx = e.changedTouches[0].clientX - this.touchStartX
      if (dx < -50) this.swipedId = r.id
      if (dx > 10) this.swipedId = null
    }
    , onTouchEnd(e, r) {
      // 状态由 swipedId 控制
    }
    , itemTransformStyle(r) {
      const open = this.swipedId === r.id
      return `transform: translateX(${open ? '-140rpx' : '0'});`
    }
  }
}
</script>

<style>
.container {
  padding: 24rpx;
}

.top {
  display: flex;
  gap: 12rpx;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #f1f7ff 0%, #ffffff 100%);
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.06);
}

.brand {
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  color: #1c1c1e;
}

.top-controls {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.top-right .picker {
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 16rpx;
}

.pill {
  border-radius: 999rpx;
  padding: 12rpx 20rpx;
  background: #f5f7fb;
}

.section {
  margin-top: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.group {
  margin-bottom: 24rpx;
}

.group-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.danger {
  color: #FF3B30;
}

.item {
  position: relative;
  overflow: hidden;
}

.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 16rpx;
  background: #fff;
  transition: transform 0.2s ease;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.05);
}

.item-content.danger::before {
  content: '';
  width: 18rpx;
  height: 18rpx;
  border-radius: 9rpx;
  background: #FF3B30;
  margin-right: 12rpx;
  display: block;
}

.item-content.upcoming::before {
  content: '';
  width: 18rpx;
  height: 18rpx;
  border-radius: 9rpx;
  background: #34C759;
  margin-right: 12rpx;
  display: block;
}

.item-content.danger,
.item-content.upcoming {
  gap: 12rpx;
}

.item-main {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 28rpx;
}

.sub {
  font-size: 24rpx;
  color: #666;
}

.item-action {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  background: #34C759;
  color: #fff;
}

.btn {
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
  background: #eee;
}

.btn.outline {
  background: #fff;
  border: 1rpx solid #d0d3db;
  color: #1c1c1e;
}

.btn.primary {
  background: #007AFF;
  color: #fff;
}

.empty {
  color: #888;
}

.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  width: 86%;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.08);
}

.input {
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
}

.picker {
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
}

.grow {
  flex: 1;
}

.fab {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 120rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #007AFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  box-shadow: 0 10rpx 22rpx rgba(0, 0, 0, 0.18);
}

.pets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.pet-card {
  background: #fff;
  border: 1rpx solid #eee;
  border-radius: 14rpx;
  padding: 16rpx;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.05);
}

.pet-name {
  font-size: 30rpx;
  font-weight: 600;
}

.pet-sub {
  font-size: 24rpx;
  color: #666;
}
</style>