import type StoreMelody from "../../storeMelody";
import ArrangeData from "../arrangeData";
import type ArrangeLibrary from "../arrangeLibrary";


namespace PianoEditor {

    export type Control = 'voicing' | 'backing';
    export interface Props {
        control: Control;

        preset: PresetBak;
        voicing: Voicing;
        backing: null | Backing;

        /** エディタ起動時のソースを保持 */
        lastSource: string;

        finder: ArrangeLibrary.PianoArrangeFinder | null;
    }

    type Backing = {
        recordNum: number;
        layers: Layer[];
        layerIndex: number;
        cursorX: number;
        cursorY: number;
    }


    export type Layer = {
        cols: Col[];
        items: string[];
    }

    export const createInitialProps = (): Props => {

        return {
            backing: null,
            control: 'voicing',
            lastSource: '',
            voicing: {
                cursorX: 0,
                cursorY: 0,
                items: []
            },
            preset: { index: -1, list: [] },
            finder: null
        };
    }

    type PresetBak = {
        list: PianoEditor.Unit[];
        index: number;
    }

    type Voicing = {
        items: string[];
        cursorX: number;
        cursorY: number;
    }

    export type PedalState = 0 | 1 | 2;
    export interface Col extends StoreMelody.Norm {
        dot?: number;
        pedal: PedalState;
    }
    export const getInitialLayers = (): Layer[] => {
        return [{ cols: [], items: [] }, { cols: [], items: [] }]
    }

    export interface Unit {// extends ArrangeEditor.Unit {
        voicingSounds: string[];
        layers: Layer[];
    }

    export interface BackingPattern extends ArrangeData.Pattern {
        backing: BackingProps;

        category: ArrangeLibrary.BackingCategory;
    }
    export interface SoundsPattern extends ArrangeData.Pattern {
        sounds: string[];
        category: ArrangeLibrary.SoundsCategory;
    }
    export type Preset = {
        bkgPatt: number;
        sortNo: number;
        voics: number[];
    }
    export type Lib = {
        backingPatterns: BackingPattern[];
        soundsPatterns: SoundsPattern[];

        presets: Preset[];
    }

    export type BackingProps = {
        layers: Layer[];
        recordNum: number;
    }

    // export const getUnitFromEditor = (editor: Props): Unit => {
    //     return {
    //         layers: editor.backing.layers,
    //         voicingSounds: editor.voicing.sounds
    //     }
    // }

    /**
     * アレンジ（バッキング・ボイシング）パターンを検索（なければ登録）し、識別連番を返す
     * @param category 検索用のカテゴリ
     * @param backing バッキング
     * @param sounds ボイシング
     * @param lib ライブラリ
     * @returns アレンジ（バッキング・ボイシング）の識別連番の配列（分割代入で使う想定）
     */
    export const registPattern = (
        category: ArrangeLibrary.SearchCategory,
        backing: BackingProps,
        sounds: string[],
        lib: Lib
    ) => {
        const backingSrc = JSON.stringify(backing);
        const soundsSrc = JSON.stringify(sounds);

        // 既存のバッキングパターンを検索
        let backingPatt = lib.backingPatterns.find(pat => {
            const pattSrc = JSON.stringify(pat.backing);
            return backingSrc === pattSrc;
        });

        // 既存の構成音パターンを検索
        let soundsPatt = lib.soundsPatterns.find(pat => {
            const pattSrc = JSON.stringify(pat.sounds);
            return soundsSrc === pattSrc;
        });

        // 既存のパターンが見つからなかった場合、新規追加
        if (backingPatt == undefined) {
            const maxNo = lib.backingPatterns.reduce((p, n) => n.no > p ? n.no : p, -1);
            backingPatt = {
                no: maxNo + 1,
                backing: JSON.parse(backingSrc),
                category: { ...category }
            };
            lib.backingPatterns.push(backingPatt);
        }
        // 既存のパターンが見つからなかった場合、新規追加
        if (soundsPatt == undefined) {
            const maxNo = lib.soundsPatterns.reduce((p, n) => n.no > p ? n.no : p, -1);
            soundsPatt = {
                no: maxNo + 1,
                sounds: JSON.parse(soundsSrc),
                category: { ...category }
            }
            lib.soundsPatterns.push(soundsPatt);
        }
        return [backingPatt.no, soundsPatt.no];
    }

    export const searchPianoLibUnit = (
        chordSeq: number,
        track: ArrangeData.Track
    ): Unit | undefined => {
        const relations = track.relations;
        const relation = relations.find(r => r.chordSeq === chordSeq);

        if (relation != undefined) {
            const pianoLib = track.pianoLib as PianoEditor.Lib;
            const backingPatt = pianoLib.backingPatterns.find(patt => patt.no === relation.bkgPatt);
            if (backingPatt == null) throw new Error('backingPattがundefinedであってはならない。');
            const soundsPatt = pianoLib.soundsPatterns.find(patt => patt.no === relation.sndsPatt);
            if (soundsPatt == null) throw new Error('soundsPattがundefinedであってはならない。');

            return {
                voicingSounds: soundsPatt.sounds,
                layers: backingPatt.backing.layers
            }
        }
        return undefined;
    }

    export const deleteUnreferUnit = (track: ArrangeData.Track) => {
        const pianoLib = track.pianoLib as PianoEditor.Lib;
        ArrangeData.deleteUnreferPattern('bkgPatt', pianoLib.backingPatterns,
            (patt: ArrangeData.Pattern) => {
                return pianoLib.presets.find(p => p.bkgPatt === patt.no) != undefined;
            },
            track);
        ArrangeData.deleteUnreferPattern('sndsPatt', pianoLib.soundsPatterns,
            (patt: ArrangeData.Pattern) => {
                const result = pianoLib.presets.find(p => {
                    // console.log(`p.voics:${p.voics}, patt.no:${patt.no}`);
                    return p.voics.includes(patt.no);
                }) != undefined;
                // console.log(`result: ${result}`);
                return result;
            }, track);
    }
};

export default PianoEditor;