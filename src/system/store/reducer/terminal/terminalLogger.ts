import type StoreTerminal from "../../props/storeTerminal"

const useTerminalLogger = (terminal: StoreTerminal.Props) => {

    const backupCommand = () => {
        terminal.outputs.push({
            type: 'record',
            texts: [{ str: `${terminal.target}>${terminal.command}` }]
        });
    }

    const undefinedFunction = () => {
        terminal.outputs.push({
            type: 'record',
            texts: [{ str: `${terminal.target}>${terminal.command}` }]
        });
    }

    return {
        backupCommand,
        undefinedFunction
    };
};
export default useTerminalLogger;