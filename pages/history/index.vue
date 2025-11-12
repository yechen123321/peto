<template>
  <view class="bg-background-light dark:bg-background-dark min-h-screen">
    <!-- 顶部导航栏 -->
    <view class="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-gray-200/50 dark:border-white/10">
      <view class="flex items-center gap-3">
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">历史记录</text>
      </view>
      <view class="flex items-center gap-2">
        <view class="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
          <view v-for="tab in filterTabs" :key="tab.value"
                class="px-3 py-1 rounded-md text-sm transition-colors"
                :class="currentFilter === tab.value ? 'bg-serene-blue text-white' : 'text-gray-600 dark:text-gray-400'"
                @click="changeFilter(tab.value)">
            {{ tab.label }}
          </view>
        </view>
      </view>
    </view>

    <!-- 宠物选择器 -->
    <view class="px-4 mb-4">
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <view class="flex items-center justify-between">
          <text class="text-gray-900 dark:text-gray-50 text-base font-medium">选择宠物</text>
          <picker mode="selector" :range="petNames" :value="selectedPetIndex" @change="onPetChange">
            <view class="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
              <text class="text-gray-900 dark:text-gray-50 text-sm">{{ currentPetName }}</text>
              <text class="material-symbols-outlined !text-sm text-gray-500">expand_more</text>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 日历视图 -->
    <view class="px-4 mb-4">
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <view class="flex items-center justify-between mb-4">
          <button class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800" @click="previousMonth">
            <text class="material-symbols-outlined !text-base">chevron_left</text>
          </button>
          <text class="text-gray-900 dark:text-gray-50 text-base font-medium">{{ currentYear }}年{{ currentMonth }}月</text>
          <button class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800" @click="nextMonth">
            <text class="material-symbols-outlined !text-base">chevron_right</text>
          </button>
        </view>
        
        <!-- 星期标题 -->
        <view class="grid grid-cols-7 gap-1 mb-2">
          <view v-for="day in weekDays" :key="day" class="text-center py-2">
            <text class="text-gray-600 dark:text-gray-400 text-xs">{{ day }}</text>
          </view>
        </view>
        
        <!-- 日期网格 -->
        <view class="grid grid-cols-7 gap-1">
          <view v-for="date in calendarDates" :key="date.dateStr"
                class="aspect-square flex items-center justify-center rounded-lg relative"
                :class="getDateCellClass(date)"
                @click="selectDate(date)">
            <text class="text-sm" :class="getDateTextClass(date)">{{ date.day }}</text>
            <view v-if="hasEvent(date)" class="absolute bottom-1 w-1 h-1 rounded-full bg-serene-blue"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 事件列表 -->
    <view class="px-4 pb-20">
      <view class="bg-white dark:bg-slate-900 rounded-xl p-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-gray-900 dark:text-gray-50 text-lg font-bold">{{ selectedDateStr }} 事件</text>
          <text class="text-gray-600 dark:text-gray-400 text-sm">{{ filteredEvents.length }} 项</text>
        </view>
        
        <view v-if="filteredEvents.length > 0" class="space-y-3">
          <view v-for="event in filteredEvents" :key="event.id" 
                class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <view class="w-2 h-2 rounded-full mt-2 flex-shrink-0" :class="getEventColor(event)"></view>
            <view class="flex-1">
              <view class="flex items-center justify-between mb-1">
                <text class="text-gray-900 dark:text-gray-50 text-sm font-medium">{{ event.title }}</text>
                <text class="text-gray-600 dark:text-gray-400 text-xs">{{ formatTime(event.time) }}</text>
              </view>
              <text class="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{{ event.description }}</text>
              <view class="flex items-center gap-2 mt-2">
                <text class="text-gray-500 dark:text-gray-500 text-xs">{{ event.petName }}</text>
                <view v-if="event.hasReminder" class="flex items-center gap-1">
                  <text class="material-symbols-outlined !text-xs text-orange-500">notifications</text>
                  <text class="text-orange-500 text-xs">提醒已设置</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
          暂无事件记录
        </view>
      </view>
    </view>

    <!-- 浮动添加按钮 -->
    <view class="fixed bottom-24 right-4">
      <button class="w-14 h-14 bg-serene-blue rounded-full shadow-lg flex items-center justify-center" @click="showAddEventModal">
        <text class="material-symbols-outlined text-white !text-xl">add</text>
      </button>
    </view>

    <!-- 添加事件模态框 -->
    <view v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeAddModal">
      <view class="bg-white dark:bg-slate-900 rounded-xl p-6 w-11/12 max-w-sm" @click.stop>
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold mb-4 block">添加事件</text>
        
        <view class="space-y-4">
          <view>
            <text class="text-gray-700 dark:text-gray-300 text-sm mb-1 block">事件标题</text>
            <input v-model="newEvent.title" 
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-50"
                   placeholder="请输入事件标题" />
          </view>
          
          <view>
            <text class="text-gray-700 dark:text-gray-300 text-sm mb-1 block">事件描述</text>
            <textarea v-model="newEvent.description" 
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-50 resize-none"
                      rows="3"
                      placeholder="请输入事件描述"></textarea>
          </view>
          
          <view>
            <text class="text-gray-700 dark:text-gray-300 text-sm mb-1 block">关联宠物</text>
            <picker mode="selector" :range="petNames" :value="newEvent.petIndex" @change="onNewEventPetChange">
              <view class="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800">
                <text class="text-gray-900 dark:text-gray-50 text-sm">{{ petNames[newEvent.petIndex] || '选择宠物' }}</text>
                <text class="material-symbols-outlined !text-sm text-gray-500">expand_more</text>
              </view>
            </picker>
          </view>
          
          <view>
            <text class="text-gray-700 dark:text-gray-300 text-sm mb-1 block">事件时间</text>
            <picker mode="time" :value="newEvent.time" @change="onNewEventTimeChange">
              <view class="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800">
                <text class="text-gray-900 dark:text-gray-50 text-sm">{{ newEvent.time }}</text>
                <text class="material-symbols-outlined !text-sm text-gray-500">schedule</text>
              </view>
            </picker>
          </view>
          
          <view class="flex items-center justify-between">
            <text class="text-gray-700 dark:text-gray-300 text-sm">设置提醒</text>
            <switch :checked="newEvent.hasReminder" @change="onReminderToggle" />
          </view>
          
          <view v-if="newEvent.hasReminder">
            <text class="text-gray-700 dark:text-gray-300 text-sm mb-1 block">提醒时间</text>
            <picker mode="time" :value="newEvent.reminderTime" @change="onReminderTimeChange">
              <view class="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800">
                <text class="text-gray-900 dark:text-gray-50 text-sm">{{ newEvent.reminderTime }}</text>
                <text class="material-symbols-outlined !text-sm text-gray-500">notifications</text>
              </view>
            </picker>
          </view>
        </view>
        
        <view class="flex gap-3 mt-6">
          <button class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300" 
                  @click="closeAddModal">取消</button>
          <button class="flex-1 px-4 py-2 bg-serene-blue rounded-lg text-white" 
                  @click="addEvent">添加</button>
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
      user: null,
      pets: [],
      selectedPetIndex: 0,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      selectedDate: new Date(),
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      events: [],
      currentFilter: 'all',
      filterTabs: [
        { label: '全部', value: 'all' },
        { label: '提醒', value: 'reminders' },
        { label: '事件', value: 'events' }
      ],
      showAddModal: false,
      newEvent: {
        title: '',
        description: '',
        petIndex: 0,
        time: '09:00',
        hasReminder: false,
        reminderTime: '09:00'
      }
    }
  },
  onShow() {
    const user = uni.getStorageSync('user')
    if (!user) {
      uni.redirectTo({ url: '/pages/login/index' })
      return
    }
    this.user = user
    try { uni.setNavigationBarTitle({ title: '历史记录' }) } catch (e) {}
    try { const locale = uni.getStorageSync('locale') || (this.$i18n ? this.$i18n.locale : 'en'); applyTabBarLocale(locale) } catch (e) {}
    
    this.loadData()
    
    // 添加触摸反馈
    this.$nextTick(() => {
      this.addTouchFeedback()
    })
  },
  mounted() {
    this.addTouchFeedback()
  },
  computed: {
    calendarDates() {
      const dates = []
      const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth, 0)
      const firstDayWeek = firstDay.getDay()
      const lastDayDate = lastDay.getDate()
      
      // 添加上月末尾日期
      const prevMonth = new Date(this.currentYear, this.currentMonth - 1, 0)
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth - 2, prevMonth.getDate() - i)
        dates.push({
          day: date.getDate(),
          date: date,
          dateStr: this.formatDate(date),
          isCurrentMonth: false
        })
      }
      
      // 添加当月日期
      for (let i = 1; i <= lastDayDate; i++) {
        const date = new Date(this.currentYear, this.currentMonth - 1, i)
        dates.push({
          day: i,
          date: date,
          dateStr: this.formatDate(date),
          isCurrentMonth: true
        })
      }
      
      // 添加下月开始日期
      const remainingCells = 42 - dates.length
      for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(this.currentYear, this.currentMonth, i)
        dates.push({
          day: i,
          date: date,
          dateStr: this.formatDate(date),
          isCurrentMonth: false
        })
      }
      
      return dates
    },
    currentPetName() {
      return this.pets[this.selectedPetIndex] ? this.pets[this.selectedPetIndex].name : '全部宠物'
    },
    petNames() {
      return ['全部宠物', ...this.pets.map(pet => pet.name)]
    },
    selectedDateStr() {
      return this.formatDate(this.selectedDate)
    },
    filteredEvents() {
      let events = this.events
      
      // 按宠物筛选
      if (this.selectedPetIndex > 0) {
        const selectedPetId = this.pets[this.selectedPetIndex - 1].id
        events = events.filter(event => event.petId === selectedPetId)
      }
      
      // 按日期筛选
      events = events.filter(event => event.date === this.selectedDateStr)
      
      // 按类型筛选
      if (this.currentFilter === 'reminders') {
        events = events.filter(event => event.hasReminder)
      } else if (this.currentFilter === 'events') {
        events = events.filter(event => !event.hasReminder)
      }
      
      // 按时间排序
      return events.sort((a, b) => a.time.localeCompare(b.time))
    }
  },
  methods: {
    loadData() {
      this.pets = DataManager.loadData(this.user.id, 'pets')
      this.events = DataManager.loadData(this.user.id, 'events')
    },
    previousMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    selectDate(date) {
      if (date.isCurrentMonth) {
        this.selectedDate = date.date
      }
    },
    getDateCellClass(date) {
      const classes = []
      if (!date.isCurrentMonth) {
        classes.push('text-gray-400 dark:text-gray-600')
      } else if (this.isSelectedDate(date)) {
        classes.push('bg-serene-blue text-white')
      } else if (this.hasEvent(date)) {
        classes.push('bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300')
      } else {
        classes.push('text-gray-900 dark:text-gray-50')
      }
      return classes.join(' ')
    },
    getDateTextClass(date) {
      if (!date.isCurrentMonth) {
        return 'text-gray-400 dark:text-gray-600'
      } else if (this.isSelectedDate(date)) {
        return 'text-white'
      } else {
        return 'text-gray-900 dark:text-gray-50'
      }
    },
    isSelectedDate(date) {
      return this.formatDate(date.date) === this.selectedDateStr
    },
    hasEvent(date) {
      return this.events.some(event => event.date === date.dateStr)
    },
    formatDate(date) {
      const d = new Date(date)
      const y = d.getFullYear()
      const m = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    formatTime(time) {
      return time || '00:00'
    },
    getEventColor(event) {
      if (event.hasReminder) {
        return 'bg-orange-500'
      }
      return 'bg-serene-blue'
    },
    changeFilter(filter) {
      this.currentFilter = filter
    },
    onPetChange(e) {
      this.selectedPetIndex = parseInt(e.detail.value)
    },
    showAddEventModal() {
      this.showAddModal = true
      this.resetNewEvent()
    },
    closeAddModal() {
      this.showAddModal = false
    },
    resetNewEvent() {
      this.newEvent = {
        title: '',
        description: '',
        petIndex: 0,
        time: '09:00',
        hasReminder: false,
        reminderTime: '09:00'
      }
    },
    onNewEventPetChange(e) {
      this.newEvent.petIndex = parseInt(e.detail.value)
    },
    onNewEventTimeChange(e) {
      this.newEvent.time = e.detail.value
    },
    onReminderToggle(e) {
      this.newEvent.hasReminder = e.detail.value
    },
    onReminderTimeChange(e) {
      this.newEvent.reminderTime = e.detail.value
    },
    addEvent() {
      if (!this.newEvent.title.trim()) {
        uni.showToast({ title: '请输入事件标题', icon: 'none' })
        return
      }
      
      const petId = this.newEvent.petIndex > 0 ? this.pets[this.newEvent.petIndex - 1].id : null
      const petName = this.newEvent.petIndex > 0 ? this.pets[this.newEvent.petIndex - 1].name : '全部宠物'
      
      const event = {
        id: Date.now(),
        title: this.newEvent.title.trim(),
        description: this.newEvent.description.trim(),
        petId: petId,
        petName: petName,
        date: this.selectedDateStr,
        time: this.newEvent.time,
        hasReminder: this.newEvent.hasReminder,
        reminderTime: this.newEvent.reminderTime,
        createdAt: Date.now()
      }
      
      this.events.push(event)
      DataManager.saveData(this.user.id, 'events', this.events)
      
      this.closeAddModal()
      uni.showToast({ title: '事件添加成功', icon: 'success' })
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
      
      // 为日期单元格添加触摸反馈
      const dateCells = this.$el.querySelectorAll('.grid > view')
      dateCells.forEach(cell => {
        TouchFeedback.addTouchFeedback(cell, {
          scale: 0.9,
          duration: 100
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