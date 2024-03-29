import { get_all_cards_on_field, get_cardEnv_by_unique_id, get_unique_id_from_ennvironment } from "@/utils/helper/global-actions"
import { emit_activate_effect, emit_card_finish_operate, emit_effect_ack } from "@/utils/socket/sender"
import { ENVIRONMENT,CARD_TYPE, SIDE } from "@/utils/helper/constants"
import AllActionsInStore from "@/store"
import store from "@/store/store"
import Misc from "./misc"

class Effect {
    constructor() {

        this.category = undefined

        this.type = undefined

        this.chain = undefined

        // A function returns true if the effect is able to be runned
        this.condition = undefined

        // A function that returns the targets (with unique number)
        this.target = undefined

        // A function that specifies the operations
        this.operation = undefined
    }

    canActive(card, environment) {
        for (const effect of card.effects) {
            if (effect.condition(environment)) {
                return true
            }
        }
        return false
    }

    activate(cardEnv, src_location, side, environment) {
        const info = {
            cardEnv: cardEnv,
            src_location: src_location
        }
    
        if (src_location == ENVIRONMENT.HAND) {
            let current_field = environment[side][ENVIRONMENT.SPELL_FIELD];
            const summon_priorities = [2, 3, 1, 4, 0]
            for (let i = 0; i < summon_priorities.length; i++) {
                if (current_field[summon_priorities[i]] == CARD_TYPE.PLACEHOLDER) {
                    current_field[summon_priorities[i]] = cardEnv
                    break;
                }
            }
            environment[side][ENVIRONMENT.SPELL_FIELD] = current_field
        
            // remove the card from the hand
            environment[side][src_location].splice(environment[side][src_location].findIndex((cardEnv_i) => get_unique_id_from_ennvironment(cardEnv_i) == get_unique_id_from_ennvironment(cardEnv)), 1);
        }
    
        store.dispatch(AllActionsInStore.Actions.Environment.updateEnv(environment))
    
        if (side == SIDE.MINE) {
            emit_activate_effect(info)
        }
    
        return environment;
    }

        
    async operate(data, environment) {
        const { cardEnv, src_location } = data.data
        // TODO: change to a generic location
        const local_card = get_cardEnv_by_unique_id(environment, SIDE.MINE, ENVIRONMENT.SPELL_FIELD, get_unique_id_from_ennvironment(cardEnv))
        // get tools
        await local_card.card.effects[0].operation(environment)

        const info = {
            cardEnv: cardEnv,
            src_location: src_location
        }

        emit_card_finish_operate(info)
        Misc.move_cards_to_graveyard([get_unique_id_from_ennvironment(local_card)], SIDE.MINE, ENVIRONMENT.SPELL_FIELD, environment)    
    }


    opponent_activate(data, environment) {
        const activated_card = data.data.cardEnv
        const src_location = data.data.src_location
        const local_card = get_cardEnv_by_unique_id(environment, SIDE.OPPONENT, src_location, get_unique_id_from_ennvironment(activated_card))
        activate(local_card, src_location, SIDE.OPPONENT, environment)

        const card_able_to_chain = get_cards_to_chain(local_card, environment)

        if (card_able_to_chain.length > 0) {
            // TODO: return promise
        } else {
            emit_effect_ack()
        }
    }


    opponent_effect_ack(data, environment) {
        // TODO: chain on card yourself has been activating
        emit_effect_ack()
    }

    opponent_operated(data, environment) {
        const { cardEnv, src_location } = data.data
        // TODO: change to a generic location
        const local_card = get_cardEnv_by_unique_id(environment, SIDE.OPPONENT, ENVIRONMENT.SPELL_FIELD, get_unique_id_from_ennvironment(cardEnv))
        move_activated_card_to_graveyard(local_card, ENVIRONMENT.SPELL_FIELD, SIDE.OPPONENT, environment)
    }

    get_cards_to_chain(prev, environment) {
        const all_cards = get_all_cards_on_field(environment)
        let card_able_to_chain = []
        for (const cardEnv of all_cards) {
            if (cardEnv?.card?.effects) {
                for (const effect of cardEnv.card.effects) {
                    if (effect.condition(environment, prev)) {
                        card_able_to_chain.push(cardEnv)
                    }
                }
            }
        }
        return card_able_to_chain
    }

    move_activated_card_to_graveyard(cardEnv, src_location, side, environment) {
        setTimeout(() => {
            Misc.move_cards_to_graveyard([get_unique_id_from_ennvironment(cardEnv)], side, src_location, environment)
        }, 3000)
    }
}

export default new Effect()