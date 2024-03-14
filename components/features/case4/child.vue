<template>
    <div>
        子コンポーネント: {{ injectValue }}
    </div>
</template>

<script setup>
import useProvideInject from '~/composables/use-provide-inject'
const { provideInjectState } = useProvideInject()

const injectValue = provideInjectState()
console.log(injectValue) // 型確認

</script>

<style scoped>
</style>