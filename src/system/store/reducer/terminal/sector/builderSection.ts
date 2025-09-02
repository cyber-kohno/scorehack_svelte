import type StoreMelody from "../../../props/storeMelody";
import StorePreview from "../../../props/storePreview";
import { createStoreUtil, type StoreProps } from "../../../store";
import useReducerCache from "../../reducerCache";
import useReducerMelody from "../../reducerMelody";
import useReducerOutline from "../../reducerOutline";
import useReducerTermianl from "../../reducerTerminal";
import CommandRegistUtil from "../commandRegistUtil";

const useBuilderSection = (lastStore: StoreProps) => {
    // const { commit } = createStoreUtil(lastStore);
    const reducer = useReducerTermianl(lastStore);
    const terminal = reducer.getTerminal();

    const get = (): CommandRegistUtil.FuncProps[] => {

        const defaultProps = CommandRegistUtil.createDefaultProps('section');
        return [
            {
                ...defaultProps,
                funcKey: 'ren',
                usage: 'Change the section name.',
                args: [],
                callback: (args) => {
                    const { getCurrentSectionData, renameSectionData } = useReducerOutline(lastStore);
                    const { calculate } = useReducerCache(lastStore);

                    const prev = getCurrentSectionData().name;
                    const next = args[0];
                    renameSectionData(next);
                    calculate();
                    terminal.outputs.push({
                        type: 'record',
                        record: {
                            attr: 'info',
                            texts: [
                                { str: `The section name has been changed. [${prev} to ${next}]` }
                            ]
                        }
                    });
                }
            },
        ];
    };
    return {
        get
    };
}
export default useBuilderSection;