import useReducerTerminal from "../store/reducer/reducerTerminal";
import type { StoreUtil } from "../store/store";

const useInputTerminal = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const reducerTerminal = useReducerTerminal(lastStore);

    const control = (eventKey: string) => {

        switch (eventKey) {
            case 'Escape': {
                reducerTerminal.close();
            } break;
            case 'Enter': {
                // reducerTerminal.registCommand();
            } break;
            case 'Backspace': {
                // reducerTerminal.removeCommand();
            } break;
            case 'ArrowLeft': {
                // reducerTerminal.moveFocus(-1);
            } break;
            case 'ArrowRight': {
                // reducerTerminal.moveFocus(1);
            } break;
            default: {
                // 単一文字のキーのみ処理する
                if (eventKey.length === 1) {
                    // reducerTerminal.insertCommand(eventKey);
                }
            } break;
        }
    }
    
    return {
        control
    }
}
export default useInputTerminal;