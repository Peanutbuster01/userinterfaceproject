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

    <h1>{{ uiLabels.joinWelcome }}</h1>

    <div id="container">
        <div id="board">
            <div id="overlay">
                <div v-for="(x, i) in 12" class="square" @click="placeCharacter(i)">
                    <img :class="[{ 'characterShipBorder': placedShips.findIndex(x => x == i) == selectedCharacter }]"
                        v-if="placedShips.includes(i)" :src="characters[characterIndex].image"
                        style="box-sizing: border-box; width: 100%; height: 100%; display: block; object-fit: contain;">
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
            <div id="chooseCharacter">
                <button class="characterButton" @click="previousCharacter">←</button>
                <img class="chosenCharacter" :src="characters[characterIndex].image">
                <button class="characterButton" @click="nextCharacter">→</button>
            </div>
            <div id="ships">
                <p>
                    {{ uiLabels.placePlayerInstruction }}
                </p>
                <div>
                    <template v-for="(x, i) in 3">
                        <img class="characterShip" @click="select" v-if="placedShips[i] == null"
                            :src="characters[characterIndex].image">
                    </template>
                </div>
            </div>
        </div>

    </div>
    <div class="popup" :style="{ display: showPopupBoolean ? 'block' : 'none' }">
        <p>{{ uiLabels.notReadyPopup }}</p>
        <button @click="showPopupBoolean = false" id="okButton">OK</button>
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
            playerName: "",
            characters,
            characterIndex: 0,
            placedShips: [
                null, null, null,
            ],
            selectedCharacter: 0,
            showPopupBoolean: false,
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
        previousCharacter: function () {
            if (this.characterIndex === 0) {
                this.characterIndex = this.characters.length - 1
            }
            else {
                this.characterIndex--
            }

        },
        nextCharacter: function () {
            if (this.characterIndex === this.characters.length - 1) {
                this.characterIndex = 0
            }
            else {
                this.characterIndex++
            }

        },
        placeCharacter: function (index) {
            if (this.placedShips.includes(index)) {
                this.selectedCharacter = this.placedShips.findIndex(x => x == index)
            }
            else {
                this.placedShips[this.selectedCharacter] = index;
                if (this.placedShips.includes(null)) {
                    this.selectedCharacter = this.placedShips.findIndex(x => x == null)
                }
                else {
                    this.selectedCharacter = null;
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

            }

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

#chooseCharacter {
    display: flex;
    align-items: center;
}

#container {
    display: flex;
    gap: 2rem;
    margin-bottom: 50px;
}

.chosenCharacter {
    width: 12rem;
    height: 12rem;
    margin: 0.5rem;
    padding: 0.2rem;
}

.characterButton {
    background-color: rgb(235, 77, 177);
    color: white;
    padding: 0.5rem;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    box-shadow: 3px 3px 2px 0px black;
}

.characterButton:hover {
    background-color: rgb(159, 50, 119);
    transform: scale(1.1);
}



#ships {
    margin: 1rem;
    padding: 1rem;
}

.characterShip {
    width: 8rem;
    height: 8rem;
    padding: 5px;
}

.characterShipBorder {
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
    z-index: 50;
}

#okButton {
    cursor: pointer;
}
</style>