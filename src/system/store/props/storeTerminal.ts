namespace StoreTerminal {
   
    export type Props = {
        histories: Block[];
        command: string;
        target: string;
        focus: number;
    }
    export const createInitial = (): Props =>{

        return {
            histories: [],
            command: '',
            target: '',
            focus: 0
        }
    };

    export type BlockType = 'record' | 'table';
    export type HighlightType = 'func' | 'item';

    export type TextItem = {
        str: string;
        highlight?: HighlightType;
    }
    export type Block = {
        type: BlockType;

        texts?: TextItem[];
    }
}

export default StoreTerminal;