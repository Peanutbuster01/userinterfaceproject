<template>

  <title>{{ uiLabels.start }}</title>

  <div class="welcomeMessages">
    <h1>{{ uiLabels.welcomeTitle }}</h1>
  </div>

  <div id="createJoin">

    <section class="gamePanel">
      <h6 class="gameSubtitles">{{ uiLabels.createGame }}</h6>
      <p>{{ uiLabels.createGameInstructions }}</p>

      <div class="ButtonRow">
        <router-link class="gameButtons" to="/create/">
          {{ uiLabels.createGameButton }}
        </router-link>
      </div>
    </section>

    <section class="gamePanel">
      <h6 class="gameSubtitles">{{ uiLabels.joinGame }}</h6>
      <p>{{ uiLabels.joinGameInstructions }}</p>


      <div>
        <input class="gameButtons" type="text" maxlength="4" @input="validateLobbyId" v-model="lobbyId"
          :placeholder="uiLabels.fourCharGameID">

        <p v-if="lobbyId.length < 4" class="joinErrorMessage">
          {{ joinMessage }}
        </p>
      </div>

      <div class="ButtonRow">

        <button class="gameButtons" @click="checkLobbyId">
          {{ uiLabels.joinGameButton }}
        </button>

      </div>
    </section>
  </div>

  <div id="noGameExist" v-if="showNoGameExistBoolean">
    {{ uiLabels.noGameExist }}
    <button id="okButton" @click="showNoGameExistBoolean = !showNoGameExistBoolean">
      OK
    </button>
  </div>

</template>


<script>
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'StartView',
  props: ["uiLabels"],


  data: function () {
    return {
      lobbyId: "",
      joinMessage: "",
      hideNav: true,
      showRulesBoolean: false,
      showNoGameExistBoolean: false,
    }
  },
  created() {
    socket.on('lobbyIdResponse', (response) => {
      if (response == "valid") {
        this.$router.push({ path: `/join/${this.lobbyId}` })
      }
      else {
        console.log("INTE OK ID")
        this.showNoGameExistBoolean = true;
      }
    })

  },
  methods: {
    validateLobbyId() {
      this.joinMessage = this.uiLabels.joinErrorMessage || "Spel-ID måste vara 4 tecken";
    }
    ,
    checkLobbyId() {
      socket.emit('tryLobbyId', this.lobbyId)
    }
  }
}


</script>


<style scoped>
@import url('https://fonts.cdnfonts.com/css/super-funky');

.welcomeMessages {
  border-radius: 6px;
  margin-top: 3rem;
  text-align: center;
}

#createJoin {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(1.5rem, 5vw, 4rem);
  margin-top: 5rem;
}

.gamePanel {
  background: var(--light-blue-base-color);
  border: ridge 5px var(--blue-base-color);
  border-radius: 0.25rem;
  padding: 1rem;
  width: 320px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
}

.gameButtons:hover {
  transform: scale(1.1);
}

input.gameButtons:hover {
  transform: none;
  cursor: text;
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
  color: red;
}

.joinApprovedMessage {
  color: darkgreen;
}

#noGameExist {
  margin: 5% auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  white-space: pre-line;
  position: fixed;

  padding: 20px;
  color: red;
  background-color: var(--pink-base-color);
  border-radius: 0.25rem;
  border: ridge 10px var(--pink-darker-color);
  font-family: 'ADLaM Display', sans-serif;
  box-shadow: 5px 4px 5px var(--pink-darker-color);
  z-index: 1000000;
}

#okButton {
  border: ridge 3px var(--pink-darker-color);
  border-radius: 0.25rem;
  color: var(--pink-darker-color);
  background-color: var(--light-gray-base-color);
  cursor: pointer;
  font-family: 'ADLaM Display', sans-serif;
  padding: 5px;
  margin: 10px;
}

#okButton:hover {
  transform: scale(1.05);
}
</style>
