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