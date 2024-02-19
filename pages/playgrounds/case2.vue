<template>
    <h1>Case 2</h1>
    <div>ツールチップの検証</div>
    <div>Project Status: {{ computed(() => { return closed ? 'closed' : 'open' }) }}</div>
    <div>
        <el-input placeholder="ツールチップ文字列を入力" style="width: 200px" size="small" v-model="mess"></el-input>
        <el-button size="small" @click="closed = !closed">トグル</el-button>
    </div>
    <div>
        👉
        <ShareTooltipButton :button-disabled="closed" :tooltip-message="mess" />
    </div>

    <h3>Singleton</h3>
    <div>
        <!-- <el-button @mouseover="(e) => (buttonRef = e.currentTarget)">Click to open tooltip</el-button>
        <el-button @mouseover="(e) => (buttonRef = e.currentTarget)">Click to open tooltip</el-button>
        <el-button @mouseover="(e) => (buttonRef = e.currentTarget)">Click to open tooltip</el-button> -->
        <el-button
          v-for="i in 3"
          :key="i"
          @mouseover="(e) => (buttonRef = e.currentTarget)"
          @click="visible = !visible"
          >Click to open tooltip</el-button
        >
    </div>
    <el-tooltip ref="tooltipRef" :visible="visible" :popper-options="{
        modifiers: [
            {
                name: 'computeStyles',
                options: {
                    adaptive: false,
                    enabled: false,
                },
            },
        ],
    }" :virtual-ref="buttonRef" virtual-triggering popper-class="singleton-tooltip">
        <template #content>
            <span> Some content </span>
        </template>
    </el-tooltip>
</template>

<script setup>
import { computed, ref } from 'vue';

const closed = ref(true);
const mess = ref('');

const buttonRef = ref()
const tooltipRef = ref()
const visible = ref(true)

</script>

<style scoped>
div {
    margin: 10px
}

.singleton-tooltip {
  transition: transform 13s var(--el-transition-function-fast-bezier);
}

</style>