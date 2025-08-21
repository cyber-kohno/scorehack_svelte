namespace StoreRef {

    export type Props = {
        grid?: HTMLElement ;
        header?: HTMLElement  ;
        pitch?: HTMLElement ;
        outline?: HTMLElement ;
        terminal?: HTMLElement ;

        elementRefs: { seq: number, ref: HTMLElement  }[];
    }

    export const INITIAL: Props = {
        elementRefs: []
    };
};
export default StoreRef;