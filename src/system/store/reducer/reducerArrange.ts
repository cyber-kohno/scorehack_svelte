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
        if (arrange.method !== 'piano' || arrange.editor == undefined) throw new Error();
        return arrange.editor as StorePianoEditor.Props
    }
    const getPianoFinder = () => {
        const arrange = getArrange();
        if (arrange.method !== 'piano' || arrange.finder == undefined) throw new Error();
        return arrange.finder as ArrangeLibrary.PianoArrangeFinder;
    }
    const getCurTrack = () => {
        const track = lastStore.data.arrange.tracks[lastStore.control.outline.trackIndex];
        if (track == undefined) throw new Error();
        return track;
    }

    const getPianoLib = () => {
        const track = getCurTrack();
        if (track.method === 'piano' && track.pianoLib != undefined) {
            return track.pianoLib as StorePianoEditor.Lib;
        }
        throw new Error();
    }

    return {
        getArrange,
        getPianoEditor,
        getPianoFinder,
        getCurTrack,
        getPianoLib
    }
}
export default useReducerArrange;