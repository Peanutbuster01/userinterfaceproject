<template>
    <title>{{ uiLabels.play }}</title>
    <h3>{{ uiLabels.gameId }} {{ gameId }}</h3>

    <div id="vsScreen">
        <div class="vsPlayer">
            <h1 style="text-shadow: 4px 4px 2px var(--blue-base-color);">{{ playerName }}</h1>
            <img :src="avatars[avatarIndex].image"></img>
        </div>
        <div class="vsPlayer">
            <h1 style="text-shadow: 4px 4px 2px var(--lavender-darker-color);">{{ opponentName }}</h1>
            <img :src="avatars[opponentAvatarIndex].image"></img>
        </div>
        <h1 id="vs">
            VS
        </h1>
    </div>

    <div class="pageLayout">
        <div class="leftColumn">
            <div id="playerAvatar">
                <h2 class="playerName">{{ playerName }}</h2>
                <img class="playerAvatarImage" :src="avatars[avatarIndex].image" :alt="selectedAvatar.name" />
            </div>

            <div class="questionBox">
                <p class="questionText" :class="{ hiddenQuestion: waitingForNextQuestion }">
                    {{ currentQuestion }}</p>
            </div>

            <div class="answerBox">
                <input class="answerInput" type="text" v-model="playerAnswer" @keypress.enter="submitAnswerEquation"
                    :placeholder="uiLabels.answerMathQuestion" />

                <button class="answerButton" @click="submitAnswerEquation">{{ uiLabels.send }}</button>
            </div>
        </div>

        <div class="rightColumn">
            <div>
                <h3 class="boardLabel">{{ uiLabels.opponentsBoard }}</h3>
                <GameBoard :isOpponent="true" :avatarIndex="opponentAvatarIndex"
                    :isBoardLocked="!canShoot || hasShotThisRound" :shots="playerShots"
                    :selectedShotIndex="selectedShotIndex" @squareClicked="(i) => shootAtOpponent(i)" />
            </div>
            <div>
                <h3 class="boardLabel">{{ uiLabels.yourBoard }}</h3>
                <GameBoard :isOpponent="false" :avatarIndex="avatarIndex" :isBoardLocked="true" :shots="opponentShots"
                    :placedShips="placedShips" />
            </div>
        </div>
    </div>

    <div class="popupBackground" v-if="showPopupBoolean && popupType === 'makeMovePopup'">
        <div class="popup">
            <p>{{ uiLabels.makeAMove }}</p>
            <GameBoard :isOpponent="true" :avatarIndex="opponentAvatarIndex"
                :isBoardLocked="!canShoot || hasShotThisRound" :shots="playerShots"
                :selectedShotIndex="selectedShotIndex" @squareClicked="(i) => shootAtOpponent(i)"
                style="box-shadow: 3px 3px 2px 0px var(--lavender-darker-color);" />
            <button @click="confirmShot()" class="okButton">OK</button>
        </div>
    </div>
    <div class="popupBackground counterPopupBackground" v-if="waitingForNextQuestion">
        <div class="popup counterPopup" v-if="waitingForNextQuestion">
            <p>{{ uiLabels.nextQuestion }}</p>
            <ul></ul>
            <h1 style="text-shadow: 4px 4px 2px var(--lavender-darker-color);">{{ counterNumber }}</h1>

        </div>
    </div>

    <div class="popupBackground" v-if="showPopupBoolean && popupType === 'wrongAnswerPopup'">
        <div class="popup">
            <p>{{ uiLabels.wrongAnswer }}</p>
            <button @click="showPopupBoolean = false; popupType = null" class="okButton">OK</button>
        </div>
    </div>

    <div class="popupBackground" v-if="showPopupBoolean && popupType === 'waitOnOpponentPopup'">
        <div class="popup">
            <p>{{ uiLabels.waitForOpponent }}</p>
        </div>
    </div>

    <div class="popupBackground" v-if="showPopupBoolean && popupType === 'gameOverPopup'">
        <div class="popup">
            <p v-if="winnerId === playerId">{{ uiLabels.youWon }}</p>
            <p v-else>{{ uiLabels.gameOver }}</p>
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
import { playSound } from "../src/utils/sound";

