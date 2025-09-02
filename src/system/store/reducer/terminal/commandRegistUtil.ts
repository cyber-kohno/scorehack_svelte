import FileUtil from "../../../util/fileUtil";
import type StoreMelody from "../../props/storeMelody";
import type StoreOutline from "../../props/storeOutline";
import StorePreview from "../../props/storePreview";
import { createStoreUtil, type StoreProps } from "../../store";
import useReducerMelody from "../reducerMelody";
import useReducerTermianl from "../reducerTerminal";
import useBuilderChord from "./sector/builderChord";
import useBuilderCommon from "./sector/builderCommon";
import useBuilderMelody from "./sector/builderMelody";
import useBuilderSection from "./sector/builderSection";

namespace CommandRegistUtil {

    export type FuncArg = {
        name: string;
    }

    export interface FuncPropsDefault {
        sector: string;
        usage: string;
        args: FuncArg[];
        callback: (args: string[]) => void
    }

    export interface FuncProps extends FuncPropsDefault {
        funcKey: string;
    }
    export const createDefaultProps = (sector: string): FuncPropsDefault => ({
        sector,
        usage: '',
        args: [],
        callback: () => [],
    });

    export const useCommandRegister = (lastStore: StoreProps) => {

        const reducer = useReducerTermianl(lastStore);
        const terminal = reducer.getTerminal();

        const builderCommon = useBuilderCommon(lastStore);
        const builderSection = useBuilderSection(lastStore);
        const builderChord = useBuilderChord(lastStore);
        const builderMelody = useBuilderMelody(lastStore);

        const getFuncs = () => {
            const items: FuncProps[] = [];
            const add = (funcs: FuncProps[]) => {
                items.push(...funcs);
            }

            const sectors = terminal.target.split('\\');

            add(builderCommon.get({ items }));

            switch (sectors[0]) {
                case 'harmonize': {
                    switch (sectors[1] as StoreOutline.ElementType) {
                        // case 'init': add(getFuncsHarmonizeInit()); break;
                        case 'section': add(builderSection.get()); break;
                        case 'chord': add(builderChord.get()); break;
                        // case 'modulate': add(getFuncsHarmonizeModulate()); break;
                    }
                } break;
                case 'melody': add(builderMelody.get());
            }

            return items;
        }


        const execute = (target: string, funcKey: string, args: string[]) => {

        }
        return {
            getFuncs,
            execute,
        }
    }
}
export default CommandRegistUtil;