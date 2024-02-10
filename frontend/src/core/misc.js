import { get_unique_id_from_ennvironment } from '@/utils/helper/global-actions'
import { ENVIRONMENT, CARD_TYPE, SIDE } from '@/utils/helper/constants';
import { emit_move_cards_to_graveyard } from '@/utils/socket/sender';
import AllActionsInStore from "@/store";
import store from '@/store/store';

class Misc {

    draw_card_from_deck = (environment, info) => {
        for (let i = 0; i < info.amount; i++) {
            environment[info.side][ENVIRONMENT.HAND].push(environment[info.side][ENVIRONMENT.DECK].shift())
        }
        return environment
    }

    move_cards_to_graveyard = (cards, side, src, environment) => {
        const current_cards = environment[side][src]
        for (let i = 0; i < current_cards.length; i++) {
            if (!current_cards[i].card) {
                continue
            }
            if (cards.includes(get_unique_id_from_ennvironment(current_cards[i]))) {
                environment[side][ENVIRONMENT.GRAVEYARD].push(current_cards[i])
                if (src == ENVIRONMENT.HAND) {
                    environment[side][src].splice(i, 1)
                } else {
                    environment[side][src][i] = CARD_TYPE.PLACEHOLDER
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

export default new Misc()