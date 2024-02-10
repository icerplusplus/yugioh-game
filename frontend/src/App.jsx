import React from "react"
import { connect } from "react-redux"
import { exchange_deck_with_opponent } from "./utils/socket/sender";
import { shuffle } from "./utils/helper/global-actions";
import { PHASE_START, SIDE } from "./utils/helper/constants";
import Sky from "react-sky";
import { jaden_sky, neos_sky, yugi_sky, yusei_sky } from "./assets";
import { Game, LeftPanel } from "./components";
import AllActionsInStore from '@/store';

const App = ({
  opponent_id,
  my_id,
  player_starts,
  opponent_deck,
  dispatch_initialize_meta,
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [myDeck, setMyDeck] = React.useState(null);
  const [rawEnvironment, setRawEnvironment] = React.useState(null);

  React.useEffect(() => {
    if (opponent_id) {
      let heros = [24094653, 24094653, 24094653, 58932615, 58932615, 58932615, 21844576, 21844576, 21844576]
      heros = shuffle(heros)
      const myDeck = {
        deck: heros,
        extra_deck: [35809262, 35809262, 35809262]
      };
      exchange_deck_with_opponent(myDeck);
      setMyDeck(myDeck);
    }
  }, [opponent_id]);

  React.useEffect(() => {
    if (opponent_deck) {
      const decks = [
        my_id === player_starts ? myDeck : opponent_deck,
        opponent_id === player_starts ? myDeck : opponent_deck
      ];
      const first_side = my_id === player_starts ? SIDE.MINE : SIDE.OPPONENT;

      const rawEnvironment = {
        decks,
        first_side,
      };

      const rawMeta = {
        current_turn: player_starts,
        current_phase: PHASE_START,
        my_id,
        opponent_id,
      };

      dispatch_initialize_meta(rawMeta);
      setRawEnvironment(rawEnvironment);
      setLoaded(true);
    }
  }, [opponent_deck, my_id, player_starts, myDeck, opponent_id]);


  return (
    <>
      {loaded ? (
        <div style={{ display: "flex", height: "100vh" }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: '-10' }}>
            <Sky
              images={{
                0: yugi_sky,
                1: jaden_sky,
                2: yusei_sky,
                3: neos_sky,
              }}
              how={30}
              time={20}
              size={'200px'}
              background={'#f2f2f2'}
            />
          </div>
          <LeftPanel />
          <Game raw_environment={rawEnvironment} />
        </div>
      ) : (
        <div className="main_waiting">
          <p>Please wait for an opponent....</p>
        </div>
      )}
    </>
  )
}

const mapStateToProps = state => {
  const { opponent_id, my_id, player_starts, opponent_deck } = state.server;
  return { opponent_id, my_id, player_starts, opponent_deck };
};

const mapDispatchToProps = dispatch => ({
  // initialize: (environment) => dispatch(initialize_environment(environment)),
  dispatch_initialize_meta: (game_meta) => dispatch(AllActionsInStore.Actions.GameMeta.initalizeMeta({game_meta}))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
