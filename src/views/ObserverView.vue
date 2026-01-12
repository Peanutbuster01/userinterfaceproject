<template>
    <title>{{ uiLabels.observe }}</title>
    <h3>{{ uiLabels.gameId }} <span style="font-size: x-large;">{{ gameId }}</span></h3>


    <VsScreen :avatarIndex="avatarIndex" :opponentAvatarIndex="opponentAvatarIndex" :playerName="playerName"
        :opponentName="opponentName" />

    <div class="pageLayout">

        <div>
            <img :src="avatars[avatarIndex].image" class="boardAvatars"></img>
            <h3 class="boardLabel">{{ playerName }}s {{ uiLabels.board }}</h3>
            <GameBoard :isOpponent="false" :avatarIndex="avatarIndex" :isBoardLocked="true" :shots="opponentShots"
                :placedShips="placedShips" />
        </div>

        <div class="gameInfo">
            <div id="playerAvatar">
                <h2 class="playerName">{{ uiLabels.observeMessage }}</h2>
            </div>

            <div class="questionBox">
                <p class="questionText" :class="{ hiddenQuestion: waitingForNextQuestion }">{{ currentQuestion }}</p>
            </div>
            <button class="okButton returnButton" @click="() => {
                this.$router.push({ path: `/` });
            }">{{ uiLabels.returnToStart }}</button>

        </div>

        <div>
            <img :src="avatars[opponentAvatarIndex].image" class="boardAvatars"></img>
            <h3 class="boardLabel">{{ opponentName }}s {{ uiLabels.board }}</h3>
            <GameBoard :isOpponent="false" :avatarIndex="opponentAvatarIndex" :isBoardLocked="true" :shots="playerShots"
                :selectedShotIndex="selectedShotIndex" :placedShips="opponentPlacedShips" />
        </div>


    </div>

    <div class="showHitOrMiss">
        <h1 v-if="shotResultText === true">
            {{ uiLabels.hit }}
        </h1>

        <h1 v-else-if="shotResultText === false">
            {{ uiLabels.miss }}
        </h1>
    </div>

    <div class="popupBackground" v-if="showPopupBoolean && popupType === 'gameOverPopup'">
        <div class="popup">
            <p v-if="winnerId === playerId">{{ playerName }} {{ uiLabels.won }}</p>
            <p v-else>{{ opponentName }} {{ uiLabels.won }}</p>
            <button class="okButton" @click="() => {
                this.$router.push({ path: `/` });
            }">{{ uiLabels.returnToStart }}</button>
        </div>
    </div>

</template>
<script>
import io from 'socket.io-client';
const socket = io();
import avatars from "../assets/avatars.json";
import GameBoard from '../components/GameBoard.vue';
import VsScreen from '../components/VsScreen.vue';

