import type { StoreProps } from "../store";

const useReducerRoot = (lastStore: StoreProps) => {

    // const reducerMelody = useReducerMelody();

    const switchMode = () => {
        // const mode = store.control.mode;
        // if (mode === 'harmonize') reducerMelody.syncCursorFromElementSeq();
        // store.control.mode = mode === 'harmonize' ? 'melody' : 'harmonize';
    };

    type InputKey = keyof StoreProps['input'];
    const setInputHold = (key: InputKey, isDown: boolean) => {
        lastStore.input[key] = isDown;
    }

    const hasHold = () => {
        return Object.values(lastStore.input).find(flg => flg) != undefined;
    }

    return {
        switchMode,
        setInputHold,
        hasHold
    };
}

export default useReducerRoot;