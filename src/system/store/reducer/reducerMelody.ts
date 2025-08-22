import SoundFont, { type InstrumentName } from "soundfont-player";
import StoreMelody from "../props/storeMelody";
import useReducerOutline from "./reducerOutline";
import type { StoreProps, StoreUtil } from "../store";
import useReducerRef from "./reducerRef";

const useReducerMelody = (lastStore: StoreProps) => {

    const { syncChordSeqFromNote } = useReducerOutline(lastStore);
    const { adjustGridScrollXFromNote } = useReducerRef(lastStore);

    const syncCursorFromElementSeq = () => {
        const focus = lastStore.control.outline.focus;
        const cache = lastStore.cache;
        const { lastChordSeq, chordSeq } = cache.elementCaches[focus];
        let pos = 0;
        // 先頭以降の要素
        if (lastChordSeq !== -1) {
            const chordCache = cache.chordCaches[lastChordSeq];

            pos = chordCache.startBeatNote;
            // コード要素
            if (chordSeq === -1) pos += chordCache.lengthBeatNote;
        }

        const melody = lastStore.control.melody;
        const cursor = melody.cursor;
        cursor.norm.div = 1;
        cursor.norm.tuplets = undefined;
        cursor.pos = pos;
        cursor.len = 1;
        melody.focus = -1;
    }
    const addNote = (note: StoreMelody.Note) => {
        const melody = lastStore.control.melody;
        const layer = lastStore.data.tracks[melody.trackIndex];
        if (layer.method !== 'score') throw new Error();
        const notes = (layer as StoreMelody.ScoreTrack).notes;
        notes.push(note);
        notes.sort((n1, n2) => {
            const [n1Pos, n2Pos] = [n1, n2].map(n => StoreMelody.calcBeat(n.norm, n.pos));
            return n1Pos - n2Pos;
        });
    }

    const addNoteFromCursor = () => {
        addNote(JSON.parse(JSON.stringify(lastStore.control.melody.cursor)));
    }

    const judgeOverlap = () => {
        const melody = lastStore.control.melody;
        const layer = getCurrScoreTrack();
        const notes = (layer as StoreMelody.ScoreTrack).notes;
        const overlapNote = notes.find(n => {
            return StoreMelody.judgeOverlapNotes(n, melody.cursor);
        });
        melody.isOverlap = overlapNote != undefined;
    }
    
    const getCurrScoreTrack = () => {
        const melody = lastStore.control.melody;
        const layer = lastStore.data.tracks[melody.trackIndex];
        if (layer.method !== 'score') throw new Error();
        return layer as StoreMelody.ScoreTrack;
    }

    const focusInNearNote = (dir: -1 | 1) => {
        const melody = lastStore.control.melody;
        const cursor = melody.cursor;
        const layer = getCurrScoreTrack();
        const notes = (layer as StoreMelody.ScoreTrack).notes;

        const cursorPos = StoreMelody.calcBeat(cursor.norm, cursor.pos);
        const matchIndex = (dir === -1 ? notes.slice().reverse() : notes).findIndex(n => {
            const side = StoreMelody.calcBeatSide(n);
            const [left, right] = [side.pos, side.pos + side.len];
            return dir === -1 ? cursorPos > left : cursorPos < right;
        });
        if (matchIndex !== -1) {
            melody.focus = (dir === -1 ? notes.length - 1 - matchIndex : matchIndex);
            const note = notes[melody.focus];
            syncChordSeqFromNote(note);
            adjustGridScrollXFromNote(note);
        }
    }

    const focusOutNoteSide = (note: StoreMelody.Note, dir: -1 | 1) => {
        const melody = lastStore.control.melody;
        melody.cursor = JSON.parse(JSON.stringify(note));
        const cursor = melody.cursor;
        // cursor.norm.div = note.norm.div;
        // cursor.pos = note.pos;
        cursor.len = 1;
        if (dir === 1) {
            cursor.pos += note.len;
        }
        melody.focus = -1;
        judgeOverlap();
        syncChordSeqFromNote(cursor);
        adjustGridScrollXFromNote(cursor);
    }

    const changeScoreTrack = (trackIndex: number) => {
        const melody = lastStore.control.melody;
        const tracks = lastStore.data.tracks;
        if (tracks[trackIndex] == undefined) throw new Error();
        const prevIndex = melody.trackIndex;
        const prevTrack = tracks[prevIndex];
        const nextTrack = tracks[trackIndex];
        if (nextTrack.method !== 'score') throw new Error();

        melody.trackIndex = trackIndex;
        if (prevTrack.method === 'score' && melody.focus !== -1) {
            const notes = (prevTrack as StoreMelody.ScoreTrack).notes;
            focusOutNoteSide(notes[melody.focus], -1);
        }
    }
    const setSFCurTrack = (sfName: InstrumentName) => {
        const melody = lastStore.control.melody;
        const track = lastStore.data.tracks[melody.trackIndex] as StoreMelody.ScoreTrack;
        if (track == undefined) throw new Error();
        if (track.method !== 'score') throw new Error();

        track.soundFont = sfName;

        const items = lastStore.preview.sfItems;

        const isLoadAlready = items.find(c => c.instrumentName === sfName) != undefined;
        if (!isLoadAlready) {
            items.push({ instrumentName: sfName });

            // lastStore.info = `Loading soundfont[${sfName}].`;
            SoundFont.instrument(new AudioContext(), sfName).then(player => {
                const item = items.find(sf => sf.instrumentName === sfName);
                if (item == undefined) throw new Error();
                item.player = player;
                // lastStore.info = '';
            });
        }
    }
    const loadSFPlayer = (sfName: SoundFont.InstrumentName) => {
        const items = lastStore.preview.sfItems;

        const isLoadAlready = items.find(c => c.instrumentName === sfName) != undefined;
        if (!isLoadAlready) {
            items.push({ instrumentName: sfName });

            // lastStore.info = `Loading soundfont[${sfName}].`;
            SoundFont.instrument(new AudioContext(), sfName).then(player => {
                const item = items.find(sf => sf.instrumentName === sfName);
                if (item == undefined) throw new Error();
                item.player = player;
                // lastStore.info = '';
            });
        }
    }

    return {
        syncCursorFromElementSeq,
        addNote,
        addNoteFromCursor,
        judgeOverlap,
        focusInNearNote,
        focusOutNoteSide,
        getCurrScoreTrack,
        changeScoreTrack,
        setSFCurTrack,
        loadSFPlayer
    };
};
export default useReducerMelody;