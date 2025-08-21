import Layout from "../const/layout";
import type { StoreProps } from "../store/store";

namespace DesignInitializer {

    export const initConstProps = () => {
        const PL = Layout.pitch;
        const OL = Layout.outline;
        setCustomProps([
            { key: '--root-header-height', value: `${Layout.root.HEADER_HEIGHT}px` },
            { key: '--outline-width', value: `${Layout.root.OUTLINE_WIDTH}px` },
            { key: '--pitch-width', value: `${PL.FRAME_WIDTH}px` },
            { key: '--pitch-item-height', value: `${PL.ITEM_HEIGHT}px` },
            { key: '--pitch-frame-height', value: `${PL.ITEM_HEIGHT * PL.NUM}px` },
            { key: '--timeline-header-height', value: `${Layout.timeline.HEADER_HEIGHT}px` },
            { key: '--timeline-pitch-width', value: `${Layout.timeline.PITCH_WIDTH}px` },
            { key: '--block-height', value: `${Layout.timelineHeader.BLOCK_HEIGHT}px` },
            { key: '--memori-height', value: `${Layout.timelineHeader.MEMORI_HEIGHT}px` },
            { key: '--info-height', value: `${Layout.timelineHeader.INFO_HEIGHT}px` },
            { key: '--outline-header-height', value: `${OL.HEADER_HEIGHT}px` },
            { key: '--element-list-height', value: `calc(100% - ${OL.HEADER_HEIGHT + OL.FOOTER_HEIGHT}px)` },
        ]);
    }
    export const initVariableProps = (lastStore: StoreProps) => {
        const beatSum = lastStore.cache.chordCaches.reduce((total, cur) => total + cur.viewPosWidth, 0);
        setCustomProps([
            { key: '--beat-sum', value: `${beatSum}px` },
        ]);
    }

    const setCustomProps = (customProps: { key: string, value: string }[]) => {

        customProps.forEach(prop => {
            document.documentElement.style.setProperty(prop.key, prop.value);
        });
    }
};
export default DesignInitializer;