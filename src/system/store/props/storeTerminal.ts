namespace StoreTerminal {

    export type Props = {
        outputs: OutputBlock[];
        command: string;
        target: string;
        focus: number;
    }
    export const createInitial = (): Props => {

        return {
            outputs: [],
            command: '',
            target: '',
            focus: 0
        }
    };

    export type BlockType = 'record' | 'table';

    export type RecordAttr = 'info' | 'backup' | 'error';
    export type HighlightType = 'func' | 'item' | 'word';

    export type RecordProps = {
        attr: RecordAttr;
        texts: TextItem[];
    }
    export type TextItem = {
        str: string;
        highlight?: HighlightType;
    }
    export type OutputBlock = {
        type: BlockType;

        record?: RecordProps;
        table?: TableProps;
    }


    export type ColAttr = 'id' | 'item' | 'sentence' | 'def';
    export type ColInfo = {
        headerName: string;
        width: number;
        attr: ColAttr;
        isNumber?: boolean;
    }
    export type TableProps = {
        cols: ColInfo[];
        table: string[][];
    }
}

export default StoreTerminal;