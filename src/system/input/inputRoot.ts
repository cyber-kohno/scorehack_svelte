import type StoreInput from "../store/props/storeInput";
import useReducerRoot from "../store/reducer/reducerRoot";
import type { StoreUtil } from "../store/store";
import store from "../store/store";
import useInputMelody from "./inputMelody";
import useInputOutline from "./inputOutline";


const useInputRoot = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;
    const reducerRoot = useReducerRoot(storeUtil);
    // const reducerTerminal = useReducerTerminal();

    const inputOutline = useInputOutline(storeUtil);
    const inputMelody = useInputMelody(storeUtil);
    // const inputTerminal = useInputTerminal();

    const control = lastStore.control;

    const controlKeyHold = (eventKey: string, isDown: boolean) => {
        const set = reducerRoot.setInputHold;
        switch (eventKey) {
            case "e": { set('holdE', isDown) } break;
            case "d": { set('holdD', isDown) } break;
            case "f": { set('holdF', isDown) } break;
            case "c": { set('holdC', isDown) } break;
            case "x": { set('holdX', isDown) } break;
            case "g": { set('holdG', isDown) } break;
            case "Shift": { set('holdShift', isDown) } break;
            case "Control": { set('holdCtrl', isDown) } break;
        }
    }

    const setHoldControl = (callbacks: StoreInput.Callbacks) => {

        Object.keys(callbacks).some(key => {
            const holdKey = key as keyof typeof lastStore.input; // キーをタイプアサーションして型を指定
            const callback = callbacks[holdKey];
            if (lastStore.input[holdKey] && callback != undefined) {
                callback();
                // 1つでも処理したらループを抜ける。
                return 1;
            }
        });
    }

    const controlKeyDown = (e: KeyboardEvent) => {
        const eventKey = e.key;

        switch (eventKey) {
            case 'r': {
                control.mode = control.mode === 'harmonize' ? 'melody' : 'harmonize';
                commit();
            } break;
        }

        const mode = control.mode;

        if (!reducerRoot.hasHold()) {
            // if (reducerTerminal.isUse()) {
            //     inputTerminal.control(eventKey);
            //     return;
            // }

            switch (eventKey) {
                case 'r': {
                    reducerRoot.switchMode();
                } break;
                case 't': {
                    // reducerTerminal.open();
                } break;
            }

            switch (mode) {
                case 'harmonize': {
                    inputOutline.control(eventKey);
                } break;
                case 'melody': {
                    inputMelody.control(eventKey);
                } break;
            }

            controlKeyHold(e.key, true);
        } else {
            setHoldControl(getHoldCallbacks(eventKey));

            switch (mode) {
                case 'harmonize': {
                    setHoldControl(inputOutline.getHoldCallbacks(eventKey));
                } break;
                case 'melody': {
                    setHoldControl(inputMelody.getHoldCallbacks(eventKey));
                } break;
            }
        }
    }

    const controlKeyUp = (e: KeyboardEvent) => {
        controlKeyHold(e.key, false);
    }

    // const getHoldCallbacks = (): StoreInput.Callbacks => {
    //     const callbacks: StoreInput.Callbacks = {};

    //     return callbacks;
    // }
    const getHoldCallbacks = (eventKey: string): StoreInput.Callbacks => {
        const callbacks: StoreInput.Callbacks = {};

        callbacks.holdE = () => {

            switch (eventKey) {
                case 'ArrowUp': {
                    console.log('E押しながら上');
                } break;
            }
        }
        return callbacks;
    }

    return {
        controlKeyDown,
        controlKeyUp
    }
}
export default useInputRoot;