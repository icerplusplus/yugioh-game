import { createSlice } from "@reduxjs/toolkit";
import { PHASE } from "@/utils/helper/constants";

const initialState= {
    game_meta: undefined,
}
const gameMetaSlice = createSlice({
    name: 'gameMeta',
    initialState,
    reducers: {
        changePhase: (state, action) => {
            const { info } = action.payload;

            let current_turn = state.game_meta.current_turn
            if (info.next_phase === PHASE.END_PHASE) {
                const { my_id, opponent_id } = state.game_meta
                if (current_turn === my_id) {
                    current_turn = opponent_id
                } else {
                    current_turn = my_id
                }

            }
            const gameMeta = {
                game_meta: {
                    ...state.game_meta,
                    current_phase: info.next_phase,
                    current_turn: current_turn
                }
            }
            return {
                ...state,
                ...gameMeta
            };
        },
        initalizeMeta: (state, action) => {
            const { game_meta } = action.payload;
            return {
                ...state,
                game_meta: {
                    ...game_meta
                }
            }
        },
    },
})
  
export const gameMetaActions = gameMetaSlice.actions
  
export default gameMetaSlice.reducer