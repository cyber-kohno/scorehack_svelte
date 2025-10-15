import type StoreInput from "../../../store/props/storeInput";
import useReducerArrange from "../../../store/reducer/reducerArrange";
import type { StoreUtil } from "../../../store/store";

const useInputFinder = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const outline = lastStore.control.outline;
    const arrange = outline.arrange;

    const arrangeReducer = useReducerArrange(lastStore);


    const control = (eventKey: string) => {
        const finder = arrangeReducer.getPianoFinder();

        switch (eventKey) {
            case 'Escape':
            case 'b': {
                outline.arrange = null;
                commit();
                return;
            }
            case 'ArrowUp': {
                finder.cursorBacking --;
                commit();
                console.log(finder.cursorBacking);
            } break;
            case 'ArrowDown': {
                finder.cursorBacking ++;
                commit();
                console.log(finder.cursorBacking);
            } break;
        }
    }

    const getHoldCallbacks = (eventKey: string): StoreInput.Callbacks => {
        if (arrange == null) throw new Error();

        const callbacks: StoreInput.Callbacks = {};

        return callbacks;
    }

    return {
        control,
        getHoldCallbacks
    };
}
export default useInputFinder;