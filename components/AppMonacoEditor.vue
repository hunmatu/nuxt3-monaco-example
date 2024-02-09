<script lang="ts" setup>
import * as monaco from "monaco-editor";
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

/** コンポーネントのプロパティ */
const props = defineProps({
    modelValue: String, // v-model用
    language: { type: String, default: `json` },
});

/** 親コンポーネントに発行するイベント定義 */
const emits = defineEmits([`change`, `update:modelValue`]);

/** テンプレート参照: MonacoEditor用のDOM要素 */
const appMonacoEditorEl = ref<HTMLElement>();

/** 生成したMonacoEditorのインスタンス */
let monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

// modelValue(v-model)の監視設定
watch(
    () => props.modelValue,
    (newVal, oldVal) => {
        // エディタの初期化済みチェック
        if (!monacoEditor) {
            return;
        }

        // MonacoEditor側に反映する
        if (monacoEditor.getValue() !== newVal) {
            monacoEditor.setValue(newVal ?? ``);
        }
    }
);

// configure the JSON language support with schemas and schema associations
monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    trailingCommas: "ignore",
    schemaValidation: "error",
    validate: true,
    schemas: [
        {
            uri: "json-schema", // id of the first schema
            fileMatch: ["urn:sample-site:tag:service-dependencies.json"], // associate with our model
            schema: {
                type: "array",
                items: {
                    type: 'object', properties: {
                        namespace: {
                            "type": "string",
                            "minLength": 1,
                        },
                        serviceCode: {
                            "type": "string",
                            "minLength": 1,
                        },
                        version: {
                            "type": "string",
                            "pattern": "^((\\^([0-9]|[1-9][0-9]+)\\.([0-9]|[1-9][0-9]+)\\.([0-9]|[1-9][0-9]+))?)$",
                            "minLength": 1,
                        }
                    },
                    required: ["namespace", "serviceCode", "version"],
                    "additionalProperties": false,
                },
            },
        }
    ],
});
// var modelUri = monaco.Uri.parse("urn:sample-site:tag:service-dependencies.json"); // a made up unique URI for our model
var modelUri2 = monaco.Uri.parse("urn:dummy:sample-site:tag:service-dependencies.json"); // a made up unique URI for our model
var modelUri = monaco.Uri.parse(typeof undefined); // a made up unique URI for our model

const onClick = () => {
    // console.log(monaco.editor.getModelMarkers({resource: modelUri}));
    console.log(monaco.editor.getModelMarkers({}));
    if (!monaco.editor.getModelMarkers({ resource: modelUri }).filter((marker) => marker.code !== undefined).length)
        console.log(JSON.parse(monaco.editor.getModel(modelUri).getValue() || ""))

    console.log(monaco.editor.getModels())
}


onMounted(() => {
    
    var tempModel = monaco.editor.createModel(props.modelValue || "", "json", modelUri);
    // var tempModel2 = monaco.editor.createModel(props.modelValue || "", "json", modelUri);

    // MonacoEditorを生成する
    monacoEditor = monaco.editor.create(appMonacoEditorEl.value, {
        language: props.language,
        value: props.modelValue,
        automaticLayout: true, // 親要素のレイアウト変更に追従させる
        model: tempModel
    });

    // MonacoEditorのテキスト変更イベントを登録
    monacoEditor.onDidChangeModelContent((event) => {
        // エディタ上のテキストを取得
        const value = monacoEditor.getValue();

        // 変更イベントを発行
        if (props.modelValue !== value) {
            emits(`change`, value, event);
            emits(`update:modelValue`, value, event);
        }
    });

    // console.log(tempModel.getValue())
});
</script>

<template>
    <button @click=onClick>validate</button>
    <div ref="appMonacoEditorEl" style="width: 100%; height: 100%"></div>
</template>