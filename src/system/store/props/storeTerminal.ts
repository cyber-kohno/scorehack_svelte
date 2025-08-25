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

    export type BlockType = '';
    export type Block = {
        type: BlockType;
    }
}

export default StoreTerminal;