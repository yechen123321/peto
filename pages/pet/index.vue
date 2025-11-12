<template>
  <view class="bg-background-light dark:bg-background-dark min-h-screen">
    <!-- 顶部导航栏 -->
    <view class="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-gray-200/50 dark:border-white/10">
      <view class="flex items-center gap-3">
        <button class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800" @click="goBack">
          <text class="material-symbols-outlined !text-base">arrow_back</text>
        </button>
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">宠物档案</text>
      </view>
      <button class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800" @click="editProfile">
        <text class="material-symbols-outlined !text-base">edit</text>
      </button>
    </view>

    <!-- 主要内容 -->
    <view v-if="pet" class="p-4 space-y-6">
      <!-- 宠物基本信息卡片 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <view class="relative">
          <view class="w-full h-48 bg-center bg-no-repeat bg-cover" :style="photoStyle(pet)"></view>
          <view class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></view>
          <view class="absolute bottom-4 left-4">
            <text class="text-white text-2xl font-bold">{{ pet.name }}</text>
            <view class="flex items-center gap-2 mt-1">
              <text class="text-white/80 text-sm">{{ pet.breed || '品种未设置' }}</text>
              <view class="w-1 h-1 rounded-full bg-white/60"></view>
              <text class="text-white/80 text-sm">{{ ageText(pet.birthday) }}</text>
            </view>
          </view>
        </view>
        
        <view class="p-4 space-y-3">
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <text class="material-symbols-outlined text-gray-500 dark:text-gray-400 !text-base">pets</text>
              <text class="text-gray-600 dark:text-gray-400 text-sm">品种</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ pet.breed || '未设置' }}</text>
          </view>
          
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <text class="material-symbols-outlined text-gray-500 dark:text-gray-400 !text-base">cake</text>
              <text class="text-gray-600 dark:text-gray-400 text-sm">年龄</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ ageText(pet.birthday) }}</text>
          </view>
          
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <text class="material-symbols-outlined text-gray-500 dark:text-gray-400 !text-base">{{ pet.gender === 'female' ? 'female' : 'male' }}</text>
              <text class="text-gray-600 dark:text-gray-400 text-sm">性别</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ pet.gender === 'female' ? '雌性' : '雄性' }}</text>
          </view>
          
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <text class="material-symbols-outlined text-gray-500 dark:text-gray-400 !text-base">scale</text>
              <text class="text-gray-600 dark:text-gray-400 text-sm">体重</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ pet.weight ? pet.weight + 'kg' : '未设置' }}</text>
          </view>
        </view>
      </view>

      <!-- 宠物特征描述 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold mb-3 block">特征描述</text>
        <view class="space-y-2">
          <view v-if="pet.features && pet.features.length > 0" class="space-y-2">
            <view v-for="(feature, index) in pet.features" :key="index" class="flex items-start gap-2">
              <view class="w-2 h-2 rounded-full bg-serene-blue mt-2 flex-shrink-0"></view>
              <text class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{{ feature }}</text>
            </view>
          </view>
          <view v-else class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            暂无特征描述
          </view>
        </view>
      </view>

      <!-- 生活习惯 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold mb-3 block">生活习惯</text>
        <view class="space-y-3">
          <view v-if="pet.habits && pet.habits.length > 0" class="space-y-3">
            <view v-for="(habit, index) in pet.habits" :key="index" class="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
              <view class="flex items-center gap-2 mb-1">
                <text class="material-symbols-outlined text-serene-blue !text-sm">schedule</text>
                <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ habit.name }}</text>
              </view>
              <text class="text-gray-600 dark:text-gray-400 text-xs">{{ habit.description }}</text>
            </view>
          </view>
          <view v-else class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            暂无生活习惯记录
          </view>
        </view>
      </view>

      <!-- 健康提醒 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">健康提醒</text>
          <button class="text-serene-blue text-sm" @click="toHealth">查看全部</button>
        </view>
        <view class="space-y-2">
          <view v-if="upcomingReminders.length > 0" class="space-y-2">
            <view v-for="reminder in upcomingReminders.slice(0, 3)" :key="reminder.id" 
                  class="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <view class="flex items-center gap-2">
                <text class="material-symbols-outlined text-orange-500 !text-sm">notifications</text>
                <text class="text-gray-900 dark:text-gray-50 text-sm">{{ reminder.title }}</text>
              </view>
              <text class="text-orange-500 text-xs">{{ formatDate(reminder.nextDueAt) }}</text>
            </view>
          </view>
          <view v-else class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            暂无即将到来的提醒
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex-1 flex items-center justify-center">
      <view class="text-center space-y-4">
        <text class="material-symbols-outlined text-gray-400 text-4xl">pets</text>
        <text class="text-gray-500 dark:text-gray-400">未找到宠物信息</text>
        <button class="bg-serene-blue text-white px-6 py-2 rounded-lg" @click="goBack">返回</button>
      </view>
    </view>
  </view>
