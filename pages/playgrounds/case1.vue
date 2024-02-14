<template>
    <h1>case 1</h1>
    {{ textRef }}
    <div style="width: 640px; height: 480px; border: 1px solid">
        <ClientOnly>
            <LazyAppMonacoEditor language="json" v-model="textRef"></LazyAppMonacoEditor>
        </ClientOnly>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const textRef = ref(`{
    "p1": "v3",
    "p2": false,
    "a": "a"
}`);

</script>
