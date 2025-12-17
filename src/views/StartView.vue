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

        <p v-if="joinMessage" :class="lobbyId.length === 4 ? 'joinApprovedMessage' : 'joinErrorMessage'">
          {{ joinMessage }}
        </p>
      </div>

      <div class="ButtonRow">

        <router-link class="gameButtons" v-bind:to="'/join/' + lobbyId">
          {{ uiLabels.joinGameButton }}
        </router-link>

      </div>
    </section>
  </div>

</template>


<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  props: ["uiLabels"],


  data: function () {
    return {
      lobbyId: "",
      joinMessage: "",
      hideNav: true,
      showRulesBoolean: false,
    }
  },

  methods: {
    validateLobbyId() {
      if (this.lobbyId.length === 4) {
        this.joinMessage = this.uiLabels.joinApprovedMessage || "Spel-ID godkänt";
      } else {
        this.joinMessage = this.uiLabels.joinErrorMessage || "Spel-ID måste vara 4 tecken";
      }
    },

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
  gap: 4rem;
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
}

.gameButtons:hover {
  transform: scale(1.1);
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
</style>
