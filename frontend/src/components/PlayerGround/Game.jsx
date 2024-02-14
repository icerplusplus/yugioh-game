import React from 'react'
import { connect } from 'react-redux'
import AllActionsInStore from '@/store'
import { create_card, load_card_to_environment } from '@/utils/helper/global-actions'
import { CARD_TYPE, SIDE, ENVIRONMENT, PHASE, PHASE_START, TOOL_TYPE } from '@/utils/helper/constants'

// sender functions
import { emit_change_phase } from '@/utils/socket/sender'

import Field from './Field/Field';
import Hand from './Hand/Hand';
import Settings from './Settings/Settings';
import PhaseSelector from './PhaseSelector/PhaseSelector'
import HealthBar from './HealthBar/HealthBar'
import CardSelector from './CardSelector/CardSelector'
import PhaseAnimator from './PhaseSelector/PhaseAnimator'

import './Game.css';

function Game(props) {
    const [state, setState] = React.useState({
        transformRotateX: '45deg', // rotateX(45deg)
        scale: 1.0, // scale(1.0)
        x_pos: 0, // translate(0px, 0px)
        y_pos: -100,
        show_card_selector: false,
        card_selector_info: undefined,
    })
    
    const auto_next_phase = (next_phase) => {

        const WAIT_TIME = 2100
        setTimeout(() => {
            // change to next phase
            const info = {
                next_phase: next_phase
            }
            
            emit_change_phase(info);
            props.dispatch_change_phase(info);
        }, WAIT_TIME);
    }

    const initializeEnvironment = (raw_environment) => {
        const make_placeholders = () => {
            let placeholderArray = Array(5).fill(CARD_TYPE.PLACEHOLDER)
            return placeholderArray;
        }
        console.log("raw_environment.decks: ", raw_environment)
        const loaded_card_env = raw_environment.decks.map(deck => {
            return deck.deck.map(card_key => {
                return load_card_to_environment(create_card(card_key));
            })
        })

        const load_extra_card_env = raw_environment.decks.map(deck => {
            return deck.extra_deck.map(card_key => {
                return load_card_to_environment(create_card(card_key));
            })
        })
        
        const mine_index = raw_environment.first_side === SIDE.MINE ? 0 : 1;
        const opponent_index = raw_environment.first_side === SIDE.OPPONENT ? 0 : 1;

        let environment = {
            [SIDE.MINE]: {
                [ENVIRONMENT.HAND]: loaded_card_env[mine_index].slice(0, 5),
                [ENVIRONMENT.MONSTER_FIELD]: make_placeholders(),
                [ENVIRONMENT.SPELL_FIELD]: make_placeholders(),
                [ENVIRONMENT.GRAVEYARD]: [],
                [ENVIRONMENT.DECK]: loaded_card_env[mine_index].slice(5),
                [ENVIRONMENT.EXTRA_DECK]: load_extra_card_env[mine_index].slice(0, 3),
                hp: 8000,
            },
            [SIDE.OPPONENT]: {
                [ENVIRONMENT.HAND]: loaded_card_env[opponent_index].slice(0, 5),
                [ENVIRONMENT.MONSTER_FIELD]: make_placeholders(),
                [ENVIRONMENT.SPELL_FIELD]: make_placeholders(),
                [ENVIRONMENT.GRAVEYARD]: [],
                [ENVIRONMENT.DECK]: loaded_card_env[opponent_index].slice(5),
                [ENVIRONMENT.EXTRA_DECK]: load_extra_card_env[opponent_index].slice(3),
                hp: 8000,
            },
            monsters: {},
            spells: {},
            traps: {},
            environment_spell: {},
            // statusKey: Math.random(),
        }
        
        props.initialize(environment);
    }

    const getTransformRotateXValue = (event, value) => {
        let valueString = `${value}deg`;
        if (valueString !== state.transformRotateX) {
            setState({ transformRotateX: valueString });
        }
    };

    const onChangeSize = (value) => {
        const scale = state.scale;
        if (value === 'increase') {
            if (scale < 1.4) {
                setState({ scale: scale + 0.1 });
                //this.forceUpdate();
            }
        } else {
            if (scale > 0.7) {
                setState({ scale: scale - 0.1 });
                //this.forceUpdate();
            }
        }
    }

    const onChangePosition = (value) => {
        const { x_pos, y_pos } = state;
        const MOVE_AMOUNT = 10;
        if (value === 'up') {
            setState({ y_pos: y_pos - MOVE_AMOUNT });
            //this.forceUpdate();
        } else if (value === 'down') {
            setState({ y_pos: y_pos + MOVE_AMOUNT });
            //this.forceUpdate();
        } else if (value === 'left') {
            setState({ x_pos: x_pos - MOVE_AMOUNT });
            //this.forceUpdate();
        } else if (value === 'right') {
            setState({ x_pos: x_pos + MOVE_AMOUNT });
            //this.forceUpdate();
        } else {
            setState({ x_pos: 0, y_pos: 0 });
            //this.forceUpdate();
        }
    }

    // const close_card_selector = () => {
    //     setState({show_card_selector: false})
    // }

    const call_card_selector = (info) => {
        setState({show_card_selector: true, card_selector_info: info})
    }

    React.useEffect(() => {
        initializeEnvironment(props.raw_environment)
    }, [])

    React.useEffect(() => {
        const current_phase = props.game_meta.current_phase

        switch (current_phase) {
            case PHASE_START:
                auto_next_phase(PHASE.DRAW_PHASE)  
                break;
            case PHASE.DRAW_PHASE:
                const info = {
                    side: props.my_id === props.game_meta.current_turn ? SIDE.MINE : SIDE.OPPONENT,
                    amount: 1
                }
                props.dispatch_draw_card({info, environment: props.environment});
                auto_next_phase(PHASE.STANDBY_PHASE);
                break;
            case PHASE.STANDBY_PHASE:
                auto_next_phase(PHASE.MAIN_PHASE_1)
                break;
            case PHASE.END_PHASE:
                auto_next_phase(PHASE_START)
            default:
                break;
        }
    }, [props.game_meta.current_phase])

    const { transformRotateX, scale, x_pos, y_pos} = state;
    const { tools } = props;

    return (
        <div className="game_container">
            <div className="field_settings_container">
                <PhaseAnimator />
                <CardSelector key={"selector-" + Math.random()} show_card_selector={tools[TOOL_TYPE.CARD_SELECTOR].status} card_selector_info={tools[TOOL_TYPE.CARD_SELECTOR].info}/>
                <HealthBar side='MINE' />
                <HealthBar side='OPPONENT' />
                <PhaseSelector />
                <div className="hand_field_container">
                    <Hand side='OPPONENT' />
                    <div className="field_container">
                        <Field transformRotateX={transformRotateX} scale={scale} x_pos={x_pos} y_pos={y_pos} call_card_selector={call_card_selector}/>
                    </div>
                    <Hand side='MINE' call_card_selector={call_card_selector} />
                </div>
                <Settings onChangePosition={onChangePosition} onChangeSize={onChangeSize} getTransformRotateXValue={getTransformRotateXValue} />
            </div>
        </div>

    )

}

const mapStateToProps = state => {
    const { environment } = state.environment;
    const { game_meta } = state.gameMeta;
    const { my_id } = state.server;
    const { tools } = state.tool;
    return { environment, game_meta, my_id, tools};
};

const mapDispatchToProps = dispatch => ({
    initialize: (environment) => dispatch(AllActionsInStore.Actions.Environment.initializeEnv(environment)),
    dispatch_draw_card: ({info, environment}) => dispatch(AllActionsInStore.Actions.Environment.drawCard({info, environment})),
    dispatch_change_phase: (info) => dispatch(AllActionsInStore.Actions.GameMeta.changePhase({info}))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);