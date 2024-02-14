import { ENVIRONMENT, CARD_TYPE, CARD_POS, SIDE, SET_SUMMON } from "@/utils/helper/constants";
import { get_unique_id_from_ennvironment } from "@/utils/helper/global-actions";
import { emit_summon } from "@/utils/socket/sender";
import AllActionsInStore from "@/store";
import store from "@/store/store";
import Misc from "./misc";

class Sommon {
    summon(info, type, environment) {
        // TODO: make summon function more generic
        if (type !== SET_SUMMON) {
            info.card.current_pos = CARD_POS.FACE;
        } else {
            info.card.current_pos = CARD_POS.SET;
        }

        console.log("info, type, environment: ", {info, type, environment})
        let current_monsters = environment[info.side][ENVIRONMENT.MONSTER_FIELD];
        console.log("init current_monsters: ", current_monsters)
        const summon_priorities = [2, 3, 1, 4, 0]
        for (const element of summon_priorities) {
            if (current_monsters[element] === CARD_TYPE.PLACEHOLDER) {
                current_monsters = current_monsters.map((monter_field,field_index) => {
                    if (field_index === element) {
                        return info.card
                    }
                    return monter_field
                })
                break;
            }
        }

        console.log("current_monsters: ", current_monsters)

        environment = {
            ...environment,
            [info.side]: {
                ...environment[info.side],
                // send monster card to field
                [ENVIRONMENT.MONSTER_FIELD]: current_monsters,
                // remove the card from the hand
                [info.src_location]: environment[info.side][info.src_location].filter((_,index) => index !== environment[info.side][info.src_location].findIndex((cardEnv) => get_unique_id_from_ennvironment(cardEnv) === get_unique_id_from_ennvironment(info.card)))
            }
        }
        
        if (info.side === SIDE.MINE) {
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