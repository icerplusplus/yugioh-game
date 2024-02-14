import { TOOL_TYPE } from "@/utils/helper/constants"
import { createSlice } from "@reduxjs/toolkit"

const initialize_tools = () => {
    let res = {}
    for (const tool_name of Object.keys(TOOL_TYPE)) {
        res[TOOL_TYPE[tool_name]] = {
            status: false,
            info: {}
        }
    }
    return res
}

const initialState= {
    tools: initialize_tools()
}
const toolSlice = createSlice({
    name: 'tool',
    initialState,
    reducers: {
        showTool: (state, action) => {
            const { info } = action.payload;

            return {
                ...state,
                tools: {
                    ...state.tools,
                    [info.tool_type]: {
                        status: true,
                        info: info.info
                    }
                }
            };
        },
        closeTool: (state, action) => {
            const { info } = action.payload;
            return {
                tools: {
                    ...state.tools,
                    [info.tool_type]: {
                        status: false,
                        info: {}
                    }
                }
            };
        },
    },
})

export const toolActions = toolSlice.actions
  
export default toolSlice.reducer