import { ENVIRONMENT, CARD_TYPE, CARD_POS, SIDE, SET_SUMMON } from "@/utils/helper/constants";
import { get_unique_id_from_ennvironment } from "@/utils/helper/global-actions";
import { emit_summon } from "@/utils/socket/sender";
import AllActionsInStore from "@/store";
import store from "@/store/store";
import Misc from "./misc";

class Sommon {
    summon(info, type, environment) {
        // TODO: make summon function more generic
        if (type != SET_SUMMON) {
            info.card.current_pos = CARD_POS.FACE;
        } else {
            info.card.current_pos = CARD_POS.SET;
        }
        let current_monsters = environment[info.side][ENVIRONMENT.MONSTER_FIELD];
        const summon_priorities = [2, 3, 1, 4, 0]
        for (let i = 0; i < summon_priorities.length; i++) {
            if (current_monsters[summon_priorities[i]] == CARD_TYPE.PLACEHOLDER) {
                current_monsters[summon_priorities[i]] = info.card
                break;
            }
        }
        environment[info.side][ENVIRONMENT.MONSTER_FIELD] = current_monsters
    
        // remove the card from the hand
        environment[info.side][info.src_location].splice(environment[info.side][info.src_location].findIndex((cardEnv) => get_unique_id_from_ennvironment(cardEnv) == get_unique_id_from_ennvironment(info.card)), 1);
    
        if (info.side == SIDE.MINE) {
            emit_summon(info, type)
        }
    
        store.dispatch(AllActionsInStore.Actions.Environment.updateEnv(environment))
    
        return environment;
    }

    tribute(cards, side, src, environment) {
        const res = Misc.move_cards_to_graveyard(cards, side, src, environment)
        // if (side == SIDE.MINE) {
        //     const info = {
        //         cardEnvs: cards,
        //         side: SIDE.OPPONENT,
        //         src: src,
        //     }
        //     emit_tribute(info)
        // }
    
        store.dispatch(update_environment(res))
        return res
    }
}

export default new Sommon()