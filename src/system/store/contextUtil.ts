import { getContext, setContext } from "svelte";
import { derived, type Readable } from "svelte/store";
import store from "./store";
import type StorePianoBacking from "./props/arrange/piano/storePianoBacking";
import type StorePianoEditor from "./props/arrange/piano/storePianoEditor";
import type StoreArrange from "./props/arrange/storeArrange";
import type { Writeable } from "zod";

namespace ContextUtil {

    // キーと型のマップを定義
    type ContextMap = {
        isPreview: boolean

        arrange: StoreArrange.EditorProps;
        pianoEditor: StorePianoEditor.Props;
        backingProps: {
            backing: StorePianoBacking.EditorProps,
            layer: StorePianoBacking.Layer,
            getColWidth: (col: StorePianoBacking.Col) => number
        }
    };

    type Keys = keyof ContextMap; // キーの型を取得

    // setContextをラップ
    export const set = <K extends Keys>(key: K, value: ContextMap[K]) => {
        // console.log(`set: [${key}]`);
        const readableValue = derived(store, () => value)
        setContext(key, readableValue);
    };

    // getContextをラップ
    export const get = <K extends Keys>(key: K): Readable<ContextMap[K]> => {
        // console.log(`get: [${key}]`);
        const value = getContext<Readable<ContextMap[K]>>(key);
        if (value == undefined) throw new Error(`key: [${key}]が取得できない。`);
        return value;
    };

    // export const build = () => {
    //     const isPreview = derived(store, (lastStore) => lastStore.preview.timerKeys != null);
    //     set('isPreview', isPreview); // 型安全に設定
    // }

    export const use = () => {
        return {
            isPreview: get('isPreview'),
            // pianoEditor: get('pianoEditor'),
            // backingProps: get('backingProps'),
            get
        }
    }
}
export default ContextUtil;