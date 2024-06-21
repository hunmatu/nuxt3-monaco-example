<template>
    <div class="dropzone" @dragover.prevent @dragenter.prevent @dragleave="handleDragLeave" @drop="handleDrop"
        :class="{ 'is-dragover': isDragover }">
        <p v-if="!isDragover">ここにファイルをドラッグ＆ドロップ</p>
        <p v-else>ファイルをここにドロップしてください</p>
        <input type="file" @change="onFileChange" ref="fileInput" hidden />
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDragover: false,
        }
    },
    methods: {
        handleDragEnter() {
            this.isDragover = true;
        },
        handleDragLeave() {
            this.isDragover = false;
        },
        handleDrop(event) {
            this.isDragover = false;
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                this.$emit('file-dropped', files[0]);
            }
        },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.$emit('file-dropped', file);
            }
        },
    }
}
</script>

<style scoped>
.dropzone {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
}

.dropzone.is-dragover {
    border-color: #000;
    background-color: #f0f0f0;
}
</style>
