import type { StoreProps } from "../store";

const useReducerTermianl = (lastStore: StoreProps) => {

    const isUse = () => lastStore.terminal != null;

    const open = () => {
        lastStore.terminal = {
            histories: [],
            target: (() => {
                const control = lastStore.control;
                const data = lastStore.data;
                let ret = 'unknown';
                const set = (v: string) => { ret = v };
                const add = (v: string) => { ret += '\\' + v };
                switch (control.mode) {
                    case 'harmonize': {
                        const element = data.elements[control.outline.focus];
                        set('harmonize');
                        add(element.type);
                        switch (element.type) {
                            case 'init': {

                            } break;
                        }
                    } break;
                    case 'melody': {
                        set('melody');
                    }
                }
                return ret;
            })(),
            command: '',
            focus: 0
        };
    };
    const close = () => {
        lastStore.terminal = null;
    };

        const getTerminal = () => {
        const terminal = lastStore.terminal;
        if (terminal == null) throw new Error('terminalがnullでgetTerminalを呼び出さしてはならない。');
        return terminal;
    }
    return {
        isUse,
        open,
        close,
        getTerminal,
    };
}

export default useReducerTermianl;