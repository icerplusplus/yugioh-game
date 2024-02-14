import MonsterEnv from "@/components/Card/Monster/MonsterEnv";
import { CARD_TYPE, DST_DIRECT_ATTACK, ENVIRONMENT, PHASE, SIDE } from "./constants";
import SpellEnv from "@/components/Card/Spell/SpellEnv";
import { spell_database } from "@/components/Card/Spell/SpellData";
import { monster_database } from "@/components/Card/Monster/MonsterData";
import { card_meta } from "@/components/Card/CardMeta";

export function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export const get_unique_id_from_ennvironment = (cardEnv) => {
    return cardEnv.card.key + "_" + cardEnv.unique_count
}

// Core helper

export const cards_existed = (environment, cards, locations) => {
    if (!Array.isArray(cards)) {
        cards = [cards]
    }

    if (!Array.isArray(locations)) {
        locations = [locations]
    }

    const existed = {}
    for (const card of cards) {
        for (const location of locations) {
            for (const environment_cardEnv of environment[SIDE.MINE][location]) {
                if (environment_cardEnv.card && card === environment_cardEnv.card.key) {
                    existed[card] = true
                }
            }
        }
        if (!existed[card]) {
            return false
        }
    }
    return true
}

// src is the unique key
export const get_fusion_material = (environment, src) => {
    const locations = [ENVIRONMENT.MONSTER_FIELD, ENVIRONMENT.HAND]
    let res = []
    
    const fusion_monster_env = get_cardEnv_by_unique_id(environment, SIDE.MINE, ENVIRONMENT.EXTRA_DECK, src)
    const fusion_materials_raw = fusion_monster_env.card.fusion_materials
    
    for (const location of locations) {
        for (const environment_cardEnv of environment[SIDE.MINE][location]) {
            if (environment_cardEnv.card && fusion_materials_raw.includes(environment_cardEnv.card.key)) {
                res.push(environment_cardEnv)
            }
        }
    }

    return res
}

export const get_monsters_to_be_attacked = (environment) => {
    const opponent_cards = environment[SIDE.OPPONENT][ENVIRONMENT.MONSTER_FIELD]
    let res = []
    opponent_cards.forEach((cardEnv, index) => {
        if (cardEnv.card) {
            res.push(index)
        }
    })
    return res
}

export const is_fusion_monster = (cardEnv) => {
    return cardEnv.card.card_type === CARD_TYPE.MONSTER.FUSION
}

export const get_all_cards_on_field = (environment) => {
    let res = []
    for (const location of [ENVIRONMENT.MONSTER_FIELD, ENVIRONMENT.GRAVEYARD, ENVIRONMENT.SPELL_FIELD, ENVIRONMENT.HAND]) {
        res = res.concat(environment[SIDE.MINE][location])
    }
    return res
}

export const get_cards_by_filter_and_location = (environment, location, filterFunc) => {
    return environment[SIDE.MINE][location].filter(cardEnv => filterFunc(cardEnv))
}


export const get_cardEnv_by_unique_id = (environment, side, location, unique_id) => {
    for (const monsterEnv of environment[side][location]) {
        if (monsterEnv !== CARD_TYPE.PLACEHOLDER && get_unique_id_from_ennvironment(monsterEnv) === unique_id) {
            return monsterEnv
        }
    }
}


let current_game_unique_count = 0

export const is_monster = (card_type) => {
    return card_type.substring(0, 7) === 'MONSTER'
}

export const is_spell = (card_type) => {
    return card_type.substring(0, 5) === 'SPELL'
}

export const is_trap = (card_type) => {
    return card_type.substring(0, 4) === 'TRAP'
}

export const load_card_to_environment = function (card) {
    const card_type = card_meta[card.key].card_type;
    current_game_unique_count++;
    if (is_monster(card_type)) {
        return new MonsterEnv(card, current_game_unique_count);
    } else if (is_spell(card_type)) {
        return new SpellEnv(card, current_game_unique_count);
    } else {
        return;
    }
}

export const create_card = (card_key) => {
    const card_type = card_meta[card_key].card_type;
    if (is_monster(card_type)) {
        return monster_database[card_key]();
    } else if (is_spell(card_type)) {
        return spell_database[card_key]();
    } else {
        return;
    }
}

