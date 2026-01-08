<template>
    <title>{{uiLabels.observe}}</title>
    <p>Lobby-ID: {{ lobbyId }}</p>

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
                <GameBoard :isOpponent="true" :avatarIndex="avatarIndex" :isBoardLocked="true" :shots="opponentShots"
                    :placedShips="placedShips" />
            </div>
        </div>

    </div>

    <div class="popupBackground" v-if="showPopupBoolean && popupType === 'waitOnOpponentPopup'">
        <div class="popup">
            <p>{{ uiLabels.waitForOpponent }}</p>
        </div>
    </div>

    <div class="popupBackground" v-if="showPopupBoolean && popupType === 'gameOverPopup'">
        <div class="popup">
            <p v-if="winnerId === playerId">{{playerName}} {{uiLabels.won}}</p>
            <p v-else>{{playerName}} {{uiLabels.won}}</p>
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

export default {
    name: 'observeView',
    props: ["uiLabels"],

    data: function () {
        return {
            hideNav: true,
            lobbyId: "",

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

            //placeholder tills att socket data kommer in


            currentEquation: null,
            currentQuestion: null,
            playerAnswer: "",

            canShoot: false,
            hasShotThisRound: false,
            selectedShotIndex: null,
            opponentShots: {},
        }
    },

    created: function () {
        this.lobbyId = this.$route.params.id;
        this.playerId = Number(this.$route.params.playerId);
        socket.emit("joinLobby", this.lobbyId);

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

        socket.on("roundWinner", (winnerPlayerId) => {
            const myPlayerId = this.playerId;

            if (winnerPlayerId === myPlayerId) {
                this.makeAMove();
            } else {
                this.WaitOnOpponent();
            }
        });


        socket.on("newQuestion", (equation) => {
            this.currentEquation = equation;
            this.currentQuestion = equation.question;
            this.playerAnswer = "";
            this.canShoot = false;
            this.showPopupBoolean = false;
        });

        socket.on("startGame", () => {
            console.log("[client] startGame received. lobby:", this.lobbyId, "playerId:", this.playerId);
        });

        socket.on("shotResult", () => {
            console.log("[GameView] shotResult received:");
        });


        socket.on("wrongAnswer", () => {
            this.popupType = "wrongAnswerPopup";
            this.showPopupBoolean = true;
        });

        socket.emit("getUILabels", this.lang);
        socket.emit("getGameSettings", this.lobbyId);
        socket.emit("getPlayerInfo", this.lobbyId, 0);
        socket.emit("getPlayerInfo", this.lobbyId, 1);
    },

    methods: {
    }
}
</script>

<style>
.board {
    position: relative;
    top: 1em;
    width: 400px;
    height: 300px;
    min-width: 300px;
    min-height: 300px;
    border: 12px solid #962d9a;
    border-radius: 12px;
    margin: 2rem;
}

.overlay {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    background-color: rgb(189, 123, 206);
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

.popupBackgroundWaitOnOpponent {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10000;
    background-color: #00000040;
}

.popupBackgroundMakeMove {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10000;
    pointer-events: none;
}

.popupBackgroundMakeMove .popup {
    pointer-events: auto;
}

.leftColumns {
    display: flex;
    flex-direction: column;
}

.rightColumn {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
    align-items: center;
}

#playerAvatar {
    margin-top: 2rem;
    min-width: 200px;
    padding: 1rem;
    border: 2px solid #962d9a;
    border-radius: 20px;
    /* matchar boardens margin */
    min-width: 200px;
    padding: 1rem;
    border: 2px solid #962d9a;
    border-radius: 20px;
}

.placedAvatarShip {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
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
    align-items: flex-start;
    gap: 3rem;
}

.questionBox {
    min-width: 260px;
    padding: 1rem;
    border-radius: 12px;
    background: white;
    border: 2px solid #962d9a;

}

.boardLock {
    position: absolute;
    inset: 0;
    z-index: 9999;
    pointer-events: auto;
    /* blockera klick */


}
</styl