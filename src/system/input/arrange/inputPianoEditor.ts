import Layout from "../../const/layout";
import type StorePianoBacking from "../../store/props/arrange/piano/storePianoBacking";
import type StorePianoEditor from "../../store/props/arrange/piano/storePianoEditor";
import type StoreInput from "../../store/props/storeInput";
import useReducerArrange from "../../store/reducer/reducerArrange";
import useReducerRef from "../../store/reducer/reducerRef";
import type { StoreUtil } from "../../store/store";
import MusicTheory from "../../util/musicTheory";

const useInputPianoEditor = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const reducerArrange = useReducerArrange(lastStore);
    const reducerRef = useReducerRef(lastStore);

    const outline = lastStore.control.outline;
    const arrange = outline.arrange;


    const control = (eventKey: string) => {
        if (arrange == null) throw new Error();

        const editor = reducerArrange.getPianoEditor();

        switch (editor.phase) {
            case 'edit': {

                const shiftLayer = (backing: StorePianoBacking.EditorProps) => {
                    backing.layerIndex = backing.layerIndex === 0 ? 1 : 0;

                    backing.cursorX = -1;
                    editor.control = 'record';
                    commit();
                    reducerRef.adjustPEBScrollCol();
                }

                /**
                 * ボイシング選択時の制御を定義
                 */
                const voicingControl = () => {
                    const compiledChord = arrange.target.compiledChord;
                    const structs = compiledChord.structs;
                    let structCnt = compiledChord.structs.length;
                    const onChord = compiledChord.chord.on;
                    if (onChord != undefined) {
                        const rel = MusicTheory.getRelationFromInterval(onChord.key12);
                        if (!structs.map(s => s.relation).includes(rel)) structCnt++;
                    }
                    const voicing = editor.voicing;
                    const OCTAVE_MAX = Layout.arrange.piano.VOICING_OCTAVE_MAX;
                    const adjustRange = () => {
                        if (voicing.cursorX < 0) voicing.cursorX = 0;
                        if (voicing.cursorY < 0) voicing.cursorY = 0;
                        if (voicing.cursorX > OCTAVE_MAX - 1) voicing.cursorX = OCTAVE_MAX - 1;
                        if (voicing.cursorY > structCnt - 1) voicing.cursorY = structCnt - 1;
                    }

                    switch (eventKey) {
                        case 'ArrowUp': {
                            voicing.cursorY--;
                            adjustRange();
                            commit();
                        } break;
                        case 'ArrowDown': {
                            voicing.cursorY++;
                            adjustRange();
                            commit();
                        } break;
                        case 'ArrowLeft': {
                            voicing.cursorX--;
                            adjustRange();
                            commit();
                        } break;
                        case 'ArrowRight': {
                            voicing.cursorX++;
                            adjustRange();
                            commit();
                        } break;
                        case 'a': {
                            const key = `${voicing.cursorX}.${voicing.cursorY}`;
                            if (!voicing.items.includes(key)) {
                                voicing.items.push(key);
                            } else {
                                const pos = voicing.items.findIndex(s => s === key);
                                voicing.items.splice(pos, 1);
                            }
                            voicing.items.sort((a, b) => {
                                const [ax, ay] = a.split('.').map(s => Number(s));
                                const [bx, by] = b.split('.').map(s => Number(s));
                                return (ax * 10 + ay) - (bx * 10 + by);
                            });
                            commit();
                        } break;
                        case 'd': {
                            const struct = structs[voicing.cursorY];
                            // const name = MusicTheory.getKey12FullName(struct.key12 +  voicing.cursorX + struct.carryForwardOctave);

                            // const instrumentName = store.arrange.layers[outline.layerIndex].soundFont;
                            // const sf = store.soundFontCaches.find(sf => sf.instrumentName === instrumentName);
                            // if (sf == undefined) throw new Error('sfがundefinedであってはならない。');
                            // sf.player.play(name, 0, { gain: 10, duration: 1 });
                            // console.log(name);
                        } break;
                    }
                }

                const colControl = () => {
                    const backing = editor.backing;
                    if (backing == null) throw new Error();

                    const cols = backing.layers[backing.layerIndex].cols;
                    const layer = backing.layers[backing.layerIndex];
                    const isLimit = () => {
                        return cols.length > Layout.arrange.piano.BACKING_COL_MAX;
                    };

                    const createInitialCol = (): StorePianoBacking.Col => {
                        let div = 8;
                        if (backing.cursorX >= 0) {
                            const len = layer.cols[backing.cursorX];
                            div = len.div;
                        }
                        return {
                            div,
                            tuplets: 1,
                            pedal: 0
                        }
                    };

                    const modDiv = (div: number) => {
                        if (backing.cursorX === -1) return;
                        const col = cols[backing.cursorX];
                        col.div = div;
                        commit();
                    };
                    const pedalChange = () => {
                        const index = backing.cursorX;
                        if (index === -1) return;
                        const col = cols[index];
                        let prevState = 0;
                        if (index >= 1) prevState = cols[index - 1].pedal;
                        switch (col.pedal) {
                            case 0: {
                                for (let i = index; i < cols.length; i++) {
                                    if (cols[i].pedal === 1) break;
                                    cols[i].pedal = 1;
                                }
                            } break;
                            case 1: {
                                if (prevState === 1) {
                                    col.pedal = 2;
                                } else {
                                    for (let i = index; i < cols.length; i++) {
                                        cols[i].pedal = 0;
                                    }
                                }
                            } break;
                            case 2: {
                                for (let i = index; i < cols.length; i++) {
                                    cols[i].pedal = 0;
                                }
                            } break;
                        }
                        commit();
                    };
                    const toggleDot = () => {
                        if (backing.cursorX === -1) return;
                        const col = cols[backing.cursorX];
                        if (col.div >= 16) return;
                        switch (col.dot) {
                            case undefined: col.dot = 1; break;
                            case 1: col.dot = undefined; break;
                        }
                        // console.log(col.dot);
                        commit();
                    };

                    switch (eventKey) {
                        case 'ArrowLeft': {
                            if (backing.cursorX > 0) {
                                backing.cursorX--;
                                commit();
                                reducerRef.adjustPEBScrollCol();
                            }
                        } break;
                        case 'ArrowRight': {
                            if (backing.cursorX < cols.length - 1) {
                                backing.cursorX++;
                                commit();
                                reducerRef.adjustPEBScrollCol();
                            }
                        } break;
                        case 'ArrowDown': {
                            pedalChange();
                        } break;
                        case 'a': {
                            if (!isLimit()) {
                                cols.splice(backing.cursorX, 0, createInitialCol());
                                layer.items.forEach((item, i) => {
                                    const [c, r] = item.split('.').map(v => Number(v));
                                    if (backing.cursorX < c) {
                                        layer.items[i] = `${c + 1}.${r}`;
                                    }
                                });
                                commit();
                            }
                        } break;
                        case 'Delete': {
                            if (backing.cursorX !== -1) {

                                for (let i = layer.items.length - 1; i >= 0; i--) {
                                    const item = layer.items[i];
                                    const [c, r] = item.split('.').map(v => Number(v));
                                    // console.log(`r, c = ${r}, ${c}`);
                                    if (backing.cursorX === c) {
                                        layer.items.splice(i, 1);
                                    }
                                }
                                layer.items.forEach((item, i) => {
                                    const [c, r] = item.split('.').map(v => Number(v));
                                    if (backing.cursorX < c) {
                                        layer.items[i] = `${c - 1}.${r}`;
                                    }
                                });

                                cols.splice(backing.cursorX, 1);
                                if (backing.cursorX > 0) backing.cursorX--;
                                if (cols.length === 0) backing.cursorX = -1;
                                commit();
                            }
                        } break;
                        case '1': modDiv(16); break;
                        case '2': modDiv(8); break;
                        case '3': modDiv(4); break;
                        case '4': modDiv(2); break;
                        case '5': modDiv(1); break;
                        case '.': toggleDot(); break;
                        case 'r': {
                            shiftLayer(backing);
                        } break;
                    }
                }

                const recordControl = () => {
                    const backing = editor.backing;
                    if (backing == null) throw new Error();

                    const layers = backing.layers;

                    switch (eventKey) {
                        case 'ArrowDown': {
                            if (backing.cursorY > 0) {
                                backing.cursorY--;
                                commit();
                            }
                        } break;
                        case 'ArrowUp': {
                            if (backing.cursorY < backing.recordNum - 1) {
                                backing.cursorY++;
                                commit();
                            }
                        } break;
                        case 'a': {
                            if (backing.recordNum < Layout.arrange.piano.BACKING_RECORD_MAX) {
                                backing.recordNum++;
                                if (backing.recordNum === 1) backing.cursorY = 0;
                                else {
                                    layers.forEach(l => {
                                        l.items.forEach((item, i) => {
                                            const [c, r] = item.split('.').map(v => Number(v));
                                            // console.log(`r, c = ${r}, ${c}`);
                                            if (backing.cursorY < r) {
                                                l.items[i] = `${c}.${r + 1}`;
                                            }
                                        });
                                    });
                                }
                                commit();
                            }
                        } break;
                        case 'Delete': {
                            if (backing.recordNum >= 1) {

                                layers.forEach(l => {
                                    for (let i = l.items.length - 1; i >= 0; i--) {
                                        const item = l.items[i];
                                        const [c, r] = item.split('.').map(v => Number(v));
                                        // console.log(`r, c = ${r}, ${c}`);
                                        if (backing.cursorY === r) {
                                            l.items.splice(i, 1);
                                        }
                                    }
                                    l.items.forEach((item, i) => {
                                        const [c, r] = item.split('.').map(v => Number(v));
                                        if (backing.cursorY < r) {
                                            l.items[i] = `${c}.${r - 1}`;
                                        }
                                    });
                                });

                                backing.recordNum--;
                                if (backing.recordNum === 0) backing.cursorY = -1;
                                if (backing.cursorY > 0) backing.cursorY--;
                                commit();
                            }
                        } break;
                        case 'r': {
                            shiftLayer(backing);
                        } break;
                    }
                }

                const notesControl = () => {
                    const backing = editor.backing;
                    if (backing == null) throw new Error();
                    const layer = backing.layers[backing.layerIndex];

                    const adjustRange = () => {
                        if (backing.cursorX < 0) backing.cursorX = 0;
                        if (backing.cursorY < 0) backing.cursorY = 0;
                        if (backing.cursorX > layer.cols.length - 1) backing.cursorX = layer.cols.length - 1;
                        if (backing.cursorY > backing.recordNum - 1) backing.cursorY = backing.recordNum - 1;
                    }

                    switch (eventKey) {
                        case 'ArrowDown': {
                            backing.cursorY--;
                            adjustRange();
                            commit();
                        } break;
                        case 'ArrowUp': {
                            backing.cursorY++;
                            adjustRange();
                            commit();
                        } break;
                        case 'ArrowLeft': {
                            backing.cursorX--;
                            adjustRange();
                            commit();
                            reducerRef.adjustPEBScrollCol();
                        } break;
                        case 'ArrowRight': {
                            backing.cursorX++;
                            adjustRange();
                            commit();
                            reducerRef.adjustPEBScrollCol();
                        } break;
                        case 'a': {
                            if (backing.cursorX === -1 || backing.cursorY === -1) {
                                // store.message.confirm = {
                                //     msgLines: [
                                //         'This point cannot be selected.',
                                //         ''
                                //     ],
                                //     width: 380,
                                //     buttons: [
                                //         {
                                //             name: 'ok', width: 180, shortCutKey: 'Enter', callback: () => { }
                                //         }
                                //     ]
                                // }
                                // commit();
                                break;
                            }
                            const key = `${backing.cursorX}.${backing.cursorY}`;
                            if (!layer.items.map((item) => {
                                const props = item.split(".");
                                return `${props[0]}.${props[1]}`;
                            }).includes(key)) {
                                layer.items.push(key);
                            } else {
                                const pos = layer.items
                                    .map((item) => {
                                        const props = item.split(".");
                                        return `${props[0]}.${props[1]}`;
                                    })
                                    .findIndex(i => i === key);
                                layer.items.splice(pos, 1);
                            }
                            commit();
                        } break;

                        case 'r': {
                            shiftLayer(backing);
                        } break;
                    }
                }

                switch (editor.control) {
                    case 'voicing': voicingControl(); break;
                    case 'record': recordControl(); break;
                    case 'col': colControl(); break;
                    case 'notes': notesControl(); break;
                }
            } break;
        }
    }

    const getHoldCallbacks = (eventKey: string): StoreInput.Callbacks => {
        if (arrange == null) throw new Error();

        const editor = reducerArrange.getPianoEditor();
        const callbacks: StoreInput.Callbacks = {};

        callbacks.holdShift = () => {
            if (editor.backing == null) return;

            const shiftControl = (next: StorePianoEditor.Control) => {
                editor.control = next;
                // editor.phase = 'target';
                // PBEditor.initCursor(editor);
                commit();
            }
            switch (editor.control) {
                case 'voicing': {
                    if (eventKey === 'ArrowDown') shiftControl('col');
                } break;
                case 'col': {
                    if (eventKey === 'ArrowUp') shiftControl('voicing');
                    if (eventKey === 'ArrowDown') shiftControl('notes');
                    if (eventKey === 'ArrowLeft') shiftControl('record');
                } break;
                case 'record': {
                    if (eventKey === 'ArrowUp') shiftControl('col');
                    if (eventKey === 'ArrowRight') shiftControl('notes');
                } break;
                case 'notes': {
                    if (eventKey === 'ArrowUp') shiftControl('col');
                    if (eventKey === 'ArrowLeft') shiftControl('record');
                } break;
            }
        }
        return callbacks;
    }

    return {
        control,
        getHoldCallbacks
    };
}
export default useInputPianoEditor;