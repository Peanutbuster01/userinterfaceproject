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
        <button class="gameButtons">
          <router-link class="linkModifier" to="/create/">
            {{ uiLabels.createGameButton }}
          </router-link>
        </button>
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
        <button class="gameButtons">
          <router-link class="linkModifier" v-bind:to="'/join/' + lobbyId">
            {{ uiLabels.joinGameButton }}
          </router-link>
        </button>
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

.welcomeMessages {
  border-radius: 6px;
  margin-top: 5rem;
  text-align: center;
}

#createJoin {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 12rem;
}

.gamePanel {
  background: rgb(224, 223, 223);
  border: 1px solid #ddd;
  border-radius: 6px;
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
}

.ButtonRow {
  justify-content: center;
  display: flex;
  margin-top: auto;
}

.linkModifier {
  text-decoration: none;
  color: inherit;
}

.joinErrorMessage {
  color: red;
}

.joinApprovedMessage {
  color: darkgreen;
}
</style>
