<template>
    <h1>Case 8</h1>
    <div>Abstract: open ai api. Assistants Overview</div>

    <el-button @click="createAssistant()">Create Assistant</el-button>
    <el-button :disabled="assistant === undefined" @click="createThreads()">Create Thread</el-button>
    <el-button @click="fileInput.click();">FileUpload</el-button>
    <input type="file" ref="fileInput" style="display: none" @change="uploadFile" multiple />
    <FeaturesCase7ImageUpload v-model="url" />
    <br>
    <br>
    <div v-if="file_url">
        <img :src="file_url" width="20%" />
    </div>

    <br>
    {{ result }}

</template>

<script setup lang="ts">
// import FeaturesCase7ImageUpload from '~/components/features/case7/ImageUpload.vue';

/** OpenAi Assistant Overview */
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

const assistant = ref(); const thread = ref(); const files = ref([]); const file_id = ref(); const file_url = ref();
const result = ref(''); const url = ref(); const fileInput = ref(null);

async function createAssistant() {
    assistant.value = await openai.beta.assistants.create({
        name: "Nakayama-Sample",
        instructions: "I am champion.",
        // tools: [{ type: "code_interpreter" }],
        model: "gpt-4o"
    });
    console.log(assistant.value)
}

async function createThreads() {
    thread.value = await openai.beta.threads.create(
        // {
        //     messages: [
        //         {
        //             "role": "user",
        //             "content": [
        //                 {
        //                     "type": "text",
        //                     "text": "この画像は何？"
        //                 },
        //                 {
        //                     "type": "image_url",
        //                     "image_url": { "url": `${url.value}` }
        //                 },
        //             ]
        //         }
        //     ]
        // }
    );
    console.log(thread.value)

    // messageのみ作成
    const message = await openai.beta.threads.messages.create(
        thread.value.id,
        {
            role: "user",
            content: [
                {
                    "type": "text",
                    "text": "この画像は何？"
                },
                {
                    "type": "image_url",
                    "image_url": { "url": `${url.value}` }
                },
            ]
        },
    );
    console.log(message)
    const run = openai.beta.threads.runs.stream(thread.value.id, {
        assistant_id: assistant.value.id
    })
    .on('textDelta', (textDelta, snapshot) => result.value += textDelta.value)
}

// [AssistantAPI Overview: First Step](https://platform.openai.com/docs/assistants/overview?context=with-streaming)
// [How Assistant Work: File Request](https://platform.openai.com/docs/assistants/how-it-works?lang=node.js)
import axios from 'axios'
async function uploadFile(event){
    // File operation
    files.value = event.target.files;
    const reader = new FileReader();
    reader.onload = (e) => {
        file_url.value = e.target.result;
    };
    reader.readAsDataURL(files.value[0]);

    // Form data
    const formData = new FormData();
    formData.append('file', files.value[0]);
    formData.append('purpose', 'vision')
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/files',
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                }
            }
        );
        console.log('アップロード成功', response.data.id);
        file_id.value = response.data.id;
    } catch (error) {
        console.error('アップロード失敗', error);
    }
    // file = await openai.files.create({
    //     file: files[0].name,
    //     file: fs.createReadStream("mydata.jsonl"),
    //     purpose: "vision",
    // });
    thread.value = await openai.beta.threads.create();
    // messageのみ作成
    const message = await openai.beta.threads.messages.create(
        thread.value.id,
        {
            role: "user",
            content: [
                {
                    "type": "text",
                    "text": "この画像は何？"
                },
                {
                    "type": "image_file",
                    "image_file": { "file_id": file_id.value }
                },
            ]
        },
    );
    console.log(message)
    const run = openai.beta.threads.runs.stream(thread.value.id, {
        assistant_id: assistant.value.id
    }).on('textDelta', (textDelta, snapshot) => result.value += textDelta.value)
}
// fs.createReadStream("mydata.jsonl"),

</script>
