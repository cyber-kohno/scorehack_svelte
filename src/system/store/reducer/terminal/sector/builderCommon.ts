import FileUtil from "../../../../util/fileUtil";
import type StoreMelody from "../../../props/storeMelody";
import StorePreview from "../../../props/storePreview";
import { createStoreUtil, type StoreProps } from "../../../store";
import useReducerMelody from "../../reducerMelody";
import useReducerTermianl from "../../reducerTerminal";
import CommandRegistUtil from "../commandRegistUtil";

const useBuilderCommon = (lastStore: StoreProps) => {
    const { commit } = createStoreUtil(lastStore);
    const reducer = useReducerTermianl(lastStore);
    const terminal = reducer.getTerminal();

    const fileUtil = FileUtil.getUtil(lastStore);

    const get = (props: {
        items: CommandRegistUtil.FuncProps[];
    }): CommandRegistUtil.FuncProps[] => {
        const { loadSFPlayer } = useReducerMelody(lastStore);

        const defaultProps = CommandRegistUtil.createDefaultProps('common');
        return [
            {
                ...defaultProps,
                funcKey: 'clear',
                usage: 'Delete all output from the terminal.',
                args: [],
                callback: () => {
                    terminal.outputs.length = 0;
                }
            },
            {
                ...defaultProps,
                funcKey: 'lsc',
                usage: 'Lists the available commands.',
                args: [],
                callback: () => {

                    terminal.outputs.push({
                        type: 'table',
                        table: {
                            cols: [
                                { headerName: 'Sector', width: 110, attr: 'item' },
                                { headerName: 'Command', width: 150, attr: 'item' },
                                { headerName: 'Usage', width: 400, attr: 'sentence' }
                            ],
                            table: (() => props.items.map(item => {
                                return [item.sector, item.funcKey, item.usage]
                            }))()
                        }
                    });
                }
            },
            {
                ...defaultProps,
                funcKey: 'save',
                usage: 'Save the music score data.',
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
                usage: 'Loads music score data.',
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
    return {
        get
    };
}
export default useBuilderCommon;