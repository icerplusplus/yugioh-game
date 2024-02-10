import { CARD_TYPE, DST_DIRECT_ATTACK, ENVIRONMENT, SIDE } from '@/utils/helper/constants';
import { get_unique_id_from_ennvironment } from '@/utils/helper/global-actions';

class Battle {
    battle(info, environment) {
        const { dst, side, src_index, dst_index } = info

        // side is the attacker's side
        const getting_attacked_side = side === SIDE.MINE ? SIDE.OPPONENT : SIDE.MINE;
 
        const current_cards_attacker = environment[side][ENVIRONMENT.MONSTER_FIELD]
        const current_cards_getting_attacked = environment[getting_attacked_side][ENVIRONMENT.MONSTER_FIELD]
        const attacker_card = current_cards_attacker[src_index]
    
        // direct attack
        if (dst === DST_DIRECT_ATTACK) {
            
            // environment[getting_attacked_side]['hp'] -= attacker_card.current_atk
            return {
                ...environment,
                [getting_attacked_side]: {
                    ... environment[getting_attacked_side],
                    hp: environment[getting_attacked_side].hp - attacker_card.current_atk
                }
            }
        }
    
        // others attack (attacking other monsters)
        const getting_attacked_card = current_cards_getting_attacked[dst_index]
                
                    
        // calculate damage
        if (attacker_card.current_atk > getting_attacked_card.current_atk) {
            environment = this.battle_to_graveyard(getting_attacked_card, getting_attacked_side, dst_index, environment)
            environment[getting_attacked_side].hp -= (attacker_card.current_atk - getting_attacked_card.current_atk)
    
        } else if (attacker_card.current_atk < getting_attacked_card.current_atk) {
            environment = this.battle_to_graveyard(attacker_card, side, src_index, environment)
            environment[side].hp -= (getting_attacked_card.current_atk - attacker_card.current_atk)
    
        } else {
            environment = this.battle_to_graveyard(getting_attacked_card, getting_attacked_side, dst_index, environment)
            environment = this.battle_to_graveyard(attacker_card, side, src_index, environment)
        }
    
        return environment
    }

    battle_to_graveyard(card, side, index, environment) {
        // environment[side][ENVIRONMENT.GRAVEYARD].push(card)
        // environment[side][ENVIRONMENT.MONSTER_FIELD][index] = CARD_TYPE.PLACEHOLDER
        console.log("monster destroyed index: ", index)
        console.log("environment[side][ENVIRONMENT.MONSTER_FIELD]: ", environment[side][ENVIRONMENT.MONSTER_FIELD])
        return {
            ...environment,
            [side]: {
                ...environment[side],
                [ENVIRONMENT.GRAVEYARD]: [
                    ...environment[side][ENVIRONMENT.GRAVEYARD],
                    card
                ],
                [ENVIRONMENT.MONSTER_FIELD]: environment[side][ENVIRONMENT.MONSTER_FIELD].map((item, field_index) => {
                    if (index === field_index) {
                        return CARD_TYPE.PLACEHOLDER
                    }
                    else {
                        return item
                    }
                })
            }
        }
    }
    
    get_battle_index(src_monster, dst, side, environment) {
        // side is the attacker's side
        const getting_attacked_side = side === SIDE.MINE ? SIDE.OPPONENT : SIDE.MINE;
        console.log("get_battle_index: ", environment)
        const current_cards_attacker = environment[side][ENVIRONMENT.MONSTER_FIELD]
        const current_cards_getting_attacked = environment[getting_attacked_side][ENVIRONMENT.MONSTER_FIELD]
        
        let src_index = current_cards_attacker.findIndex((cardEnv) => cardEnv.card && get_unique_id_from_ennvironment(cardEnv) === src_monster);
        let dst_index = dst;
        if (dst !== DST_DIRECT_ATTACK) {
            dst_index = current_cards_getting_attacked.findIndex((cardEnv) => cardEnv.card && get_unique_id_from_ennvironment(cardEnv) === dst);
        }
    
        return {
            src_index, 
            dst_index
        }
    }
}



export default new Battle()