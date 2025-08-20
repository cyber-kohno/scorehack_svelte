import StoreMelody from "../props/storeMelody";
import type StoreOutline from "../props/storeOutline";
import type { StoreUtil } from "../store";


const useReducerOutline = (storeUtil: StoreUtil) => {

    const { lastStore, commit } = storeUtil;

    const getCurrentElement = () => {
        const elementIndex = lastStore.control.outline.focus;
        return lastStore.data.elements[elementIndex];
    };

    const getCurrentInitData = (): StoreOutline.DataInit => {
        const element = getCurrentElement();
        if (element.type !== 'init') throw new Error('element.typeはinitでなければならない。');
        return element.data;
    };
    const getCurrentSectionData = (): StoreOutline.DataSection => {
        const element = getCurrentElement();
        if (element.type !== 'section') throw new Error('element.typeはsectionでなければならない。');
        return element.data;
    };
    const getCurrentChordData = (): StoreOutline.DataChord => {
        const element = getCurrentElement();
        if (element.type !== 'chord') throw new Error('element.typeはchordでなければならない。');
        return element.data;
    };
    const getCurrentTempoData = (): StoreOutline.DataTempo => {
        const element = getCurrentElement();
        if (element.type !== 'tempo') throw new Error('element.typeはtempoでなければならない。');
        return element.data;
    };
    const getCurrentModulateData = (): StoreOutline.DataModulate => {
        const element = getCurrentElement();
        if (element.type !== 'modulate') throw new Error('element.typeはmodulateでなければならない。');
        return element.data;
    };

    const insertElement = (element: StoreOutline.Element) => {
        const elements = lastStore.data.elements;
        const focus = lastStore.control.outline.focus;
        elements.splice(focus + 1, 0, element);
    };
    const removeCurElement = () => {
        const elements = lastStore.data.elements;
        const focus = lastStore.control.outline.focus;
        elements.splice(focus, 1);
        lastStore.control.outline.focus--;
    };

    const moveFocus = (val: number) => {
        const focus = lastStore.control.outline.focus;
        const length = lastStore.data.elements.length;
        const next = focus + val;
        if (next >= 0 && next <= length - 1) lastStore.control.outline.focus = next;
    };

    const renameSectionData = (value: string) => {
        const element = getCurrentElement();
        if (element.type !== 'section') throw Error(`section要素でない。[${element.type}]`);
        const data: StoreOutline.DataSection = element.data;
        data.name = value;
    };

    const setChordData = (data: StoreOutline.DataChord) => {
        const element = getCurrentElement();
        if (element.type !== 'chord') throw Error(`chord要素でない。[${element.type}]`);
        element.data = data;
    };

    const syncChordSeqFromNote = (note: StoreMelody.Note) => {
        const cursorPos = StoreMelody.calcBeat(note.norm, note.pos);
        const chord = lastStore.cache.chordCaches.find(c => c.startBeatNote <= cursorPos && c.startBeatNote + c.lengthBeatNote > cursorPos);
        if (chord == undefined) throw new Error();
        lastStore.control.outline.focus = chord.elementSeq;
    }

    return {
        getCurrentElement,
        getCurrentSectionData,
        getCurrentChordData,
        getCurrentInitData,
        getCurrentModulateData,
        getCurrentTempoData,
        insertElement,
        removeCurElement,
        moveFocus,
        renameSectionData,
        setChordData,
        syncChordSeqFromNote,
    }
};

export default useReducerOutline;