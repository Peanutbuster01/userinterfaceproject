<template>
    <title>{{ uiLabels.play }}</title>
    <p>Lobby-ID: {{ lobbyId }}</p>

    <div class="pageLayout">

        <!--vänster sida (boards)-->
        <div class="leftColumns">
            <div id="OpponentBoard">
                <div class="board">
                    <div class="overlay">
                        <div v-for="(x, i) in 12" :key="'opp-' + i" class="square"
                            :class="{ selectedShot: selectedShotIndex === i }" @click="shootAtOpponent(i)">
                            <span v-if="opponentShots[i]">{{ opponentShots[i] }}</span>
                        </div>
                    </div>
                    <div v-if="canShoot && !hasShotThisRound" class="canShootOnBoard"></div>
                    <div v-if="!canShoot || hasShotThisRound" class="boardLock"></div>

                </div>
            </div>

            <div id="playerBoard">
                <div class="board">
                    <div class="overlay">
                        <div v-for="(x, i) in 12" class="square">
                            <img class="placedAvatarShip" v-if="placedShips.includes(i)"
                                :src="avatars[avatarIndex].image">
                        </div>
                    </div>
                    <div v-if="canShoot || hasShotThisRound" class="boardLock"></div>
                </div>
            </div>
        </div>


        <!--hö nger karaktär, fråga, svar-->
        <div class="rightColumn">
            <div id="playerAvatar">
                <h2 class="playerName">{{ playerName }}</h2>
                <img class="playerAvatarImage" :src="avatars[avatarIndex].image" :alt="selectedAvatar.name" />
            </div>

            <div class="questionBox">
                <p class="questionText">{{ currentQuestion }}</p>
            </div>

            <div class="answerBox">
                <input class="answerInput" type="text" v-model="playerAnswer"
                    :placeholder="uiLabels.answerMathQuestion" />

                <button class="answerButton" @click="submitAnswerEquation">{{ uiLabels.send }}</button>
            </div>
        </div>
    </div>

    <div class="popupBackgroundMakeMove" v-if="showPopupBoolean && popupType === 'makeMovePopup'">
        <div class="popup">
            <p>{{ uiLabels.makeAMove }}</p>
            <button @click="confirmShot()" id="okButton">OK</button>

        </div>
    </div>

    <div class="popupBackgroundWaitOnOpponent" v-if="showPopupBoolean && popupType === 'wrongAnswerPopup'">
        <div class="popup">
            <p>{{ uiLabels.wrongAnswer }}</p>
            <button @click="showPopupBoolean = false; popupType = null" id="okButton">OK</button>
        </div>
    </div>

    <div class="popupBackgroundWaitOnOpponent" v-if="showPopupBoolean && popupType === 'waitOnOpponentPopup'">
        <div class="popup">
            <p>{{ uiLabels.waitForOpponent }}</p>
        </div>
    </div>

</template>

<script>
export default {
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

            selectedAvatarIndex: 1, //byt så indeselectedx byt ut automatiskt
            avatars: avatars,

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
    }
}
</script>