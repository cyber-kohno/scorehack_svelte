import Layout from "../../const/layout";
import type MusicTheory from "../../util/musicTheory";

namespace StoreOutline {

    export type Props = {
        focus: number;
    }

    export const INITIAL = {
        focus: 1
    };

    export type ElementType = 'init' | 'section' | 'chord' | 'change' | 'modulate' | 'tempo' | 'ts';

    export type DataInit = {
        ts: MusicTheory.TimeSignature;
        tempo: number;
        tonality: MusicTheory.Tonality;
    };

    export type DataSection = {
        name: string;
    };

    export interface DataChord {
        beat: number;
        eat: number;
        degree?: MusicTheory.DegreeChord;
    };
    export interface KeyChord {
        beat: number;
        eat: number;
        chord?: MusicTheory.KeyChordProps;
        structs?: MusicTheory.StructProps[];
    };
    export type DataModulate = {
        method: ModulateMedhod;
        val?: number;
    };

    export const ModulateMedhods = ['domm', 'parallel', 'relative', 'key'] as const;
    export type ModulateMedhod = typeof ModulateMedhods[number];

    export type TempoRelation = 'diff' | 'rate' | 'abs';
    export type DataTempo = {
        method: TempoMedhod;
        val: number;
    };
    export const TempoMedhods = ['rate', 'addition'] as const;
    export type TempoMedhod = typeof TempoMedhods[number];

    export type DataTS = {
        newTS: MusicTheory.TimeSignature;
    };

    export type Element = {
        type: ElementType;
        data: any;
    }

    export const getInitialElements = () => {
        const list: Element[] = [];
        const initData: DataInit = {
            ts: { num: 4, den: 4 },
            tempo: 100,
            tonality: {
                key12: 0,
                scale: 'major'
            }
        };
        const firstSectionData: DataSection = {
            name: 'section0'
        }
        list.push({ type: 'init', data: initData });
        list.push({ type: 'section', data: firstSectionData });
        const dataChord = (): StoreOutline.DataChord => ({
            beat: 4,
            eat: 0
        });
        for (let i = 0; i < 2; i++) {
            list.push({ type: 'chord', data: dataChord() });
        }
        return list;
    }

    export const MARGIN_HEAD = 4;

    export const getElementViewHeight = (element: Element) => {
        const EL = Layout.element;
        switch (element.type) {
            case 'init': return (EL.INIT_RECORD_HEIGHT + EL.INIT_RECORD_MARGIN) * 3 + EL.INIT_RECORD_MARGIN;
            case 'section': return EL.SECTION_LABEL_HEIGHT + EL.SECTION_BORDER_HEIGHT + EL.SECTION_TOP_MARGIN + EL.SECTION_BOTTOM_MARGIN;
            case 'chord': {
                const data = element.data as DataChord;
                let ret = EL.CHORD_SEQ_HEIGHT + EL.CHORD_TIP_HEIGHT + EL.CHORD_DEGREE_HEIGHT;
                if (data.degree != undefined) ret += EL.CHORD_NAME_HEIGHT;
                return ret;
            }
            case 'modulate': return EL.MODULATE_RECRORD_HEIGHT * 3;
        }
        return 0;
    }
}

export default StoreOutline;