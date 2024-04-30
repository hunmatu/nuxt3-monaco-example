<template>
    <div>
        <FeaturesCase5UiLowCodeEditor v-model="sampleUICs" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UIComponent } from '~/types/type';

definePageMeta({
    layout: "case5",
});

const sampleUICs = ref<UIComponent[]>([])

</script>

<style scoped>
.flex {
    display: flex;
    justify-content: space-around
}
</style>