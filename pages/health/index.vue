<template>
  <view class="bg-light-gray dark:bg-background-dark font-display min-h-screen w-full overflow-x-hidden">
    <!-- 顶部 App Bar -->
    <view
      class="sticky top-0 z-10 flex items-center bg-light-gray dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
      <button class="text-dark-gray dark:text-background-light flex size-10 items-center justify-center"
        @click="goBack">
        <text class="material-symbols-outlined text-2xl">arrow_back</text>
      </button>
      <text
        class="text-dark-gray dark:text-background-light text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{{
          pet?.name ? (pet.name + ' 的档案') : '健康档案' }}</text>
      <view class="w-10"></view>
    </view>

    <!-- 宠物信息摘要 -->
    <view class="flex items-center gap-4 bg-light-gray dark:bg-background-dark px-4 py-4 justify-start">
      <view class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12" :style="avatarStyle"></view>
      <text class="text-dark-gray dark:text-background-light text-lg font-semibold leading-normal flex-1 truncate">{{
        pet?.name || '未命名宠物' }}</text>
    </view>

    <!-- 统计与图表卡片 -->
    <view class="flex overflow-x-auto gap-4 px-4 py-3 snap-x snap-mandatory">
      <view
        class="flex min-w-[90%] md:min-w-72 flex-1 flex-col gap-2 p-4 bg-white dark:bg-black/20 rounded-xl snap-center shrink-0">
        <text class="text-dark-gray dark:text-gray-300 text-base font-medium leading-normal">健康趋势</text>
        <text
          class="text-dark-gray dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">最近两周</text>
        <view class="h-[180px] w-full rounded-md border border-gray-200/80 dark:border-gray-700" id="healthLine"
          @click="onChartClick('line')"></view>
      </view>
      <view
        class="flex min-w-[90%] md:min-w-72 flex-1 flex-col gap-2 p-4 bg-white dark:bg-black/20 rounded-xl snap-center shrink-0">
        <text class="text-dark-gray dark:text-gray-300 text-base font-medium leading-normal">就诊频次</text>
        <text
          class="text-dark-gray dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">最近两周</text>
        <view class="h-[180px] w-full rounded-md border border-gray-200/80 dark:border-gray-700" id="visitBar"
          @click="onChartClick('bar')"></view>
      </view>
    </view>

    <!-- 过滤 Chips -->
    <view class="px-4 py-2">
      <view class="flex gap-2 pb-2 overflow-x-auto">
        <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4"
          :class="filterType === 'all' ? 'bg-warm-orange text-white' : 'bg-white dark:bg-black/20'"
          @click="setFilterType('all')">
          <text class="text-sm font-semibold leading-normal">全部</text>
        </button>
        <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4"
          :class="filterType === 'vaccine' ? 'bg-warm-orange text-white' : 'bg-white dark:bg-black/20'"
          @click="setFilterType('vaccine')">
          <text class="text-dark-gray dark:text-gray-300 text-sm font-medium leading-normal">疫苗</text>
        </button>
        <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4"
          :class="filterType === 'visit' ? 'bg-warm-orange text-white' : 'bg-white dark:bg-black/20'"
          @click="setFilterType('visit')">
          <text class="text-dark-gray dark:text-gray-300 text-sm font-medium leading-normal">就诊</text>
        </button>
        <button class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4"
          :class="filterType === 'exam' ? 'bg-warm-orange text-white' : 'bg-white dark:bg-black/20'"
          @click="setFilterType('exam')">
          <text class="text-dark-gray dark:text-gray-300 text-sm font-medium leading-normal">体检</text>
        </button>
        <button
          class="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-black/20 pl-4 pr-3"
          @click="openFullModal">
          <text class="text-dark-gray dark:text-gray-300 text-sm font-medium leading-normal">筛选</text>
          <text class="material-symbols-outlined text-xl">calendar_month</text>
        </button>
      </view>
    </view>

    <!-- 时间轴（最近 3 条/类型） -->
    <view class="flex flex-col px-4 pb-24">
      <view v-for="group in groupedRecent" :key="group.type">
        <text
          class="text-dark-gray/60 dark:text-gray-400 text-sm font-bold uppercase tracking-wider py-4 text-center">{{
            typeLabel(group.type) }}</text>
        <view v-for="item in group.items" :key="item.id" class="flex gap-4">
          <view class="relative flex flex-col items-center">
            <view class="flex items-center justify-center rounded-full h-10 w-10 z-[1]" :class="dotBgClass(group.type)">
              <text class="material-symbols-outlined text-xl" :class="dotIconClass(group.type)">{{ typeIcon(group.type)
                }}</text>
            </view>
            <view class="w-0.5 flex-1 bg-gray-300 dark:bg-gray-700"></view>
          </view>
          <view class="flex-1 pb-8">
            <view class="flex items-center justify-between">
              <text class="text-dark-gray dark:text-white font-semibold">{{ maskSummary(item.summary) }}</text>
              <view class="flex items-center gap-1.5 text-status-green">
                <view class="h-2 w-2 rounded-full bg-status-green"></view>
                <text class="text-xs font-medium">完成</text>
              </view>
            </view>
            <text class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ formatDate(item.date) }}</text>
          </view>
        </view>
      </view>
      <view class="flex items-center justify-center pt-2">
        <button class="flex items-center justify-center h-10 px-4 rounded-xl bg-warm-orange text-white"
          @click="openFullModal">
          <text class="text-sm font-semibold leading-normal">查看全部</text>
        </button>
      </view>
    </view>

    <!-- 全量显示模态框（优化 UI 与筛选交互） -->
    <view v-if="showFull" class="modal">
      <view class="modal-card">
        <view class="modal-header">
          <text class="material-symbols-outlined header-icon">filter_alt</text>
          <text class="modal-title">筛选与搜索</text>
          <button class="icon-btn" @click="closeFullModal"><text class="material-symbols-outlined">close</text></button>
        </view>
        <view class="filter-bar">
          <input class="input" placeholder="搜索关键词" v-model="search" />
          <view class="select-wrap">
            <button class="select-btn" @click="toggleTypeDropdown">
              <text>{{ typeLabel(filterType) }}</text>
              <text class="material-symbols-outlined">expand_more</text>
            </button>
            <view v-if="showTypeDropdown" class="dropdown">
              <view class="dropdown-item" @click="selectFilterType('all')">全部</view>
              <view class="dropdown-item" @click="selectFilterType('vaccine')">疫苗</view>
              <view class="dropdown-item" @click="selectFilterType('visit')">就诊</view>
              <view class="dropdown-item" @click="selectFilterType('exam')">体检</view>
            </view>
          </view>
          <view class="picker-wrap">
            <picker mode="date" :value="filterDate" @change="onFilterDateChange">
              <view class="date-input">{{ filterDate || '选择日期' }}</view>
            </picker>
          </view>
        </view>
        <scroll-view scroll-y class="full-list">
          <view v-for="item in pagedFiltered" :key="item.id" class="item">
            <view class="dot" :class="item.type"></view>
            <view class="content">
              <view class="row">
                <text class="date">{{ formatDate(item.date) }}</text>
                <text class="type">{{ typeLabel(item.type) }}</text>
              </view>
              <text class="summary">{{ maskSummary(item.summary) }}</text>
            </view>
          </view>
          <view class="pagination">
            <button class="btn" @click="prevPage" :disabled="page <= 1">上一页</button>
            <text class="page-info">{{ page }} / {{ totalPages }}</text>
            <button class="btn" @click="nextPage" :disabled="page >= totalPages">下一页</button>
          </view>
        </scroll-view>
        <view class="modal-actions">
          <button class="btn" @click="closeFullModal">关闭</button>
        </view>
      </view>
    </view>

    <!-- 新增记录模态框 -->
    <view v-if="showAdd" class="modal">
      <view class="modal-card">
        <view class="modal-header">
          <text class="material-symbols-outlined header-icon">add_circle</text>
          <text class="modal-title">新增记录</text>
          <button class="icon-btn" @click="closeAddModal"><text class="material-symbols-outlined">close</text></button>
        </view>
        <view class="add-filter-bar">
          <view class="select-wrap">
            <button class="select-btn" @click="toggleAddTypeDropdown">
              <text>{{ typeLabel(newRecord.type) }}</text>
              <text class="material-symbols-outlined">expand_more</text>
            </button>
            <view v-if="showAddTypeDropdown" class="dropdown">
              <view class="dropdown-item" @click="selectAddType('vaccine')">疫苗</view>
              <view class="dropdown-item" @click="selectAddType('visit')">就诊</view>
              <view class="dropdown-item" @click="selectAddType('exam')">体检</view>
            </view>
          </view>
          <view class="picker-wrap">
            <picker mode="date" :value="newRecord.date" @change="onDateChange">
              <view class="date-input">{{ newRecord.date || '选择日期' }}</view>
            </picker>
          </view>
        </view>
        <view class="form-body">
          <textarea class="input textarea" placeholder="填写摘要（不含敏感信息）" v-model="newRecord.summary"></textarea>
        </view>
        <view class="modal-actions">
          <button class="btn" @click="closeAddModal">取消</button>
          <button class="btn primary" @click="submitAddRecord">保存</button>
        </view>
      </view>
    </view>

    <!-- 悬浮添加按钮 -->
    <view class="fixed bottom-6 right-6">
      <button class="flex items-center justify-center w-14 h-14 bg-warm-orange rounded-xl shadow-lg"
        @click="openAddModal">
        <text class="material-symbols-outlined text-white text-3xl">add</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      petId: null,
      pet: null,
      activeTab: 'vaccine',
      tabs: [
        { key: 'vaccine', label: '疫苗', icon: 'vaccines' },
        { key: 'visit', label: '就诊', icon: 'monitor_heart' },
        { key: 'exam', label: '体检', icon: 'labs' }
      ],
      // 图表懒加载标记
      chartsReady: false,
      // 时间轴数据
      records: [],
      showFull: false,
      showAdd: false,
      search: '',
      filterType: 'all',
      filterDate: '',
      page: 1,
      pageSize: 10,
      showTypeDropdown: false,
      showAddTypeDropdown: false,
      newRecord: { type: 'visit', date: '', summary: '' },
    }
  },
  onLoad(query) {
    this.petId = query?.petId || null
  },
  onShow() {
    const user = uni.getStorageSync('user')
    if (!user) { uni.redirectTo({ url: '/pages/login/index' }); return }
    const pets = uni.getStorageSync('pets_' + user.id) || []
    this.pet = pets.find(p => p.id == this.petId) || pets[0] || null
    this.loadRecords(user)
    this.lazyLoadCharts()
  },
  computed: {
    avatarStyle() {
      const url = this.pet?.photo || this.pet?.avatar || this.pet?.photoUrl || ''
      return url ? `background-image: url('${url}');` : ''
    },
    groupedRecent() {
      const types = this.filterType === 'all' ? ['vaccine', 'visit', 'exam'] : [this.filterType]
      return types.map(type => ({
        type,
        items: this.records
          .filter(r => r.type === type)
          .sort((a, b) => b.date - a.date)
          .slice(0, 3)
      }))
    },
    filterTypes() { return ['全部', '疫苗', '就诊', '体检'] },
    filteredList() {
      const s = (this.search || '').trim().toLowerCase()
      const type = this.filterType
      const dateStr = (this.filterDate || '').trim()
      let start = null, end = null
      if (dateStr) { const d = new Date(dateStr); start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); end = start + 86400000 }
      return this.records.filter(r => {
        const byType = (type === 'all' || r.type === type)
        const byText = (!s || (r.summary || '').toLowerCase().includes(s))
        const byDate = (!start || (r.date >= start && r.date < end))
        return byType && byText && byDate
      })
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredList.length / this.pageSize)) },
    pagedFiltered() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredList.slice(start, start + this.pageSize)
    },
  },
  methods: {
    goBack() { uni.navigateBack() },
    typeLabel(type) { return type === 'vaccine' ? '疫苗' : type === 'visit' ? '就诊' : type === 'exam' ? '体检' : '全部' },
    typeIcon(type) { return type === 'vaccine' ? 'vaccines' : type === 'visit' ? 'monitor_heart' : 'labs' },
    formatDate(ts) { if (!ts) return '未设置'; const d = new Date(ts); const y = d.getFullYear(), m = (d.getMonth() + 1).toString().padStart(2, '0'), day = d.getDate().toString().padStart(2, '0'); return `${y}-${m}-${day}` },
    maskSummary(text) { if (!text) return ''; return String(text).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') },
    switchTab(key) { this.activeTab = key; this.microInteract() },
    microInteract() { try { if (typeof window !== 'undefined') { const el = document.activeElement; if (el) el.blur() } } catch (e) { } },
    toggleExpand(item) { item.expanded = !item.expanded; this.microInteract() },
    openFullModal() { this.showFull = true; this.page = 1 },
    closeFullModal() { this.showFull = false },
    openAddModal() { const now = Date.now(); this.newRecord = { type: 'visit', date: this.formatDateOnly(now), summary: '' }; this.showAdd = true },
    closeAddModal() { this.showAdd = false },
    toggleTypeDropdown() { this.showTypeDropdown = !this.showTypeDropdown },
    selectFilterType(t) { this.filterType = t; this.page = 1; this.showTypeDropdown = false },
    toggleAddTypeDropdown() { this.showAddTypeDropdown = !this.showAddTypeDropdown },
    selectAddType(t) { this.newRecord.type = t; this.showAddTypeDropdown = false },
    setFilterType(t) { this.filterType = t; this.page = 1 },
    onTypeFilterChange(e) { const idx = e.detail.value; this.filterType = idx == 0 ? 'all' : (idx == 1 ? 'vaccine' : idx == 2 ? 'visit' : 'exam'); this.page = 1 },
    prevPage() { if (this.page > 1) this.page-- },
    nextPage() { if (this.page < this.totalPages) this.page++ },
    onChartClick(kind) { uni.showToast({ title: kind === 'line' ? '趋势点' : '频次柱', icon: 'none', duration: 1200 }) },
    formatDateOnly(ts) { const d = new Date(ts); const y = d.getFullYear(); const m = (d.getMonth() + 1).toString().padStart(2, '0'); const day = d.getDate().toString().padStart(2, '0'); return `${y}-${m}-${day}` },
    onDateChange(e) { this.newRecord.date = e?.detail?.value || '' },
    onFilterDateChange(e) { this.filterDate = e?.detail?.value || ''; this.page = 1 },
    async submitAddRecord() {
      const { type, date, summary } = this.newRecord
      if (!summary || !summary.trim()) { uni.showToast({ title: '请填写摘要', icon: 'none' }); return }
      const ts = date ? new Date(date).getTime() : Date.now()
      const rec = { id: Date.now() + Math.random(), date: ts, type, summary: summary.trim(), expanded: false }
      this.records = [rec, ...this.records]
      try {
        const user = uni.getStorageSync('user')
        const key = `healthRecords_${user.id}_${this.pet?.id || 'unknown'}`
        uni.setStorageSync(key, this.records)
      } catch (e) { }
      uni.showToast({ title: '已新增', icon: 'success', duration: 1200 })
      this.closeAddModal()
    },
    onTimeChange(e) { this.newRecord.time = e?.detail?.value || '' },
    loadRecords(user) {
      const key = `healthRecords_${user.id}_${this.pet?.id || 'unknown'}`
      const list = uni.getStorageSync(key)
      if (Array.isArray(list) && list.length > 0) {
        this.records = list
        return
      }
      // 构造演示数据（脱敏）
      const now = Date.now()
      const mk = (offset, type, summary) => ({ id: now + Math.random(), date: now - offset * 86400000, type, summary, expanded: false })
      this.records = [
        mk(3, 'vaccine', '疫苗加强：狂犬疫苗第2针'),
        mk(10, 'visit', '就诊：轻微皮炎治疗'),
        mk(18, 'exam', '体检：血常规指标正常'),
        mk(30, 'vaccine', '疫苗接种：五联第一针'),
        mk(42, 'visit', '就诊：胃肠不适处理'),
        mk(53, 'exam', '体检：体重、心率稳定'),
        mk(65, 'visit', '就诊：皮毛护理建议'),
        mk(80, 'exam', '体检：影像学检查正常'),
        mk(95, 'vaccine', '疫苗接种：免疫计划启动')
      ]
    },
    async lazyLoadCharts() {
      if (this.chartsReady) return
      // 延迟加载 ECharts，降低首屏压力
      setTimeout(async () => {
        if (typeof window !== 'undefined') {
          await this.ensureEcharts()
          this.initCharts()
          this.chartsReady = true
        }
      }, 300)
    },
    ensureEcharts() {
      return new Promise((resolve) => {
        if (window.echarts) { resolve(); return }
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'
        s.onload = () => resolve()
        s.onerror = () => resolve() // 失败时不阻塞
        document.head.appendChild(s)
      })
    },
    initCharts() {
      try {
        const echarts = window.echarts
        if (!echarts) return
        const lineEl = document.getElementById('healthLine')
        const barEl = document.getElementById('visitBar')
        if (!lineEl || !barEl) return
        const lineChart = echarts.init(lineEl)
        const barChart = echarts.init(barEl)
        const days = Array.from({ length: 14 }, (_, i) => `D${i + 1}`)
        const trend = days.map((_, i) => (80 + Math.round(10 * Math.sin(i / 2))))
        const visits = days.map(() => Math.floor(Math.random() * 3))
        lineChart.setOption({
          grid: { left: 8, right: 8, top: 24, bottom: 24 },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: days },
          yAxis: { type: 'value' },
          series: [{ type: 'line', data: trend, smooth: true, itemStyle: { color: '#1E88E5' } }]
        })
        barChart.setOption({
          grid: { left: 8, right: 8, top: 24, bottom: 24 },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: days },
          yAxis: { type: 'value' },
          series: [{ type: 'bar', data: visits, itemStyle: { color: '#43A047' } }]
        })
        lineChart.on('click', (p) => this.onChartClick('line'))
        barChart.on('click', (p) => this.onChartClick('bar'))
      } catch (e) { }
    },
    dotBgClass(type) {
      return type === 'vaccine' ? 'bg-serene-blue/20 dark:bg-serene-blue/30' :
        type === 'visit' ? 'bg-warm-orange/20 dark:bg-warm-orange/30' :
          'bg-serene-blue/20 dark:bg-serene-blue/30'
    },
    dotIconClass(type) {
      return type === 'vaccine' ? 'text-serene-blue' :
        type === 'visit' ? 'text-warm-orange' :
          'text-serene-blue'
    }
  }
}
</script>

