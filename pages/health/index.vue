<template>
  <view class="bg-background-light dark:bg-background-dark min-h-screen">
    <!-- 顶部导航栏 -->
    <view class="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-gray-200/50 dark:border-white/10">
      <view class="flex items-center gap-3">
        <button class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800" @click="goBack">
          <text class="material-symbols-outlined !text-base">arrow_back</text>
        </button>
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">健康报告</text>
      </view>
    </view>

    <!-- 宠物选择器 -->
    <view class="p-4">
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-gray-900 dark:text-gray-50 text-base font-medium">选择宠物</text>
          <view class="flex items-center gap-2">
            <picker mode="selector" :range="petNames" :value="selectedPetIndex" @change="onPetChange">
              <view class="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                <text class="text-gray-900 dark:text-gray-50 text-sm">{{ currentPetName }}</text>
                <text class="material-symbols-outlined !text-sm text-gray-500">expand_more</text>
              </view>
            </picker>
          </view>
        </view>
        
        <!-- 快速切换按钮 -->
        <view class="flex gap-2 overflow-x-auto">
          <view v-for="(pet, index) in pets" :key="pet.id" 
                class="flex items-center gap-2 px-3 py-2 rounded-lg min-w-max"
                :class="selectedPetIndex === index ? 'bg-serene-blue text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'"
                @click="selectPet(index)">
            <view class="w-6 h-6 rounded-full bg-center bg-cover" :style="photoStyle(pet)"></view>
            <text class="text-sm">{{ pet.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 健康数据内容 -->
    <view v-if="currentPet" class="px-4 pb-4 space-y-4">
      <!-- 基本信息概览 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold mb-3 block">健康概览</text>
        <view class="grid grid-cols-2 gap-4">
          <view class="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
            <view class="flex items-center gap-2 mb-1">
              <text class="material-symbols-outlined text-blue-500 !text-sm">scale</text>
              <text class="text-gray-600 dark:text-gray-400 text-xs">当前体重</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">{{ currentPet.weight || 0 }}kg</text>
          </view>
          
          <view class="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
            <view class="flex items-center gap-2 mb-1">
              <text class="material-symbols-outlined text-green-500 !text-sm">height</text>
              <text class="text-gray-600 dark:text-gray-400 text-xs">身高</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">{{ currentPet.height || 0 }}cm</text>
          </view>
          
          <view class="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
            <view class="flex items-center gap-2 mb-1">
              <text class="material-symbols-outlined text-purple-500 !text-sm">favorite</text>
              <text class="text-gray-600 dark:text-gray-400 text-xs">健康状态</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">{{ healthStatus }}</text>
          </view>
          
          <view class="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
            <view class="flex items-center gap-2 mb-1">
              <text class="material-symbols-outlined text-orange-500 !text-sm">local_hospital</text>
              <text class="text-gray-600 dark:text-gray-400 text-xs">疫苗状态</text>
            </view>
            <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">{{ vaccinationStatus }}</text>
          </view>
        </view>
      </view>

      <!-- 体重趋势 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">体重趋势</text>
          <button class="text-serene-blue text-sm" @click="addWeightRecord">记录体重</button>
        </view>
        <view class="h-32 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center justify-center">
          <view class="text-center">
            <text class="material-symbols-outlined text-gray-400 text-2xl">trending_up</text>
            <text class="text-gray-500 dark:text-gray-400 text-sm block mt-2">体重趋势图表</text>
            <text class="text-gray-400 dark:text-gray-500 text-xs">最近{{ weightRecords.length }}条记录</text>
          </view>
        </view>
        <view v-if="weightRecords.length > 0" class="mt-3 space-y-2">
          <view v-for="record in weightRecords.slice(-3)" :key="record.id" class="flex items-center justify-between py-1">
            <text class="text-gray-600 dark:text-gray-400 text-sm">{{ formatDate(record.date) }}</text>
            <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ record.weight }}kg</text>
          </view>
        </view>
      </view>

      <!-- 疫苗接种记录 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">疫苗接种</text>
          <button class="text-serene-blue text-sm" @click="addVaccination">添加记录</button>
        </view>
        <view class="space-y-3">
          <view v-if="vaccinations.length > 0" class="space-y-3">
            <view v-for="vaccination in vaccinations.slice(-3)" :key="vaccination.id" 
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <view>
                <text class="text-gray-900 dark:text-gray-50 text-sm font-medium block">{{ vaccination.name }}</text>
                <text class="text-gray-600 dark:text-gray-400 text-xs">{{ formatDate(vaccination.date) }}</text>
              </view>
              <view class="flex items-center gap-1">
                <view class="w-2 h-2 rounded-full" :class="vaccination.nextDue && vaccination.nextDue > Date.now() ? 'bg-green-500' : 'bg-red-500'"></view>
                <text class="text-gray-600 dark:text-gray-400 text-xs">{{ vaccination.nextDue && vaccination.nextDue > Date.now() ? '有效' : '需补种' }}</text>
              </view>
            </view>
          </view>
          <view v-else class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            暂无疫苗接种记录
          </view>
        </view>
      </view>

      <!-- 健康评估 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold mb-3 block">健康评估</text>
        <view class="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4">
          <view class="flex items-start gap-3">
            <text class="material-symbols-outlined text-green-500 text-xl">health_and_safety</text>
            <view class="flex-1">
              <text class="text-gray-900 dark:text-gray-50 text-sm font-medium block mb-1">{{ healthAssessment.title }}</text>
              <text class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ healthAssessment.description }}</text>
            </view>
          </view>
        </view>
        
        <view class="mt-4 space-y-2">
          <text class="text-gray-900 dark:text-gray-50 text-sm font-medium block">建议</text>
          <view v-for="(suggestion, index) in healthSuggestions" :key="index" class="flex items-start gap-2">
            <view class="w-1 h-1 rounded-full bg-serene-blue mt-2 flex-shrink-0"></view>
            <text class="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">{{ suggestion }}</text>
          </view>
        </view>
      </view>

      <!-- 最近检查记录 -->
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">最近检查</text>
          <button class="text-serene-blue text-sm" @click="addCheckup">添加记录</button>
        </view>
        <view class="space-y-3">
          <view v-if="recentCheckups.length > 0" class="space-y-3">
            <view v-for="checkup in recentCheckups.slice(0, 2)" :key="checkup.id" 
                  class="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <view class="flex items-center justify-between mb-2">
                <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ checkup.type }}</text>
                <text class="text-gray-600 dark:text-gray-400 text-xs">{{ formatDate(checkup.date) }}</text>
              </view>
              <text class="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{{ checkup.notes }}</text>
            </view>
          </view>
          <view v-else class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            暂无检查记录
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { applyTabBarLocale } from '../../i18n/index.js'
import { DataManager } from '../../utils/dataModels.js'
import { TouchFeedback } from '../../utils/touchFeedback.js'

