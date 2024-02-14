import React from 'react';
import { connect } from 'react-redux';
import { CARD_SELECT_TYPE, ENVIRONMENT, NORMAL_SUMMON, PHASE, SET_SUMMON, SIDE, TOOL_TYPE } from '@/utils/helper/constants';
import { get_unique_id_from_ennvironment, is_monster, is_spell, is_trap } from '@/utils/helper/global-actions';
import { TransitionGroup } from 'react-transition-group' // ES6
import { CardView } from '@/components';
import Core from '@/core';
import AllActionsInStore from '@/store';

import './Hand.css'

function Hand(props) {
    const [state, setState] = React.useState({cardClicked: -1})
    
    const {side, environment, game_meta} = props;


    const cardOnClickHandler = (cardIndex) => {
        setState({cardClicked: cardIndex})
    }

    const cardMouseMoveHandler = () => {
        setState({cardClicked: -1})
    }

    const summon_final = (info, type, event) => {
        Core.Summon.summon(info, type, environment)
        setState({cardClicked: -1})
        
        event.stopPropagation();
    }

    const summonOnclick = (info, type) => event => {
        const { environment } = props
        if (info.card.card.level > 4) {
            // tribute summon; Send a promise to call card selector
            return new Promise((resolve, reject) => {
                const info_show_tool = {
                    tool_type: TOOL_TYPE.CARD_SELECTOR,
                    info: {
                        resolve: resolve,
                        reject: reject,
                        cardEnv: info.card,
                        type: CARD_SELECT_TYPE.CARD_SELECT_TRIBUTE_SUMMON
                    }
                }
                // props.call_card_selector(info.card)
                props.dispatch_show_tool(info_show_tool)
            }).then((result) => {
                Core.Summon.tribute(result.cardEnvs, SIDE.MINE, ENVIRONMENT.MONSTER_FIELD, environment)
                setTimeout(()=>summon_final(info, type, event), 500)
                
                
            })
        } else {
            summon_final(info, type, event)
        }
    }

    const activateOnClick = (cardEnv) => event => {

        const { environment, call_card_selector} = props
        const tools = {
            call_card_selector: call_card_selector
        }

        for (const effect of cardEnv.card.effects) {
            if (effect.condition(environment)) {

                Core.Effect.activate(cardEnv, ENVIRONMENT.HAND, SIDE.MINE, environment)

                // TODO: remove the card from field to the graveyard
            }
        }

        setState({cardClicked: -1})
        event.stopPropagation()
    }

    const onMouseEnterHandler = (info) => {
        if (info.cardEnv.card) {
            props.dispatch_mouse_in_view(info);
        }
    }

    return(
        <TransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
        >
                <div className={side === SIDE.MINE ? "hand_container_mine" : "hand_container_opponent"}>
                    {environment && side === SIDE.MINE && environment[side][ENVIRONMENT.HAND].map((cardEnv, cardIndex) => {
                            const info_in = {
                                cardEnv: cardEnv
                            }

                            const get_hand_card_view = () => {
                                const hasOptions = cardIndex === state.cardClicked ? "show_hand_option" : "no_hand_option"
                        
                                if (is_monster(cardEnv.card.card_type)) {
                                    const can_normal_summon = cardEnv.card.can_normal_summon(cardEnv.card, environment) ? "show_summon" : "no_hand_option"
                                    const can_set = cardEnv.card.can_normal_summon(cardEnv.card, environment) ? "show_summon" : "no_hand_option"
                                    const can_special_summon = cardEnv.card.can_special_summon(cardEnv.card, environment)? "show_summon" : "no_hand_option"
                                    const info = {
                                        side: side,
                                        card: cardEnv,
                                        src_location: ENVIRONMENT.HAND
                                    }
                                    return (
                                            <div key={'monter_card'}>
                                                <div className={hasOptions}>
                                                    <div className={can_normal_summon} onClick={summonOnclick(info, NORMAL_SUMMON)}>Summon</div>
                                                    <div className={can_special_summon}>Special</div>
                                                    <div className={can_set} onClick={summonOnclick(info, SET_SUMMON)}>Set</div>
                                                </div>
                                                <CardView card={cardEnv} />
                                            </div>
                                    )
                                } else if (is_spell(cardEnv.card.card_type)) {
                                    //TODO: can activate the spell or not
                                    const can_activate = Core.Effect.canActive(cardEnv.card, environment) ? "show_summon" : "no_hand_option"
                                    const can_set = game_meta.current_phase === PHASE.MAIN_PHASE_1 ? "show_summon" : "no_hand_option"
                                    return (
                                        <div key={'spell_card'}>
                                            <div className={hasOptions}>
                                                <div className={can_activate} onClick={activateOnClick(cardEnv)}>Activate</div>
                                                <div className={can_set}>Set</div>
                                            </div>
                                            <CardView card={cardEnv} />
                                        </div>
                                    )
                                } 
                                // else {
                                //     //traps
                                //     return <p key={'trap_card'}>fuck</p>
                                // }
                        
                            }

                            return (
                                <div className="hand_card" key={"hand_card_" + get_unique_id_from_ennvironment(cardEnv)} 
                                    onClick={() => cardOnClickHandler(cardIndex)} 
                                    onMouseLeave={() => cardMouseMoveHandler()} 
                                    onMouseEnter={()=>onMouseEnterHandler(info_in)}>
                                        {
                                            get_hand_card_view()
                                        }
                                </div>
                            )
                        })}
                    {environment && side !== SIDE.MINE && environment[side][ENVIRONMENT.HAND].map((_,index) => {
                        return (
                            // back side for the opponent's
                            <img key={"hand_card_opponent_" + index}  style={{width: '5%', marginRight: '10px'}} src={'https://ms.yugipedia.com//f/fd/Back-Anime-ZX-2.png'}/>
                        )
                    })}    
               </div>
        </TransitionGroup>
    )
}


const mapStateToProps = state => {
    const { left_panel_cardEnv } = state.mouse
    const { environment } = state.environment
    const { game_meta } = state.gameMeta
    return { left_panel_cardEnv, environment, game_meta };
};

const mapDispatchToProps = dispatch => ({
    // initialize: (environment) => dispatch(initialize_environment(environment)),
    dispatchUpdateEnv: (environment) => dispatch(AllActionsInStore.Actions.Environment.updateEnv(environment)),
    dispatch_mouse_in_view: (info) => dispatch(AllActionsInStore.Actions.Mouse.leftPanelMouseOnFocus({info})),
    dispatch_show_tool: (info) => dispatch(AllActionsInStore.Actions.Tool.showTool({info}))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Hand);