<style>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background: #eef3fb;
  background-size: cover;
  background-position: center;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pet-name {
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1e;
}

.tabs {
  display: flex;
  gap: 8px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  color: #374151;
  transition: all 0.2s ease;
}

.tab.active {
  background: #e8f1fb;
  border-color: #1E88E5;
  color: #1E88E5;
}

.icon {
  font-size: 18px;
}

.charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 8px;
}

.chart {
  height: 180px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.timeline {
  margin-top: 16px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1E88E5;
  font-weight: 600;
  margin-bottom: 8px;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 8px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #eee;
  transition: background 0.2s ease;
}

.item:active {
  background: #f7fbff;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin-top: 6px;
}

.dot.vaccine {
  background: #1E88E5;
}

.dot.visit {
  background: #43A047;
}

.dot.exam {
  background: #5b99e5;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.date {
  color: #6b7280;
  font-size: 14px;
}

.summary {
  color: #374151;
  max-height: 2.8em;
  overflow: hidden;
}

.summary.expanded {
  max-height: none;
}

.arrow {
  color: #6b7280;
}

.see-all {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  height: 44px;
  font-size: 15px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: #FFA726;
  color: #fff;
  border-color: #FFA726;
}

.modal-actions .btn { min-width: 120px; }

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-card {
  width: 92%;
  max-width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 201;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .15);
  border: 1px solid #e5e7eb;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.header-icon {
  color: #6b7280;
  font-size: 20px;
}

