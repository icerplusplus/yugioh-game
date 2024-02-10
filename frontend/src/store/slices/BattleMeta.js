import { BATTLE_STEP, SIDE } from "@/utils/helper/constants";
import { emit_attack_start } from "@/utils/socket/sender";
import { createSlice } from "@reduxjs/toolkit"
import Core from "@/core"

const initialState= {
    battle_meta: undefined,
}
const battleMetaSlice = createSlice({
    name: 'battleMeta',
    initialState,
    reducers: {
      directAttackOrOthersAttack: (state, action) => {
        const { info } = action.payload;
        // console.log(info)
        const battle_meta = {
            src_monster: info.src_monster,
            dst: info.dst,
            battle_step: BATTLE_STEP.START_STEP,
            side: SIDE.MINE
        }
        emit_attack_start(battle_meta)
        return {
            ...state,
            battle_meta
        };
      },
      opponentAttackStart: (state, action) => {
        const { info } = action.payload;
        return{
            ...state,
            battle_meta: {
                src_monster: info.src_monster,
                dst: info.dst,
                battle_step: BATTLE_STEP.START_STEP,
                side: SIDE.OPPONENT
            }
        }
      },
      opponentAttackAck: (state, action) => {
        const { info } = action.payload;
        const { environment } = info;
        const { src_monster, dst, side } = state.battle_meta

        const { src_index, dst_index } = Core.Battle.get_battle_index(src_monster, dst, side, environment)
       
        return {
            ...state,
            battle_meta: {
                ...state.battle_meta,
                battle_step: BATTLE_STEP.DAMAGE_STEP,
                src_index: src_index,
                dst_index: dst_index,
            }
        }
      },
      endBattle: (state) => {
        return {
            ...state,
            battle_meta: undefined
        }
      },
    },
  })
  
  export const battleMetaActions = battleMetaSlice.actions
  
  export default battleMetaSlice.reducer