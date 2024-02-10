import StoreProvider from "./Provider";
import { envAppActions } from "./slices/Environment"
import { battleMetaActions } from "./slices/BattleMeta"
import { gameMetaActions } from "./slices/GameMeta"
import { mouseActions } from "./slices/Mouse"
import { serverActions } from "./slices/Server"
import { toolActions } from "./slices/Tool"
import { useDispatch, useSelector, useStore } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch
export const useAppSelector = useSelector
export const useAppStore = useStore

export default {
    Provider: StoreProvider,
    Actions: {
        BattleMeta: battleMetaActions,
        Environment: envAppActions,
        GameMeta: gameMetaActions,
        Mouse: mouseActions,
        Server: serverActions,
        Tool: toolActions,
    },
}