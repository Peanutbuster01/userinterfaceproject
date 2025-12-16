<template>
  <header>
    <div v-bind:class="['hamburger', { 'close': !hideNav }]" v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="/img/logo.png">
      {{ uiLabels.siteName }}
      <img src="../assets/logo.svg">
    </div>
  </header>

  <ResponsiveNav v-bind:hideNav="hideNav">
    <button v-on:click="switchLanguage">
      <img :src="uiLabels.flag" style="width: 60%;">
    </button>


    <button @click="showRulesBoolean = !showRulesBoolean">
      {{ uiLabels.rules }}
    </button>

  </ResponsiveNav>

  <div class="ruleSquare" v-if="showRulesBoolean">
    {{ uiLabels.ruleBody }}
  </div>

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
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      lobbyId: "",
      joinMessage: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      showRulesBoolean: false,
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
header {
  background-color: gray;
  width: 100%;
  display: grid;
  grid-template-columns: 2em auto;
}

.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 2.5rem;
  color: white;
  padding-top: 0.2em;
}

.logo img {
  height: 2.5rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
}

.hamburger {
  color: white;
  width: 1em;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0.5rem;
  top: 0;
  left: 0;
  height: 2rem;
  cursor: pointer;
  font-size: 1.5rem;
}

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger::before {
    content: "☰";
  }

  .close::before {
    content: "✕";
  }

  .hide {
    left: -12em;
  }
}

.welcomeMessages {
  border-radius: 6px;
  margin-top: 5rem;
  text-align: center;
}

.ruleSquare {
  margin: 5% auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: blue;
  width: 50rem;
  background-color: aqua;
  white-space: pre-line;
  position: fixed;
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
