<template>
    <title>{{ uiLabels.join }}</title>
    <header>
        <div class="logo">
            {{ uiLabels.siteName }}
        </div>
    </header>

    <ResponsiveNav v-bind:hideNav="hideNav">
        <button>
            <img v-on:click="switchLanguage" :src="uiLabels.flag" style="width: 60%;">
        </button>
        <div class="lobbyID">Lobby-ID: {{ lobbyId }}</div>
    </ResponsiveNav>

<div class="pageLayout">

    <!--vänster sida (boards)-->
    <div class="leftColumns">
        <div id="OpponentBoard">
            <div class="board">
                <div class="overlay">
                        <div v-for="(x, i) in 12" :key="'opp-' + i" class="square" :class="{ selectedShot: selectedShotIndex === i }" @click="shootAtOpponent(i)">
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
            <p>{{ uiLabels.wrongAnswer}}</p>
            <button @click="showPopupBoolean = false; popupType = null" id="okButton">OK</button>
        </div>
    </div>

    <div class="popupBackgroundWaitOnOpponent" v-if="showPopupBoolean && popupType === 'waitOnOpponentPopup'">
        <div class="popup">
            <p>{{ uiLabels.waitForOpponent}}</p>
        </div>
    </div>

</template>
<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import avatars from "../assets/avatars.json";

export default {
    components: {
        ResponsiveNav
    },

    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "sv",
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

        socket.on("uiLabels", labels => this.uiLabels = labels);

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
        switchLanguage: function () {
            if (this.lang === "en") {
                this.lang = "sv"
            }
            else {
                this.lang = "en"
            }
            localStorage.setItem("lang", this.lang);
            socket.emit("getUILabels", this.lang);
        },
        toggleNav: function () {
            this.hideNav = !this.hideNav;
        },

        placeAvatar: function (i) {
            // placeholder tills du implementerar logiken
            console.log("placeAvatar", i);
        },
        
        submitAnswerEquation: function () {
        socket.emit("answer", this.lobbyId, this.playerId, parseInt(this.playerAnswer));
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

        this.selectedShotIndex = squareIndex;
    },

        confirmShot: function () {
        if (this.selectedShotIndex === null) return;

        const hit = false; // TODO: ersätt med serverresultat
        this.opponentShots[this.selectedShotIndex] = hit ? "hit" : "miss";

        this.hasShotThisRound = true;
        this.canShoot = false;
        this.selectedShotIndex = null;

        this.showPopupBoolean = false;
        this.popupType = null;

        }
    }
}
</script>

<style scoped>
header {
    background-color: gray;
    width: 100%;
    grid-template-columns: 2em auto;
}

.logo {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 2.5rem;
    color: white;
    padding-top: 0.2em;
    grid: 0%;
}

.lobbyID {
    font-size: 2rem;
    padding-top: 0.5em;
}

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

.square:hover {
    transform: scale(0.95);
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

.leftColumns {
  display: flex;
  flex-direction: column;
}

.rightColumn {
  display: flex;
  flex-direction: column;
  gap: 2rem;
    margin-top: 2rem;
    /* linjerar med boardens margin */
}

#playerAvatar {
    margin-top: 2rem;
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

.answerBox {
  min-width: 260px;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  
}

.answerInput {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #962d9a;
  border-radius: 10px;
}

.answerButton {
  padding: 0.75rem 1rem;
  border: 2px solid #111;
  border-radius: 10px;
  background: white;
  cursor: pointer;
}


.boardLock {
    position: absolute;
    inset: 0;
    z-index: 9999;
    pointer-events: auto; /* blockera klick */


}

.canShootOnBoard {
  position: absolute;
  inset: 0;
  z-index: 9999;
  outline: 12px solid #3a9a2d;
  outline-offset: 0;
  pointer-events: none;
}

.selectedShot {
    outline: 4px solid #ff0000;
    outline-offset: -4px;
}




</style>