import { type StoreProps } from "../../../store";
import useReducerCache from "../../reducerCache";
import useReducerOutline from "../../reducerOutline";
import useReducerTermianl from "../../reducerTerminal";
import CommandRegistUtil from "../commandRegistUtil";

const useBuilderHarmonize = (lastStore: StoreProps) => {
    const reducer = useReducerTermianl(lastStore);
    const terminal = reducer.getTerminal();

    const get = (): CommandRegistUtil.FuncProps[] => {

        const defaultProps = CommandRegistUtil.createDefaultProps('section');
        return [
            {
                ...defaultProps,
                funcKey: 'lsh',
                usage: 'Displays a list of existing harmony tracks.',
                args: [],
                callback: () => {
                    const tracks = lastStore.data.arrange.tracks;
                    terminal.outputs.push({
                        type: 'table',
                        table: {
                            cols: [
                                { headerName: 'Index', width: 80, attr: 'item', isNumber: true },
                                { headerName: 'Method', width: 100, attr: 'def' },
                                { headerName: 'Name', width: 120, attr: 'item' },
                                { headerName: 'Soundfont', width: 220, attr: 'def' },
                                { headerName: 'Vol', width: 70, attr: 'sentence', isNumber: true },
                                { headerName: 'Mute', width: 80, attr: 'sentence' },
                            ],
                            table: (() => tracks.map((item, i) => {
                                return [
                                    i.toString(),
                                    item.name,
                                    item.method,
                                    item.soundFont,
                                    item.volume.toString(),
                                    item.isMute ? '●' : ''
                                ]
                            }))()
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
export default useBuilderHarmonize;