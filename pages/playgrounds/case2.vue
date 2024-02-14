<template>
    <h1>Case 2</h1>
    <div>ツールチップの検証</div>
    <div>Project Status: {{ computed(() => { return closed ? 'closed' : 'open' }) }}</div>
    <div>
        <el-input placeholder="ツールチップ文字列を入力" style="width: 200px" size="small" v-model="mess"></el-input>
        <el-button size="small" @click="closed = !closed">トグル</el-button>
    </div>
    <div>
        👉 <ShareTooltipButton :button-disabled="closed" :tooltip-message="mess"/>
    </div>
    
</template>

<script setup>
import { computed, ref } from 'vue';

const closed = ref(true);
const mess = ref('');
</script>

<style scoped>
div {
    margin:10px
}
</style>