</template>

<script>
import { applyTabBarLocale } from '../../i18n/index.js'
import { DataManager } from '../../utils/dataModels.js'
import { TouchFeedback, AnimationUtils } from '../../utils/touchFeedback.js'

export default {
  data() {
    return {
      pet: null,
      petId: '',
      user: null,
      reminders: []
    }
  },
  onLoad(options) {
    this.petId = options.petId || ''
  },
  onShow() {
    const user = uni.getStorageSync('user')
    if (!user) {
      uni.redirectTo({ url: '/pages/login/index' })
      return
    }
    this.user = user
    try { uni.setNavigationBarTitle({ title: '宠物档案' }) } catch (e) {}
    try { const locale = uni.getStorageSync('locale') || (this.$i18n ? this.$i18n.locale : 'en'); applyTabBarLocale(locale) } catch (e) {}
    
    this.loadPetData()
    this.loadReminders()
    
    // 添加触摸反馈
    this.$nextTick(() => {
      this.addTouchFeedback()
    })
  },
  mounted() {
    this.addTouchFeedback()
  },
  computed: {
    upcomingReminders() {
      const now = Date.now()
      const nextWeek = now + 7 * 24 * 3600 * 1000
      return this.reminders.filter(r => r.petId === this.petId && r.nextDueAt && r.nextDueAt > now && r.nextDueAt <= nextWeek)
        .sort((a, b) => a.nextDueAt - b.nextDueAt)
    }
  },
  methods: {
    loadPetData() {
      const pets = DataManager.loadData(this.user.id, 'pets')
      this.pet = pets.find(p => p.id === this.petId) || null
      
      // 如果没有找到宠物，尝试加载第一个宠物
      if (!this.pet && pets.length > 0) {
        this.pet = pets[0]
        this.petId = this.pet.id
      }
    },
    loadReminders() {
      this.reminders = DataManager.loadData(this.user.id, 'reminders')
    },
    goBack() {
      uni.navigateBack()
    },
    editProfile() {
      uni.showToast({ title: '编辑功能开发中', icon: 'none' })
    },
    toHealth() {
      const url = '/pages/health/index?petId=' + encodeURIComponent(this.petId)
      uni.navigateTo({ url })
    },
    photoStyle(pet) {
      const url = pet.photo || pet.avatar || pet.photoUrl || ''
      return url ? `background-image: url('${url}');` : 'background-color: #f3f4f6;'
    },
    ageText(birthday) {
      if (!birthday) return '年龄未设置'
      const d = new Date(birthday)
      if (isNaN(d.getTime())) return birthday
      const now = new Date()
      let years = now.getFullYear() - d.getFullYear()
      const m = now.getMonth() - d.getMonth()
      const da = now.getDate() - d.getDate()
      if (m < 0 || (m === 0 && da < 0)) years--
      return years <= 0 ? '小于1岁' : `${years}岁`
    },
    formatDate(ts) {
      if (!ts) return '未设置'
      const d = new Date(ts)
      const y = d.getFullYear()
      const m = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      return `${m}-${day}`
    },
    addTouchFeedback() {
      // 为按钮添加触摸反馈
      const buttons = this.$el.querySelectorAll('button')
      buttons.forEach(button => {
        TouchFeedback.addTouchFeedback(button, {
          scale: 0.95,
          duration: 150
        })
        TouchFeedback.addRippleEffect(button, {
          color: 'rgba(59, 130, 246, 0.3)'
        })
      })
    }
  }
}
</script>

<style>
.bg-serene-blue {
  background-color: #3b82f6;
}
.text-serene-blue {
  color: #3b82f6;
}
.bg-warm-orange {
  background-color: #f97316;
}
.text-warm-orange {
  color: #f97316;
}
.text-error-red {
  color: #ef4444;
}
.bg-neutral-card {
  background-color: #ffffff;
}
.dark .bg-neutral-card {
  background-color: #1f2937;
}
.text-neutral-text-primary {
  color: #111827;
}
.dark .text-neutral-text-primary {
  color: #f9fafb;
}
.text-neutral-text-secondary {
  color: #6b7280;
}
.dark .text-neutral-text-secondary {
  color: #9ca3af;
}
.bg-neutral-bg {
  background-color: #f9fafb;
}
.dark .bg-neutral-bg {
  background-color: #374151;
}
</style>