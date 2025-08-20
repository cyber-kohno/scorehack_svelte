namespace StoreRef {

    export type Props = {
        grid?: HTMLDivElement;
        header?: HTMLDivElement;
        pitch?: HTMLDivElement;
        outline?: HTMLDivElement;
        terminal?: HTMLDivElement;

        elementRefs: { seq: number, ref: HTMLDivElement }[];
    }

    export const INITIAL: Props = {
        elementRefs: []
    };
};
export default StoreRef;