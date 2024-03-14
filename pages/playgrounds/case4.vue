<template>
    <h1>Case 4</h1>
    <div>composable 検証</div>
    Mouse position is at: {{ x }}, {{ y }}
    <p>※ ref オブジェクトを公開するイメージ.</p>

    <div>
        {{ hh }} : {{ mm }} : {{ ss }}
    </div>

    <h3>composable を用いた inject</h3>
    <div>
        <FeaturesCase4Child></FeaturesCase4Child>
        <el-button size="small"  @click="changeState">トリガ</el-button>
    </div>
</template>

<script setup lang="ts">
import { useMouse } from './mouse'
const { x, y } = useMouse()

import { useClock } from './clock'
const { hh, mm, ss, useStartClock } = useClock()
useStartClock()

import useProvideInject from '~/composables/use-provide-inject'
const { provideState, changeState } = useProvideInject()
provideState()

</script>

<style scoped>
div {
    display:flex
}
.el-button {
    margin-left: 10px;
}
</style>