.modal-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  color: #1c1c1e;
}

/* header-actions 已移除日期，仅保留关闭按钮，无需特殊布局 */

.date-input {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  height: 40px;
  background: #fff;
  display: flex;
  align-items: center;
  color: #374151;
  z-index: 1102;
  transition: box-shadow .15s ease, border-color .15s ease;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.filter-bar {
  display: flex;
  gap: 8px;
  position: relative;
}

/* 让筛选弹框中的类型与日期横向填满并统一视觉 */
.filter-bar .select-wrap { flex: 1; }
.filter-bar .picker-wrap { flex: 1.1; }
.filter-bar .select-btn { width: 100%; justify-content: space-between; }
.filter-bar .date-input { width: 100%; }
.filter-bar .select-wrap .dropdown { width: 100%; min-width: 100%; }

.add-filter-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  padding-top: 4px;
}

.select-wrap {
  position: relative;
}

.input {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  height: 40px;
  font-size: 15px;
  background: #fff;
  color: #111827;
  box-sizing: border-box;
  flex: 1;
  transition: box-shadow .15s ease, border-color .15s ease;
}

.select-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  color: #374151;
  transition: box-shadow .15s ease, border-color .15s ease;
}

.dropdown {
  position: absolute;
  top: 42px;
  left: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .12);
  z-index: 1100;
  min-width: 160px;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px 12px;
  color: #374151;
}

