import type { StoreUtil } from "../../store/store";

const useInputGuitarEditor = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const outline = lastStore.control.outline;
    const arrange = outline.arrange;

    const control = (eventKey: string) => {
        if (arrange == null) throw new Error();
    }

    return {
        control
    };
}
export default useInputGuitarEditor;