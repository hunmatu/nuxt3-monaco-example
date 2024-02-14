<template>
    <el-tooltip :disabled="!props.buttonDisabled || !props.tooltipMessage" :content=props.tooltipMessage>
        <el-button size="small" :disabled="props.buttonDisabled">削除</el-button>
    </el-tooltip>
</template>

<script setup lang="ts">
    const props = defineProps<{
        buttonDisabled: boolean,
        tooltipMessage: string | undefined
    }>()
</script>