export const calculate_aim_style = (info) => {
    let {src_index, dst_index } = info;
    console.log("calculate_aim_style: ", info)
    const res = {
        cardIndex: src_index,
        style: {}
    }
    src_index -= 1
    dst_index -= 1
    const new_dst_index = 4 - dst_index
    const neg = src_index > new_dst_index ? -1 : 1;
    const diff = Math.abs(src_index - new_dst_index)


    if (diff === 1) {
        res.style.transform = `rotate(${neg * 45}deg)`
    } else if (diff === 2) {
        res.style.transform = `rotate(${neg * 55}deg)`
    } else if (diff === 3) {
        res.style.transform = `rotate(${neg * 65}deg)`
    } else if (diff === 4) {
        res.style.transform = `rotate(${neg * 71}deg)`
    }

    return res
}

export const calculate_battle_style = (info) => {
    const {src_index, dst_index } = info;

    const res = {
        cardIndex: get_styled_index_from_environment(src_index),
        style: {
            transform: 'translateY(calc(-200% - 60px))'
        },
        side_style: {
            zIndex: 1
        }
    }

    if (dst_index === DST_DIRECT_ATTACK) {
        // direct attack;
        if (src_index === 2) {
        } else if (src_index === 0 || src_index === 4) {
            const neg = src_index === 0 ? 1 : -1
            res.style.transform = `rotate(${neg * 41}deg) translateY(calc(-300% - 60px))`
        } else {
            // 1 and 3
            const neg = src_index === 1 ? 1 : -1
            res.style.transform = `rotate(${neg * 24}deg) translateY(calc(-200% - 90px))`
        }
    } else {
        // others attack
        const new_dst_index = 4 - dst_index
        const neg = src_index > new_dst_index ? -1 : 1;
        const diff = Math.abs(src_index - new_dst_index)
        if (diff === 0) {
            res.style.transform = `translateY(calc(-100% - 50px))`
        } else if (diff === 1) {
            res.style.transform = `rotate(${neg * 45}deg) translateY(calc(-10vw - 100px))`
        } else if (diff === 2) {
            res.style.transform = `rotate(${neg * 55}deg) translateY(calc(-10vw - 200px))`
        } else if (diff === 3) {
            res.style.transform = `rotate(${neg * 65}deg) translateY(calc(-10vw - 350px))`
        } else if (diff === 4) {
            res.style.transform = `rotate(${neg * 71}deg) translateY(calc(-10vw - 480px))`
        }

    }
    return res
}

export const constructFieldFromEnv = (side, environment) => {
    const field_size = 14
    const env_magic_index = 0
    const graveyard_index = 6
    const extra_deck_index = 7
    const deck_index = 13
    const special_indexes = [env_magic_index, graveyard_index, extra_deck_index, deck_index]

    const cards = environment[side][ENVIRONMENT.MONSTER_FIELD].concat(environment[side][ENVIRONMENT.SPELL_FIELD])

    // render the environment onto the field
    let count = -1
    let field_cards = new Array(field_size).fill(null).map((_, index) =>  {        
        if (special_indexes.includes(index)) {
            // deadling with special indexes
            if (index === graveyard_index) {
                return environment[side][ENVIRONMENT.GRAVEYARD]
            } 
            return CARD_TYPE.PLACEHOLDER
        } else {
            count++
            return cards[count]
        }
    });
    return field_cards

}


export const returnAttackStatus = (cardEnv, game_meta, environment) => {

    const disabled_class = 'no_hand_option'
    const enabled_class = 'show_summon'

    // console.log(cardEnv.card)

    // if it is not battle phase or the card is not a monster
    if (!cardEnv.card || game_meta.current_phase != PHASE.BATTLE_PHASE || 
        !is_monster(cardEnv.card.card_type)) {
            return {
                can_direct_attack: disabled_class,
                can_others_attack: disabled_class
            }
    }

    // if there is no monster on enemy's field
    for (let monster of environment[SIDE.OPPONENT][ENVIRONMENT.MONSTER_FIELD]) {
        if (monster != CARD_TYPE.PLACEHOLDER) {
            return {
                can_direct_attack: disabled_class,
                can_others_attack: enabled_class
            }
        }
    }

    return {
        can_direct_attack: enabled_class,
        can_others_attack: disabled_class
    }
    
}



export const get_styled_index_from_environment = (indexes) => {

    if (!indexes) return

    if (indexes === -1) {
        return -2
    }

    if (typeof indexes === 'number') {
        return indexes + 1
    } else {
        return indexes.map((value) => {
            return value + 1
        })
    }
    
}