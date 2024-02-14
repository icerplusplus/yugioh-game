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
            const environment  = action.payload;
            
            return {
                ...state,
                environment: {
                    ...environment
                }
            };
        },
        updateEnv: (state, action) => {
            const environment  = action.payload;

            return {
                ...state,
                environment: {
                    ...environment
                }
            };
        },
        drawCard: (state, action) => {
            const {info, environment} = action.payload;
           
            const new_environment = Core.Misc.draw_card_from_deck(environment, info)
            
            return {
                ...state,
                environment: {
                    ...new_environment
                }
            }
        },
        performAttack: (state, action) => {
            const info = action.payload;
            console.log("performAttack: ", info)
            const new_environment = Core.Battle.battle(info.info, info.environment);
            console.log("performAttack, new_environment: ", new_environment)
            return {
                ...state,
                environment: {
                    ...new_environment
                }
            }
        },
    },
})
  
export const envAppActions = envAppSlice.actions;
  
export default envAppSlice.reducer;