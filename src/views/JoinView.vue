<template>
    <title>{{ uiLabels.join }}</title>
    <p>Lobby-ID: {{ lobbyId }}</p>
    <h1>{{ uiLabels.joinWelcome }}</h1>

    <div id="container">
        <div id="board">
            <div id="overlay">
                <div v-for="(x, i) in 12" class="square" @click="placeAvatar(i)">
                    <img class="placedAvatarShip"
                        :class="[{ 'avatarShipBorder': placedShips.findIndex(x => x == i) == selectedAvatar }]"
                        v-if="placedShips.includes(i)" :src="avatars[avatarIndex].image">
                </div>
            </div>
            <div>
                <button id="readyButton" @click="readyToPlay">{{ uiLabels.ready }}</button>
            </div>
        </div>

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
                <p>
                    {{ uiLabels.placePlayerInstruction }}
                </p>
                <div>
                    <template v-for="(x, i) in 3">
                        <img class="avatarShip" @click="select" v-if="placedShips[i] == null"
                            :src="avatars[avatarIndex].image">
                    </template>
                </div>
            </div>
        </div>

    </div>
    <div class="popupBackground" :style="{ display: showPopupBoolean ? 'block' : 'none' }">
        <div class="popup">
            <p>{{ uiLabels.notReadyPopup }}</p>
            <button @click="showPopupBoolean = false" id="okButton">OK</button>
        </div>

    </div>


</template>

<script>
import io from 'socket.io-client';
const socket = io();
import avatars from "../assets/avatars.json";

export default {
    name: 'joinView',
    props: ["uiLabels"],

    data: function () {
        return {
            uiLabels: {},
            hideNav: true,
            lobbyId: "",
            playerId: 0,
            playerName: "",
            avatars,
            avatarIndex: 0,
            placedShips: [
                null, null, null,
            ],
            selectedAvatar: 0,
            showPopupBoolean: false,
        }
    },
    created: function () {
        this.lobbyId = this.$route.params.id;

        socket.on("gameSettings", (settings) => { console.log(settings) })


        socket.on("playerJoined", (playerId) => {
            console.log("spelare skapad", this.lobbyId);
            this.playerId = playerId;
        });

        socket.on("startGame", () => {
            this.$router.push({ path: `/game/${this.lobbyId}/${this.playerId}` });
        })


        socket.emit("getGameSettings", this.lobbyId)
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
        select: function () {

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
                    lobbyId: this.lobbyId,
                    avatarIndex: this.avatarIndex
                });
            }
        }
    }
}
</script>

<style scoped>
#board {
    top: 1em;
    width: 400px;
    height: 300px;
    min-width: 300px;
    min-height: 300px;
    border: 12px solid var(--board-border-color);
    border-radius: 12px;
    margin: 2rem;
}

#overlay {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    background-color: var(--board-background-color);
    width: 100%;
    height: 100%;
    cursor: pointer;
    gap: 5px;
}

.square {
    z-index: 50;
    box-shadow: inset 0 0 4px rgb(255, 255, 255);
    position: relative;
    overflow: hidden;
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
    margin: 20px;
    padding: 50px;
    justify-items: center;
}

#chooseAvatar {
    display: flex;
    align-items: center;
}

#container {
    display: flex;
    gap: 2rem;
    margin-bottom: 50px;
}

.chosenAvatar {
    width: 12rem;
    height: 12rem;
    margin: 0.5rem;
    padding: 0.2rem;
}

.avatarButton {
    background-color: var(--avatar-button-color);
    color: white;
    padding: 0.5rem;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    box-shadow: 3px 3px 2px 0px black;
}

.avatarButton:hover {
    background-color: var(--avatar-button-hover);
    transform: scale(1.1);
}


#ships {
    margin: 1rem;
    padding: 1rem;
}

.avatarShip {
    width: 8rem;
    height: 8rem;
    padding: 5px;
}

.avatarShipBorder {
    border: 5px solid green;
}

#readyButton {
    background-color: rgb(0, 177, 0);
    color: white;
    font-size: 5ch;
    padding: 0.5rem;
    margin-top: 100px;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    box-shadow: 3px 3px 2px 0px rgba(0, 0, 0, 0.402);
}

#readyButton:hover {
    background-color: green;
    transform: scale(1.1);
}

.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(235, 77, 177);
    color: white;
    border-radius: 0.25rem;
    border: double 10px rgb(159, 50, 119);
    padding: 30px;
    max-width: 40%;

}

.popupBackground {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10000;
    background-color: #00000040;
}

#okButton {
    cursor: pointer;
}
</style>