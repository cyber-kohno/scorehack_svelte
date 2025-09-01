import useReducerRef from "../store/reducer/reducerRef";
import useReducerTerminal from "../store/reducer/reducerTerminal";
import type { StoreUtil } from "../store/store";

const useInputTerminal = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const reducerTerminal = useReducerTerminal(lastStore);
    // const { adjustTerminalScroll } = useReducerRef(lastStore);

    const control = (eventKey: string) => {

        switch (eventKey) {
            case 'Escape': {
                reducerTerminal.close();
            } break;
            case 'Enter': {
                reducerTerminal.registCommand();
                // adjustTerminalScroll();
                commit();
            } break;
            case 'Backspace': {
                reducerTerminal.removeCommand();
                commit();
            } break;
            case 'ArrowLeft': {
                reducerTerminal.moveFocus(-1);
                commit();
            } break;
            case 'ArrowRight': {
                reducerTerminal.moveFocus(1);
                commit();
            } break;
            default: {
                // 単一文字のキーのみ処理する
                if (eventKey.length === 1) {
                    reducerTerminal.insertCommand(eventKey);
                    commit();
                }
            } break;
        }
    }

    return {
        control
    }
}
export default useInputTerminal;