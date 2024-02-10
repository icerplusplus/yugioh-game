// Card constants
export const ENVIRONMENT = {
    DECK: 'DECK',
    EXTRA_DECK: 'EXTRA_DECK',
    MONSTER_FIELD: 'MONSTER_FIELD',
    SPELL_FIELD: 'SPELL_FIELD',
    HAND: 'HAND',
    GRAVEYARD: 'GRAVEYARD',
    BANISHED: 'BANISHED',
    // link and pendulum will be updated in the future
}

export const SIDE = {
    MINE: 'MINE',
    OPPONENT: 'OPPONENT'
}

export const SET_SUMMON = "SET_SUMMON";


export const CARD_TYPE = {
    MONSTER: {
        NORMAL: 'MONSTER_NORMAL',
        EFFECT: 'MONSTER_EFFECT',
        RITUAL: 'MONSTER_RITUAL',
        FUSION: 'MONSTER_FUSION',
        SYNCHRO: 'MONSTER_SYNCHRO',
        // xyz, pendulum and link will be updated in the future

    },
    SPELL: {
        NORMAL: 'SPELL_NORMAL',
        QUICK: 'SPELL_QUICK',
        EQUIPMENT: 'SPELL_EQUIPMENT',
        CONTINUOUS: 'SPELL_CONTINUOUS',
        ENVIRONMENT: 'SPELL_ENVIRONMENT',   
    },
    TRAP: {
        NORMAL: 'TRAP_NORMAL',
        CONTINUOUS: 'TRAP_CONTINUOUS',
        COUNTER: 'TRAP_COUNTER',
    },
    PLACEHOLDER: 'PLACEHOLDER'

}

export const CARD_POS = {
    FACE: 'FACE',
    DEFENSE: 'DEFENSE',
    SET: 'SET',
    UNSURE: 'UNSURE'
}


/**
 * Monster constant
 */
export const ATTRIBUTE = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
    EARTH: 'EARTH',
    FIRE: 'FIRE',
    WATER: 'WATER',
    WIND: 'WIND',
    DIVINE: 'DIVINE',
}

// PlayerGround constants

export const PHASE_START = 'Game start'
export const PHASE = {
    DRAW_PHASE: 'Draw',
    STANDBY_PHASE: 'Standby',
    MAIN_PHASE_1: 'MP1',
    BATTLE_PHASE: 'Battle',
    MAIN_PHASE_2: 'MP2',
    END_PHASE: 'End'
}

export const BATTLE_STEP = {
    START_STEP: "START_STEP",
    DAMAGE_STEP: "DAMAGE_STEP",
    END_STEP: "END_STEP"
}


export const CARD_SELECT_TYPE = {
    CARD_SELECT_TRIBUTE_SUMMON: 'CARD_SELECT_TRIBUTE_SUMMON',
    CARD_SELECT_BATTLE_SELECT: 'CARD_SELECT_BATTLE_SELECT',
    CARD_SELECT_SPECIAL_SUMMON_TARGET: 'CARD_SELECT_SPECIAL_SUMMON_TARGET',
    CARD_SELECT_SPECIAL_SUMMON_MATERIALS: 'CARD_SELECT_SPECIAL_SUMMON_MATERIALS' 
}

export const MONSTER_ATTACK_TYPE = {
    DIRECT_ATTACK: 'DIRECT_ATTACK',
    OTHERS_ATTACK: 'OTHERS_ATTACK'
}

// to show that the dst is the player (instead of a monster)
export const DST_DIRECT_ATTACK = "DST_DIRECT_ATTACK"

//--- tool actions
export const TOOL_TYPE = {
    CARD_SELECTOR: 'TOOL_TYPE_CARD_SELECTOR'
}