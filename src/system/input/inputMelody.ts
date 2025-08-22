import Layout from "../const/layout";
import type StoreInput from "../store/props/storeInput";
import StoreMelody from "../store/props/storeMelody";
import StorePreview from "../store/props/storePreview";
import useReducerCache from "../store/reducer/reducerCache";
import useReducerMelody from "../store/reducer/reducerMelody";
import useReducerOutline from "../store/reducer/reducerOutline";
import useReducerRef from "../store/reducer/reducerRef";
import type { StoreUtil } from "../store/store";
import MusicTheory from "../util/musicTheory";

const useInputMelody = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const { adjustGridScrollYFromCursor, adjustGridScrollXFromNote, adjustOutlineScroll } = useReducerRef(lastStore);
    const reducerOutline = useReducerOutline(lastStore);
    const reducerCache = useReducerCache(lastStore);
    const reducerMelody = useReducerMelody(lastStore);
    // const { isPreview } = useAccessorPreview(lastStore);

    const melody = lastStore.control.melody;
    const playSF = (pitchIndex: number) => {
        const track = lastStore.data.tracks[melody.trackIndex] as StoreMelody.ScoreTrack;
        if (track.soundFont === '') return;
        const sfName = StorePreview.validateSFName(track.soundFont);
        const sf = lastStore.preview.sfItems.find(item => item.instrumentName === sfName);
        if (sf == undefined || sf.player == undefined) return;
        sf.player.stop();
        const soundName = MusicTheory.getKey12FullName(pitchIndex);
        sf.player.play(soundName, 0, { gain: 5, duration: 0.5 });
    }

    const isCursor = () => melody.focus === -1;
    const getFocusNote = () => {
        const notes = reducerMelody.getCurrScoreTrack().notes;
        return notes[melody.focus];
    }

    const movePitch = (note: StoreMelody.Note, dir: number) => {
        const max = Layout.pitch.NUM - 1;
        let temp = note.pitch + dir;
        if (temp < 0) temp = 0;
        if (temp > max) temp = max;
        note.pitch = temp;
        playSF(note.pitch);
        adjustGridScrollYFromCursor(note);
        commit();
    }

    const control = (eventKey: string) => {
        const cursor = melody.cursor;
        const notes = reducerMelody.getCurrScoreTrack().notes;
        // const getFocusNote = () => notes[melody.focus];

        const changeCursorDiv = (div: number) => {
            const prev = cursor.norm.div;
            const rate = div / prev;
            cursor.norm.div = div;
            cursor.norm.tuplets = undefined;
            cursor.pos = Math.floor(cursor.pos * rate);

            reducerMelody.judgeOverlap();
            commit();
        }

        // if (isPreview()) {

        //     switch (eventKey) {
        //         case ' ': PreviewUtil.stopTest();
        //     }

        //     return;
        // }

        // switch (eventKey) {
        //     case ' ': PreviewUtil.startTest({ target: 'all' });
        // }

        if (isCursor()) {
            const moveCursor = (dir: -1 | 1) => {
                const temp = cursor.pos + dir;
                const [tempPos, tempLen] = [temp, cursor.len].map(size => StoreMelody.calcBeat(cursor.norm, size));
                const tailBeatNote = reducerCache.getBeatNoteTail();
                if (tempPos < 0 || tempPos + tempLen > tailBeatNote) return;
                cursor.pos = temp;
                adjustGridScrollXFromNote(cursor);
                reducerOutline.syncChordSeqFromNote(cursor);
                adjustOutlineScroll();
                reducerMelody.judgeOverlap();
                commit();
            }
            switch (eventKey) {
                case 'ArrowLeft': moveCursor(-1); break;
                case 'ArrowRight': moveCursor(1); break;
                case '1': { changeCursorDiv(4); } break;
                case '2': { changeCursorDiv(2); } break;
                case '3': { changeCursorDiv(1); } break;
                case 'ArrowUp': movePitch(cursor, 1); break;
                case 'ArrowDown': movePitch(cursor, -1); break;

                case 'a': {
                    if (!melody.isOverlap) {
                        reducerMelody.addNoteFromCursor();
                        // reducerMelody.judgeOverlap();
                        reducerMelody.focusInNearNote(1);
                        commit();
                    }
                } break;
            }
        } else {
            const moveFocus = (dir: -1 | 1) => {
                const temp = melody.focus + dir;
                if (temp < 0 || temp > notes.length - 1) return;
                melody.focus = temp;
                const note = getFocusNote();
                reducerOutline.syncChordSeqFromNote(note);
                adjustGridScrollXFromNote(note);
                commit();
            }
            const changeFocusNoteDiv = (div: number) => {
                const note = getFocusNote();
                const prev = note.norm.div;
                const rate = div / prev;
                const tempPos = note.pos * rate;
                const tempLen = note.len * rate;
                if (!Number.isInteger(tempPos) || !Number.isInteger(tempLen)) return;
                note.norm.div = div;
                note.pos = tempPos;
                note.len = tempLen;
                commit();
            }
            switch (eventKey) {
                case 'ArrowLeft': moveFocus(-1); break;
                case 'ArrowRight': moveFocus(1); break;
                case 'ArrowUp': movePitch(getFocusNote(), 1); break;
                case 'ArrowDown': movePitch(getFocusNote(), -1); break;
                case 'Delete': {
                    const focus = melody.focus;
                    reducerMelody.focusOutNoteSide(getFocusNote(), -1);
                    notes.splice(focus, 1);
                    melody.isOverlap = false;
                    commit();
                } break;
                case 'a': {
                    const tempNote: StoreMelody.Note = JSON.parse(JSON.stringify(getFocusNote()));
                    tempNote.pos += tempNote.len;
                    tempNote.len = 1;
                    if (!notes.find(n => StoreMelody.judgeOverlapNotes(n, tempNote))) {
                        reducerMelody.addNote(tempNote);
                        melody.focus++;

                        const note = getFocusNote();
                        reducerOutline.syncChordSeqFromNote(note);
                        adjustGridScrollXFromNote(note);
                        commit();
                    }
                } break;
                case '1': { changeFocusNoteDiv(4); } break;
                case '2': { changeFocusNoteDiv(2); } break;
                case '3': { changeFocusNoteDiv(1); } break;
            }
        }
    }

    const getHoldCallbacks = (eventKey: string): StoreInput.Callbacks => {
        const callbacks: StoreInput.Callbacks = {};
        const cursor = melody.cursor;

        // プレビュー中は処理しない。
        // if (isPreview()) return callbacks;

        callbacks.holdX = () => {

            if (isCursor()) {
                switch (eventKey) {
                    case 'ArrowUp': movePitch(cursor, 12); break;
                    case 'ArrowDown': movePitch(cursor, -12); break;
                }
            } else {
                switch (eventKey) {
                    case 'ArrowUp': movePitch(getFocusNote(), 12); break;
                    case 'ArrowDown': movePitch(getFocusNote(), -12); break;
                }
            }
        }
        callbacks.holdE = () => {

            const focusInNearNote = (dir: -1 | 1) => {
                reducerMelody.focusInNearNote(dir);
                commit();
            }
            const focusOutNoteSide = (dir: -1 | 1) => {
                reducerMelody.focusOutNoteSide(getFocusNote(), dir);
                commit();
            }

            if (isCursor()) {
                switch (eventKey) {
                    case 'ArrowLeft': focusInNearNote(-1); break;
                    case 'ArrowRight': focusInNearNote(1); break;
                }
            } else {
                switch (eventKey) {
                    case 'ArrowLeft': focusOutNoteSide(-1); break;
                    case 'ArrowRight': focusOutNoteSide(1); break;
                }
            }
        }
        callbacks.holdF = () => {

            if (!isCursor()) {
                const notes = reducerMelody.getCurrScoreTrack().notes;

                const scaleNote = (note: StoreMelody.Note, dir: -1 | 1) => {
                    const temp: StoreMelody.Note = JSON.parse(JSON.stringify(note));
                    temp.len += dir;
                    if (temp.len === 0) return;
                    const vNotes = notes.slice();
                    vNotes.splice(melody.focus, 1);
                    const matchNode = vNotes.find(n => StoreMelody.judgeOverlapNotes(n, temp));
                    if (matchNode != undefined) return;
                    note.len = temp.len;
                    adjustGridScrollXFromNote(note);
                    commit();
                }
                switch (eventKey) {
                    case 'ArrowLeft': scaleNote(getFocusNote(), -1); break;
                    case 'ArrowRight': scaleNote(getFocusNote(), 1); break;
                }
            }
        }
        callbacks.holdD = () => {

            if (!isCursor()) {
                const notes = reducerMelody.getCurrScoreTrack().notes;

                const moveNote = (note: StoreMelody.Note, dir: -1 | 1) => {
                    const temp: StoreMelody.Note = JSON.parse(JSON.stringify(note));
                    temp.pos += dir;
                    const vNotes = notes.slice();
                    vNotes.splice(melody.focus, 1);
                    const matchNode = vNotes.find(n => StoreMelody.judgeOverlapNotes(n, temp));
                    if (matchNode != undefined) return;
                    note.pos = temp.pos;
                    reducerOutline.syncChordSeqFromNote(note);
                    adjustGridScrollXFromNote(note);
                    commit();
                }
                switch (eventKey) {
                    case 'ArrowLeft': moveNote(getFocusNote(), -1); break;
                    case 'ArrowRight': moveNote(getFocusNote(), 1); break;
                }
            }
        }
        callbacks.holdC = () => {
            const { getCurBase } = reducerCache;
            const tonality = getCurBase().scoreBase.tonality;

            const movePitchLockScale = (note: StoreMelody.Note, dir: number) => {
                const max = Layout.pitch.NUM - 1;
                let temp = note.pitch;
                while (true) {
                    temp += dir;
                    const isScale = MusicTheory.isScale(temp, tonality);
                    if (isScale) break;
                }
                // console.log(temp);
                if (temp < 0) temp = 0;
                if (temp > max) temp = max;
                note.pitch = temp;
                playSF(note.pitch);
                adjustGridScrollYFromCursor(note);
                commit();
            }
            if (isCursor()) {
                switch (eventKey) {
                    case 'ArrowUp': movePitchLockScale(cursor, 1); break;
                    case 'ArrowDown': movePitchLockScale(cursor, -1); break;
                }
            } else {
                switch (eventKey) {
                    case 'ArrowUp': movePitchLockScale(getFocusNote(), 1); break;
                    case 'ArrowDown': movePitchLockScale(getFocusNote(), -1); break;
                }
            }
        }
        callbacks.holdShift = () => {

            const changeCursorTuplets = (tuplets: number) => {
                if (![1, 2].includes(cursor.norm.div)) return;
                const prev = cursor.norm.tuplets ?? 1;
                if (prev === tuplets) tuplets = 1;
                const rate = tuplets / prev;
                cursor.norm.tuplets = tuplets;
                cursor.pos = Math.floor(cursor.pos * rate);

                if (cursor.norm.tuplets === 1) cursor.norm.tuplets = undefined;
                reducerMelody.judgeOverlap();
                commit();
            }
            if (isCursor()) {
                switch (eventKey) {
                    case '#': changeCursorTuplets(3); break;
                }
            }
        }
        return callbacks;
    }

    return {
        control,
        getHoldCallbacks
    };
}
export default useInputMelody;