<template>
    <title>{{ uiLabels.join }}</title>
    <h3>{{ uiLabels.gameId }} <span style="font-size: x-large;">{{ gameId }}</span></h3>
    <h2>{{ uiLabels.joinWelcome }}</h2>

    <div id="container">
        <div id="player">
            <div>
                <label for="name">{{ uiLabels.playerName }}</label>
                <input type="text" id="name" v-model="playerName" required="required">
            </div>
            <div id="chooseAvatar">
                <button class="avatarButton" @click="previousAvatar">←</button>
                <img class="chosenAvatar" :src="avatars[avatarIndex].image">
                <button class="avatarButton" @click="nextAvatar">→</button>
            </div>
            <div id="ships">
                <h5>
                    {{ uiLabels.placePlayerInstruction }}
                </h5>
                <div id="avatarContainer">
                    <template v-for="(x, i) in 3">
                        <img class="avatarShip" v-if="placedShips[i] == null"
                            :src="avatars[avatarIndex].image">
                    </template>
                </div>
            </div>
        </div>

        <div id="boardAndButton">

            <GameBoard :avatarIndex="avatarIndex" :placedShips="placedShips" :is-board-locked="false"
                :is-opponent="false" @squareClicked="(i) => placeAvatar(i)" :shots="{}"
                :selectedSquareIndex="selectedAvatar == null ? -1 : placedShips[selectedAvatar]" />

            <div>
                <button id="readyButton" @click="readyToPlay">{{ uiLabels.ready }}</button>
            </div>
        </div>

    </div>
    <div class="popupBackground" v-if="showPopupBoolean">
        <div class="popup">
            <p>{{ uiLabels.notReadyPopup }}</p>
            <button @click="showPopupBoolean = false" class="okButton">OK</button>
        </div>
    </div>

    <div class="popupBackground" v-if="waitingForOpponentBoolean">
        <div class="popup">
            <p>{{ uiLabels.waitingForOpponent }}</p>
        </div>
    </div>

    <div class="popupBackground" v-if="showObservePrompt">
        <div class="popup">
            <p>{{ uiLabels.observePrompt }}</p>
            <button class="okButton" @click="() => {
                showObservePrompt = false
                this.$router.push({ path: `/observe/${this.gameId}` });
            }">
                {{ uiLabels.yes }}
            </button>

            <button class="okButton" @click="() => {
                showObservePrompt = false
                this.$router.push({ path: `/` });

            }">
                {{ uiLabels.noBackToStart }}
            </button>

        </div>
    </div>




</template>

<script>
import io from 'socket.io-client';
const socket = io();
import avatars from "../assets/avatars.json";
import GameBoard from '../components/GameBoard.vue';

