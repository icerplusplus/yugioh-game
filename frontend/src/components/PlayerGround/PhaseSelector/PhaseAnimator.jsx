import React from 'react';
import { connect } from 'react-redux';
import { PHASE_START } from '@/utils/helper/constants';

import './PhaseSelector.css';

const PhaseAnimator = (props) => {
  const [phaseClass, setPhaseClass] = React.useState('phase_before phase_invisible');
  const [phaseBlackBarClass, setPhaseBlackBarClass] = React.useState('phase_invisible');

  const broadcastPhase = () => {
    setPhaseClass('phase_before');
    setPhaseBlackBarClass('');

    setTimeout(() => {
      setPhaseClass('');

      setTimeout(() => {
        setPhaseClass('phase_after');

        setTimeout(() => {
          setPhaseClass('phase_before phase_invisible');
          setPhaseBlackBarClass('phase_invisible');
        }, 500);
      }, 1000);
    }, 200);
  };

  React.useEffect(() => {
    broadcastPhase();
  }, [props.game_meta.current_phase]);

  const { game_meta, my_id } = props;

  const broadcastText = () => {
    if (game_meta.current_phase === PHASE_START) {
      return game_meta.current_turn === my_id ? <h1>Your turn!</h1> : <h1>Opponent's turn!</h1>;
    } else {
      return <h1>{game_meta.current_phase}</h1>;
    }
  };

  return (
    <div className={`phase_black_bar ${phaseBlackBarClass}`}>
      <div className={`phase_block ${phaseClass}`}>
        {broadcastText()}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const { environment } = state.environment;
  const { game_meta } = state.gameMeta;
  const { my_id, opponent_id } = state.server;
  return { environment, game_meta, my_id, opponent_id };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(PhaseAnimator);
