import { createSlice } from "@reduxjs/toolkit"
import Core from "@/core"

const initialState= {
    environment: undefined,
}

const envAppSlice = createSlice({
    name: 'environment',
    initialState,
    reducers: {
        initializeEnv: (state, action) => {
            const { environment } = action.payload;
            return {
                environment: {
                    ...environment
                }
            };
        },
        updateEnv: (state, action) => {
            const { environment } = action.payload;
            return {
                environment: {
                    ...environment
                }
            };
        },
        drawCard: (state, action) => {
            const { info } = action.payload;
            const new_environment = Core.Misc.draw_card_from_deck(state.environment, info);
            return {
                environment: {
                    ...new_environment
                }
            }
        },
        performAttack: (state, action) => {
            const { info } = action.payload;
            const new_environment = Core.Battle.battle(info, state.environment);
            return {
                environment: {
                    ...new_environment
                }
            }
        },
    },
})
  
export const envAppActions = envAppSlice.actions;
  
export default envAppSlice.reducer;