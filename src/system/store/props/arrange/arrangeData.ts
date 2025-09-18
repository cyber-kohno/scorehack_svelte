import type PianoEditor from "./piano/pianoEditor";

namespace ArrangeData {

    export const ArrangeMedhods = ['piano', 'guitar'] as const;
    export type ArrangeMedhod = typeof ArrangeMedhods[number];

    export const INITIAL: Props = {
        tracks: [{
            name: 'arrange0',
            method: 'piano',
            soundFont: '',
            volume: 10,
            isMute: false,
            relations: [],
            pianoLib: { backingPatterns: [], soundsPatterns: [], presets: [] }
        }],
    }

    export type Track = {
        name: string;
        method: ArrangeMedhod;
        soundFont: string;
        volume: number;
        isMute: boolean;

        relations: Relation[];
        pianoLib?: PianoEditor.Lib;
    }

    /**
     * コード要素とアレンジの紐づけを管理するプロパティ
     */
    export interface Relation {
        chordSeq: number;

        /** バッキングパターン */
        bkgPatt: number;
        /** 構成音パターン */
        sndsPatt: number;
    }

    export type Props = {
        tracks: Track[];
    }

    export interface Pattern {
        no: number;
    }

    /**
     * 利用していないパターンの削除
     * @param target 
     * @param patts 
     * @param isUsePreset 
     * @param layers 
     */
    export const deleteUnreferPattern = (
        target: 'bkgPatt' | 'sndsPatt',
        patts: Pattern[],
        isUsePreset: (patt: Pattern) => boolean,
        layer: Track
    ) => {

        for (let i = patts.length - 1; i >= 0; i--) {
            const patt = patts[i];
            // プリセット登録されているパターンは削除しない
            if (isUsePreset(patt)) continue;
            let isRefer = false;

            if (layer.relations.map(r => r[target]).includes(patt.no)) {
                isRefer = true;
            }
            // 参照が見つからない場合削除
            console.log(`削除します。${target}- no:[${patts[i].no}]`)
            if (!isRefer) patts.splice(i, 1);
        }
    }

}
export default ArrangeData;