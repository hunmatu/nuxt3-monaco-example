<template>
    <!-- UIコンポーネント提案ダイアログ -->
    <div v-if=disabled class="dialog">
        <el-input size="small" v-model="userInput" placeholder="例）「メールアドレスを入力」を入力" @input="onSuggest" />
        <!-- @keypress.enter.native="aiCall()"  -->
        <div size="small" class="suggests-alia" v-for="(suggest, index) in suggests"
            @keydown.prevent.tab.exact="moveNext">
            <el-button class="suggest" size="small" @click="onGenComponent(index)">
                <div :style="{ color: '#909090', left: '30px', position: 'absolute' }">{{ suggest.uiType }}
                </div>
                <div :style="{ left: '120px', position: 'absolute' }">{{ suggest.label }}</div>
                <div :style="{ right: '30px', position: 'absolute' }">マッチ度:{{ suggest.match }}%</div>
            </el-button>
            <!-- <el-dropdown size="small" placement="right-start">
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>デフォルトで配置</el-dropdown-item>
                        <el-dropdown-item>自動プリセット　<div :style="{ color: '#909090' }">AI で設定</div>
                        </el-dropdown-item>
                        <el-dropdown-item>プリセット１　<div :style="{ color: '#909090' }">TDBメアド用</div>
                        </el-dropdown-item>
                        <el-dropdown-item>プリセット２　<div :style="{ color: '#909090' }">TDB住所用</div>
                        </el-dropdown-item>
                        <el-dropdown-item>プリセット３　<div :style="{ color: '#909090' }">郵便番号用</div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown> -->
        </div>
        <!-- [Vue+Element-UIのinputで@keyup.enter.nativeは日本語変換でも発火する - とろろこんぶろぐ](https://oisham.hatenablog.com/entry/2019/03/21/235557) -->
    </div>
    <!-- [Vue で右クリックメニューを出す｜Sheeprograming](https://sheeprogramming.iku4.com/Entry/374/) -->
</template>

<script setup lang="ts">
import type { UICProp, UICSuggest, UIComponent } from '~/types/case5';

const props = defineProps<{
    disabled: boolean,
    position_x: number,
    position_y: number
}>();
const emits = defineEmits(['genComponent'])


// ユーザの入力
const userInput = ref('');

const suggests = ref(new Array<UICSuggest>())

function onSuggest() {
    if (userInput.value) {
        if (suggests.value.length === 0) {
            suggests.value.push({
                label: 'BaseTextInput',
                name: 'baseTextComponent',
                match: 75,
                uiType: '(Base)'
            })
            suggests.value.push({
                label: 'BaseTextLabel',
                name: 'baseLabelComponent',
                match: 25,
                uiType: '(Base)'
            })
        }
    } else {
        suggests.value = []
    }
}

function onGenComponent(index: number) {
    const suggest = suggests.value[index]

    const x = props.position_x;
    const y = props.position_y;

    const uicProps: UICProp[] = [
        {
            key: "label",
            value: userInput.value,
            type: "string",
            selectableValues: []
        },
    ]

    const outVo: UIComponent = { x, y, props: uicProps, name: suggest.name }
    emits('genComponent', outVo);
}

watch(
    () => props.disabled,
    () => { userInput.value = ''; suggests.value = [] }
)

function moveNext(event: KeyboardEvent) {
    const elements = document.getElementsByClassName('suggest')
    const index = [].findIndex.call(elements, e => e === event.target)
    // @ts-ignore
    elements[(index + 1) % elements.length].focus()
} 
// [Vue.js で入力フォームを↑↓キーやタブ・シフトタブでフォーカス移動する - Qiita](https://qiita.com/zaru/items/e40eaa8a48688d1928f6)
</script>

<style scoped>
.dialog {
    position: absolute;
    /* position は子から見る, flex は親から */
    left: v-bind(position_x + 'px');
    top: v-bind(position_y + 'px');
    width: auto;
    height: auto;
    z-index: 1;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px -3px rgb(187, 187, 187);
    border-radius: 5px;
    /* [【CSS】box-shadow（ドロップシャドウ）で影を下だけつける方法](https://takechi-web.com/box-shadow-under/) */
}

/* [【Vue3.2】styleタグ内でJavaScript変数をバインドできる](https://zenn.dev/azukiazusa/articles/599baba4a32e14) */
.el-input {
    margin: 10px;
    width: 320px;
}

.suggests-alia {
    margin: 5px 20px;
    /* font-size: 12px; */
    color: #909090;
    /* border:2px solid #909090; */
}

.suggest {
    width: 100%;
}
</style>