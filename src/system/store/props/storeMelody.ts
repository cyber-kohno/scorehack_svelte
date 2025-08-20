namespace StoreMelody {

    export type Props = {
        trackIndex: number;

        cursor: Note;
        isOverlap: boolean;
        focus: number;
        focusLock: number;
        clipboard: {
            notes: Note[] | null;
        };
    }

    export const INITIAL: Props = {
        cursor: {
            norm: { div: 1 },
            pos: 0,
            len: 1,
            pitch: 42
        },
        focus: -1,
        focusLock: -1,
        isOverlap: false,
        trackIndex: 0,
        clipboard: { notes: null }
    };

    export interface Norm {
        div: number;
        tuplets?: number;
    }

    export const calcBeat = (norm: StoreMelody.Norm, size: number) => {
        return 1 / norm.div * size / (norm.tuplets ?? 1);
    }
    export const calcBeatSide = (note: Note) => {
        const [pos, len] = [note.pos, note.len].map(size => calcBeat(note.norm, size));
        return { pos, len };
    }
    export const judgeOverlapNotes = (n1: Note, n2: Note) => {
        const { pos: n1Pos, len: n1Len } = StoreMelody.calcBeatSide(n1);
        const { pos: n2Pos, len: n2Len } = StoreMelody.calcBeatSide(n2);
        // 割り切れない数値の計算のための調整値
        const adj = 0.00001;
        const n1l = n1Pos + adj;
        const n1r = n1Pos + n1Len;
        const n2l = n2Pos + adj;
        const n2r = n2Pos + n2Len;
        // return ((n1r > n2l && n1r < n2r) && (n2r > n1l && n2r < n1r)) ||
        //     ((n2r > n1l && n2r < n1r) && (n1r > n2l && n1r < n2r));
        return n1r > n2l && n1r <= n2r || n2r > n1l && n2r < n1r;
    }

    export const compareNotes = (aNorm: Norm, aSize: number, bNorm: Norm, bSize: number) => {

    }

    export interface Note {
        norm: Norm;
        pos: number;
        len: number;
        pitch: number;
    }

    export type TrackMethod = 'score' | 'audio';

    export interface Track {
        name: string;
        isMute: boolean;
        volume: number;
        method: TrackMethod;
    }
    export interface ScoreTrack extends Track {
        soundFont: string;
        notes: Note[];
    }
    export const createMelodyTrackScoreInitial = (): ScoreTrack => {
        return {
            name: 'track0',
            method: 'score',
            volume: 10,
            isMute: false,
            notes: [],
            soundFont: ''
        }
    }
    export interface AudioTrack extends Track {
        fileName: string;
        source: string;
        adjust: number;
    }
}

export default StoreMelody;