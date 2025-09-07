import { getContext, setContext } from "svelte";
import { derived, type Readable } from "svelte/store";
import store from "./store";

namespace ContextUtil {

    // キーと型のマップを定義
    type ContextMap = {
        isPreview: Readable<boolean>;
        // 他にも今後追加する場合はここに定義
    };

    type Keys = keyof ContextMap; // キーの型を取得

    // setContextをラップ
    const set = <K extends Keys>(key: K, value: ContextMap[K]) => {
        setContext(key, value);
    };

    // getContextをラップ
    const get = <K extends Keys>(key: K): ContextMap[K] => {
        return getContext<ContextMap[K]>(key);
    };

    export const build = () => {
        const isPreview = derived(store, (lastStore) => lastStore.preview.timerKeys != null);
        set('isPreview', isPreview); // 型安全に設定
    }

    export const use = () => {
        return {
            isPreview: get('isPreview') // 型安全に取得
        }
    }
}
export default ContextUtil;