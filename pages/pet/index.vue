<template>
    <view>
        <view class="pet-name">
            {{ $t('pet.name') }}
        </view>
    </view>
</template>

<script>
import { applyTabBarLocale } from '../../i18n/index.js'
export default {
    data() {
        return {
            petName: 'Peto'
        }
    },
    onShow() {
        try { uni.setNavigationBarTitle({ title: this.$t('nav.pet') }) } catch (e) {}
        try { const locale = uni.getStorageSync('locale') || (this.$i18n ? this.$i18n.locale : 'en'); applyTabBarLocale(locale) } catch (e) {}
    }
}
</script>