export default {
    name: 'StartView',
    props: ["uiLabels"],
    components: { GameBoard },
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

            opponentName: "",
            opponentAvatarIndex: 0,
            opponentPlacedShips: [
                null, null, null
            ],


            counterNumber: 5,
            selectedAvatarIndex: 1,
            avatars: avatars,

            currentEquation: null,
            currentQuestion: null,
            playerAnswer: "",

            canShoot: false,
            hasShotThisRound: false,
            selectedShotIndex: null,
            opponentShots: {},
            playerShots: {},
            waitingForNextQuestion: false,

            gameOver: false,
            winnerId: null
        }
    },


    created: function () {
        this.gameId = this.$route.params.id;
        this.playerId = Number(this.$route.params.playerId);
        socket.emit("joinGame", this.gameId);

        socket.on("gameSettings", (settings) => {
            console.log("gameSettings:", settings);
        });

        ;
        socket.on("playerInfo", (playerId, playerInfo) => {
            if (playerId == this.playerId) {
                console.log("INFO:"); console.log(playerInfo);
                this.placedShips = playerInfo.placedShips;
                this.avatarIndex = playerInfo.avatarIndex;
                this.playerName = playerInfo.playerName;
                socket.emit("getShots", this.lobbyId)
                socket.on("shots", (shots) => {
                    this.playerShots = shots[playerId];
                });
                console.log(this.placedShips);
            }
            else {
                console.log("MOTSTÅNDARINFO:"); console.log(playerInfo);
                this.opponentPlacedShips = playerInfo.placedShips;
                this.opponentAvatarIndex = playerInfo.avatarIndex;
                this.opponentName = playerInfo.playerName;
                socket.emit("getShots", this.lobbyId)
                socket.on("shots", (shots) => {
                    this.opponentShots = shots[playerId];
                });
                console.log(this.opponentName);
            }
        });

        socket.on("roundWinner", (winnerPlayerId) => {
            const myPlayerId = this.playerId;

            if (winnerPlayerId === myPlayerId) {
                this.makeAMove();
            } else {
                this.WaitOnOpponent();
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

        socket.on("startGame", () => {
            console.log("[client] startGame received. game:", this.gameId, "playerId:", this.playerId);
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
            console.log("[GameView] shotResult received:");
        });


        socket.on("wrongAnswer", () => {
            this.popupType = "wrongAnswerPopup";
            this.showPopupBoolean = true;
        });

        socket.on("waitingForNextQuestion", () => {
            this.waitingForNextQuestion = true;
            this.startCountDown();
        });

        socket.on("gameOver", ({ winnerId }) => {
            this.gameOver = true;
            this.winnerId = winnerId;
            this.canShoot = false;
            this.hasShotThisRound = true;
            this.popupType = "gameOverPopup";
            this.showPopupBoolean = true;

            if (winnerId === this.playerId) {
                playSound("win");
            }
            //else {
            //    playSound("lose");
            //}   
        });

        socket.emit("getUILabels", this.lang);
        socket.emit("getGameSettings", this.gameId);
        socket.emit("getPlayerInfo", this.gameId, 0);
        socket.emit("getPlayerInfo", this.gameId, 1);
    },

    methods: {

        placeAvatar: function (i) {
            console.log("placeAvatar", i);
        },


        submitAnswerEquation: function () {
            socket.emit("answer", this.gameId, this.playerId, parseInt(this.playerAnswer));
            this.playerAnswer = "";
        },

        makeAMove: function () {
            this.popupType = "makeMovePopup";
            this.showPopupBoolean = true;
            this.canShoot = true;
            this.hasShotThisRound = false;
            this.selectedShotIndex = null;
        },

        WaitOnOpponent: function () {
            this.popupType = "waitOnOpponentPopup";
            this.showPopupBoolean = true;
            this.canShoot = false;
        },

        shootAtOpponent: function (squareIndex) {
            if (!this.canShoot) return;
            if (this.hasShotThisRound) return;
            if (this.playerShots[squareIndex] !== undefined) return;

            this.selectedShotIndex = squareIndex;
            console.log("Selected shot at index:", squareIndex);
        },

        confirmShot: function () {
            if (this.selectedShotIndex === null || this.playerShots[this.selectedShotIndex] !== undefined) return;

            socket.emit("shoot", {
                gameId: this.gameId,
                playerId: this.playerId,
                shootIndex: this.selectedShotIndex
            });

            this.hasShotThisRound = true;
            this.canShoot = false;
            this.selectedShotIndex = null;

            this.showPopupBoolean = false;
            this.popupType = null;

        },

        startCountDown: function () {
            this.counterNumber = 5;
            const interval = setInterval(() => {
                this.counterNumber--;

                if (this.counterNumber === 0) {
                    clearInterval(interval);
                    this.waitingForNextQuestion = false;
                }
            }, 1000);
        }
    }
}
</script>

<style scoped>
#vsScreen {
    position: fixed;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999999;
    background-color: var(--light-blue-base-color);
    pointer-events: none;

    animation: forwards 4s vsScreenAnimation;
}


@media(max-width: 600px) {
    #vsScreen {
        grid-template-columns: 1fr;
    }
}

