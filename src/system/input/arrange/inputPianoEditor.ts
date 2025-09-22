import Layout from "../../const/layout";
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

                switch (editor.control) {
                    case 'voicing': voicingControl(); break;
                }
            } break;
        }
    }

    return {
        control
    };
}
export default useInputPianoEditor;