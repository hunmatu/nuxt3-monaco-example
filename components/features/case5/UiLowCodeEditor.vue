<template>
    <div class="main">
        👇 UI Low Code Editor
        <div class="editor box" @mousemove.self="getMouseXYInElement(event)" @click.self="onLeftClick"
            @click.right.self.prevent="onRightClick">
            <FeaturesCase5AdvisorDialog :disabled="advisorDisabled" :position_x="click_x" :position_y="click_y" @genComponent="onGenComponent"/>
            <FeaturesCase5UiComponents :components="components" @dragComponent="onDragComponent" />
        </div>
        <!-- [Vue で右クリックメニューを出す｜Sheeprograming](https://sheeprogramming.iku4.com/Entry/374/) -->
        <!-- [「Vue.js」子要素と親要素のクリック イベントを併発しない方法！](https://hasethblog.com/it/programming/vue/5149/) -->
    </div>
    <p>Global: x = {{ x }}, y = {{ y }}</p>
    <p>Editor: x = {{ editor_x }} , y = {{ editor_y }}</p>

</template>

<script setup lang="ts">
import { useMouse } from '~/pages/playgrounds/mouse';
import type { UIComponent } from '~/types/case5';

// コンポーネントの管理
const components = defineModel<Array<UIComponent>>({ default: [] })

// 絶対領域
const { x, y } = useMouse()

// エディタ領域の座標;       // エディタ領域のクリック座標 // ドラッグ移動量計算のため利用
const editor_x = ref(0);    const click_x = ref(0);     const pre_x = ref(0)
const editor_y = ref(0);    const click_y = ref(0);     const pre_y = ref(0)

// ダイアログの表示管理
const advisorDisabled = ref(false)

/** Editor の UI に関連する関数 */
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

function getPointer() {
    click_x.value = editor_x.value
    click_y.value = editor_y.value
}

function onLeftClick() {
    advisorDisabled.value = false
}

function onRightClick() {
    getPointer();
    advisorDisabled.value = true
}

function onDragComponent(component: UIComponent) {
    if (pre_x.value || pre_y.value) {
        if (event.x || event.y) {
            component.x += event.x - pre_x.value
            component.y += event.y - pre_y.value
        }
    }
    pre_x.value = event.x;
    pre_y.value = event.y;
}

function onGenComponent(component: UIComponent) {
    components.value.push(component)
    advisorDisabled.value = false
}

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
</style>