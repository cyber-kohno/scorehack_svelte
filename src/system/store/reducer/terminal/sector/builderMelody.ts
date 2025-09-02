import StorePreview from "../../../props/storePreview";
import { createStoreUtil, type StoreProps } from "../../../store";
import useReducerMelody from "../../reducerMelody";
import useReducerTermianl from "../../reducerTerminal";
import CommandRegistUtil from "../commandRegistUtil";

const useBuilderMelody = (lastStore: StoreProps) => {
    const reducer = useReducerTermianl(lastStore);
    const terminal = reducer.getTerminal();
    const { changeScoreTrack, setSFCurTrack } = useReducerMelody(lastStore);

    const get = (): CommandRegistUtil.FuncProps[] => {

        const defaultProps = CommandRegistUtil.createDefaultProps('melody');
        return [
            {
                ...defaultProps,
                funcKey: 'lss',
                usage: 'Displays a list of existing music tracks.',
                args: [],
                callback: () => {
                    const trackIndex = lastStore.control.melody.trackIndex;
                    const tracks = lastStore.data.scoreTracks.map((t, i) => ({ ...t, isActive: trackIndex === i }));
                    terminal.outputs.push({
                        type: 'table',
                        table: {
                            cols: [
                                { headerName: 'Index', width: 80, attr: 'item', isNumber: true },
                                { headerName: 'Name', width: 120, attr: 'item' },
                                { headerName: 'Soundfont', width: 220, attr: 'def' },
                                { headerName: 'Vol', width: 80, attr: 'sentence', isNumber: true },
                                { headerName: 'Mute', width: 80, attr: 'sentence' },
                                { headerName: 'Notes', width: 80, attr: 'sentence', isNumber: true },
                            ],
                            table: (() => tracks.map((item, i) => {
                                const active = item.isActive ? '*' : '';
                                return [
                                    i.toString(),
                                    active + item.name,
                                    item.soundFont,
                                    item.volume.toString(),
                                    item.isMute ? '●' : '',
                                    item.notes.length.toString()
                                ]
                            }))()
                        }
                    });
                }
            },
            {
                ...defaultProps,
                funcKey: 'mks',
                usage: 'Create a new music score track.',
                args: [],
                callback: (args) => {
                    const tracks = lastStore.data.scoreTracks;
                    const name = args[0] ?? `track${tracks.length}`;
                    tracks.push({
                        name,
                        isMute: false,
                        volume: 10,
                        soundFont: '',
                        notes: []
                    });
                    terminal.outputs.push({
                        type: 'record',
                        record: {
                            attr: 'info',
                            texts: [
                                { str: `Created a new track [${name}].` }
                            ]
                        }
                    });
                }
            },
            {
                ...defaultProps,
                funcKey: 'rms',
                usage: 'Deletes the music track.',
                args: [],
                callback: (args) => {
                    const tracks = lastStore.data.scoreTracks;
                    const melody = lastStore.control.melody;
                    let delIndex = melody.trackIndex;
                    if (args[0] != undefined) {
                        delIndex = Number(args[0]);
                        if (Number.isNaN(delIndex)) {
                            terminal.outputs.push({
                                type: 'record',
                                record: {
                                    attr: 'error',
                                    texts: [
                                        { str: `The first argument must be a number. [${args[0]}]` }
                                    ]
                                }
                            });
                            return;
                        }
                    }
                    if (tracks.length === 1) {
                        terminal.outputs.push({
                            type: 'record',
                            record: {
                                attr: 'error',
                                texts: [
                                    { str: `You cannot delete all tracks.` }
                                ]
                            }
                        });
                        return;
                    }
                    const name = tracks[delIndex].name;
                    tracks.splice(delIndex, 1);
                    // 先頭以外が選択されている場合かつ、アクティブより上が削除され場合
                    if (delIndex > 0 && delIndex <= melody.trackIndex) melody.trackIndex--;
                    terminal.outputs.push({
                        type: 'record',
                        record: {
                            attr: 'info',
                            texts: [
                                { str: `Track deleted. [${name}].` }
                            ]
                        }
                    });
                }
            },
            {
                ...defaultProps,
                funcKey: 'chs',
                usage: 'Change the active track.',
                args: [],
                callback: (args) => {
                    const melody = lastStore.control.melody;
                    if (args[0] == undefined) {
                        terminal.outputs.push({
                            type: 'record',
                            record: {
                                attr: 'error',
                                texts: [
                                    { str: `The first argument is not specified.` }
                                ]
                            }
                        });
                        return;
                    }
                    const nextIndex = Number(args[0]);
                    if (Number.isNaN(nextIndex)) {
                        terminal.outputs.push({
                            type: 'record',
                            record: {
                                attr: 'error',
                                texts: [
                                    { str: `The first argument must be a number. [${args[0]}]` }
                                ]
                            }
                        });
                        return;
                    }
                    const prev = melody.trackIndex;
                    melody.trackIndex = nextIndex;
                    terminal.outputs.push({
                        type: 'record',
                        record: {
                            attr: 'info',
                            texts: [
                                { str: `Active track changed. [${prev} → ${nextIndex}].` }
                            ]
                        }
                    });
                }
            },
            {
                ...defaultProps,
                funcKey: 'sf',
                usage: 'Sets the SoundFont for the active track.',
                args: [],
                callback: (args) => {

                    if (args[0] == undefined) {
                        terminal.outputs.push({
                            type: 'record',
                            record: {
                                attr: 'error',
                                texts: [
                                    { str: `The first argument is not specified.` }
                                ]
                            }
                        });
                        return;
                    }
                    try {
                        const sfName = StorePreview.validateSFName(args[0]);
                        setSFCurTrack(sfName);
                        terminal.outputs.push({
                            type: 'record',
                            record: {
                                attr: 'info',
                                texts: [
                                    { str: `Set a soundfont as the active track. [${sfName}].` }
                                ]
                            }
                        });
                    } catch {
                        terminal.outputs.push({
                            type: 'record',
                            record: {
                                attr: 'error',
                                texts: [
                                    { str: `The specified soundfont does not exist. [${args[0]}]` }
                                ]
                            }
                        });
                    }
                }
            },
            {
                ...defaultProps,
                funcKey: 'lsf',
                usage: 'Lists available soundfonts.',
                args: [],
                callback: (args) => {
                    if (args[0] == undefined) {
                        terminal.outputs.push({
                            type: 'record',
                            record: {
                                attr: 'error',
                                texts: [
                                    { str: `The first argument is not specified.` }
                                ]
                            }
                        });
                        return;
                    }
                    const items = StorePreview.InstrumentNames
                        .filter(n => {
                            const v = args[0];
                            if (v == undefined) return true;
                            else return n.indexOf(v) !== -1;
                        })
                        .map(def => {
                            const isLoad = lastStore.preview.sfItems.find(sf => sf.instrumentName === def);
                            return {
                                def, isLoad
                            }
                        });
                    terminal.outputs.push({
                        type: 'table',
                        table: {
                            cols: [
                                { headerName: 'Def', width: 500, attr: 'def' },
                                { headerName: 'Load', width: 80, attr: 'sentence' },
                            ],
                            table: (() => items.map(item => [
                                item.def,
                                item.isLoad ? '*' : ''
                            ]))()
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
export default useBuilderMelody;