.dropdown-item:active {
  background: #f9fafb;
}

.full-list {
  max-height: 60vh;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 0;
}

.page-info {
  color: #6b7280;
}

.form-body {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 统一类型选择与日期选择的视觉尺寸与文字样式 */
.select-btn,
.date-input {
  height: 40px;
  font-size: 15px;
}

.select-btn .material-symbols-outlined {
  font-size: 18px;
  color: #6b7280;
}

/* 横向填满：左右控件均占满各自空间 */
.add-filter-bar { display: flex; }
.select-wrap { flex: 1; }
.picker-wrap { flex: 2; }
.select-btn { width: 100%; justify-content: space-between; }
.date-input { width: 100%; }
.select-wrap .dropdown { width: 100%; min-width: 100%; }

.textarea {
  min-height: 96px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
}

/* 焦点与占位样式统一 */
.input:focus,
.input:focus-within {
  outline: none;
  /* 保留外层边框，借鉴登录页仅加外环的做法 */
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.35);
}
.input::placeholder {
  color: #9ca3af;
}
.input .uni-input-wrapper,
.date-input .uni-input-wrapper {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 0 !important;
}
.input .uni-input-input,
.date-input .uni-input-input,
.input input,
.date-input input {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}
.select-btn:focus, .select-btn:active, .select-btn:focus-within,
.date-input:focus, .date-input:active, .date-input:focus-within {
  /* 保留外层边框，统一为外环高亮 */
  box-shadow: 0 0 0 2px rgba(255, 167, 38, 0.35);
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

/* 响应式 */
@media (min-width: 768px) {
  .charts {
    grid-template-columns: 1fr 1fr
  }
}
</style>