import React from 'react';
import { connect } from 'react-redux';
import { Progress } from 'semantic-ui-react';
import { SIDE } from '@/utils/helper/constants';

import './HealthBar.css';

function HealthBar(props) {
    const display_data = {
        id: props.side == SIDE.MINE ? props.my_id : props.opponent_id,
        hp: props.environment ? props.environment[props.side].hp : 0  
    }
    // console.log("props.environment: ", props)

    return (
        <div className={"health_bar health_bar_" + props.side}>
            <div className={"health_bar_avatar_username_container"}>
                <img className="health_bar_avatar" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/84dc13b7-a2e7-4b45-83ec-311e72e82900/ddg84ua-02d600ad-dc7f-4cdf-b510-c1916324803a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvODRkYzEzYjctYTJlNy00YjQ1LTgzZWMtMzExZTcyZTgyOTAwXC9kZGc4NHVhLTAyZDYwMGFkLWRjN2YtNGNkZi1iNTEwLWMxOTE2MzI0ODAzYS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.U8nOU_7_z8s5trKUg4ZrbNCm8n5Cg4u3b18-_BgkC3U" />
                <div className="health_bar_username_container">
                    <p className="health_bar_username">Player</p>
                    <p>{display_data.hp}</p>
                </div>
            </div>
            <Progress percent={(display_data.hp)/8000*100} indicating />
        </div>
    )
}

const mapStateToProps = state => {
    const { left_panel_cardEnv } = state.mouse
    const { environment } = state.environment
    const { game_meta } = state.gameMeta
    const { my_id, opponent_id } = state.server
    return { left_panel_cardEnv, environment, game_meta, my_id, opponent_id };
};

const mapDispatchToProps = dispatch => ({
    // initialize: (environment) => dispatch(initialize_environment(environment)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HealthBar);