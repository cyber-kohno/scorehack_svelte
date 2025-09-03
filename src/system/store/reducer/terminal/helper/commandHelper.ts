import type StoreOutline from "../../../props/storeOutline";
import StorePreview from "../../../props/storePreview";
import StoreTerminal from "../../../props/storeTerminal";
import type { StoreProps } from "../../../store";
import useReducerTermianl from "../../reducerTerminal";

const useCommandHelper = (lastStore: StoreProps) => {

    const terminal = useReducerTermianl(lastStore).getTerminal();

    const build = () => {
        terminal.helper = null;

        const sectors = terminal.target.split('\\');
        const orderItems = terminal.command.split(' ');
        const commKey = orderItems[0];
        const args = orderItems.slice(1);
        // if (args.length === 0) return;

        let list: string[] = [];

        switch (sectors[0]) {
            case 'harmonize': {
                switch (sectors[1] as StoreOutline.ElementType) {
                    case 'init':
                }
            }
            case 'melody': {
                switch (commKey) {
                    case 'sf': {
                        if (args.length === 1) list = StorePreview.InstrumentNames;
                    }
                }
            }
        }

        const keyword = orderItems[orderItems.length - 1];
        list = list.filter((item) => item.indexOf(keyword) !== -1);
        if (list.length > 0) {
            terminal.helper = StoreTerminal.createHelperInitial();
            const helper = terminal.helper;
            helper.list = list;
            helper.keyword = keyword
        }
    }

    return { build };
}
export default useCommandHelper;