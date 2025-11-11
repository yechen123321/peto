<template>
  <view class="bg-background-light dark:bg-background-dark font-display min-h-screen w-full overflow-hidden">
    <!-- Top App Bar -->
    <view
      class="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-200/50 dark:border-white/10">
      <button class="text-gray-800 dark:text-gray-200 flex size-10 shrink-0 items-center justify-center"
        @click="goBack">
        <text class="material-symbols-outlined">arrow_back</text>
      </button>
      <text
        class="text-gray-900 dark:text-gray-50 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">{{
          $t('pet.add.title') }}</text>
      <view class="flex size-10 shrink-0 items-center"></view>
    </view>

    <view class="flex-grow px-4 pb-24">
      <!-- Profile Header/Image Uploader -->
      <view class="flex p-4 @container justify-center">
        <view class="flex w-full flex-col gap-4 items-center">
          <view class="relative">
            <view
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-white dark:border-gray-800 shadow-sm"
              :style="photoStyle"></view>
            <button
              class="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-md"
              @click="onChoosePhoto">
              <text class="material-symbols-outlined text-xl">add_a_photo</text>
            </button>
          </view>
          <view class="flex flex-col items-center justify-center">
            <text
              class="text-gray-900 dark:text-gray-50 text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{{
                $t('pet.add.uploadTitle') }}</text>
            <text class="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal text-center">{{
              $t('pet.add.uploadSubtitle') }}</text>
          </view>
        </view>
      </view>

      <!-- Form Fields (简化结构，无多层包裹) -->
      <view class="flex flex-col gap-4 mt-6 max-w-lg mx-auto">
        <!-- Pet Name -->
        <text class="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">{{ $t('pet.add.nameLabel')
        }}</text>
        <view
          class="flex items-center w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 h-14 px-[15px] focus-within:ring-2 focus-within:ring-primary/50">
          <input
            class="w-full h-full bg-transparent border-0 outline-none text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :placeholder="$t('pet.add.namePlaceholder')" v-model="form.name" />
        </view>

        <!-- Breed -->
        <text class="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">{{ $t('pet.add.breedLabel')
        }}</text>
        <view
          class="flex items-center w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 h-14 px-[15px] focus-within:ring-2 focus-within:ring-primary/50">
          <input
            class="w-full h-full bg-transparent border-0 outline-none text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :placeholder="$t('pet.add.breedPlaceholder')" v-model="form.breed" />
        </view>

        <!-- Birthday & Gender Row -->
        <view class="flex flex-col sm:flex-row gap-4">
          <!-- Birthday -->
          <view class="flex-1">
            <text class="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">{{
              $t('pet.add.birthdayLabel') }}</text>
            <picker class="w-full" mode="date" :value="form.birthday" @change="onDateChange">
              <view
                class="flex w-full rounded-lg text-gray-900 dark:text-gray-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark h-14 p-[15px] text-base items-center justify-between">
                <text class="text-gray-900 dark:text-gray-50">{{ form.birthday || $t('pet.add.birthdayPlaceholder')
                }}</text>
                <text class="material-symbols-outlined text-gray-400 dark:text-gray-500">calendar_today</text>
              </view>
            </picker>
          </view>
          <!-- Weight -->
          <view class="flex-1">
            <text class="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">{{
              $t('pet.add.weightLabel') }}</text>
            <view
              class="flex items-center w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 h-14 px-[15px] focus-within:ring-2 focus-within:ring-primary/50">
              <input
                class="flex-1 h-full bg-transparent border-0 outline-none text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                :placeholder="$t('pet.add.weightPlaceholder')" v-model="weight" inputmode="decimal" />
              <view class="flex gap-1">
                <view class="px-3 py-1 rounded-full"
                  :class="weightUnit === 'kg' ? 'bg-primary text-white' : 'bg-transparent text-gray-800 dark:text-gray-200'"
                  @click="setWeightUnit('kg')">{{ $t('pet.add.weightUnitKg') }}</view>
                <view class="px-3 py-1 rounded-full"
                  :class="weightUnit === 'lb' ? 'bg-primary text-white' : 'bg-transparent text-gray-800 dark:text-gray-200'"
                  @click="setWeightUnit('lb')">{{ $t('pet.add.weightUnitLb') }}</view>
              </view>
            </view>
          </view>
        </view>

        <!-- Gender Segmented Control -->
        <view class="mt-2">
          <text class="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">{{
            $t('pet.add.genderLabel') }}</text>
          <view
            class="grid grid-cols-2 w-full rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden h-12">
            <view class="flex items-center justify-center"
              :class="form.gender === 'male' ? 'bg-primary text-white' : 'bg-transparent text-gray-800 dark:text-gray-200'"
              @click="setGender('male')">{{ $t('pet.add.genderMale') }}</view>
            <view class="flex items-center justify-center"
              :class="form.gender === 'female' ? 'bg-primary text-white' : 'bg-transparent text-gray-800 dark:text-gray-200'"
              @click="setGender('female')">{{ $t('pet.add.genderFemale') }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- Bottom Action Bar -->
    <view
      class="fixed bottom-0 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-white/10">
      <button
        class="flex w-full max-w-lg mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-primary text-white text-base font-bold leading-normal shadow-lg shadow-primary/30"
        @click="save">
        <text class="truncate">{{ $t('pet.add.saveBtn') }}</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        breed: '',
        birthday: '',
        gender: 'male',
        photo: ''
      },
      weight: '',
      weightUnit: 'kg',
      user: null
    }
  },
  computed: {
    photoStyle() {
      const url = this.form.photo || "https://lh3.googleusercontent.com/aida-public/AB6AXuDHbbd4a6UBLhp0HjI-Qx73aYxZB4GbEf7qkrtQUu_mwEtTkSHmTX32FZnLbQSslLhYvb3vj1gh9CSILcmlcb1q9BTZAJAzf4_rwrKYTT6w2dUnQSYQ5xLiZmN13dVIOfz1Bnp6J2n6MOl6nG8IOGVk-2G0sXepPklazTtrn1MtnG5Pk7A12cRTksUx2GjDNUsohOViy3svBeEki0d-dJTVdo2bsMwVj14QzofV2HAmTfzGpTbx4dcXIj5dKyvftksZ2LmIxCABkxqe"
      return `background-image: url("${url}");`
    }
  },
  onLoad() {
    const user = uni.getStorageSync('user')
    if (!user) {
      uni.redirectTo({ url: '/pages/login/index' })
      return
    }
    this.user = user
  },
  methods: {
    goBack() {
      // 返回上一页或首页
      uni.navigateBack({ delta: 1 })
    },
    setGender(g) { this.form.gender = g },
    setWeightUnit(unit) {
      if (this.weightUnit === unit) return
      const v = parseFloat(this.weight)
      if (!isNaN(v)) {
        this.weight = unit === 'lb' ? (v * 2.20462).toFixed(2) : (v / 2.20462).toFixed(2)
      }
      this.weightUnit = unit
    },
    onChoosePhoto() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const path = res?.tempFilePaths?.[0]
          if (path) this.form.photo = path
        }
      })
    },
    onDateChange(e) {
      this.form.birthday = e.detail.value
    },
    save() {
      if (!this.form.name) {
        uni.showToast({ title: this.$t('pet.add.toastNameRequired'), icon: 'none' })
        return
      }
      // 体重校验与换算
      if (!this.weight) {
        uni.showToast({ title: this.$t('pet.add.toastWeightRequired'), icon: 'none' })
        return
      }
      const weightVal = parseFloat(this.weight)
      if (isNaN(weightVal) || weightVal <= 0) {
        uni.showToast({ title: this.$t('pet.add.toastWeightInvalid'), icon: 'none' })
        return
      }
      const pet = { id: Date.now(), ...this.form }
      pet.weight = weightVal
      pet.weightUnit = this.weightUnit
      pet.weightKg = parseFloat((this.weightUnit === 'kg' ? weightVal : weightVal / 2.20462).toFixed(3))
      const key = 'pets_' + this.user.id
      const pets = uni.getStorageSync(key) || []
      pets.push(pet)
      uni.setStorageSync(key, pets)
      uni.showToast({ title: this.$t('pet.add.toastSaved'), icon: 'none' })
      // 进入首页需要使用 switchTab，确保 H5 下 tabBar 正常显示
      uni.switchTab({ url: '/pages/home/index' })
    }
  }
}
</script>

<style>
/* 使用 Tailwind 风格类，无需额外样式 */
</style>