import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { CardView } from "@/components";
import { ENVIRONMENT, CARD_TYPE, SIDE, CARD_POS, CARD_SELECT_TYPE, MONSTER_ATTACK_TYPE, PHASE, DST_DIRECT_ATTACK, BATTLE_SELECT, ANIMATION_TYPE } from "@/utils/helper/constants";
import AllActionsInStore from '@/store';
import { calculate_aim_style, calculate_battle_style, constructFieldFromEnv, get_styled_index_from_environment, get_unique_id_from_ennvironment, is_spell, returnAttackStatus } from "@/utils/helper/global-actions";
import { TransitionGroup } from "react-transition-group"; // ES6

import "./Side.css";

function Side(props) {
    const [state, setState] = React.useState({
        cardClicked: -1,
        // change this style to make the card move
        cardBattleStyle: {
            cardIndex: -1
        },
    })

    // mouse enter
    const onMouseEnterHandler = (info) => {
        if (info.cardEnv.card) {
            props.mouse_in_view(info);
        } else {
            return
        }

        const { battle_selection, side } = props

        if (side === SIDE.OPPONENT && battle_selection?.cards) {
            const info_battle_select = {
                mouse_in: info.cardIndex
            }
            props.updateBattleSelection(BATTLE_SELECT.MOUSE_IN_SELECT, info_battle_select)
        } 

    }

    // mouse leave
    const cardMouseMoveHandler = () => {
        const { battle_selection, side } = props
        if (side === SIDE.OPPONENT && battle_selection?.cards) {
            const info_battle_select = {
                mouse_in: -1
            }
            props.updateBattleSelection(BATTLE_SELECT.MOUSE_IN_SELECT, info_battle_select)
        }
        setState(prev => ({...prev, cardClicked: -1}))
    }

    const onCardClickHandler = (info, cardIndex) => {
        // clicking the card on the field
        if (!info.cardEnv.card) {
            return
        }

        if (props?.battle_selection?.cards) {
            if (props.side === SIDE.OPPONENT) {
                // wait to pick a monster
                const info_battle_select = {
                    selection: get_unique_id_from_ennvironment(info.cardEnv)
                }
                props.updateBattleSelection(BATTLE_SELECT.CONFIRM_SELECT, info_battle_select)
            } 
            return
        }

        setState(prev => ({...prev, cardClicked: cardIndex}))
    }

    const monsterAttackOnClick = (attack_type, info) => {

        const src_monster_id = get_unique_id_from_ennvironment(info.cardEnv)
        
        if (attack_type === MONSTER_ATTACK_TYPE.DIRECT_ATTACK) {
            // direct attack
            const info_battle = {
                src_monster: src_monster_id,
                dst: DST_DIRECT_ATTACK,
            }
            props.dispatch_direct_attack(info_battle)

        } else {
            const info_battle_select = {
                src_monster: src_monster_id,
                src_monster_index: info.cardIndex
            }
            props.updateBattleSelection(BATTLE_SELECT.START_SELECT, info_battle_select)
        }
    }

    let side_style = undefined
    const { cardBattleStyle } = state
    const { side, environment, game_meta, battle_selection, battle_animation } = props
    if (cardBattleStyle?.side === side) {
        side_style = cardBattleStyle.side_style
    }

    React.useEffect(() => {
        const { battle_animation, side, battle_selection } = props;
        // when the attack animation has finished
        if (state?.cardBattleStyle?.style && state.cardBattleStyle.type === ANIMATION_TYPE.ATTACK_ANIMATION) {
            setTimeout(() => setState(prev => ({
                ...prev,
                cardBattleStyle: {
                    cardIndex: -1
                }
            })), 300)
            
        }

        if (side === SIDE.MINE && battle_selection?.selection) {

            props.updateBattleSelection(BATTLE_SELECT.END_SELECT)
            const info_battle = {
                src_monster: battle_selection.src_monster,
                // monster can only attack one monster
                dst: battle_selection.selection
            }
            props.dispatch_others_attack(info_battle)
        }

        if (side === SIDE.MINE && battle_selection?.mouse_in && !battle_selection?.selection) {
            if (battle_selection.mouse_in !== -1) {
                const info = {
                    src_index: battle_selection.src_monster_index,
                    dst_index: battle_selection.mouse_in
                }
                setState(prev => ({
                    ...prev,
                    cardBattleStyle: {
                    // cardIndex: battle_selection.src_monster_index,
                    // style: {
                    //     transform: 'rotate(45deg)'
                    // },
                    ...calculate_aim_style(info),
                    type: ANIMATION_TYPE.AIM_ANIMATION
                }}))
            } else {
                setState(prev => ({
                    ...prev,
                    cardBattleStyle: {
                        cardIndex: -1
                    }
                }))
            }
            
        }

    }, [props.battle_animation, props.side, props.battle_selection, props.environment]) // state.cardBattleStyle

    React.useEffect(() => {
        if (props.battle_animation.key) {
            // perform animation
            setState(prev => ({
                ...prev,
                cardBattleStyle: {
                    ...calculate_battle_style(props.battle_animation),
                    side: props.battle_animation.side,
                    type: ANIMATION_TYPE.ATTACK_ANIMATION
                }
            }))
        }
    }, [props.battle_animation])

    const initializeSide = React.useCallback(() => {
        
        if (!environment) {
            return
        }
        const field_cards = constructFieldFromEnv(side, environment)
        const highlightIndexes = side === SIDE.OPPONENT ? get_styled_index_from_environment(battle_selection?.cards) : undefined
        return field_cards.map((cardEnv, index) => {
            const cardView = () => {
                if (index === 6 && cardEnv.length > 0) {
                    // graveyard
                    return (
                        <CardView card={cardEnv[cardEnv.length - 1]} key="side_card" />
                    )
                }

                if (index === 13) {
                    return (
                        <h1 className = "deck_remaining">
                            {environment[side][ENVIRONMENT.DECK].length}
                        </h1>
                    )
                }

                if (cardEnv.card) {
                    if (cardEnv.current_pos === CARD_POS.FACE || is_spell(cardEnv.card.card_type)) {
                        return (
                            <CardView style={side === cardBattleStyle.side && index === cardBattleStyle.cardIndex? cardBattleStyle.style : undefined} card={cardEnv} key="side_card" />
                        )
                    } else if (cardEnv.current_pos === CARD_POS.SET) {
                        return <img className="side_card_set" key="side_card_set" src={'https://ms.yugipedia.com//f/fd/Back-Anime-ZX-2.png'}/>
                    }
                }
            }
            const info = {
                cardEnv: cardEnv,
                cardIndex: index
            }

            const hasOptions = index === state.cardClicked ? "show_hand_option" : "no_hand_option"

            const {can_direct_attack, can_others_attack} = returnAttackStatus(cardEnv, game_meta, environment)

            return (
                <div 
                    className={`card_outer_box ${highlightIndexes?.includes(index) ? 'card_flashing' : ''}`}
                    key={"side_" + side + index} 
                    onMouseEnter={()=>onMouseEnterHandler(info)}
                    onClick={()=>onCardClickHandler(info, index)}
                    onMouseLeave={() => cardMouseMoveHandler()}>
                    <div className={`card_box`}>
                        <div className={hasOptions}>
                            <div className={can_direct_attack} 
                                onClick={()=>monsterAttackOnClick(MONSTER_ATTACK_TYPE.DIRECT_ATTACK, info)}>
                                    Direct Attack
                            </div>
                            <div className={can_others_attack}
                                onClick={()=>monsterAttackOnClick(MONSTER_ATTACK_TYPE.OTHERS_ATTACK, info)}>
                                    Attack
                            </div>
                        </div>
                        
                        <div className={"card_mask" + (cardEnv.current_pos !== CARD_POS.SET ? "" : " side_card_set")}/>
                        <TransitionGroup
                            transitionName="side"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}>
                                <div>
                                    {cardView()}
                                </div>
                        </TransitionGroup>

                    </div>
                </div>
            );
        });
    }, [environment, battle_animation, side, battle_selection, state, side_style])


    return <div style={side_style} className={"side_box_" + side}>{initializeSide()}</div>;

}

const mapStateToProps = state => {
    const { left_panel_cardEnv } = state.mouse
    const { environment } = state.environment
    const { game_meta } = state.gameMeta
    const { battle_meta } = state.battle
    return { left_panel_cardEnv, environment, game_meta, battle_meta};
};

const mapDispatchToProps = dispatch => ({
    // initialize: (environment) => dispatch(initialize_environment(environment)),
    mouse_in_view: (info) => dispatch(AllActionsInStore.Actions.Mouse.leftPanelMouseOnFocus({info: info})),
    dispatch_direct_attack: (info) => dispatch(AllActionsInStore.Actions.BattleMeta.directAttackOrOthersAttack({info: info})),
    dispatch_others_attack: (info) => dispatch(AllActionsInStore.Actions.BattleMeta.directAttackOrOthersAttack({info: info})),
    // opponent attack ack will change the battle step to damage step
    dispatch_change_to_damage_step: () => dispatch(AllActionsInStore.Actions.BattleMeta.opponentAttackAck()),
    dispatch_perform_attack: ({info, environment}) => dispatch(AllActionsInStore.Actions.Environment.performAttack({info: info, environment: environment})),
    dispatch_end_battle: () => dispatch(AllActionsInStore.Actions.BattleMeta.endBattle())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Side);