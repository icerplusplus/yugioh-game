import { configureStore } from "@reduxjs/toolkit";
import BattleMetaReducer from "./slices/BattleMeta";
import GameMetaReducer from "./slices/GameMeta";
import MouseReducer from "./slices/Mouse";
import ServerReducer from "./slices/Server";
import ToolReducer from "./slices/Tool";
import EnvironmentReducer from "@/store/slices/Environment";

const store = configureStore({
  reducer: {
    environment: EnvironmentReducer,
    battle: BattleMetaReducer,
    gameMeta: GameMetaReducer,
    mouse: MouseReducer,
    server: ServerReducer,
    tool: ToolReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:false
    }),
})

export default store