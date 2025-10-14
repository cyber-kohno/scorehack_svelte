import type StoreInput from "../../../store/props/storeInput";
import type { StoreUtil } from "../../../store/store";

const useInputFinder = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const outline = lastStore.control.outline;
    const arrange = outline.arrange;


    const control = (eventKey: string) => {
        if (arrange == null) throw new Error();

        switch (eventKey) {
            case 'Escape':
            case 'b': {
                outline.arrange = null;
                commit();
                return;
            }
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