<template>
    <h1>Case 6</h1>
    <div>Google Colab 連携</div>
    <div>
        <canvas ref="canvas" width="280" height="280" @mousedown="startDrawing" @mousemove="draw"
            @mouseup="stopDrawing"></canvas>
    </div>
    <div class="buttons">
        <el-button @click="test">保存</el-button>
        <el-button @click="clearCanvas">クリア</el-button>
    </div>
    <p>mnist:</p>
    <div>
        <canvas id="displayCanvas" width="28" height="28"></canvas>
    </div>
    {{ answer }}
</template>

<script setup lang="ts">
/** 
 * Using chatGPT-3.5 coding
 */
import { ref } from 'vue';
import axios from 'axios';

const canvas = ref<HTMLCanvasElement | null>(null);

const drawing = ref(false);
let lastX = 0;
let lastY = 0;

const aiServerUrl = 'http://127.0.0.1:3031/predict'
const answer = ref(0);

const startDrawing = (event) => {
    drawing.value = true;
    const { offsetX, offsetY } = event;
    lastX = offsetX;
    lastY = offsetY;
};

const draw = (event) => {
    if (!drawing.value || !canvas.value) return;
    const { offsetX, offsetY } = event;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = '#000'; // 描画色
    ctx.lineWidth = 25; // 線の太さ 15
    // ctx.lineJoin = 'round'; // 線のつなぎ目を丸くする
    ctx.lineCap = 'round'; // ペン先を丸くする
    ctx.stroke();
    lastX = offsetX;
    lastY = offsetY;
};

const stopDrawing = () => {
    drawing.value = false;
};

// Canvasをクリアする関数
function clearCanvas() {
    const ctx = canvas.value?.getContext('2d');
    if (ctx) {
        if (canvas.value)
            ctx.clearRect(0, 0, canvas.value?.width, canvas.value?.height);
    }

    // displayCanvas をクリア
    const displayCanvas = document.getElementById('displayCanvas');
    if (!displayCanvas) return;

    const ctx2 = displayCanvas.getContext('2d');
    if (ctx2) {
        ctx2.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    }
}

function test() {
    // Canvasから描画された絵を取得して二次元配列に変換
    const drawingData = getDrawingData(canvas.value);
    console.log(drawingData);

    // mnist size で描画
    const displayCanvas = document.getElementById('displayCanvas');
    if(!displayCanvas) return;
    const ctx = displayCanvas.getContext('2d');

    for (let i = 0; i < drawingData.length; i++) {
        for (let j = 0; j < drawingData[i].length; j++) {
            const value = drawingData[i][j];
            // アルファ値に基づいてピクセルを描画
            ctx.fillStyle = `rgba(0, 0, 0, ${value})`;
            ctx.fillRect(j, i, 1, 1); // (x, y, width, height)
        }
    }
    // google colab にリクエスト
    sendData(drawingData)
}

function sendData(drawingData) {
    // 2次元配列をJSON形式に変換
    const jsonData = JSON.stringify(drawingData);

    // APIサーバにPOSTリクエストを送信
    axios.post(aiServerUrl, jsonData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        answer.value = response.data
        // レスポンスの処理を行う
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
}

// Canvasから描画された絵を28x28の二次元配列に変換する関数
function getDrawingData(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return [[]];
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(imageData)
    
    const data = imageData.data;
    const gridSize = 28;
    const gridStep = canvas.width / gridSize;
    const result: number[][] = [];

    // for (let i = 0; i < gridSize; i++) {
    //     const row: number[] = [];
    //     for (let j = 0; j < gridSize; j++) {
    //         let sum = 0;
    //         for (let k = 0; k < gridStep; k++) {
    //             for (let l = 0; l < gridStep; l++) {
    //                 const index = ((i * gridStep + k) * canvas.width + (j * gridStep + l)) * 4;
    //                 const grayValue = (data[index] + data[index + 1] + data[index + 2]) / 3;
    //                 sum += grayValue;
    //             }
    //         }
    //         const avgGrayValue = sum / (gridStep * gridStep);
    //         row.push(avgGrayValue / 255); // 正規化して0から1の範囲に変換
    //     }
    //     result.push(row);
    // }

    for (let i = 0; i < gridSize; i++) {
        const row: number[] = [];
        for (let j = 0; j < gridSize; j++) {
            let sum = 0;
            for (let k = 0; k < gridStep; k++) {
                for (let l = 0; l < gridStep; l++) {
                    const index = ((i * gridStep + k) * canvas.width + (j * gridStep + l)) * 4;
                    // アルファチャンネルの値を取得
                    const alphaValue = data[index + 3];
                    sum += alphaValue; // アルファチャンネルの値を加算
                }
            }
            const avgAlphaValue = sum / (gridStep * gridStep);
            row.push(avgAlphaValue / 255); // 正規化して0から1の範囲に変換
        }
        result.push(row);
    }
    return result;
}
</script>

<style scoped>
canvas {
    border: 1px solid #000;
    /* キャンバスの境界線 */
}
</style>
