<template>
  <view
    class="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark h-screen w-screen overflow-hidden">
    <view class="relative flex h-full w-full flex-col overflow-x-hidden">
      <view class="flex flex-col items-center justify-between flex-1 w-full max-w-md mx-auto p-4">
        <view class="h-8 w-full"></view>
        <view class="flex flex-col items-center justify-center w-full text-center">
          <view class="w-full max-w-[160px] mb-6">
            <view class="w-full bg-center bg-no-repeat bg-cover aspect-square rounded-full flex-1"
              style="background-image:url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7mD-Zr3fof3N_7XP8ViIdqbj_81UzGvEUAbJx-7DcADnXuLkKE6SthQdOZ1BLrpU-tteFpZf__npDX8Bfz4pG6H3KTczMuaPSBCd2QX2n3K9N3KPRoi3dsuuA_gjyV9AYXtype21hyC2yFUmGu7NsyVzqWk6adcK9tWnYxQ19j15YH_4sEOHeis48-FKE6ofD6K0n1ioyYxmvW2Jj0YfU2FzCREHBUbcvkWcVa_5bj4MGPvV21GiWydIFW2UKqsIIQ5mSQ9Ds3Aw4')">
            </view>
          </view>
          <view class="mb-10">
            <text class="tracking-tight text-4xl font-extrabold leading-tight">Pet Calendar</text>
            <text class="text-text-light/80 dark:text-text-dark/80 text-lg font-normal leading-normal pt-2 block">{{
              $t('login.titleTagline') }}</text>
          </view>
        </view>

        <!-- 返回按钮（仅在登录或注册模式显示） -->
        <view v-if="mode !== 'choose'" class="w-full mb-3">
          <button class="flex items-center gap-1 text-primary" @click="mode = 'choose'">
            <text class="material-symbols-outlined">arrow_back</text>
            <text>{{ $t('common.back') }}</text>
          </button>
        </view>

        <!-- 登录表单 -->
        <view v-if="mode === 'login'" class="w-full space-y-3">
          <view
            class="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-700 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
            <text class="material-symbols-outlined text-secondary text-[20px]">person</text>
            <input class="flex-1 h-10 bg-transparent outline-none placeholder:text-neutral-400" type="text"
              :placeholder="$t('login.username')" v-model="username" />
          </view>
          <view class="flex items-center gap-3">
            <view
              class="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-700 shadow-sm flex-1 focus-within:ring-2 focus-within:ring-primary/20">
              <text class="material-symbols-outlined text-secondary text-[20px]">lock</text>
              <input class="flex-1 h-10 bg-transparent outline-none placeholder:text-neutral-400" type="password"
                :placeholder="$t('login.password')" v-model="password" />
            </view>
          </view>
          <button :class="{ 'opacity-60 cursor-not-allowed': !agree }"
            class="flex items-center justify-center rounded-lg h-11 px-4 w-full bg-primary text-white text-sm font-semibold shadow-sm active:scale-[0.99]"
            @click="login">{{ $t('login.loginBtn') }}</button>
          <view class="w-full px-4 mt-2 flex items-center justify-center">
            <view class="flex items-center cursor-pointer" @click="toggleAgree">
              <view
                :class="['w-4 h-4 rounded-full border flex items-center justify-center transition-colors', agree ? 'bg-primary border-primary' : 'bg-transparent border-neutral-300 dark:border-neutral-600']">
                <view v-if="agree" class="w-2 h-2 rounded-full bg-white"></view>
              </view>
              <text class="ml-2 text-xs text-neutral-500 dark:text-neutral-400">{{ $t('login.agreePrefix') }}
                <text class="font-semibold underline">{{ $t('legal.terms') }}</text> {{ $t('common.and') }}
                <text class="font-semibold underline">{{ $t('legal.privacy') }}</text>
              </text>
            </view>
          </view>
        </view>

        <!-- 注册表单 -->
        <view v-if="mode === 'register'" class="w-full space-y-3">
          <view
            class="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-700 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
            <text class="material-symbols-outlined text-secondary text-[20px]">person</text>
            <input class="flex-1 h-10 bg-transparent outline-none placeholder:text-neutral-400" type="text"
              :placeholder="$t('login.username')" v-model="username" />
          </view>
          <view class="flex items-center gap-3">
            <view
              class="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-700 shadow-sm flex-1 focus-within:ring-2 focus-within:ring-primary/20">
              <text class="material-symbols-outlined text-secondary text-[20px]">lock</text>
              <input class="flex-1 h-10 bg-transparent outline-none placeholder:text-neutral-400" type="password"
                :placeholder="$t('login.password')" v-model="password" />
            </view>
            <view
              class="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-200 dark:border-neutral-700 shadow-sm flex-1 focus-within:ring-2 focus-within:ring-primary/20">
              <text class="material-symbols-outlined text-secondary text-[20px]">lock</text>
              <input class="flex-1 h-10 bg-transparent outline-none placeholder:text-neutral-400" type="password"
                :placeholder="$t('login.confirmPassword')" v-model="password2" />
            </view>
          </view>
          <button :class="{ 'opacity-60 cursor-not-allowed': !agree }"
            class="flex items-center justify-center rounded-lg h-11 px-4 w-full bg-primary text-white text-sm font-semibold shadow-sm active:scale-[0.99]"
            @click="register">{{ $t('login.registerBtn') }}</button>
          <view class="w-full px-4 mt-2 flex items-center justify-center">
            <view class="flex items-center cursor-pointer" @click="toggleAgree">
              <view
                :class="['w-4 h-4 rounded-full border flex items-center justify-center transition-colors', agree ? 'bg-primary border-primary' : 'bg-transparent border-neutral-300 dark:border-neutral-600']">
                <view v-if="agree" class="w-2 h-2 rounded-full bg-white"></view>
              </view>
              <text class="ml-2 text-xs text-neutral-500 dark:text-neutral-400">{{ $t('login.agreePrefix') }}
                <text class="font-semibold underline">{{ $t('legal.terms') }}</text> {{ $t('common.and') }}
                <text class="font-semibold underline">{{ $t('legal.privacy') }}</text>
              </text>
            </view>
          </view>
        </view>

        <!-- 协议提示移至各表单下方并添加勾选框 -->

        <!-- 底部切换按钮（选择模式） -->
        <view v-if="mode === 'choose'" class="w-full mt-auto">
          <view class="flex px-4 py-1">
            <button
              class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30"
              @click="mode = 'register'">
              <text class="truncate">{{ $t('choose.createAccount') }}</text>
            </button>
          </view>
          <view class="flex px-4 py-1">
            <button
              class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 flex-1 bg-transparent text-primary text-base font-bold leading-normal tracking-[0.015em]"
              @click="mode = 'login'">
              <text class="truncate">{{ $t('choose.logIn') }}</text>
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mode: 'choose',
      username: 'demo',
      password: '1234',
      password2: '',
      agree: false
    }
  },
  onLoad() {
    // 预置默认用户，便于首次登录体验
    const users = uni.getStorageSync('users') || {}
    if (!users['demo']) {
      users['demo'] = { password: '1234', createdAt: Date.now() }
      uni.setStorageSync('users', users)
    }
  },
  methods: {
    onAgreeChange(e) {
      const val = e?.detail?.value
      this.agree = Array.isArray(val) ? val.includes('agree') : false
    },
    toggleAgree() {
      this.agree = !this.agree
    },
    login() {
      if (!this.agree) {
        uni.showToast({ title: this.$t('toast.agreeRequired'), icon: 'none' })
        return
      }
      if (!this.username || !this.password) {
        uni.showToast({ title: this.$t('toast.enterUsernamePassword'), icon: 'none' })
        return
      }
      const users = uni.getStorageSync('users') || {}
      const u = users[this.username]
      if (!u) {
        uni.showToast({ title: this.$t('toast.userNotFound'), icon: 'none' })
        return
      }
      if (u.password !== this.password) {
        uni.showToast({ title: this.$t('toast.wrongPassword'), icon: 'none' })
        return
      }
      const user = { id: this.username, name: this.username }
      uni.setStorageSync('user', user)
      // 如果没有宠物，跳转到添加宠物；否则跳主页
      const pets = uni.getStorageSync('pets_' + user.id) || []
      if (!pets || pets.length === 0) {
        uni.redirectTo({ url: '/pages/pet/add' })
      } else {
        uni.switchTab({ url: '/pages/home/index' })
      }
    },
    register() {
      if (!this.agree) {
        uni.showToast({ title: this.$t('toast.agreeRequired'), icon: 'none' })
        return
      }
      if (!this.username || !this.password) {
        uni.showToast({ title: this.$t('toast.enterUsernamePassword'), icon: 'none' })
        return
      }
      if (this.password.length < 4) {
        uni.showToast({ title: this.$t('toast.passwordTooShort'), icon: 'none' })
        return
      }
      if (this.password !== this.password2) {
        uni.showToast({ title: this.$t('toast.passwordMismatch'), icon: 'none' })
        return
      }
      const users = uni.getStorageSync('users') || {}
      if (users[this.username]) {
        uni.showToast({ title: this.$t('toast.usernameExists'), icon: 'none' })
        return
      }
      users[this.username] = { password: this.password, createdAt: Date.now() }
      uni.setStorageSync('users', users)
      uni.showToast({ title: this.$t('toast.registerSuccess'), icon: 'none' })
      // 自动登录
      const user = { id: this.username, name: this.username }
      uni.setStorageSync('user', user)
      const pets = uni.getStorageSync('pets_' + user.id) || []
      if (!pets || pets.length === 0) {
        uni.redirectTo({ url: '/pages/pet/add' })
      } else {
        uni.switchTab({ url: '/pages/home/index' })
      }
    }
  },
  beforeDestroy() { }
}
</script>

<style>
/* 使用 Tailwind，保留空样式块以防编译器要求 */
</style>