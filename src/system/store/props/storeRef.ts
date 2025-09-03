namespace StoreRef {

    export type Props = {
        grid?: HTMLElement;
        header?: HTMLElement;
        pitch?: HTMLElement;
        outline?: HTMLElement;
        terminal?: HTMLElement;
        cursor?: HTMLElement;
        helper?: HTMLElement;

        elementRefs: { seq: number, ref: HTMLElement }[];
    }

    export const INITIAL: Props = {
        elementRefs: []
    };

    export type ScrollLimitProps = {
        scrollMiddleX: number;
        scrollMiddleY: number;
        rectWidth: number;
        rectHeight: number;
    }

    export const getScrollLimitProps = (ref: HTMLElement | undefined) => {
        if (ref == undefined) return null;
        const rect = ref.getBoundingClientRect();

        const props: ScrollLimitProps = {
            scrollMiddleX: ref.scrollLeft + rect.width / 2,
            scrollMiddleY: ref.scrollTop + rect.height / 2,
            rectWidth: rect.width,
            rectHeight: rect.height
        };
        return props;
    }
};
export default StoreRef;