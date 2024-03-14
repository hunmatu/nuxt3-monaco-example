<template>
    <h1>Case 5</h1>
    <div>AI + Low Code: suggest funtion !!!</div>
    <p>Global: x = {{ x }}, y = {{ y }}</p>
    <p>Editor: x = {{ editor_x }} , y = {{ editor_y }}</p>
    <p>User Input: {{ userInput }}</p>
    <div class="main">
        👇 UI Low Code Editor
        <div class="editor box" @mousemove.se="getMouseXYInElement(event)" @click.self="disabled = false"
            @click.right.self.prevent="getPointer()">

            <div v-if=disabled class="dialog">
                <el-input size="small" v-model="userInput" @keypress.enter.native="aiCall()">
                </el-input>
            </div>
            <div v-for="component in components">
                <div :draggable="true" :style="{ position: 'absolute', top: component.y + 'px', left: component.x + 'px'}"
                    @drag="moveComponent(component)">
                    <div v-if="component.type === 'baseTextComponent'" class="baseTextComponent">
                        {{ component.label }}: <input />
                    </div>
                </div>
            </div>
        </div>
        <!-- [Vue で右クリックメニューを出す｜Sheeprograming](https://sheeprogramming.iku4.com/Entry/374/) -->
        <!-- [「Vue.js」子要素と親要素のクリック イベントを併発しない方法！](https://hasethblog.com/it/programming/vue/5149/) -->
        <!-- [Vue+Element-UIのinputで@keyup.enter.nativeは日本語変換でも発火する - とろろこんぶろぐ](https://oisham.hatenablog.com/entry/2019/03/21/235557) -->
    </div>
    <p>AI input: {{ aiInput }}</p>
</template>

<script setup lang="ts">

// 絶対領域
import { useMouse } from './mouse'
const { x, y } = useMouse()

// エディタ領域の座標
const editor_x = ref(0)
const editor_y = ref(0)

// エディタ領域のクリック座標
const click_x = ref(0)
const click_y = ref(0)

// ダイアログの表示管理
const disabled = ref(false)

const userInput = ref('')
const aiInput = ref('')

const component_x = ref(0)
const component_y = ref(0)
const component_disabled = ref(false)

interface component {
    x: number,
    y: number,
    label: string,
    type: string
}
const components = ref(new Array<component>())

function getMouseXYInElement(event: any) {
    if (!event) { event = window.event; }
    var elmX, elmY;
    if (event.targetTouches) { // for tablet
        elmX = event.targetTouches[0].pageX - event.target.offsetLeft;
        elmY = event.targetTouches[0].pageY - event.target.offsetTop;
    } else if (document.all || 'all' in document) { // for IE.
        elmX = event.offsetX;
        elmY = event.offsetY;
    } else {
        elmX = event.layerX;
        elmY = event.layerY;
    }
    //console.log("x:" + elmX + ", y:" + elmY); // is debug. 
    editor_x.value = elmX < 0 ? 0 : elmX
    editor_y.value = elmY < 0 ? 0 : elmY
}
// [【JavaScript】 要素内におけるマウス位置の座標を取得 (iOS等、モバイルデバイスにも対応) - Web・IT うんたらら](https://vamview.hatenablog.com/entry/2013/01/30/205425)

function getPointer(){
    
    click_x.value = editor_x.value
    click_y.value = editor_y.value

    disabled.value = true
}

function aiCall () {
    aiInput.value = userInput.value
    if(aiInput.value){
        component_x.value = click_x.value
        component_y.value = click_y.value
        disabled.value = false
        component_disabled.value = true

        components.value.push({ x: click_x.value, y: click_y.value, label: userInput.value, type: 'baseTextComponent'})
    }
}
const pre_x = ref(0)
const pre_y = ref(0)
function moveComponent(component: any) {
    if(pre_x.value || pre_y.value){
        if (event.x || event.y){
            component.x += event.x - pre_x.value
            component.y += event.y - pre_y.value
        }
    }
    pre_x.value = event.x;
    pre_y.value = event.y;
}

watch(
    () => disabled.value,
    () => { userInput.value = ''}
)

</script>


<style scope>
.main {
    margin: 50px;
}
.editor {
    position: relative;
    border: solid;
    height: 500px;
    color: #2d2d2d;
    border-color: #909090;
}
.dialog {
    position: absolute; /* position は子から見る, flex は親から */
    left: v-bind(click_x + 'px');
    top: v-bind(click_y + 'px');
    width: 200px;
    height: 200px;
    z-index: 1;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px -3px rgb(187, 187, 187);
    border-radius: 5px;
    /* [【CSS】box-shadow（ドロップシャドウ）で影を下だけつける方法](https://takechi-web.com/box-shadow-under/) */
}
.el-input {
    margin: 10px;
    width: 180px;
}
/* [【Vue3.2】styleタグ内でJavaScript変数をバインドできる](https://zenn.dev/azukiazusa/articles/599baba4a32e14) */

.box {
    /* 方眼紙模様に必須のスタイル */
    background-image: linear-gradient(0deg, transparent calc(100% - 1px), #f0f0f0 calc(100% - 1px)),
        linear-gradient(90deg, transparent calc(100% - 1px), #f0f0f0 calc(100% - 1px));
    background-size: 15px 15px;
    background-repeat: repeat;
    background-position: center center;

    /* 以下任意のスタイル */
    /* padding: 20px; */
}
/* [【コピペOK】CSSで方眼紙のような模様の背景を実装する方法 | WebDev Tech](https://web-dev.tech/front-end/css/graph-paper-background/) */

.baseTextComponent {
    color: #909090;
    width: 330px;
    text-align: center;
    border: dotted;
    /* [【CSS】borderプロパティで枠線（ボーダー）をデザインする方法を解説 | ZeroPlus Media](https://zero-plus.io/media/css-border/) */
}
/* [【CSS】postisionで要素を重ねる方法](https://engineer-labo.com/css_position__relative_absolute/) */
</style>