import ArrangeLibrary from "../props/arrange/arrangeLibrary";
import StorePianoEditor from "../props/arrange/piano/storePianoEditor";
import type { StoreProps } from "../store";

const useReducerArrange = (lastStore: StoreProps) => {

    const getArrange = () => {
        const arrange = lastStore.control.outline.arrange;
        if (arrange == null) throw new Error();
        return arrange;
    }
    const getPianoEditor = () => {
        const arrange = getArrange();
        if (arrange.method !== 'piano') throw new Error();
        return arrange.editor as StorePianoEditor.Props
    }
    const getCurTrack = () => {
        const track = lastStore.data.arrange.tracks[lastStore.control.outline.trackIndex];
        if (track == undefined) throw new Error();
        return track;
    }

    return {
        getArrange,
        getPianoEditor,
        getCurTrack
    }
}
export default useReducerArrange;