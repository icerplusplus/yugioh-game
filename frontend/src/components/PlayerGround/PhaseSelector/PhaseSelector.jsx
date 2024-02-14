import React from 'react';
import { connect } from 'react-redux';
import { PHASE, PHASE_START } from '@/utils/helper/constants';
import AllActionsInStore from '@/store';
import { emit_change_phase } from '@/utils/socket/sender';

import './PhaseSelector.css';

function PhaseSelector(props) {

    const handlePhaseChange = (next_phase, phase_button_class) => {
        if (phase_button_class === 'phase_button_disabled') {
            return
        }

        const info = {
            next_phase: next_phase
        }

        emit_change_phase(info)
        // update self
        props.dispatch_change_phase(info);
    }

    const phaseArray = Object.keys(PHASE).map((phase) => {

        const phase_button_class = (phase) => {
            
            const current_phase = props.game_meta.current_phase
            const current_turn = props.game_meta.current_turn
            const current_class = 'phase_button_current'
            const enabled_class = `phase_button_enabled phase_button_enabled_${phase}`
            const disabled_class = 'phase_button_disabled'
            if (current_phase === PHASE_START) {
                return disabled_class
            }

            if (current_phase === phase) {
                return current_class
            }

           

            if (phase === PHASE.DRAW_PHASE || 
                phase === PHASE.STANDBY_PHASE ||
                current_phase === PHASE.DRAW_PHASE ||
                current_phase === PHASE.STANDBY_PHASE || current_turn != props.my_id) {
                return disabled_class
            }


            if (Object.values(PHASE).indexOf(current_phase) < Object.values(PHASE).indexOf(phase)) {
                return enabled_class
            } else {
                return disabled_class
            }
        }

        const res_phase_button_class = phase_button_class(PHASE[phase])

        return (
            <div className = {`phase_button ${res_phase_button_class}`} key={`phase_button_${PHASE[phase]}`}
                onClick={() => handlePhaseChange(PHASE[phase], res_phase_button_class)}>
                {PHASE[phase]}
            </div>
        )
    })
    
    return(
        <div className = "turn_selector_container">
            {phaseArray}
        </div>
    )
}

const mapStateToProps = state => {
    const { environment } = state.environment;
    const { game_meta } = state.gameMeta;
    const { my_id, opponent_id } = state.server;
    return { environment, game_meta, my_id, opponent_id};
};

const mapDispatchToProps = dispatch => ({
    // initialize: (environment) => dispatch(initialize_environment(environment)),
    dispatch_change_phase: (info) => dispatch(AllActionsInStore.Actions.GameMeta.changePhase({info}))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PhaseSelector);