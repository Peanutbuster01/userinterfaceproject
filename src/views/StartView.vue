<template>

  <title>{{ uiLabels.start }}</title>

  <div class="welcomeMessage">
    <h1>{{ uiLabels.welcomeTitle }}</h1>
  </div>

  <div id="createJoin">
    <section class="gamePanel">
      <h6 class="gameSubtitles">{{ uiLabels.createGame }}</h6>
      <p>{{ uiLabels.createGameInstructions }}</p>

      <div class="ButtonRow">
        <button class="gameButtons" @click="() => {
          this.$router.push({ path: `/create/` });
        }">
          {{ uiLabels.createGameButton }}
        </button>
      </div>
    </section>

    <section class="gamePanel">
      <h6 class="gameSubtitles">{{ uiLabels.joinGame }}</h6>
      <p>{{ uiLabels.joinGameInstructions }}</p>

      <div>
        <input class="gameButtons" type="text" maxlength="4" @input="validateGameId" v-model="gameId"
          :placeholder="uiLabels.fourCharGameID" @keypress.enter="checkGameId">

        <p v-if="gameId.length < 4" class="joinErrorMessage">{{ joinMessage }}</p>
      </div>

      <div class="ButtonRow">
        <button class="gameButtons" @click="checkGameId">
          {{ uiLabels.joinGameButton }}
        </button>
      </div>
    </section>
  </div>

  <div class="popupBackground" v-if="showNoGameExistBoolean">
    <div class="popup">
      <p>{{ uiLabels.noGameExist }}</p>
      <button class="okButton" @click="showNoGameExistBoolean = false">
        OK
      </button>
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

      <button class="okButton" @click="showObservePrompt = false">
        {{ uiLabels.no }}
      </button>

    </div>
  </div>

</template>


<script>
import { playSound } from "../src/utils/sound"; //testa ljud, ta bort sen!
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'StartView',
  props: ["uiLabels"],


  data: function () {
    return {
      gameId: "",
      joinMessage: "",
      showRulesBoolean: false,
      showNoGameExistBoolean: false,
      showObservePrompt: false,
    }
  },
  created() {
    socket.on('gameIdResponse', (response) => {
      if (response == "valid") {
        this.$router.push({ path: `/join/${this.gameId}` })
      }
      else if
        (response == "full") {
        this.showObservePrompt = true;
      }

      else {
        this.showNoGameExistBoolean = true;
      }
    })

  },
  methods: {
    validateGameId() {
      this.joinMessage = this.uiLabels.joinErrorMessage || "Spel-ID måste vara 4 tecken";
    },

    checkGameId() {
      socket.emit('tryGameId', this.gameId)
    },

  }
}


</script>


<style scoped>
.welcomeMessage {
  margin-top: 3rem;
}

#createJoin {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(1.5rem, 5vw, 4rem);
  margin-top: 3rem;
}

.gamePanel {
  background: var(--light-blue-base-color);
  border: ridge 5px var(--blue-base-color);
  box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
  border-radius: 0.25rem;
  padding: 1rem;
  width: 320px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gamePanel>p {
  text-shadow: 2px 2px 1px var(--blue-base-color);
}

.gameSubtitles {
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
}

.gameButtons {
  padding: 12px 15px;
  font-size: 15px;
  width: 19ch;
  text-align: center;
  margin: 0 auto;
  box-sizing: border-box;
  border: ridge 3px var(--blue-base-color);
  background-color: var(--light-gray-base-color);
  color: var(--blue-base-color);
  font-family: 'Super Funky', sans-serif;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 3px 3px 2px 0px var(--blue-base-color);
}

.gameButtons:hover {
  transform: scale(1.1);
  background-color: var(--blue-lighter-color);
}

input.gameButtons:hover {
  transform: none;
  cursor: text;
  background-color: var(--light-gray-base-color);
}

textarea:focus,
input:focus {
  outline: none;
}


::placeholder {
  font-size: 11px;
  color: var(--blue-base-color);
  opacity: 0.7;
}

.ButtonRow {
  justify-content: center;
  display: flex;
  margin-top: auto;
}

.joinErrorMessage {
  color: var(--red-darker-color);
  text-shadow: none;
}
</style>
