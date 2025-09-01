import FileUtil from "../../../util/fileUtil";
import type StoreMelody from "../../props/storeMelody";
import type StoreOutline from "../../props/storeOutline";
import StorePreview from "../../props/storePreview";
import { createStoreUtil, type StoreProps } from "../../store";
import useReducerMelody from "../reducerMelody";
import useReducerTermianl from "../reducerTerminal";

namespace CommandRegistUtil {

    type FuncArg = {
        name: string;
    }

    interface FuncPropsDefault {
        sector: string;
        usage: string;
        args: FuncArg[];
        callback: (args: string[]) => void
    }

    export interface FuncProps extends FuncPropsDefault {
        funcKey: string;
    }


    export const useCommandRegister = (lastStore: StoreProps) => {
        const { commit } = createStoreUtil(lastStore);

        const reducer = useReducerTermianl(lastStore);
        const terminal = reducer.getTerminal();

        const fileUtil = FileUtil.getUtil(lastStore);

        const getFuncs = () => {
            const items: FuncProps[] = [];
            const add = (funcs: FuncProps[]) => {
                items.push(...funcs);
            }

            const sectors = terminal.target.split('\\');

            add(getFuncsCommon({ items }));

            switch (sectors[0]) {
                case 'harmonize': {
                    switch (sectors[1] as StoreOutline.ElementType) {
                        // case 'init': add(getFuncsHarmonizeInit()); break;
                        // case 'section': add(getFuncsHarmonizeSection()); break;
                        // case 'chord': add(getFuncsHarmonizeChord()); break;
                        // case 'modulate': add(getFuncsHarmonizeModulate()); break;
                    }
                } break;
                // case 'melody': add(getFuncsMelody());
            }

            return items;
        }

        const getFuncsCommon = (props: {
            items: FuncProps[];
        }): FuncProps[] => {
            const { loadSFPlayer } = useReducerMelody(lastStore);

            const defaultProps = createDefaultProps('common');
            return [
                {
                    ...defaultProps,
                    funcKey: 'clear',
                    args: [],
                    callback: () => {
                        terminal.outputs.length = 0;
                    }
                },
                {
                    ...defaultProps,
                    funcKey: 'ls',
                    args: [],
                    callback: () => {
                        props.items.forEach(item => {
                            terminal.outputs.push({
                                type: 'record',
                                record: {
                                    attr: 'info',
                                    texts: [
                                        { str: item.funcKey, highlight: 'func' }
                                    ]
                                }
                            });
                        });
                    }
                },
                {
                    ...defaultProps,
                    funcKey: 'save',
                    args: [],
                    callback: () => {
                        fileUtil.saveScoreFile({
                            success: (handle) => {
                                terminal.outputs.push({
                                    type: 'record',
                                    record: {
                                        attr: 'info',
                                        texts: [
                                            { str: `File saved successfully. [${handle.name}]` }
                                        ]
                                    }
                                });
                                commit();
                            },
                            cancel() {
                                terminal.outputs.push({
                                    type: 'record',
                                    record: {
                                        attr: 'info',
                                        texts: [
                                            { str: 'File saveing was canceled.' }
                                        ]
                                    }
                                });
                                commit();
                            },
                        });
                    }
                },
                {
                    ...defaultProps,
                    funcKey: 'load',
                    args: [],
                    callback: () => {
                        fileUtil.loadScoreFile(() => {
                            lastStore.data.scoreTracks.forEach(t => {
                                const scoreTrack = t as StoreMelody.ScoreTrack;
                                if (scoreTrack.soundFont !== '') {
                                    const sfName = StorePreview.validateSFName(scoreTrack.soundFont);
                                    console.log(sfName);
                                    loadSFPlayer(sfName);
                                }
                            });
                            commit();
                        }, () => {
                            terminal.outputs.push({
                                type: 'record',
                                record: {
                                    attr: 'info',
                                    texts: [
                                        { str: 'File loading was canceled.' }
                                    ]
                                }
                            });
                            commit();
                        });
                    }
                }
            ];
        };

        const createDefaultProps = (sector: string): FuncPropsDefault => ({
            sector,
            usage: '',
            args: [],
            callback: () => [],
        });

        const execute = (target: string, funcKey: string, args: string[]) => {

        }
        return {
            getFuncs,
            execute,
        }
    }
}
export default CommandRegistUtil;