export default {
    name: 'joinView',
    props: ["uiLabels"],
    components: { GameBoard },

    data: function () {
        return {
            gameId: "",
            playerId: 0,
            playerName: "",
            avatars,
            avatarIndex: 0,
            placedShips: [
                null, null, null,
            ],
            selectedAvatar: 0,
            showPopupBoolean: false,
            waitingForOpponentBoolean: false,
            showObservePrompt: false,
        }
    },
    created: function () {
        this.gameId = this.$route.params.id;

        socket.on("gameSettings", (settings) => { console.log(settings) })


        socket.on("playerJoined", (playerId) => {
            console.log("spelare skapad", this.gameId);
            this.playerId = playerId;
            this.waitingForOpponentBoolean = true;
        });

        socket.on("startGame", () => {
            this.$router.push({ path: `/game/${this.gameId}/${this.playerId}` });
        });

        socket.on("gameFull", () => {
            this.showObservePrompt = true;
        })


        socket.emit("getGameSettings", this.gameId)
        socket.emit("getUILabels", this.lang);

    },
    methods: {
        previousAvatar: function () {
            if (this.avatarIndex === 0) {
                this.avatarIndex = this.avatars.length - 1
            }
            else {
                this.avatarIndex--
            }

        },
        nextAvatar: function () {
            if (this.avatarIndex === this.avatars.length - 1) {
                this.avatarIndex = 0
            }
            else {
                this.avatarIndex++
            }

        },
        placeAvatar: function (index) {
            if (this.placedShips.includes(index)) {
                this.selectedAvatar = this.placedShips.findIndex(x => x == index)
            }
            else {
                this.placedShips[this.selectedAvatar] = index;
                if (this.placedShips.includes(null)) {
                    this.selectedAvatar = this.placedShips.findIndex(x => x == null)
                }
                else {
                    this.selectedAvatar = null;
                }

            }

        },
        readyToPlay: function () {
            console.log(this.playerName)
            if (this.placedShips.includes(null) || this.playerName.length == 0) {
                this.showPopupBoolean = true;
            }
            else {
                socket.emit("submitPlayerInfo", {
                    name: this.playerName,
                    ships: this.placedShips,
                    gameId: this.gameId,
                    avatarIndex: this.avatarIndex
                });
            }
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/super-funky');
@import url('https://fonts.googleapis.com/css2?family=ADLaM+Display&display=swap');

#container {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 2rem;
}

#player,
#boardAndButton {
    min-width: 0;
}


#boardAndButton {
    padding: 20px;
    width: 100%;
    max-width: 400px;
    padding: 20px;
}

#board {
    top: 1em;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    aspect-ratio: 4 / 3;
    border: 12px ridge var(--blue-base-color);
    border-radius: 12px;
}

#overlay {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    background-color: var(--light-blue-base-color);
    width: 100%;
    height: 100%;
    cursor: pointer;
    gap: 5px;
}


.square:hover {
    transform: scale(0.95);
}

.placedAvatarShip {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

#player {
    padding: 30px;
    justify-items: center;
    width: 100%;
    max-width: 380px;
}

#chooseAvatar {
    display: flex;
    align-items: center;
    padding: 20px;
}

#name {
    padding: 10px;
    border-radius: 0.25rem;
    border: ridge 4px var(--pink-darker-color);
    font-family: 'Super Funky', sans-serif;
    color: var(--pink-darker-color);
    letter-spacing: 0.1em;
    box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
}

label {
    font-family: 'ADLaM Display', sans-serif;
    font-size: 24px;
    color: var(--light-gray-base-color);
    text-shadow: 2px 2px 1px var(--pink-darker-color);
}

.chosenAvatar {
    width: 12rem;
    height: 12rem;
    margin: 0.5rem;
    padding: 0.2rem;
}

.avatarButton {
    background-color: var(--light-blue-base-color);
    color: var(--light-gray-base-color);
    padding: 0.5rem;
    border: ridge 2px var(--blue-base-color);
    cursor: pointer;
    border-radius: 0.25rem;
    box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
}

.avatarButton:hover {
    background-color: var(--blue-base-color);
    transform: scale(1.1);
}


#ships {
    padding-bottom: 20px;
}

.avatarShip {
    padding: 5px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    aspect-ratio: 1 / 1;
}

#avatarContainer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
}


.avatarShipBorder {
    border: 5px solid var(--green-darker-color);
}

#readyButton {
    background-color: var(--green-base-color);
    font-family: 'Super funky', sans-serif;
    color: var(--light-gray-base-color);
    letter-spacing: 0.1em;
    font-size: 5ch;
    padding: 0.5rem;
    margin: 40px;
    border: ridge 5px var(--green-darker-color);
    cursor: pointer;
    border-radius: 0.25rem;
    box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
}

#readyButton:hover {
    background-color: var(--green-darker-color);
    transform: scale(1.05);
}

.okButton {
    border-color: var(--lavender-darker-color);
    color: var(--lavender-darker-color);
}

h5 {
    text-shadow: 2px 2px 1px var(--pink-darker-color);
}
</style>