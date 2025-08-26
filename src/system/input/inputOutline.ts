import type StoreInput from "../store/props/storeInput";
import type StoreOutline from "../store/props/storeOutline";
import useReducerCache from "../store/reducer/reducerCache";
import useReducerOutline from "../store/reducer/reducerOutline";
import useReducerRef from "../store/reducer/reducerRef";
import type { StoreUtil } from "../store/store";
import MusicTheory from "../util/musicTheory";

const useInputOutline = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const reducerOutline = useReducerOutline(lastStore);
    const reducerCache = useReducerCache(lastStore);
    const reducerRef = useReducerRef(lastStore);

    const control = (eventKey: string) => {

        switch (eventKey) {
            case 'a': {
                const data: StoreOutline.DataChord = {
                    beat: 4,
                    eat: 0
                }
                reducerOutline.insertElement({
                    type: 'chord',
                    data
                });
                reducerCache.calculate();
                commit();
            } break;
            case 's': {
                const data: StoreOutline.DataSection = {
                    name: 'section'
                };
                reducerOutline.insertElement({
                    type: 'section',
                    data
                });
                reducerCache.calculate();
                commit();
            } break;
            case 'm': {
                const data: StoreOutline.DataModulate = {
                    method: 'domm',
                    val: 1
                };
                reducerOutline.insertElement({
                    type: 'modulate',
                    data
                });
                reducerCache.calculate();
                commit();
            } break;
            case 'Delete': {
                reducerOutline.removeCurElement();
                reducerCache.calculate();
            } break;

            case 'ArrowUp': {
                reducerOutline.moveFocus(-1);
                reducerRef.adjustGridScrollXFromOutline();
                reducerRef.adjustOutlineScroll();
                commit();
            } break;
            case 'ArrowDown': {
                reducerOutline.moveFocus(1);
                reducerRef.adjustGridScrollXFromOutline();
                reducerRef.adjustOutlineScroll();
                commit();
            } break;
            case 'ArrowLeft': {
                reducerOutline.moveSectionFocus(-1);
                reducerRef.adjustGridScrollXFromOutline();
                reducerRef.adjustOutlineScroll();
                commit();
            } break;
            case 'ArrowRight': {
                reducerOutline.moveSectionFocus(1);
                reducerRef.adjustGridScrollXFromOutline();
                reducerRef.adjustOutlineScroll();
                commit();
            } break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7': {
                // if (isLock) break;
                const element = reducerOutline.getCurrentElement();
                if (element.type === 'chord') {
                    const chordData: StoreOutline.DataChord = { ...element.data };
                    const scaleIndex = Number(eventKey) - 1;
                    const diatonic = MusicTheory.getDiatonicDegreeChord('major', scaleIndex);
                    chordData.degree = diatonic;
                    reducerOutline.setChordData(chordData);
                    reducerCache.calculate();
                    commit();
                }
            } break;
        }
    }

    const getHoldCallbacks = (eventKey: string): StoreInput.Callbacks => {

        const callbacks: StoreInput.Callbacks = {};

        const elementType = reducerOutline.getCurrentElement().type;

        const elements = lastStore.data.elements;
        const focus = lastStore.control.outline.focus;
        const element = elements[focus];

        callbacks.holdF = () => {

            switch (elementType) {
                case 'chord': {
                    const chordData = reducerOutline.getCurrentChordData();


                    /**
                     * キーを半音単位で移動する
                     * @param dir 
                     */
                    const modKey = (dir: -1 | 1) => {
                        let isBlank = false;
                        if (chordData.degree == undefined) {
                            const diatonic = MusicTheory.getDiatonicDegreeChord('major', 0);
                            chordData.degree = diatonic;
                            isBlank = true;
                        }
                        let temp = MusicTheory.getDegree12Index(chordData.degree);
                        if (!isBlank) {
                            temp += dir;
                        }

                        if (isBlank || (temp >= 0 && temp <= 11)) {
                            const degree12 = MusicTheory.getDegree12Props(temp, dir === -1);
                            chordData.degree = { symbol: chordData.degree.symbol, ...degree12 };
                            // reducerOutline.setChordData(chordData);
                            reducerCache.calculate();
                        }
                    }

                    const modBeat = (dir: -1 | 1) => {
                        const temp = chordData.beat + dir;
                        if (temp >= 1 && temp <= 4) chordData.beat = temp;
                        // reducerOutline.setChordData(chordData);
                        reducerCache.calculate();
                        reducerRef.adjustGridScrollXFromOutline();
                        commit();
                    }
                    switch (eventKey) {
                        case 'ArrowLeft': modBeat(-1); break;
                        case 'ArrowRight': modBeat(1); break;
                        case 'ArrowUp': modKey(1); break;
                        case 'ArrowDown': modKey(-1); break;
                    }
                } break;
            }
        }

        callbacks.holdG = () => {
            const data = element.data as StoreOutline.DataChord;

            /**
             * コードブロックのケツのシンコペーションを増減する
             * @param dir 
             */
            const modEat = (dir: -1 | 1) => {
                let temp = data.eat;
                temp += dir;

                if (temp >= -2 && temp <= 2) {
                    data.eat = temp;
                    reducerOutline.setChordData(data);
                    reducerCache.calculate();
                    reducerRef.adjustGridScrollXFromOutline();
                }
                commit();
            }
            switch (eventKey) {
                case 'ArrowLeft': modEat(-1); break;
                case 'ArrowRight': modEat(1); break;
            }
        }
        return callbacks;
    }

    return {
        control,
        getHoldCallbacks
    };
}
export default useInputOutline;