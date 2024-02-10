import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    my_id: undefined,
    opponent_id: undefined,
    opponent_deck: undefined,
    player_starts: undefined,
}
const serverSlice = createSlice({
    name: 'server',
    initialState,
    reducers: {
        getOpponentId: (state, action) => {
            const { info } = action.payload;
            return {
                ...state,
                my_id: info.my_id,
                opponent_id: info.opponent_id,
                player_starts: info.player_starts
            };
        },
        getOpponentDeck: (state, action) => {
            const { info } = action.payload;
            return {
                ...state,
                opponent_deck: info.deck
            };
        },
    },
})

export const serverActions = serverSlice.actions
  
export default serverSlice.reducer