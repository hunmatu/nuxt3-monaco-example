<template>
    <div>
        👶 &lt; 僕はハゲ「{{ computed(()=>{ return gene.hage === 'true' ? 'る' : 'ない' }).value }}」ばぶぅ！
    </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'

const gene = inject('gene')
</script>