import type { StoreUtil } from "../../store/store";
import useInputGuitarEditor from "./inputGuitarEditor";
import useInputPianoEditor from "./inputPianoEditor";

const useInputArrange = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const outline = lastStore.control.outline;
    const arrange = outline.arrange;

    const inputPianoEditor = useInputPianoEditor(storeUtil);
    const inputGuitarEditor = useInputGuitarEditor(storeUtil);

    const control = (eventKey: string) => {
        if (arrange == null) throw new Error();

        switch (eventKey) {
            case 'Escape':
            case 'b': {
                outline.arrange = null;
                commit();
            } break;
        }

        switch (arrange.method) {
            case 'piano': { inputPianoEditor.control(eventKey); } break;
            case 'guitar': { inputGuitarEditor.control(eventKey); } break;
        }
    }

    return {
        control
    };
}
export default useInputArrange;