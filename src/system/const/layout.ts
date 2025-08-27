namespace Layout {

    export const root = {
        HEADER_HEIGHT: 40,
        OUTLINE_WIDTH: 210,
    }
    export const timelineHeader = {
        MEMORI_HEIGHT: 40,
        BLOCK_HEIGHT: 40,
        INFO_HEIGHT: 50,
    }
    export const timeline = {
        PITCH_WIDTH: 70,
        HEADER_HEIGHT: timelineHeader.MEMORI_HEIGHT + timelineHeader.BLOCK_HEIGHT + timelineHeader.INFO_HEIGHT,

    }
    export const outline = {
        HEADER_HEIGHT: 102,
        FOOTER_HEIGHT: 20,
    }

    export const pitch = {
        FRAME_WIDTH: 80,
        NUM: 94,
        ITEM_HEIGHT: 30
    }
    export const getPitchTop = (index: number) => {
        return pitch.ITEM_HEIGHT * (pitch.NUM - 1 - index);
    }

    export const element = {
        INIT_RECORD_HEIGHT: 30,
        INIT_RECORD_MARGIN: 4,
        SECTION_LABEL_HEIGHT: 30,
        SECTION_BORDER_HEIGHT: 8,
        SECTION_BOTTOM_MARGIN: 20,
        CHORD_SEQ_HEIGHT: 15,
        CHORD_TIP_HEIGHT: 20,
        CHORD_DEGREE_HEIGHT: 30,
        CHORD_NAME_HEIGHT: 30,
        MODULATE_RECRORD_HEIGHT: 30,
    }
};

export default Layout;