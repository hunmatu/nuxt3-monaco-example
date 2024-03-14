import { ref } from 'vue'

export const useClock = () => {

    // 時計の各項目
    const hh = ref('00')
    const mm = ref('00')
    const ss = ref('00')

    // タイマー
    const sleep = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 時間を取得後, 1s 待つの無限ループ
    const clock = async () => {
        while(true){
            const now = new Date()
            hh.value = now.getHours().toString()
            mm.value = now.getMinutes().toString()
            ss.value = now.getSeconds().toString()    
            await sleep(1000)
        }
    }

    const useStartClock = async () => {
        clock()
    }

    return { hh, mm, ss, useStartClock }
}