@keyframes vsScreenAnimation {
    0% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        opacity: 0;

    }

}

h1 {
    font-size: 6vw;
}

.vsPlayer {
    flex-grow: 1;
    justify-items: center;
    overflow: hidden;
    border: 18px ridge var(--blue-base-color);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.vsPlayer img {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 80%;
    display: block;
    object-fit: contain;
}

.vsPlayer:nth-child(2) {
    background-color: var(--lavender-base-color);
    border-color: var(--lavender-darker-color);
}

#vs {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(-20deg);
    font-size: 100px;
    color: var(--light-gray-base-color);
    text-shadow: 0 0 5rem #3b053b;
    margin: 0;

    animation: forwards 4s vsAnimation;
}

@keyframes vsAnimation {
    0% {
        transform: translate(-50%, -50%) scale(0) rotate(-1000deg);
    }

    30% {
        transform: translate(-50%, -50%) scale(1) rotate(-20deg);
    }

    85% {
        transform: translate(-50%, -50%) scale(1) rotate(-20deg);
    }

    100% {
        transform: translate(-50%, -50%) scale(10) rotate(-1000deg);
    }
}

.counterPopup {
    pointer-events: none;
    animation: forwards 5s counterPopupAnimation;
}


@keyframes counterPopupAnimation {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(0deg) scale(1);

    }

    85% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(0deg) scale(1);

    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(450deg) scale(10);
    }
}

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

.leftColumn {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
}

#playerAvatar {
    border: ridge 3px var(--pink-darker-color);
    border-radius: 0.25rem;
    min-width: 200px;
    display: flex;
    flex-direction: column;
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
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
}


.questionText {
    font-family: 'ADLaM Display';
    color: var(--pink-darker-color);
    letter-spacing: 0.1em;
    text-shadow: none;
    margin: 0;
    font-size: xx-large;
}

.answerBox {
    min-width: 260px;
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.answerInput {
    flex: 1;
    background: var(--light-gray-base-color);
    padding: 10px;
    border-radius: 0.25rem;
    border: ridge 4px var(--pink-darker-color);
    font-family: 'ADLaM Display';
    color: var(--pink-darker-color);
    box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
}

.answerButton:hover {
    transform: scale(1.05);
    background-color: var(--pink-lighter-color);
}

::placeholder {
    color: var(--pink-base-color);
    font-family: 'ADLaM Display', sans-serif;
}

.hiddenQuestion {
    visibility: hidden;
}
</style>