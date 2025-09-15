import type MusicTheory from "../../../util/musicTheory";
import type ArrangeData from "./arrangeData";
import type PianoEditor from "./pianoEditor";


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
        list: PianoEditor.Preset[];

        cursorBacking: number;
        cursorSounds: number;
    }
    export type Pattern = {
        backingNo: number;
        soundsNos: number[];
    }

    export const searchPianoPatterns = (req: SearchRequest, arrange: ArrangeData.Props) => {
        const lib = arrange.pianoLib;

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

        const list: PianoEditor.Preset[] = bkgPatts.map(bkgPatt => {
            const voics: number[] = [];

            // プリセットから探す             
            const presetBkgPatt = lib.presets.find(p => p.bkgPatt === bkgPatt.no);
            if(presetBkgPatt != undefined) {
                presetBkgPatt.voics.forEach(vNo => {
                    const sndsPatt = lib.soundsPatterns.find(p => p.no === vNo);
                    if (sndsPatt == undefined) throw new Error('sndsPattがundefiendであってはならない。');
                    if(req.structCnt === sndsPatt.category.structCnt) {
                        voics.push(vNo);
                    }
                });
            }

            // リレーションから探す
            arrange.tracks.filter(l => l.method === 'piano').forEach(l => {
                l.relations.forEach(r => {
                    const sndsPatt = lib.soundsPatterns.find(p => p.no === r.sndsPatt);
                    if (sndsPatt == undefined) throw new Error('sndsPattがundefiendであってはならない。');
                    if (req.structCnt === sndsPatt.category.structCnt &&
                        r.bkgPatt === bkgPatt.no && !voics.includes(sndsPatt.no)) {
                        voics.push(r.sndsPatt);
                    }
                });
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