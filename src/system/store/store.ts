import { get, writable, type Writable } from "svelte/store";
import StoreControl from "./props/storeControl";
import StoreData from "./props/storeData";
import StoreInput from "./props/storeInput";
import StorePreview from "./props/storePreview";
import StoreCache from "./props/storeCache";
import StoreRef from "./props/storeRef";

export type StoreProps = {

    control: StoreControl.Props;
    data: StoreData.Props;
    input: StoreInput.Props;
    preview: StorePreview.Props;
    cache: StoreCache.Props;
    env: {
        beatWidth: number;
    },
    ref: StoreRef.Props;
    fileHandle: {
        score?: FileSystemFileHandle
    },
}

const store = writable<StoreProps>({
    control: StoreControl.INITIAL,
    data: StoreData.INITIAL,
    input: StoreInput.INITIAL,
    preview: StorePreview.INITIAL,
    cache: StoreCache.INITIAL,
    env: {
        beatWidth: 120
    },
    ref: StoreRef.INITIAL,
    fileHandle: {

    }
});

export type StoreUtil = {
    lastStore: StoreProps;
    commit: () => void;
}

export const createStoreUtil = (lastStore: StoreProps): StoreUtil => {
    return {
        lastStore,
        // commit: () => store.set({ ...lastStore }),
        commit: () => store.set(lastStore),
    };
}

export default store;