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


    const setCommand = (callback: (prev: string) => string) => {
        const terminal = getTerminal();
        terminal.command = callback(terminal.command);
    }

    const splitCommand = () => {
        const terminal = getTerminal();
        const splitStringAtIndex = (str: string, index: number) => {
            return [str.slice(0, index), str.slice(index)];
        }
        return splitStringAtIndex(terminal.command, terminal.focus);
    }

    const removeCommand = () => {
        const [left, right] = splitCommand();
        if (left.length === 0) return;
        setCommand(() => left.slice(0, left.length - 1) + right);
        getTerminal().focus--;
    }

    const insertCommand = (key: string) => {
        const [left, right] = splitCommand();
        setCommand(() => left + key + right);
        getTerminal().focus += key.length;
    }
    return {
        isUse,
        open,
        close,
        getTerminal,
        splitCommand,
        removeCommand,
        insertCommand,
    };
}

export default useReducerTermianl;