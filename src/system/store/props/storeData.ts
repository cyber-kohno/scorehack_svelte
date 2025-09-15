import ArrangeData from "./arrange/arrangeData";
import StoreMelody from "./storeMelody";
import StoreOutline from "./storeOutline";

namespace StoreData {

    export type Props = {
        elements: StoreOutline.Element[];
        scoreTracks: StoreMelody.ScoreTrack[];
        audioTracks: StoreMelody.AudioTrack[];
        arrange: ArrangeData.Props;
    }

    export const INITIAL: Props = {
        elements: StoreOutline.getInitialElements(),
        scoreTracks: [StoreMelody.createMelodyTrackScoreInitial()],
        audioTracks: [],
        arrange: ArrangeData.INITIAL
    }
}
export default StoreData;