import MusicTheory from "../../util/musicTheory";
import type StoreOutline from "./storeOutline";

namespace StoreCache {

    export type Props = {
        baseCaches: BaseCache[];

        chordCaches: ChordCache[];
        elementCaches: ElementCache[];

        outlineTailPos: number;
    }

    export const INITIAL: Props = {
        baseCaches: [],
        chordCaches: [],
        elementCaches: [],
        outlineTailPos: 0
    };

    export interface BeatRange {
        startTime: number;
        sustainTime: number;
        startBeat: number;
        lengthBeat: number;
        startBeatNote: number;
        lengthBeatNote: number;

        viewPosLeft: number;
        viewPosWidth: number;
    }
    export interface BaseCache extends BeatRange {
        scoreBase: StoreOutline.DataInit;
        startBar: number;
    }

    export interface ChordCache extends BeatRange {
        chordSeq: number;
        elementSeq: number;

        beat: BeatCache;
        compiledChord?: CompiledChord;

        sectionStart?: string;
        modulate?: ModulateCahce;
        tempo?: TempoCahce;
    }

    export interface ModulateCahce {
        prev: MusicTheory.Tonality;
        next: MusicTheory.Tonality;
    }
    export interface TempoCahce {
        prev: number;
        next: number;
    }

    export interface BeatCache {
        num: number;
        eatHead: number;
        eatTail: number;
    }

    export type CompiledChord = {
        chord: MusicTheory.KeyChordProps;
        structs: MusicTheory.ChordStruct[];
    };

    export interface ElementCache extends StoreOutline.Element {
        elementSeq: number;
        chordSeq: number;
        baseSeq: number;
        lastChordSeq: number;

        outlineTop: number;
    }
}
export default StoreCache;