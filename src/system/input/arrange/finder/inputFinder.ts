import StorePianoEditor from "../../../store/props/arrange/piano/storePianoEditor";
import type StoreInput from "../../../store/props/storeInput";
import ArrangeUtil from "../../../store/reducer/arrangeUtil";
import useReducerCache from "../../../store/reducer/reducerCache";
import type { StoreUtil } from "../../../store/store";

const useInputFinder = (storeUtil: StoreUtil) => {
    const { lastStore, commit } = storeUtil;

    const outline = lastStore.control.outline;
    const arrange = outline.arrange;

    const arrangeReducer = ArrangeUtil.useReducer(lastStore);
    const cacheReducer = useReducerCache(lastStore);

    const control = (eventKey: string) => {
        const finder = arrangeReducer.getPianoFinder();

        const isEditor = arrange?.editor;

        const arrTrack = arrangeReducer.getCurTrack();

        const element = cacheReducer.getCurElement();
        const chordSeq = element.chordSeq;
        if (chordSeq === -1) throw new Error();

        const moveBackingList = (dir: -1 | 1) => {
            if (finder.cursor.backing === -1) return;
            const temp = finder.cursor.backing + dir;
            if (temp >= 0 && temp <= finder.list.length - 1) {
                finder.cursor.sounds = -1;
                // 移動する前に列のスクロールをリセットする
                // adjustPattColumnScroll(finder);
                finder.cursor.backing = temp;
                // adjustPattRecordScroll(finder);
                commit();
            }
        }

        const moveVoicingList = (dir: -1 | 1) => {
            const list = finder.list;
            if (list.length === 0 || finder.cursor.backing === -1) return;
            const voics = finder.list[finder.cursor.backing].voics;
            const temp = finder.cursor.sounds + dir;
            // エディタでない時は未選択を許さない
            const min = isEditor ? -1 : 0;
            if (temp >= min && temp <= voics.length - 1) {
                finder.cursor.sounds = temp;
                // adjustPattColumnScroll(finder);
                commit();
            }
        }

        const applyPattern = () => {

            const usageBkg = finder.list[finder.cursor.backing];
            const bkgPattNo = usageBkg.bkgPatt;
            const sndsPattNo = usageBkg.voics[finder.cursor.sounds];
            const lib = arrangeReducer.getPianoLib();
            const bkgPatt = lib.backingPatterns.find(patt => patt.no === bkgPattNo);
            const sndsPatt = lib.soundsPatterns.find(patt => patt.no === sndsPattNo);
            if (bkgPatt == undefined || sndsPatt == undefined) throw new Error();
            // if (bkgPatt != undefined) {
            //     editor.notes.layers = JSON.parse(JSON.stringify(bkgPatt.backing.layers));
            //     editor.record.num = bkgPatt.backing.recordNum;
            // }
            // if (sndsPatt != undefined) {
            //     editor.voicing.sounds = JSON.parse(JSON.stringify(sndsPatt.sounds));
            // }
            // コード連番と参照先ライブラリの紐付け
            const relations = arrTrack.relations;
            let relation = relations.find(r => r.chordSeq === chordSeq);
            if (relation == undefined) {
                // 未定義の場合は紐づけを新たに作成して追加
                relation = { chordSeq, bkgPatt: -1, sndsPatt: -1 };
                relations.push(relation);
            } else {
                // 紐付けが変わったことにより不参照のピアノライブラリのパターンを削除
                StorePianoEditor.deleteUnreferUnit(arrTrack);
            }
            relation.bkgPatt = bkgPatt.no;
            relation.sndsPatt = sndsPatt.no;
            lastStore.control.outline.arrange = null;
            cacheReducer.calculate();
            commit();
        }

        switch (eventKey) {
            case 'Escape':
            case 'w': {
                outline.arrange = null;
                commit();
                return;
            }
            case 'ArrowLeft': moveVoicingList(-1); break;
            case 'ArrowRight': moveVoicingList(1); break;
            case 'ArrowUp': moveBackingList(-1); break;
            case 'ArrowDown': moveBackingList(1); break;

            case 'Enter': {
                applyPattern();
            } break;
        }
    }

    const getHoldCallbacks = (eventKey: string): StoreInput.Callbacks => {
        if (arrange == null) throw new Error();

        const callbacks: StoreInput.Callbacks = {};

        return callbacks;
    }

    return {
        control,
        getHoldCallbacks
    };
}
export default useInputFinder;