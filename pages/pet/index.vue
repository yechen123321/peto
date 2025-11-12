<template>
    <view>
        <view class="pet-name">
            {{ $t('pet.name') }}
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            petName: 'Peto'
        }
    }
}
</script>