import React from 'react'
import { connect } from 'react-redux'
import { CardView } from '@/components'
import { Button, Modal } from 'semantic-ui-react'
import { CARD_SELECT_TYPE, SIDE, ENVIRONMENT, TOOL_TYPE } from '@/utils/helper/constants'
import { get_unique_id_from_ennvironment } from '@/utils/helper/global-actions'
import AllActionsInStore from '@/store'

import './CardSelector.css';

function CardSelector(props) {

    const [state, setState] = React.useState({
        num_selected: 0,
        selected_cards: {},
        executable: false,
    })

    const cardOnClickHandler = (card_unique_key, num_needs_selected) => {
        let {selected_cards, num_selected } = this.state
        if (card_unique_key in selected_cards) {
            delete selected_cards[card_unique_key]
            num_selected--
        } else {
            selected_cards[card_unique_key] = true
            num_selected++
        }
        
        setState({
            selected_cards: selected_cards,
            num_selected: num_selected,
            executable: num_selected == num_needs_selected
        })
    }

    const build_up_selections = (cards, num_needs_selected) => {
        return cards.map(cardEnv => {
            const card_unique_key = get_unique_id_from_ennvironment(cardEnv)
            return(                
                <div className={"selector_card_box" + (card_unique_key in state.selected_cards ? " selected" : "")} key={"select_card_" + card_unique_key} onClick={() => { cardOnClickHandler(card_unique_key, num_needs_selected) }}>
                    <CardView card={cardEnv} />
                </div>
            )
        })
    }


    const get_all_monsters = (side, location, environment) => {
        return environment[side][location].filter(cardEnv => cardEnv.card)
    }

    const get_card_selector_content = (card_selector_info, environment) => {
        const selector_type = card_selector_info.type;
        const cardEnv = card_selector_info.cardEnv;

        const get_title = (num_needs_selected) => {
            return 'Please select ' + num_needs_selected + " monster(s) from the following"
        }

        if (selector_type == CARD_SELECT_TYPE.CARD_SELECT_TRIBUTE_SUMMON) {
            const num_needs_selected = cardEnv.card.level >= 7 ? 2 : 1;
            // get current cards to tribute
            return {
                title: get_title(num_needs_selected),
                content: (
                    <div className="card_selector_content">
                        {build_up_selections(get_all_monsters(SIDE.MINE, ENVIRONMENT.MONSTER_FIELD, environment), num_needs_selected)}
                    </div>
                )
            }
        } else if (selector_type == CARD_SELECT_TYPE.CARD_SELECT_BATTLE_SELECT) {
            const num_needs_selected = 1
            return {
                title: get_title(num_needs_selected),
                content: (
                    <div className="card_selector_content">
                        {build_up_selections(get_all_monsters(SIDE.OPPONENT, ENVIRONMENT.MONSTER_FIELD, environment), num_needs_selected)}
                    </div>
                )
            }
        } else if (selector_type == CARD_SELECT_TYPE.CARD_SELECT_SPECIAL_SUMMON_TARGET) {
            const num_needs_selected = 1
            return {
                title: get_title(num_needs_selected),
                content: (
                    <div className="card_selector_content">
                        {build_up_selections(get_all_monsters(SIDE.MINE, ENVIRONMENT.EXTRA_DECK, environment), num_needs_selected)}
                    </div>
                )
            }
        } else if (selector_type == CARD_SELECT_TYPE.CARD_SELECT_SPECIAL_SUMMON_MATERIALS) {
            const num_needs_selected = card_selector_info.num_to_select
            return {
                title: get_title(num_needs_selected),
                content: (
                    <div className="card_selector_content">
                        {build_up_selections(card_selector_info.materials, num_needs_selected)}
                    </div>
                )
            }
        }
    }

    const { show_card_selector, card_selector_info, environment } = props
    let card_selector_content = {}
    if (show_card_selector) {
        card_selector_content = get_card_selector_content(card_selector_info, environment)
    }
    const close_info = {
        tool_type: TOOL_TYPE.CARD_SELECTOR
    }
    return (
        <Modal
            open={show_card_selector}
        >
            <Modal.Header>{card_selector_content?.title}</Modal.Header>
            <Modal.Content>
                {card_selector_content?.content}
            </Modal.Content>
            <Modal.Actions>
            <Button negative onClick={() => props.dispatch_close_tool(close_info)}>
                Cancel
            </Button>
            <Button positive onClick={() => {
                const info = {
                    cardEnvs: Object.keys(state.selected_cards),
                    side: SIDE.MINE
                }
                card_selector_info?.resolve(info)
                // close_card_selector()
                props.dispatch_close_tool(close_info)
            }} disabled={!state.executable}>
                Confirm
            </Button>
            </Modal.Actions>
        </Modal>
    )
}

const mapStateToProps = state => {
    const { environment } = state.environment
    return { environment };
};

const mapDispatchToProps = dispatch => ({
    // initialize: (environment) => dispatch(initialize_environment(environment)),
    dispatch_close_tool: (info) => dispatch(AllActionsInStore.Actions.Tool.closeTool({info}))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CardSelector);