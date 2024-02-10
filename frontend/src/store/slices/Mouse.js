import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    left_panel_cardEnv: undefined,
}
const mouseSlice = createSlice({
    name: 'mouse',
    initialState,
    reducers: {
        leftPanelMouseOnFocus: (state, action) => {
            const { info } = action.payload;
            return {
                ...state,
                left_panel_cardEnv: info.cardEnv
            };
        },
    },
})

export const mouseActions = mouseSlice.actions
  
export default mouseSlice.reducer