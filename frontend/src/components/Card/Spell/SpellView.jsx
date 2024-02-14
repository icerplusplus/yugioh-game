import React from 'react';
import '../Monster/MonsterView.css'
/**
 * View container for a monster card
 */
function SpellView(props) {

    const {card, style} = props;
    if (card) {
        return (
            <img style = {style} className="field_card" key={`card_${card.unique_count}`} src={'https://ygoprodeck.com/pics/' + card.card.key + '.jpg'}/>
        )
    } 

}

export default SpellView;
