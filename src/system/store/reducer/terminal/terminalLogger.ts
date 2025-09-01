import type StoreTerminal from "../../props/storeTerminal"

const useTerminalLogger = (terminal: StoreTerminal.Props) => {

    const backupCommand = () => {
        terminal.outputs.push({
            type: 'record',
            record: {
                attr: 'backup',
                texts: [{ str: `$${terminal.target}>${terminal.command}` }]
            }
        });
    }

    const undefinedFunction = (funcKey: string) => {
        terminal.outputs.push({
            type: 'record',
            record: {
                attr: 'error',
                texts: [
                    { str: '[' }, { str: funcKey, highlight: 'word' }, { str: ']' },
                    { str: ' command not found.' }
                ]
            }
        });
    }

    return {
        backupCommand,
        undefinedFunction
    };
};
export default useTerminalLogger;