export default {
    name: 'StartView',
    props: ["uiLabels"],
    components: { GameBoard, VsScreen },

    data: function () {
        return {
            gameId: "",

            playerName: "",
            avatarIndex: 0,
            selectedAvatar: 0,
            playerId: 0,
            placedShips: [
                null, null, null,
            ],
            showPopupBoolean: false,
            popupType: null,

            opponentId: 0,
            opponentName: "",
            opponentAvatarIndex: 0,
            opponentPlacedShips: [
                null, null, null
            ],

            avatars: avatars,

            currentEquation: null,
            currentQuestion: null,

            canShoot: false,
            hasShotThisRound: false,
            selectedShotIndex: null,
            opponentShots: {},
            playerShots: {},
            waitingForNextQuestion: false,
            shotResultText: null,

            gameOver: false,
            winnerId: null,
        }
    },

    created: function () {
        this.gameId = this.$route.params.id;
        socket.emit("joinGame", this.gameId);

        socket.on("shots", (shots) => {
            this.playerShots = shots?.[0] || {};
            this.opponentShots = shots?.[1] || {};
        });


        socket.on("playerInfo", (playerId, playerInfo) => {
            if (playerId === 0) {
                console.log("INFO:"); console.log(playerInfo);
                this.placedShips = playerInfo.placedShips;
                this.avatarIndex = playerInfo.avatarIndex;
                this.playerName = playerInfo.playerName;
                console.log(this.placedShips);
            }
            else {
                console.log("MOTSTÅNDARINFO:"); console.log(playerInfo);
                this.opponentPlacedShips = playerInfo.placedShips;
                this.opponentAvatarIndex = playerInfo.avatarIndex;
                this.opponentName = playerInfo.playerName;
                console.log(this.opponentName);
            }
        });


        socket.on("closePopups", () => {
            if (this.gameOver) return
            this.showPopupBoolean = false;
            this.popupType = null;
            this.playerAnswer = "";
        });

        socket.on("newQuestion", (equation) => {
            this.waitingForNextQuestion = false;
            this.currentEquation = equation;
            this.currentQuestion = equation.question;
        });

        socket.on("shotResult", ({ shooterId, shootIndex, hit }) => {
            const result = hit ? "hit" : "miss";
            if (shooterId !== this.playerId) {
                this.opponentShots = {
                    ...this.opponentShots,
                    [shootIndex]: result
                };
            }
            else {
                this.playerShots = {
                    ...this.playerShots,
                    [shootIndex]: result
                };
            }
            this.shotResultText = hit;
            setTimeout(() => {
                this.shotResultText = null;
            }, 1500);
            console.log("[GameView] shotResult received:");
        });

        socket.on("waitingForNextQuestion", () => {
            this.waitingForNextQuestion = true;
        });

        socket.on("gameOver", ({ winnerId }) => {
            this.gameOver = true;
            this.winnerId = winnerId;
            this.canShoot = false;
            this.hasShotThisRound = true;
            this.popupType = "gameOverPopup";
            this.showPopupBoolean = true;
        });

        socket.emit("getUILabels", this.lang);
        socket.emit("getGameSettings", this.gameId);
        socket.emit("getPlayerInfo", this.gameId, 0);
        socket.emit("getPlayerInfo", this.gameId, 1);
        socket.emit("getShots", this.gameId);
    },

    methods: {
    }
}
</script>

<style scoped>
.boardLabel {
    margin-top: 0;
}

#player {
    margin: 20px;
    padding: 50px;
    justify-items: center;
}


#container {
    display: flex;
    gap: 2rem;
    margin-bottom: 50px;
}

.rightColumn {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 400px;
    padding-bottom: 20px;
}

.gameInfo {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
}

#playerAvatar {
    border: ridge 3px var(--pink-darker-color);
    border-radius: 0.25rem;
    min-width: 200px;
    align-items: center;
    padding: 20px;
}

.playerName {
    margin: 0 0 1rem 0;
    font-size: 1.6rem;
}

.playerAvatarImage {
    width: 180px;
    height: 180px;
    object-fit: contain;
    display: block;
}

.pageLayout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 1rem;
}

@media(max-width: 600px) {
    .pageLayout {
        grid-template-columns: 1fr;
    }
}


.questionText {
    font-family: 'ADLaM Display';
    color: var(--pink-darker-color);
    letter-spacing: 0.1em;
    text-shadow: none;
    margin: 0;
}


.answerButton:hover {
    transform: scale(1.05);
}

::placeholder {
    color: var(--pink-base-color);
    font-family: 'ADLaM Display', sans-serif;
}

.hiddenQuestion {
    visibility: hidden;
}

.boardAvatars {
    width: 5rem;
    height: 5rem;
}

.returnButton {
    border-color: var(--pink-darker-color);
    color: var(--pink-darker-color);
    box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
}

.showHitOrMiss {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center;
    transform: translate(-50%, -50%);
    font-size: 100px;
    color: var(--light-gray-base-color);
    text-shadow: 0 0 5rem #3b053b;
    margin: 0;
    z-index: 10000000;
}
</style>