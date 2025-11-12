<template>
  <view class="flex-1 p-4 space-y-6">
    <!-- 顶部栏移除，根据需求不显示 Settings 标题 -->

    <!-- Profile Summary Card -->
    <view class="flex items-center gap-4 bg-neutral-card dark:bg-zinc-800 p-6 rounded-xl shadow-sm">
      <view class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 shrink-0"
        :style="{ backgroundImage: 'url(https://via.placeholder.com/150)' }">
      </view>
      <view class="flex flex-col justify-center">
        <text class="text-neutral-text-primary dark:text-white text-lg font-bold leading-normal line-clamp-1">{{
          user?.phone || 'User' }}</text>
        <text class="text-neutral-text-secondary dark:text-gray-400 text-sm leading-normal line-clamp-1">{{
          $t('profile.summary.petsLabel') }}: {{ petCount }}</text>
        <text class="text-neutral-text-secondary dark:text-gray-400 text-xs leading-normal mt-1">{{
          $t('profile.summary.joinedLabel') }}: {{ formatCompactDate(user?.joinedAt || '20241108', user?.lang || user?.locale) }}</text>
      </view>
    </view>

    <!-- Modify Personal Information Card -->
    <view class="bg-neutral-card dark:bg-zinc-800 p-4 rounded-xl shadow-sm space-y-4">
      <text
        class="text-neutral-text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-2 pt-2">{{
          $t('profile.modify.title') }}</text>
      <view class="px-2">
        <label class="flex flex-col min-w-40 flex-1">
          <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal pb-2">{{
            $t('profile.modify.nickname') }}</text>
          <input
            class="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-neutral-text-primary dark:text-white dark:bg-zinc-700 focus:outline-0 focus:ring-2 focus:ring-warm-orange border border-gray-300 dark:border-zinc-600 bg-neutral-bg focus:border-warm-orange h-14 placeholder:text-neutral-text-secondary p-[15px] text-base font-normal leading-normal"
            :value="user?.phone || 'Username123'" />
        </label>
      </view>
      <view class="px-2">
        <label class="flex flex-col min-w-40 flex-1">
          <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal pb-2">{{
            $t('profile.modify.bio') }}</text>
          <textarea
            class="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-neutral-text-primary dark:text-white dark:bg-zinc-700 focus:outline-0 focus:ring-2 focus:ring-warm-orange border border-gray-300 dark:border-zinc-600 bg-neutral-bg focus:border-warm-orange min-h-28 placeholder:text-neutral-text-secondary p-[15px] text-base font-normal leading-normal"
            :placeholder="$t('profile.modify.bioPlaceholder')"></textarea>
        </label>
      </view>
      <view class="px-2 pt-2">
        <button
          class="flex items-center justify-center w-full bg-warm-orange text-white h-12 px-6 rounded-lg font-bold text-base leading-normal shadow-sm hover:opacity-90 transition-opacity"
          @click="uni.showToast({ title: $t('profile.modify.toastSaved'), icon: 'none' })">{{ $t('profile.modify.save')
          }}</button>
      </view>
    </view>

    <!-- Account Security Card -->
    <view class="bg-neutral-card dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
      <text
        class="text-neutral-text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] p-4 pb-2">{{
          $t('profile.security.title') }}</text>
      <view class="divide-y divide-gray-200 dark:divide-zinc-700">
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">lock</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.security.changePassword') }}</text>
          </view>
          <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
        </view>
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">switch_account</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.security.switchUser') }}</text>
          </view>
          <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
        </view>
      </view>
    </view>

    <!-- System Settings Card -->
    <view class="bg-neutral-card dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
      <text
        class="text-neutral-text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] p-4 pb-2">{{
          $t('profile.system.title') }}</text>
      <view class="divide-y divide-gray-200 dark:divide-zinc-700">
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">language</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.system.language') }}</text>
          </view>
          <picker mode="selector" :range="localeLabels" :value="localeIndex" @change="onLocaleChange">
            <view class="flex items-center gap-2">
              <text class="text-neutral-text-secondary dark:text-gray-400 text-base">{{ displayLocaleLabel }}</text>
              <text
                class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
            </view>
          </picker>
        </view>
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">delete</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.system.clearCache') }}</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-neutral-text-secondary dark:text-gray-400 text-base">24.5 MB</text>
            <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
          </view>
        </view>
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">contrast</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.system.theme') }}</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-neutral-text-secondary dark:text-gray-400 text-base">{{ $t('profile.system.systemDefault')
            }}</text>
            <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
          </view>
        </view>
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">notifications</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.system.notifications') }}</text>
          </view>
          <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
        </view>
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700"
          @click="showTestDataModal">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">science</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">测试数据管理</text>
          </view>
          <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
        </view>
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-serene-blue">privacy_tip</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.system.privacy') }}</text>
          </view>
          <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
        </view>
      </view>
    </view>

    <!-- 退出登录以统一的行样式展示 -->
    <view class="bg-neutral-card dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden">
      <view class="divide-y divide-gray-200 dark:divide-zinc-700">
        <view
          class="flex items-center gap-4 px-4 min-h-[56px] py-2 justify-between hover:bg-gray-50 dark:hover:bg-zinc-700"
          @click="logout">
          <view class="flex items-center gap-4">
            <text class="material-symbols-outlined text-error-red">logout</text>
            <text class="text-neutral-text-primary dark:text-white text-base font-medium leading-normal">{{
              $t('profile.logout') }}</text>
          </view>
          <text class="material-symbols-outlined text-neutral-text-secondary dark:text-gray-400">chevron_right</text>
        </view>
      </view>
    </view>

    <!-- 测试数据管理模态框 -->
    <view v-if="showTestModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeTestModal">
      <view class="bg-white dark:bg-slate-900 rounded-xl p-6 w-11/12 max-w-sm" @click.stop>
        <text class="text-gray-900 dark:text-gray-50 text-lg font-bold mb-4 block">测试数据管理</text>
        
        <view class="space-y-4">
          <text class="text-gray-600 dark:text-gray-400 text-sm">您可以安装测试数据来体验所有功能，或清除现有数据。</text>
          
          <view class="flex gap-3">
            <button class="flex-1 px-4 py-2 bg-serene-blue rounded-lg text-white" @click="installTestData">
              安装测试数据
            </button>
            <button class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300" @click="clearTestData">
              清除数据
            </button>
          </view>
        </view>
        
        <view class="flex justify-end mt-6">
          <button class="px-4 py-2 text-gray-500 dark:text-gray-400" @click="closeTestModal">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { applyTabBarLocale } from '../../i18n/index.js'
