import type MusicTheory from "../../../util/musicTheory";
import type StoreArrange from "./storeArrange";
import type StorePianoEditor from "./piano/storePianoEditor";
import type StoreOutline from "../storeOutline";
import type StoreCache from "../storeCache";


namespace ArrangeLibrary {

    export interface BackingCategory {
        tsGloup: MusicTheory.TimeSignature[];
        beat: number;
        eatHead?: number;
        eatTail?: number;
    }
    export interface SoundsCategory {
        structCnt: number;
    }
    export interface SearchCategory extends BackingCategory, SoundsCategory { }

    export type SearchRequest = {
        ts: MusicTheory.TimeSignature;
        beat: number;
        eatHead: number;
        eatTail: number;
        structCnt: number;
    }

    export type Maintenance = {

    }

    export type PianoArrangeFinder = {
        info: SearchRequest;
        list: StorePianoEditor.Preset[];

        cursorBacking: number;
        cursorSounds: number;
    }

    export type Pattern = {
        backingNo: number;
        soundsNos: number[];
    }

    export const getFinder = (props: {
        ts: MusicTheory.TimeSignature,
        chord: StoreCache.ChordCache,
        track: StoreArrange.Track
    }) => {

        const { ts, chord, track } = props;
        const compiledChord = chord.compiledChord;
        if (compiledChord == undefined) throw new Error();

        const searchReq: SearchRequest = {
            beat: chord.beat.num,
            eatHead: chord.beat.eatHead,
            eatTail: chord.beat.eatTail,
            structCnt: compiledChord.structs.length,
            ts
        };
        const finder: ArrangeLibrary.PianoArrangeFinder = {
            cursorBacking: -1, cursorSounds: -1,
            info: searchReq,
            list: searchPianoPatterns(searchReq, track)
        }
        return finder;
    }

    export const getPianoBackingPatternFromNo = (no: number, lib: StorePianoEditor.Lib) => {
        const patt = lib.backingPatterns.find(p => p.no === no);
        if (patt == undefined) throw new Error('pattがundefinedであってはならない。');
        return patt.backing;
    }
    export const getPianoVoicingPatternFromNo = (no: number, lib: StorePianoEditor.Lib) => {
        const patt = lib.soundsPatterns.find(p => p.no === no);
        if (patt == undefined) throw new Error('pattがundefinedであってはならない。');
        return patt.sounds;
    }

    export const searchPianoPatterns = (req: SearchRequest, track: StoreArrange.Track) => {
        const lib = track.pianoLib as StorePianoEditor.Lib;

        // console.log(req);
        // 条件に一致するパターンを抽出
        const bkgPatts = lib.backingPatterns.filter(patt => {
            const cond = patt.category;
            const condEatHead = cond.eatHead ?? 0;
            const condEatTail = cond.eatTail ?? 0;

            return cond.tsGloup.includes(req.ts) &&
                cond.beat === req.beat &&
                condEatHead === req.eatHead &&
                condEatTail === req.eatTail
        });

        const list: StorePianoEditor.Preset[] = bkgPatts.map(bkgPatt => {
            const voics: number[] = [];

            // プリセットから探す             
            const presetBkgPatt = lib.presets.find(p => p.bkgPatt === bkgPatt.no);
            if (presetBkgPatt != undefined) {
                presetBkgPatt.voics.forEach(vNo => {
                    const sndsPatt = lib.soundsPatterns.find(p => p.no === vNo);
                    if (sndsPatt == undefined) throw new Error('sndsPattがundefiendであってはならない。');
                    if (req.structCnt === sndsPatt.category.structCnt) {
                        voics.push(vNo);
                    }
                });
            }

            // リレーションから探す
            track.relations.forEach(r => {
                const sndsPatt = lib.soundsPatterns.find(p => p.no === r.sndsPatt);
                if (sndsPatt == undefined) throw new Error('sndsPattがundefiendであってはならない。');
                if (req.structCnt === sndsPatt.category.structCnt &&
                    r.bkgPatt === bkgPatt.no && !voics.includes(sndsPatt.no)) {
                    voics.push(r.sndsPatt);
                }
            });

            // // バッキングパターンのレコード数と一致するボイシングの管理連番を取得
            // const voics = lib.soundsPatterns.filter(sndsPatt => {
            //     return req.structCnt === sndsPatt.category.structCnt &&
            //         bkgPatt.backing.recordNum === sndsPatt.sounds.length;
            // }).map(p => p.no);
            return {
                bkgPatt: bkgPatt.no,
                sortNo: -1,
                voics
            }
        });
        return list;
    }
}

export default ArrangeLibrary;