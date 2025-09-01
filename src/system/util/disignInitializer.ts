import Layout from "../const/layout";
import type { StoreProps } from "../store/store";

namespace DesignInitializer {

    export const initConstProps = () => {
        const PL = Layout.pitch;
        const OL = Layout.outline;
        const EL = Layout.element;
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

            { key: '--factor-center', value: `${Math.floor((PL.ITEM_HEIGHT + 4) / 2)}px` },

            { key: '--init-record-height', value: `${EL.INIT_RECORD_HEIGHT}px` },
            { key: '--init-record-margin', value: `${EL.INIT_RECORD_MARGIN}px` },
            { key: '--section-label-height', value: `${EL.SECTION_LABEL_HEIGHT}px` },
            { key: '--section-border-height', value: `${EL.SECTION_BORDER_HEIGHT}px` },
            { key: '--section-top-margin', value: `${EL.SECTION_TOP_MARGIN}px` },
            { key: '--section-bottom-margin', value: `${EL.SECTION_BOTTOM_MARGIN}px` },
            { key: '--chord-sec-height', value: `${EL.CHORD_SEQ_HEIGHT}px` },
            { key: '--chord-tip-height', value: `${EL.CHORD_TIP_HEIGHT}px` },
            { key: '--chord-degree-height', value: `${EL.CHORD_DEGREE_HEIGHT}px` },
            { key: '--chord-name-height', value: `${EL.CHORD_NAME_HEIGHT}px` },
            { key: '--modulate-record-height', value: `${EL.MODULATE_RECRORD_HEIGHT}px` },
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