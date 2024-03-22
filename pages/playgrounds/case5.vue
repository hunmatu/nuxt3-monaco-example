<template>
    <h1>Case 5</h1>
    <div>AI + Low Code: suggest funtion !!!</div>
    <p>Global: x = {{ x }}, y = {{ y }}</p>
    <p>Editor: x = {{ editor_x }} , y = {{ editor_y }}</p>
    <p>User Input: {{ userInput }}</p>
    <div class="main">
        👇 UI Low Code Editor
        <div class="editor box" @mousemove.self="getMouseXYInElement(event)" @click.self="disabled = false"
            @click.right.self.prevent="getPointer()">

            <!-- UIコンポーネント提案ダイアログ -->
            <div v-if=disabled class="dialog">
                <el-input size="small" v-model="userInput" placeholder="例）「メールアドレスを入力」を入力"
                    @keypress.enter.native="aiCall()" @input="onSuggest()" />
                <div size="small" class="suggests-alia" v-for="(suggest, index) in suggests"
                    @keydown.prevent.tab.exact="moveNext">
                    <el-dropdown size="small" placement="right-start">
                        <el-button class="suggest" size="small" @click="onGenComponent(index)">
                            {{ suggest.label }}: {{ suggest.match }}%　　<p :style="{color: '#909090'}">discription</p>
                        </el-button>
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
                    </el-dropdown>
                </div>
            </div>

            <!-- 配置済みUIコンポーネント -->
            <div v-for="component in components">
                <div class="uiComponent" :draggable="true"
                    :style="{ position: 'absolute', top: component.y + 'px', left: component.x + 'px'}"
                    @drag="moveComponent(component)">
                    <div v-if="component.name === 'baseTextComponent'" class="baseTextComponent">
                        {{ component.props[0].value }}: <input />
                    </div>
                    <div v-if="component.name === 'baseLabelComponent'" class="baseLabelComponent">
                        {{ component.props[0].value }}
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

// エディタ領域の座標;       // エディタ領域のクリック座標 // ドラッグ移動量計算のため利用
const editor_x = ref(0);    const click_x = ref(0);     const pre_x = ref(0)
const editor_y = ref(0);    const click_y = ref(0);     const pre_y = ref(0)

// ダイアログの表示管理
const disabled = ref(false)

// ユーザの入力              // AIへの入力            // 選択中のタブ
const userInput = ref('');  const aiInput = ref(''); const selectSuggest = (0)

// プリセット自動生成
interface UIComponent {
    x: number,
    y: number,
    name: string,
    props: prop[]
    // type: string | undefined
}
interface prop {
    key: string,
    value: any,
    type: string,
    selectableValues: []
}

// 提案リスト
interface UICSuggest {
    label: string,
    name: string,
    match: number,
} 

const components = ref(new Array<UIComponent>())
const suggests = ref(new Array<UICSuggest>())

function aiCall() {
    aiInput.value = userInput.value
    if (aiInput.value) {
        
        // Props object 
        const res = createPropsAi(aiInput)

        // SWへの追加
        components.value.push(res)
        disabled.value = false
    }
}

// AI の処理
function createPropsAi(input: any): UIComponent{

    const x = click_x.value
    const y = click_y.value

    const name = 'baseTextComponent'

    const props: prop[] = [
        {
            key: "label",
            value: input.value,
            type: "string",
            selectableValues: []
        },
    ]

    const outVo: UIComponent = { x, y, props, name }

    return outVo
}

function onSuggest() {

    if(userInput.value){
        if (suggests.value.length === 0){
            suggests.value.push({
                label: 'BaseTextInput',
                name: 'baseTextComponent',
                match: 75
            })
            suggests.value.push({
                label: 'BaseTextLabel',
                name: 'baseLabelComponent',
                match: 25
            })
        }
    } else {
        suggests.value = []
    }
}
function onGenComponent(index){
    const suggest = suggests.value[index]
    console.log(suggest)

    const x = click_x.value
    const y = click_y.value

    const props: prop[] = [
        {
            key: "label",
            value: userInput.value,
            type: "string",
            selectableValues: []
        },
    ]

    const outVo: UIComponent = { x, y, props, name: suggest.name }
    components.value.push(outVo)

    disabled.value = false
}

/** ★: 以下はUI的な関数のため直接AIには関係なし */
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

function moveComponent(component: UIComponent) {
    if(pre_x.value || pre_y.value){
        if (event.x || event.y){
            component.x += event.x - pre_x.value
            component.y += event.y - pre_y.value
        }
    }
    pre_x.value = event.x;
    pre_y.value = event.y;
}

function moveNext(event){
    const elements = document.getElementsByClassName('suggest')
    const index = [].findIndex.call(elements, e => e === event.target)
    elements[(index + 1) % elements.length].focus()
} 
// [Vue.js で入力フォームを↑↓キーやタブ・シフトタブでフォーカス移動する - Qiita](https://qiita.com/zaru/items/e40eaa8a48688d1928f6)
watch(
    () => disabled.value,
    () => { userInput.value = ''; suggests.value = []}
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
    width: 230px;
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

.uiComponent {
    color: #909090;
    width: auto;
    text-align: center;
    border: dotted;
    /* [【CSS】borderプロパティで枠線（ボーダー）をデザインする方法を解説 | ZeroPlus Media](https://zero-plus.io/media/css-border/) */
}

.baseTextComponent {
}
/* [【CSS】postisionで要素を重ねる方法](https://engineer-labo.com/css_position__relative_absolute/) */

.suggests-alia {
    margin: 5px 20px;
    /* font-size: 12px; */
    color: #909090;
    /* border:2px solid #909090; */
}
</style>


<!-- sonota -->
<!-- [子要素クリック時の親要素のクリックイベントの挙動 - すな.dev](https://www.sunapro.com/currenttarget/) -->
<!-- [【Vue】ドラッグで選択できるようにする方法。（結合ありのテーブルセルをドラッグで選択する） - Qiita](https://qiita.com/shizen-shin/items/88b4de6f0f7f76c66f8a) -->