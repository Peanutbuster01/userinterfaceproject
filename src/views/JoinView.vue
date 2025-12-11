<template>
    <title>{{ uiLabels.join }}</title>
    <header>
        <div class="logo">
            {{ uiLabels.siteName }}
        </div>
    </header>

    <ResponsiveNav v-bind:hideNav="hideNav">
        <button v-on:click="switchLanguage">
            <img :src="uiLabels.flag" style="width: 60%;">
        </button>
        <div class="lobbyID">Lobby-ID: </div>
    </ResponsiveNav>

    <h1>{{ uiLabels.joinWelcome }}</h1>

    <div id="container">
        <div id="board">
            <div id="overlay">
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
                <span class="square">
                </span>
            </div>
        </div>

        <div id="player">
            <p>
                <label for="name">{{ uiLabels.playerName }}</label><br>
                <input type="text" id="name" v-model="costumerName" required="required">
            </p>
            <p><button @click="previousCharacter"><- </button>
                        <img class="chosenCharacter" :src="characters[characterIndex].image">


                        <button @click="nextCharacter">-></button></p>
            <div id="ships">
                <p>
                    {{ uiLabels.placePlayerInstruction }}
                </p>

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
            characters,
            characterIndex: 0,

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
            this.characterIndex -= 1
        },
        nextCharacter: function () {
            this.characterIndex += 1

        },
        placeCharacter: function () {

        },
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
    position: sticky;
    top: 1em;
    width: 50vw;
    height: 50vw;
    min-width: 300px;
    min-height: 300px;
    max-width: calc(100vh - 2em);
    max-height: calc(100vh - 2em);
    overflow: hidden;
    border: 12px solid #6D5720;
    border-radius: 12px;
    margin: 2rem;
}

#overlay {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    position: absolute;
    background-color: aqua;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#overlay .square {
    z-index: 50;
    background: none;
    box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.05), inset -2px -2px 0 #665235;
}

#player {
    margin: 20px;
    padding: 50px;
}

#container {
    display: flex;
    gap: 2rem;
}

#ships {
    margin: 1rem;
    padding: 1rem;
}
</style>