export default {
  data() {
    return {
      pets: [],
      selectedPetIndex: 0,
      user: null,
      weightRecords: [],
      vaccinations: [],
      recentCheckups: []
    }
  },
  onLoad(options) {
    const petId = options.petId || ''
    if (petId) {
      this.petId = petId
    }
  },
  onShow() {
    const user = uni.getStorageSync('user')
    if (!user) {
      uni.redirectTo({ url: '/pages/login/index' })
      return
    }
    this.user = user
    try { uni.setNavigationBarTitle({ title: '健康报告' }) } catch (e) {}
    try { const locale = uni.getStorageSync('locale') || (this.$i18n ? this.$i18n.locale : 'en'); applyTabBarLocale(locale) } catch (e) {}
    
    this.loadPets()
    this.loadHealthData()
    
    // 添加触摸反馈
    this.$nextTick(() => {
      this.addTouchFeedback()
    })
  },
  mounted() {
    this.addTouchFeedback()
  },
  computed: {
    currentPet() {
      return this.pets[this.selectedPetIndex] || null
    },
    currentPetName() {
      return this.currentPet ? this.currentPet.name : '选择宠物'
    },
    petNames() {
      return this.pets.map(pet => pet.name)
    },
    healthStatus() {
      if (!this.currentPet) return '未知'
      // 基于体重、疫苗等数据计算健康状态
      const hasRecentVaccination = this.vaccinations.some(v => 
        v.date > Date.now() - 365 * 24 * 3600 * 1000 && v.nextDue > Date.now()
      )
      return hasRecentVaccination ? '良好' : '需关注'
    },
    vaccinationStatus() {
      if (!this.currentPet || this.vaccinations.length === 0) return '未接种'
      const recentVaccinations = this.vaccinations.filter(v => v.nextDue > Date.now())
      return recentVaccinations.length > 0 ? '已接种' : '需补种'
    },
    healthAssessment() {
      if (!this.currentPet) {
        return {
          title: '请先选择宠物',
          description: '选择宠物后查看健康评估'
        }
      }
      
      const weight = this.currentPet.weight || 0
      const age = this.getAgeInYears(this.currentPet.birthday)
      
      let title = '健康状态良好'
      let description = '您的宠物各项指标正常，继续保持良好的护理习惯。'
      
      if (weight < 5 && age > 1) {
        title = '体重偏轻'
        description = '建议增加营养摄入，定期检查体重变化。'
      } else if (weight > 15 && age > 1) {
        title = '体重偏重'
        description = '建议控制饮食，增加运动量。'
      }
      
      return { title, description }
    },
    healthSuggestions() {
      if (!this.currentPet) return []
      
      const suggestions = []
      const weight = this.currentPet.weight || 0
      const age = this.getAgeInYears(this.currentPet.birthday)
      
      if (weight < 5 && age > 1) {
        suggestions.push('增加高质量蛋白质的摄入')
        suggestions.push('定期称重监控体重变化')
      } else if (weight > 15 && age > 1) {
        suggestions.push('减少高热量零食')
        suggestions.push('增加日常运动时间')
      }
      
      if (age > 7) {
        suggestions.push('定期体检，关注老年疾病')
        suggestions.push('适当减少运动强度')
      }
      
      const hasRecentVaccination = this.vaccinations.some(v => 
        v.date > Date.now() - 365 * 24 * 3600 * 1000
      )
      if (!hasRecentVaccination) {
        suggestions.push('及时接种疫苗')
      }
      
      return suggestions.length > 0 ? suggestions : ['继续保持良好的护理习惯']
    }
  },
  methods: {
    loadPets() {
      this.pets = DataManager.loadData(this.user.id, 'pets')
      
      // 如果有指定petId，找到对应的索引
      if (this.petId) {
        const index = this.pets.findIndex(pet => pet.id === this.petId)
        if (index !== -1) {
          this.selectedPetIndex = index
        }
      }
    },
    loadHealthData() {
      // 加载体重记录
      this.weightRecords = DataManager.loadData(this.user.id, 'weightRecords')
      
      // 加载疫苗记录
      this.vaccinations = DataManager.loadData(this.user.id, 'vaccinations')
      
      // 加载检查记录
      this.recentCheckups = DataManager.loadData(this.user.id, 'checkups')
    },
    onPetChange(e) {
      this.selectedPetIndex = parseInt(e.detail.value)
      this.updateCurrentPetHealthData()
    },
    selectPet(index) {
      this.selectedPetIndex = index
      this.updateCurrentPetHealthData()
    },
    updateCurrentPetHealthData() {
      // 可以在这里添加更新当前宠物健康数据的逻辑
      uni.showToast({ title: `已选择 ${this.currentPetName}`, icon: 'none' })
    },
    addWeightRecord() {
      uni.showToast({ title: '体重记录功能开发中', icon: 'none' })
    },
    addVaccination() {
      uni.showToast({ title: '疫苗记录功能开发中', icon: 'none' })
    },
    addCheckup() {
      uni.showToast({ title: '检查记录功能开发中', icon: 'none' })
    },
    goBack() {
      uni.navigateBack()
    },
    photoStyle(pet) {
      const url = pet.photo || pet.avatar || pet.photoUrl || ''
      return url ? `background-image: url('${url}');` : 'background-color: #f3f4f6;'
    },
    formatDate(ts) {
      if (!ts) return '未设置'
      const d = new Date(ts)
      const y = d.getFullYear()
      const m = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    getAgeInYears(birthday) {
      if (!birthday) return 0
      const d = new Date(birthday)
      if (isNaN(d.getTime())) return 0
      const now = new Date()
      let years = now.getFullYear() - d.getFullYear()
      const m = now.getMonth() - d.getMonth()
      const da = now.getDate() - d.getDate()
      if (m < 0 || (m === 0 && da < 0)) years--
      return years
    },
    addTouchFeedback() {
      // 为按钮添加触摸反馈
      const buttons = this.$el.querySelectorAll('button')
      buttons.forEach(button => {
        TouchFeedback.addTouchFeedback(button, {
          scale: 0.95,
          duration: 150
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