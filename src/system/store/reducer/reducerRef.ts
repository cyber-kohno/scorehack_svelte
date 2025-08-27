import Layout from "../../const/layout";
import StoreMelody from "../props/storeMelody";
import type { StoreProps, StoreUtil } from "../store";

const useReducerRef = (lastStore: StoreProps) => {

    const adjustGridScrollX = (getLeft: ((width: number) => number)) => {

        if (lastStore.ref.grid && lastStore.ref.header) {
            const gridRef = lastStore.ref.grid;
            const headerRef = lastStore.ref.header;
            const width = gridRef.getBoundingClientRect().width;

            const left = getLeft(width);
            gridRef.scrollTo({ left, behavior: "smooth" });
            headerRef.scrollTo({ left, behavior: "smooth" });
        }
    }

    const adjustGridScrollY = (getTop: ((height: number) => number)) => {
        if (lastStore.ref.grid && lastStore.ref.pitch) {
            const gridRef = lastStore.ref.grid;
            const pitchRef = lastStore.ref.pitch;
            const height = gridRef.getBoundingClientRect().height;

            const top = getTop(height);
            gridRef.scrollTo({ top, behavior: "smooth" });
            pitchRef.scrollTo({ top, behavior: "smooth" });
        }
    }

    const adjustGridScrollXFromNote = (note: StoreMelody.Note) => {
        const [pos, len] = [note.pos, note.len]
            .map(size => StoreMelody.calcBeat(note.norm, size) * lastStore.env.beatWidth);
        adjustGridScrollX((width) => pos + len / 2 - width / 2);
    }

    const adjustGridScrollYFromCursor = (note: StoreMelody.Note) => {
        const pos = (Layout.pitch.NUM - note.pitch) * Layout.pitch.ITEM_HEIGHT;
        adjustGridScrollY((height) => pos - height / 2);
    }
    const adjustGridScrollXFromOutline = () => {

        adjustGridScrollX((width) => {
            const focus = lastStore.control.outline.focus;
            const cache = lastStore.cache;
            const { lastChordSeq, chordSeq } = cache.elementCaches[focus];
            let pos = 0;
            // 先頭以降の要素
            if (lastChordSeq !== -1) {
                const chordCache = cache.chordCaches[lastChordSeq];

                // コード要素
                if (chordSeq !== -1) {
                    pos = chordCache.viewPosLeft + chordCache.viewPosWidth / 2 - width / 2;
                } else {
                    pos = chordCache.viewPosLeft + chordCache.viewPosWidth - width / 2;
                }
            }
            return pos;
        });
    }

    const adjustOutlineScroll = () => {

        const ref = lastStore.ref.outline;
        if (ref) {
            const { height: outlineHeight } = ref.getBoundingClientRect();
            const elementSeq = lastStore.control.outline.focus;
            const element = lastStore.cache.elementCaches[elementSeq];
            const elementRef = lastStore.ref.elementRefs.find(r => r.seq === elementSeq);
            if (elementRef != undefined) {
                const height = elementRef.ref.getBoundingClientRect().height;
                const top = element.outlineTop - outlineHeight / 2 + height / 2;
                ref.scrollTo({ top, behavior: "smooth" });
            }
        }
    }
    const adjustTerminalScroll = () => {
        const ref = lastStore.ref.terminal;
        if (ref) {
            const top = ref.scrollHeight;
            ref.scrollTo({ top, behavior: "smooth" });
        }
    }

    return {
        adjustGridScrollXFromOutline,
        adjustOutlineScroll,
        adjustGridScrollXFromNote,
        adjustGridScrollYFromCursor,
        adjustTerminalScroll
    };
};

export default useReducerRef;