import type StoreMelody from "../../storeMelody";

namespace StorePianoBacking {

    export interface DataProps {
        layers: Layer[];
        recordNum: number;
    }

    export interface EditorProps extends DataProps {
        layerIndex: number;
        cursorX: number;
        cursorY: number;
    }

    export const createInitialBackingProps = (): EditorProps => {
        return {
            cursorX: -1,
            cursorY: -1,
            layerIndex: 0,
            recordNum: 0,
            layers: createInitialLayers()
        }
    }

    export type Layer = {
        cols: Col[];
        items: string[];
    }
    export type PedalState = 0 | 1 | 2;
    export interface Col extends StoreMelody.Norm {
        dot?: number;
        pedal: PedalState;
    }
    export const createInitialLayers = (): Layer[] => {
        return [{ cols: [], items: [] }, { cols: [], items: [] }]
    }

};
export default StorePianoBacking;