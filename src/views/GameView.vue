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
        <div class="lobbyID">Lobby-ID: </div>
    </ResponsiveNav>

<div class="pageLayout">

    <!--vänster sida (boards)-->
    <div class="leftColumns">

        <div id="playerBoard">
            <div id="board">
                <div id="overlay">
                    <div v-for="(x, i) in 12" class="square" @click="placeCharacter(i)">
                        <img class="placedCharacterShip"
                            :class="[{ 'characterShipBorder': placedShips.findIndex(x => x == i) == selectedCharacter }]"
                            v-if="placedShips.includes(i)" :src="characters[characterIndex].image">
                    </div>
                </div>
            </div>
        </div>

        <div id="OpponentBoard">
            <div id="board">
                <div id="overlay">
                    <div v-for="(x, i) in 12" class="square" @click="placeCharacter(i)">
                        <img class="placedCharacterShip"
                            :class="[{ 'characterShipBorder': placedShips.findIndex(x => x == i) == selectedCharacter }]"
                            v-if="placedShips.includes(i)" :src="characters[characterIndex].image">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--höger karaktär, fråga, svar-->
<div class="rightColumn">
        <div id="playerCharacter">
            <h2 class="playerName">{{ playerName }}</h2>

            <img
            class="playerCharacterImage"
            :src="selectedCharacter.image"
            :alt="selectedCharacter.name" 
            />
        </div>
    

        <div class="questionBox">
            <p class="questionText">{{ currentQuestion }}</p>
        </div>

        <div class="answerBox">
            <input
                class="answerInput"
                type="text"
                v-model="playerAnswer"
                :placeholder="uiLabels.answerMathQuestion"  
                />

                <button class="anserButton" @click="submitAnswer">{{uiLabels.send}}</button>
        </div>
    </div>    
</div>



</template>
<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import characters from "../assets/characters.json";

export default {
    components: {
        ResponsiveNav
    },

    data: function () {
        return {
            uiLabels: {},
            lang: localStorage.getItem("lang") || "sv",
            hideNav: true,
            placedShips: [
                null, null, null,
            ],
            showPopupBoolean: false,

            //placeholder tills att socket data kommer in
            playerName: "MyPlayer",
            characterIndex: 0,
            selectedCharacter: 0,
            selectedCharacterIndex: 1, //byt så index byt ut automatiskt
            characters: characters,

            currentQuestion: "2+2=?", //plceholder
            playerAnswer: "",
        }
    },
    created: function () {
        socket.on("uiLabels", labels => this.uiLabels = labels);
        socket.emit("getUILabels", this.lang);
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

        placeCharacter: function (i) {
            // placeholder tills du implementerar logiken
            console.log("placeCharacter", i);
        },

        submitAnswer: function () {
            console.log("Svar:", this.playerAnswer);
            // sen: socket.emit(...) när du kopplar det
        },

        getDifficultySettings: function(level){
            if (level === "easy") return {min:0, max:10};
            if (level === "medium") return {min:0, max:20};
            if (level === "hard") return {min:0, max:50};
            return {min:0, max:100}; // level nightmare
        },

        randomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        makeAddition: function (settings) {
            const a = this.randomInt(settings.min, settings.max);
            const b = this.randomInt(settings.min, settings.max);

            return {
                question: `${a} + ${b} = ?`,
                answer: a + b
            };
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

#board {
    top: 1em;
    width: 400px;
    height: 300px;
    min-width: 300px;
    min-height: 300px;
    border: 12px solid #962d9a;
    border-radius: 12px;
    margin: 2rem;
}

#overlay {
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

.popupBackground {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10000;
    background-color: #00000040;
}

.leftColumn {
  display: flex;
  flex-direction: column;
}

.rightColumn {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem; /* linjerar med boardens margin */
}

#playerCharacter {
  margin-top: 2rem; /* matchar boardens margin */
  min-width: 200px;
  padding: 1rem;
  border: 2px solid #962d9a;
  border-radius: 20px;
}

.playerName {
  margin: 0 0 1rem 0;
  font-size: 1.6rem;
}

.playerCharacterImage {
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

.answerBtn {
  padding: 0.75rem 1rem;
  border: 2px solid #111;
  border-radius: 10px;
  background: white;
  cursor: pointer;
}

</style>