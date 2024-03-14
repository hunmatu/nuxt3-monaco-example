// 検証用コンポーザブル: provide/inject のラップ

const useProvideInject = () => {

    const status = ref('🔈');
    const provideState = () => {
        provide('key', status);
    }
    const provideInjectState = () => {
        return inject('key');
    }
    const changeState = () => {
        status.value = status.value === '🔈' ? '🔊' : '🔈'
    }

    return { provideState, provideInjectState, changeState }
}

export default useProvideInject;