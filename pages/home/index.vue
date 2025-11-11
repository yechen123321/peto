<template>
  <view class="container">
    <view class="top">
      <view class="brand">Peto</view>
      <view class="top-controls">
        <view v-if="pets.length>1" class="top-right">
          <picker mode="selector" :range="petSelectorRange" @change="onTopPetSelect">
            <view class="picker pill">{{ topSelectorLabel }}</view>
          </picker>
        </view>
        <button class="btn outline" @click="toAddPet">添加宠物</button>
      </view>
    </view>

    <view class="section">
      <view class="section-title">我的宠物</view>
      <view v-if="pets.length===0" class="empty">暂无宠物，先添加一个吧～</view>
      <view v-else class="pets">
        <view v-for="p in pets" :key="p.id" class="pet-card">
          <view class="pet-name">{{ p.name }}</view>
          <view class="pet-sub">{{ p.breed }} · {{ p.gender==='male'?'公':'母' }}</view>
          <view class="pet-sub">生日：{{ p.birthday }}</view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title row">
        <text>近期提醒</text>
        <button class="btn" @click="openAddReminder">新增提醒</button>
      </view>
      <view v-if="filteredReminders.length===0" class="empty">暂无提醒，试试预设模板或自定义添加</view>
      <view v-else>
        <view v-if="urgentReminders.length>0" class="group">
          <view class="group-title danger">今日/过期</view>
          <view class="list">
            <view v-for="r in urgentReminders" :key="r.id" class="item" @touchstart="onTouchStart($event, r)" @touchmove="onTouchMove($event, r)" @touchend="onTouchEnd($event, r)">
              <view class="item-content danger" :style="itemTransformStyle(r)">
                <view class="item-main">
                  <text class="title danger">{{ r.title }}（{{ petName(r.petId) }}）</text>
                  <text class="sub">到期：{{ formatDate(r.nextDueAt) }}</text>
                </view>
              </view>
              <view class="item-action"><button class="btn action-btn" @click="markDone(r)">完成</button></view>
            </view>
          </view>
        </view>
        <view v-if="next7Reminders.length>0" class="group">
          <view class="group-title">未来7天</view>
          <view class="list">
            <view v-for="r in next7Reminders" :key="r.id" class="item" @touchstart="onTouchStart($event, r)" @touchmove="onTouchMove($event, r)" @touchend="onTouchEnd($event, r)">
              <view class="item-content upcoming" :style="itemTransformStyle(r)">
                <view class="item-main">
                  <text class="title">{{ r.title }}（{{ petName(r.petId) }}）</text>
                  <text class="sub">到期：{{ formatDate(r.nextDueAt) }}</text>
                </view>
              </view>
              <view class="item-action"><button class="btn action-btn" @click="markDone(r)">完成</button></view>
            </view>
          </view>
        </view>
      </view>
    <!-- 底部快捷添加按钮 -->
    <view class="fab" @click="openAddReminder">＋</view>
  </view>

    <view v-if="showAddReminder" class="modal">
      <view class="modal-card">
        <view class="section-title">新增提醒</view>
        <input class="input" placeholder="标题(如：洗澡护理)" v-model="reminderForm.title" />
        <input class="input" type="number" placeholder="周期天数(如14)" v-model.number="reminderForm.cycleDays" />
        <textarea class="input" placeholder="备注(可选)" v-model="reminderForm.note" />
        <picker mode="selector" :range="petOptions" @change="onPetSelect">
          <view class="picker">关联宠物：{{ petName(reminderForm.petId) || '请选择' }}</view>
        </picker>
        <view class="row">
          <button class="btn" @click="addPresetBatch">添加预设模板</button>
          <view class="grow"></view>
          <button class="btn" @click="closeAddReminder">取消</button>
          <button class="btn primary" @click="saveReminder">保存</button>
        </view>
      </view>
    </view>
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
    petSelectorRange() { return ['全部', ...this.pets.map(p=>p.name)] },
    topSelectorLabel() {
      if (!this.selectedPetId) return '全部'
      const p = this.pets.find(x=>x.id===this.selectedPetId)
      return p ? p.name : '全部'
    },
    filteredReminders() {
      const list = [...this.reminders]
      if (this.selectedPetId) return list.filter(x=>x.petId===this.selectedPetId)
      return list
    },
    urgentReminders() {
      const { endToday } = this.dayBounds()
      return this.filteredReminders.filter(r => (r.nextDueAt||0) <= endToday).sort((a,b)=> (a.nextDueAt||0)-(b.nextDueAt||0))
    },
    next7Reminders() {
      const { endToday } = this.dayBounds()
      const end7 = endToday + 7*24*3600*1000
      return this.filteredReminders.filter(r => (r.nextDueAt||0) > endToday && (r.nextDueAt||0) <= end7).sort((a,b)=> (a.nextDueAt||0)-(b.nextDueAt||0))
    }
  },
  methods: {
    onTopPetSelect(e){
      const idx = e.detail.value
      if (idx === 0) { this.selectedPetId = null; return }
      const pet = this.pets[idx-1]
      this.selectedPetId = pet?.id || null
    },
    toAddPet() { uni.navigateTo({ url: '/pages/pet/add' }) },
    toHistory() { uni.switchTab({ url: '/pages/history/index' }) },
    loadPets() {
      this.pets = uni.getStorageSync('pets_' + this.user.id) || []
    },
    loadReminders() {
      this.reminders = uni.getStorageSync('reminders_' + this.user.id) || []
    },
    petName(petId) {
      const p = this.pets.find(x=>x.id===petId)
      return p ? p.name : ''
    },
    formatDate(ts) {
      if (!ts) return '未设置'
      const d = new Date(ts)
      const y = d.getFullYear(), m = (d.getMonth()+1).toString().padStart(2,'0'), day = d.getDate().toString().padStart(2,'0')
      return `${y}-${m}-${day}`
    },
    openAddReminder() {
      if (this.pets.length===0) {
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
      const item = { id: now, title: f.title, cycleDays: Number(f.cycleDays), note: f.note, petId: f.petId, lastDoneAt: null, nextDueAt: now + Number(f.cycleDays)*24*3600*1000, preset: false }
      const key = 'reminders_' + this.user.id
      const list = uni.getStorageSync(key) || []
      list.push(item)
      uni.setStorageSync(key, list)
      this.loadReminders()
      this.closeAddReminder()
      uni.showToast({ title: '已添加', icon: 'none' })
    },
    addPresetBatch() {
      if (this.pets.length===0) { return }
      const petId = this.reminderForm.petId || this.pets[0].id
      const key = 'reminders_' + this.user.id
      const list = uni.getStorageSync(key) || []
      const now = Date.now()
      PRESETS.forEach(p => {
        const exists = list.find(x=>x.title===p.title && x.petId===petId)
        if (!exists) {
          list.push({ id: now + Math.random(), title: p.title, cycleDays: p.cycleDays, note: '', petId, lastDoneAt: null, nextDueAt: now + p.cycleDays*24*3600*1000, preset: true })
        }
      })
      uni.setStorageSync(key, list)
      this.loadReminders()
      uni.showToast({ title: '预设已添加', icon: 'none' })
    },
    markDone(r) {
      r.lastDoneAt = Date.now()
      r.nextDueAt = r.lastDoneAt + r.cycleDays*24*3600*1000
      const key = 'reminders_' + this.user.id
      const list = (uni.getStorageSync(key) || []).map(x=> x.id===r.id ? r : x)
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
    ,dayBounds(){
      const d = new Date()
      const startToday = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
      const endToday = startToday + 24*3600*1000 - 1
      return { startToday, endToday }
    }
    ,onTouchStart(e, r){
      this.touchStartX = e.changedTouches[0].clientX
      this.swipedId = null
    }
    ,onTouchMove(e, r){
      const dx = e.changedTouches[0].clientX - this.touchStartX
      if (dx < -50) this.swipedId = r.id
      if (dx > 10) this.swipedId = null
    }
    ,onTouchEnd(e, r){
      // 状态由 swipedId 控制
    }
    ,itemTransformStyle(r){
      const open = this.swipedId === r.id
      return `transform: translateX(${open ? '-140rpx' : '0'});`
    }
  }
}
</script>

<style>
.container { padding: 24rpx; }
.top { display:flex; gap:12rpx; align-items:center; justify-content: space-between; padding: 20rpx; border-radius: 16rpx; background: linear-gradient(135deg, #f1f7ff 0%, #ffffff 100%); box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.06); }
.brand { font-size: 40rpx; font-weight: 700; letter-spacing: 1rpx; color:#1c1c1e; }
.top-controls { display:flex; align-items:center; gap:12rpx; }
.top-right .picker { border: 1rpx solid #ddd; border-radius: 8rpx; padding: 16rpx; }
.pill { border-radius: 999rpx; padding: 12rpx 20rpx; background:#f5f7fb; }
.section { margin-top: 24rpx; }
.section-title { font-size: 32rpx; font-weight: 600; margin-bottom: 12rpx; }
.row { display:flex; align-items:center; gap:12rpx; }
.list { display: flex; flex-direction: column; gap: 12rpx; }
.group { margin-bottom: 24rpx; }
.group-title { font-size: 28rpx; color:#333; margin-bottom: 8rpx; }
.danger { color: #FF3B30; }
.item { position: relative; overflow: hidden; }
.item-content { display:flex; align-items:center; justify-content: space-between; border: 1rpx solid #eee; border-radius: 12rpx; padding: 16rpx; background:#fff; transition: transform 0.2s ease; box-shadow: 0 6rpx 12rpx rgba(0,0,0,0.05); }
.item-content.danger::before { content:''; width: 18rpx; height: 18rpx; border-radius: 9rpx; background:#FF3B30; margin-right: 12rpx; display:block; }
.item-content.upcoming::before { content:''; width: 18rpx; height: 18rpx; border-radius: 9rpx; background:#34C759; margin-right: 12rpx; display:block; }
.item-content.danger, .item-content.upcoming { gap: 12rpx; }
.item-main { display:flex; flex-direction: column; }
.title { font-size: 28rpx; }
.sub { font-size: 24rpx; color:#666; }
.item-action { position: absolute; right: 0; top: 0; bottom: 0; width: 140rpx; display:flex; align-items:center; justify-content:center; }
.action-btn { background:#34C759; color:#fff; }
.btn { padding: 12rpx 20rpx; border-radius: 8rpx; background:#eee; }
.btn.outline { background:#fff; border: 1rpx solid #d0d3db; color:#1c1c1e; }
.btn.primary { background:#007AFF; color:#fff; }
.empty { color:#888; }
.modal { position: fixed; left:0; right:0; top:0; bottom:0; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; }
.modal-card { background:#fff; border-radius: 16rpx; padding: 24rpx; width: 86%; display:flex; flex-direction: column; gap: 16rpx; box-shadow: 0 10rpx 20rpx rgba(0,0,0,0.08); }
.input { border: 1rpx solid #ddd; border-radius: 8rpx; padding: 20rpx; }
.picker { border: 1rpx solid #ddd; border-radius: 8rpx; padding: 20rpx; }
.grow { flex: 1; }
.fab { position: fixed; left: 50%; transform: translateX(-50%); bottom: 120rpx; width: 88rpx; height: 88rpx; border-radius: 44rpx; background:#007AFF; color:#fff; display:flex; align-items:center; justify-content:center; font-size: 44rpx; box-shadow: 0 10rpx 22rpx rgba(0,0,0,0.18); }
.pets { display:grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; }
.pet-card { background:#fff; border: 1rpx solid #eee; border-radius: 14rpx; padding: 16rpx; box-shadow: 0 6rpx 12rpx rgba(0,0,0,0.05); }
.pet-name { font-size: 30rpx; font-weight: 600; }
.pet-sub { font-size: 24rpx; color:#666; }
</style>