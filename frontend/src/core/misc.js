import { get_unique_id_from_ennvironment } from '@/utils/helper/global-actions'
import { ENVIRONMENT, CARD_TYPE, SIDE } from '@/utils/helper/constants';
import { emit_move_cards_to_graveyard } from '@/utils/socket/sender';
import AllActionsInStore from "@/store";
import store from '@/store/store';

class Misc {
    draw_card_from_deck = (environment, info) => {
       
        const card = environment[info.side][ENVIRONMENT.DECK]
        if (card.length === 0) return environment;

        let i = 0
        while (i < info.amount) {
            const newDrawCard = card.filter((_, index) => index === card.length - 1)[0]
            environment = {
                ...environment,
                [info.side]: {
                    ...environment[info.side],
                    [ENVIRONMENT.HAND]: [
                        ...environment[info.side][ENVIRONMENT.HAND],
                        newDrawCard
                    ],
                }
            }
            i++
        }

        const newEnv = {
            ...environment,
            [info.side]: {
                ...environment[info.side],
                [ENVIRONMENT.DECK]: card.filter((_, index) => index !== 0),
            }
        }

        console.log("newEnv: ", newEnv)

        return newEnv
    }

    move_cards_to_graveyard = (cards, side, src, environment) => {
        const current_cards = environment[side][src]
        for (let i = 0; i < current_cards.length; i++) {
            if (!current_cards[i].card) {
                console.log("ingore move to graveyard...")
                continue
            }
            if (cards.includes(get_unique_id_from_ennvironment(current_cards[i]))) {
                environment[side][ENVIRONMENT.GRAVEYARD].push(current_cards[i])

                if (src === ENVIRONMENT.HAND) {
                    environment[side][src].splice(i, 1)
                    console.log("move_cards_to_graveyard_from hand: ", environment)
                } else {
                    environment[side][src][i] = CARD_TYPE.PLACEHOLDER
                    console.log("move_cards_to_graveyard_from field: ", environment)
                }            
    
            }
        }
    
        const info = {
            cards: cards, 
            side: SIDE.OPPONENT,
            src: src,
        }
    
        store.dispatch(AllActionsInStore.Actions.Environment.updateEnv(environment))
        emit_move_cards_to_graveyard(info)
    
        return environment
    }
}

export const draw_card_from_deck = (environment, info) => {
        
    console.log("draw_card_from_deck: ", {
        environment, info
    })
    let i = 0
    while (i < info.amount) {
        const card = environment[info.side][ENVIRONMENT.DECK].shift()
        environment[info.side][ENVIRONMENT.HAND].push(card)
        i++
    }
    return environment
}

export default new Misc()