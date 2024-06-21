<template>
    <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
        <p>ここに画像をドラッグ＆ドロップ</p>
        <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" multiple />
        <button @click="triggerFileInput">ファイルを選択</button>
    </div>
    <img :src="uploadUrl" width="20%" /><br>
    <a :href="uploadUrl">{{ uploadUrl }}</a>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const uploadUrl = defineModel<string>()

const fileInput = ref(null);

const handleDrop = async (event) => {
    const files = event.dataTransfer.files;
    await uploadFiles(files);
};

const handleFileChange = async (event) => {
    const files = event.target.files;
    await uploadFiles(files);
};

const triggerFileInput = () => {
    fileInput.value.click();
};

const uploadFiles = async (files) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append('image', file);
    }

    try {
        const response = await axios.post('https://api.imgbb.com/1/upload?key=1079564fc52c7f64b20bac5332cacf85', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('アップロード成功', response.data);
        uploadUrl.value = response.data.data.url
    } catch (error) {
        console.error('アップロード失敗', error);
    }
};

</script>

<style scoped>
.drop-zone {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
}
</style>

<!-- [【vue.js】ドラッグ&ドロップでファイルアップロード | アールエフェクト](https://reffect.co.jp/vue/drag-drop-file-upload) -->
<!-- [[Vue.js]ドラッグ&ドロップでファイルアップロードするプラグインをnpmに公開  |  コラム | 東京・台東区にあるリピート率90%以上の完全独立系ITシステム会社の株式会社ディスタント・ビュー](https://www.distant-view.co.jp/column/6926/) -->