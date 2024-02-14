import React from 'react';
import { connect } from 'react-redux';
import AllActionsInStore from '@/store';
import SpellView from './Spell/SpellView';
import MonsterView from './Monster/MonsterView';
import { is_monster, is_spell, is_trap } from '@/utils/helper/global-actions';


function CardView(props) {
    
    const onMouseEnterHandler = (info) => {
        props.mouse_in_view(info);
    }

    const {card, style} = props;

    if (card) {
        const card_type = card.card.card_type // card is decorated with env\
        const info = {
            cardEnv: card
        }

        if (is_monster(card_type)) {
            return <MonsterView style={style} card={props.card}/>
        } else if (is_spell(card_type)) {
            return <SpellView style={style} card={props.card}/>
        } else {
            return <p>Developing...</p>
        }
    } else {
        return (
            <p>Loading...</p>
        )
    }
}

const mapStateToProps = state => {
    const { left_panel_cardEnv } = state.mouse
    const { environment } = state.environment
    return { left_panel_cardEnv, environment };
};

const mapDispatchToProps = dispatch => ({
    mouse_in_view: (info) => dispatch(AllActionsInStore.Actions.Mouse.leftPanelMouseOnFocus({info})),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CardView);
