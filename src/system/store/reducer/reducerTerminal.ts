import type { StoreProps } from "../store";
import useReducerRef from "./reducerRef";
import CommandRegistUtil from "./terminal/commandRegistUtil";
import useTerminalLogger from "./terminal/terminalLogger";

const useReducerTermianl = (lastStore: StoreProps) => {

    const isUse = () => lastStore.terminal != null;

    const open = () => {
        lastStore.terminal = {
            outputs: [],
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
            focus: 0,
            helper: null
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
        // スペース（区切り文字）が連続することは許さない
        if(left.slice(-1) === ' ' && key === ' ') return;
        setCommand(() => left + key + right);
        getTerminal().focus += key.length;
    }
    const moveFocus = (dir: -1 | 1) => {
        const terminal = getTerminal();
        const newFocus = terminal.focus + dir;
        const command = terminal.command;
        if (newFocus >= 0 && newFocus <= command.length) terminal.focus = newFocus;
    }

    /**
     * コマンドを実行する。
     */
    const registCommand = () => {

        const terminal = getTerminal();
        const { backupCommand, undefinedFunction } = useTerminalLogger(terminal);


        // コマンドのバックアップを出力する
        backupCommand();

        if (terminal.command !== '') {
            const orderItems = terminal.command.split(' ');
            const funcKey = orderItems[0];
            const args = orderItems.slice(1);

            const register = CommandRegistUtil.useCommandRegister(lastStore);
            const funcs = register.getFuncs();

            const func = funcs.find(f => f.funcKey === funcKey);
            if (func == undefined) {
                undefinedFunction(funcKey);
            } else {
                func.callback(args);
            }
        }
        terminal.focus = 0;
        terminal.command = '';

        // const { adjustTerminalScroll } = useReducerRef(lastStore);
        // adjustTerminalScroll();
    }
    return {
        isUse,
        open,
        close,
        getTerminal,
        splitCommand,
        removeCommand,
        insertCommand,
        moveFocus,
        registCommand,
    };
}

export default useReducerTermianl;