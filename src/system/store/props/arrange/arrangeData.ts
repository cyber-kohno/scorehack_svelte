import type PianoEditor from "./pianoEditor";

namespace ArrangeData {

    export const ArrangeMedhods = ['piano', 'guitar'] as const;
    export type ArrangeMedhod = typeof ArrangeMedhods[number];

    export const INITIAL: Props = {
        tracks: [{
            name: 'piano',
            method: 'piano',
            soundFont: 'acoustic_grand_piano',
            isMute: false,
            relations: [],
            pianoLib: { backingPatterns: [], soundsPatterns: [], presets: [] }
        }],
    }

    export type Track = {
        name: string;
        method: ArrangeMedhod;
        soundFont: string;
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

    export const getPianoBackingPatternFromNo = (no: number, lib: PianoEditor.Lib) => {
        const patt = lib.backingPatterns.find(p => p.no === no);
        if (patt == undefined) throw new Error('pattがundefinedであってはならない。');
        return patt.backing;
    }
    export const getPianoVoicingPatternFromNo = (no: number, lib: PianoEditor.Lib) => {
        const patt = lib.soundsPatterns.find(p => p.no === no);
        if (patt == undefined) throw new Error('pattがundefinedであってはならない。');
        return patt.sounds;
    }

    export interface Pattern {
        no: number;
    }

    export const deleteUnreferPattern = (
        target: 'bkgPatt' | 'sndsPatt',
        patts: Pattern[],
        isUsePreset: (patt: Pattern) => boolean,
        layers: Track[]
    ) => {

        for (let i = patts.length - 1; i >= 0; i--) {
            const patt = patts[i];
            // プリセット登録されているパターンは削除しない
            if (isUsePreset(patt)) continue;
            let isRefer = false;
            // 全てのピアノレイヤーをチェック
            layers.some(l => {
                if (l.method === 'piano' &&
                    l.relations.map(r => r[target]).includes(patt.no)
                ) {
                    isRefer = true;
                    return 1;
                }
            });
            // 参照が見つからない場合削除
            console.log(`削除します。${target}- no:[${patts[i].no}]`)
            if (!isRefer) patts.splice(i, 1);
        }
    }

}
export default ArrangeData;