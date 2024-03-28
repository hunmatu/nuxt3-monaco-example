<template>
    <h1>Case 5 Refact</h1>
    <div>AI + Low Code: suggest funtion !!!</div>
    <FeaturesCase5UiLowCodeEditor v-model="sampleUICs" />

    <p>Dependencies: ~/components/features/case5/*, ~/types/case5.ts, ~/pages/playgrounds/mouse.ts</p>
</template>

<script setup lang="ts">
import type { UIComponent } from '~/types/case5';

const sampleUICs = ref<UIComponent[]>([{
    x: 15,
    y: 30,
    name: 'baseTextComponent',
    props: [
        {
            key: 'label',
            value: 'label value',
            type: 'string',
            selectableValues: []
        }
    ]
}])
</script>