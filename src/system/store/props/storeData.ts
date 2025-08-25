import StoreMelody from "./storeMelody";
import StoreOutline from "./storeOutline";

namespace StoreData {

    export type Props = {
        elements: StoreOutline.Element[];
        scoreTracks: StoreMelody.ScoreTrack[];
        audioTracks: StoreMelody.AudioTrack[];
    }

    export const INITIAL: Props = {
        elements: StoreOutline.getInitialElements(),
        scoreTracks: [StoreMelody.createMelodyTrackScoreInitial()],
        audioTracks: []
    }
}
export default StoreData;