import TestDataGenerator from '../../utils/testData.js'
export default {
  data() { return { user: null, petCount: 0, currentLocale: 'en', locales: ['zh-CN', 'en'], localeLabels: ['简体中文', 'English'], showTestModal: false } },
  onShow() {
    const user = uni.getStorageSync('user')
    if (!user) { uni.redirectTo({ url: '/pages/login/index' }); return }
    this.user = user
    const pets = uni.getStorageSync('pets_' + user.id) || []
    this.petCount = pets.length
    const saved = uni.getStorageSync('locale')
    this.currentLocale = saved || (this.$i18n ? this.$i18n.locale : 'en')
    // 设置导航标题与刷新 tabBar 文案
    try { uni.setNavigationBarTitle({ title: this.$t('nav.profile') }) } catch (e) { }
    try { const locale = this.currentLocale; applyTabBarLocale(locale) } catch (e) { }
  },
  methods: {
    logout() {
      uni.removeStorageSync('user')
      uni.redirectTo({ url: '/pages/login/index' })
    },
    // 将紧凑日期字符串（YYYYMMDD，如“20241108”）按数据语言格式化展示
    // 输入非8位数字时，直接原样返回（即展示后端提供的文本）
    formatCompactDate(value, lang) {
      if (!value) return '20241108'
      const str = String(value).trim()
      if (/^\d{8}$/.test(str)) {
        const y = parseInt(str.slice(0, 4), 10)
        const m = parseInt(str.slice(4, 6), 10)
        const d = parseInt(str.slice(6, 8), 10)
        const effLang = (this.$i18n && this.$i18n.locale) ? this.$i18n.locale : lang
        const isZh = String(effLang || '').toLowerCase().includes('zh')
        if (isZh) {
          const mm = String(m).padStart(2, '0')
          const dd = String(d).padStart(2, '0')
          return `${y}年${mm}月${dd}日`
        }
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const dd = String(d).padStart(2, '0')
        return `${months[m - 1]} ${dd}, ${y}`
      }
      return str
    },
    // 日期展示依赖后端/数据库提供的字符串，不在前端做本地化转换
    changeLocale(locale) {
      const current = uni.getStorageSync('locale')
      if (current === locale) {
        uni.showToast({ title: '已是该语言', icon: 'none' })
        return
      }
      uni.setStorageSync('locale', locale)
      // 尝试立即切换（Vue2 可用），否则重启/刷新以全局生效
      if (this.$i18n) {
        this.$i18n.locale = locale
        // 同步更新 tabBar 文案
        applyTabBarLocale(locale)
        uni.showToast({ title: '语言已切换', icon: 'none' })
        this.currentLocale = locale
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
      } catch (e) { }
      // #endif
      uni.reLaunch({ url: '/pages/login/index' })
    },
    onLocaleChange(e) {
      const idx = e?.detail?.value
      const target = this.locales[idx] || 'en'
      this.changeLocale(target)
    },
    showTestDataModal() {
      this.showTestModal = true
    },
    closeTestModal() {
      this.showTestModal = false
    },
    installTestData() {
      try {
        TestDataGenerator.installTestData(this.user.id)
        this.petCount = 3 // 更新宠物数量
        uni.showToast({ title: '测试数据安装成功', icon: 'success' })
        this.closeTestModal()
      } catch (error) {
        uni.showToast({ title: '安装失败：' + error.message, icon: 'none' })
      }
    },
    clearTestData() {
      try {
        TestDataGenerator.clearTestData(this.user.id)
        this.petCount = 0 // 更新宠物数量
        uni.showToast({ title: '测试数据已清除', icon: 'success' })
        this.closeTestModal()
      } catch (error) {
        uni.showToast({ title: '清除失败：' + error.message, icon: 'none' })
      }
    }
  },
  computed: {
    localeIndex() {
      const i = this.locales.indexOf(this.currentLocale)
      return i >= 0 ? i : 1
    },
    displayLocaleLabel() {
      const i = this.locales.indexOf(this.currentLocale)
      return this.localeLabels[i] || 'English'
    }
  }
}
</script>

<style>
.btn {
  padding: 14rpx 22rpx;
  border-radius: 10rpx;
  background: #eee;
}

.btn.danger {
  background: #ff3b30;
  color: #fff;
}
</style>