// import { normal_summon, set_summon, tribute } from '../Store/actions/environmentActions'
import { SET_SUMMON } from "../helper/constants";
import AllActionsInStore from "@/store";
import { io } from "socket.io-client";
import store from "@/store/store";
import Core from "@/core";

/**
 * The address of the websocket server
 */
const ENDPOINT = "http://127.0.0.1:4001";

const socket = io(ENDPOINT);

const getCurrentEnvironment = () => {
    return store.getState().environment.environment
}

socket.on("connect", () => {
    socket.send(`Hello from ${socket.id}!`);
});

socket.on('message', (data) => {
    console.log(data)
})

socket.on("matched", (data) => {
    console.log(`Matched with ${data.opponent}`)
    socket.opponent = data.opponent
    const info = {
        my_id: data.my_id,
        opponent_id: socket.opponent,
        player_starts: data.player_starts
    }
    store.dispatch(AllActionsInStore.Actions.Server.getOpponentId({info}))
})

socket.on("receive_deck", (data) => {
    console.log(`Received opponent's deck!`)
    const info = {
        deck: data.deck,
    }
    store.dispatch(AllActionsInStore.Actions.Server.getOpponentDeck({info}))
})

socket.on("opponent_summon", (data) => {
    const environment = getCurrentEnvironment()
    console.log("opponent_summon: ", data)
    Core.Summon.summon(data.data, data.data.type, environment)
})

// socket.on("opponent_tribute", (data) => {

//     const { cardEnvs, side, src } = data.data
//     const environment = getCurrentEnvironment()
//     Core.Summon.tribute(cardEnvs, side, src, environment)
// })

socket.on("opponent_move_card_to_graveyard", (data) => {
    console.log("[socket] opponent_move_card_to_graveyard: ", data.data)
    const { cards, side, src } = data.data
    const environment = getCurrentEnvironment()
    Core.Misc.move_cards_to_graveyard(cards, side, src, environment)
})


socket.on("opponent_change_phase", (data) => {
    store.dispatch(AllActionsInStore.Actions.GameMeta.changePhase({info: data.data}))
})

socket.on("opponent_attack_start", (data) => {
    console.log("[SOCKET] opponent_attack_start: ", data)
    store.dispatch(AllActionsInStore.Actions.BattleMeta.opponentAttackStart({info: data.data}))
})

socket.on("opponent_attack_ack", (data) => {
    console.log("socket opponent_attack_ack: ", data)
    const info = {
        environment: getCurrentEnvironment()
    }
    store.dispatch(AllActionsInStore.Actions.BattleMeta.opponentAttackAck({...info}))
})

socket.on("opponent_card_activate", (data) => {
    const environment = getCurrentEnvironment()
    Core.Effect.opponent_activate(data, environment)
})

socket.on("card_operate", (data) => {
    const environment = getCurrentEnvironment()
    Core.Effect.operate(data, environment)
})

socket.on("opponent_card_operated", (data) => {
    const environment = getCurrentEnvironment()
    Core.Effect.opponent_operated(data, environment)
})

socket.on("opponent_effect_ack", (data) => {
    const environment = getCurrentEnvironment()
    Core.Effect.opponent_effect_ack(data, environment)
})

export default socket;
