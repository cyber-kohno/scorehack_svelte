import Layout from "../../const/layout";
import type StorePianoEditor from "../../store/props/arrange/piano/storePianoEditor";
import type StoreInput from "../../store/props/storeInput";
import useReducerArrange from "../../store/reducer/reducerArrange";
import type { StoreUtil } from "../../store/store";
import MusicTheory from "../../util/musicTheory";

const useInputPianoEditor = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const reducerArrange = useReducerArrange(lastStore);

    const outline = lastStore.control.outline;
    const arrange = outline.arrange;


    const control = (eventKey: string) => {
        if (arrange == null) throw new Error();

        const editor = reducerArrange.getPianoEditor();

        switch (editor.phase) {
            case 'edit': {

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

                const recordControl = () => {
                    if(editor.backing == null) throw new Error();
                    const backing = editor.backing;
                    const layers = editor.backing.layers;

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
                    }
                }

                switch (editor.control) {
                    case 'voicing': voicingControl(); break;
                    case 'record': recordControl(); break;
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