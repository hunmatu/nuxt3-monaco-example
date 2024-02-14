<template>
    <h1>Case 3</h1>
    <div>provider & injectionの検証</div>

    <div>
        👴 &lt; ワシャ （
        <el-radio-group size="small" v-model="gene.hage">
            <el-radio label="true">はげ</el-radio>
            <el-radio label="false">ふさふさ</el-radio>
        </el-radio-group>
        ）じゃぞ！
    </div>
    <div>
        <FeaturesCase3Child />
    </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';

const gene = ref<{hage: string}>({hage: "true"})
provide('gene', gene)

</script>

<style scoped>
div {
    margin: 10px;
}
</style>