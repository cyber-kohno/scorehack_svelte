import StoreMelody from "./storeMelody";
import StoreOutline from "./storeOutline";

namespace StoreData {

    export type Props = {
        elements: StoreOutline.Element[];
        tracks: StoreMelody.Track[];
    }

    export const INITIAL: Props = {
        elements: StoreOutline.getInitialElements(),
        tracks: [StoreMelody.createMelodyTrackScoreInitial()],
    }
}
export default StoreData;