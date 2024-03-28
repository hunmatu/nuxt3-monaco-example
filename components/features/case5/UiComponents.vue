<template>
    <!-- 配置済みUIコンポーネントのデザイン -->
    <div v-for="component in props.components">
        <div class="uiComponent" :draggable="true"
            :style="{ position: 'absolute', top: component.y + 'px', left: component.x + 'px' }"
            @drag="$emit('dragComponent', component)">
            <div v-if="component.name === 'baseTextComponent'" class="baseTextComponent">
                {{ component.props[0].value }}: <el-input placeholder="メールアドレスを入力" size="small" />
            </div>
            <div v-if="component.name === 'customTextComponent'" class="baseTextComponent">
                {{ component.props[0].value }}: <el-input placeholder="携帯のメールアドレスを入力" size="small" />
            </div>
            <div v-if="component.name === 'baseLabelComponent'" class="baseLabelComponent">
                {{ component.props[0].value }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type UIComponent } from '~/types/case5'

const props = defineProps<{
    components: UIComponent[]
}>()

</script>

<style scoped>
.el-input {
    margin: 10px;
    width: 320px;
}

.uiComponent {
    color: #909090;
    width: auto;
    text-align: center;
    border: dotted;
    /* [【CSS】borderプロパティで枠線（ボーダー）をデザインする方法を解説 | ZeroPlus Media](https://zero-plus.io/media/css-border/) */
}

</style>