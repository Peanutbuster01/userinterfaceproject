<template>
  <title>{{ uiLabels.createGame }}</title>

  <div class="pageDescription">
    <h2>{{ uiLabels.pageDescription }}</h2>
  </div>

  <div class="createlobbyId">
    <h3>{{ uiLabels.createLobbyId }}</h3>
    <input type="text" v-model="lobbyId" :placeholder="uiLabels.fourCharlobbyId" maxlength="4" @input="validatelobbyId"
      class="lobbyInput">

    <p v-if="lobbyMessage" :class="lobbyId.length === 4 ? 'lobbyApprovedMessage' : 'lobbyErrorMessage'">
      {{ lobbyMessage }}
    </p>
  </div>

  <div class="operations">
    <h3>{{ uiLabels.chooseOperation }}</h3>

    <div class="addition" style="display: inline-block;">
      <img class="operationIcon" src="https://www.pngmart.com/files/21/Addition-PNG-Photos.png" alt="addition">
      <br />

      <button :class="selectedOperations.includes('addition') ? 'chosen' : ''" @click="chooseOperation('addition')">
        {{ uiLabels.addition }}
      </button>
    </div>

    <div class="subtraction" style="display: inline-block;">
      <img class="operationIcon" src="https://www.freeiconspng.com/uploads/subtract-icon-png-26.png" alt="subtraktion">
      <br />

      <button :class="selectedOperations.includes('subtraction') ? 'chosen' : ''"
        @click="chooseOperation('subtraction')">
        {{ uiLabels.subtraction }}
      </button>
    </div>

    <div class="multiplication" style="display: inline-block;">
      <img class="operationIcon" src="https://iconape.com/wp-content/png_logo_vector/arrow-7.png" alt="multiplikation">
      <br />

      <button :class="selectedOperations.includes('multiplication') ? 'chosen' : ''"
        @click="chooseOperation('multiplication')">
        {{ uiLabels.multiplication }}
      </button>
    </div>

    <div class="divison" style="display: inline-block;">
      <img class="operationIcon" src="https://static.thenounproject.com/png/517809-200.png" alt="division">
      <br />

      <button :class="selectedOperations.includes('division') ? 'chosen' : ''" @click="chooseOperation('division')">
        {{ uiLabels.division }}
      </button>
    </div>
  </div>
  <br />

  <div class="level">
    <h3>{{ uiLabels.level }}</h3>

    <div class="easy" style="display: inline-block;">
      <img class="operationIcon"
        src="https://image.similarpng.com/file/similarpng/original-picture/2021/10/Cartoon-baby-hand-drawn-on-transpsrent-background-PNG.png"
        alt="easy">
      <br />
      <button :class="selectedLevel === 'easy' ? 'chosen' : ''" @click="chooseLevel('easy')">
        {{ uiLabels.easy }}
      </button>
    </div>

    <div class="medium" style="display: inline-block;">
      <img class="operationIcon"
        src="https://static.vecteezy.com/system/resources/previews/027/728/659/non_2x/cute-little-boy-cartoon-standing-free-png.png"
        alt="medium">
      <br />
      <button :class="selectedLevel === 'medium' ? 'chosen' : ''" @click="chooseLevel('medium')">
        {{ uiLabels.medium }}
      </button>
    </div>

    <div class="hard" style="display: inline-block;">
      <img class="operationIcon"
        src="https://cdni.iconscout.com/illustration/premium/thumb/strongman-illustration-svg-download-png-5367726.png"
        alt="hard">
      <br />
      <button :class="selectedLevel === 'hard' ? 'chosen' : ''" @click="chooseLevel('hard')">
        {{ uiLabels.hard }}
      </button>
    </div>

    <div class="nightmare" style="display: inline-block;">
      <img class="operationIcon" src="https://japaclip.com/en/files/cb01-crying.png" alt="nightmare">
      <br />
      <button :class="selectedLevel === 'nightmare' ? 'chosen' : ''" @click="chooseLevel('nightmare')">
        {{ uiLabels.nightmare }}
      </button>
    </div>
  </div>

  <div class="createLobbyButton">
    <p>{{ uiLabels.createLobbyInstructions }}</p>
    <button @click="createGame" :class="createLobbyReady ? 'createLobbyButtonReady' : 'createLobbyButtonNotReady'">
      <p>{{ createLobbyReady ? uiLabels.createLobbyButtonReady : uiLabels.createLobbyButtonNotReady }}</p>
    </button>
  </div>

</template>
<script>
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'CreateView',
  props: ["uiLabels"],

  data: function () {
    return {
      uiLabels: {},
      selectedOperations: [], //sparar vilka räknesätt som valts av host
      selectedLevel: null,
      lobbyId: "",
      lobbyMessage: "",
    }
  },
  created: function () {
    socket.on('gameCreated', (lobbyId) => {
      console.log("spel skapat", lobbyId)
      this.$router.push({ path: `/join/${lobbyId}` })
    });
  },

  methods: {

    chooseOperation: function (name) {
      const index = this.selectedOperations.indexOf(name);
      if (index === -1) {
        this.selectedOperations.push(name); //lägger till längst bak i listan
      } else {
        this.selectedOperations.splice(index, 1); //tar bort 1 element på positionen index
      }

    },

    chooseLevel: function (name) {
      if (this.selectedLevel === name) {
        this.selectedLevel = null; //klicka igen gör att de avmarkeras
      }
      else {
        this.selectedLevel = name;
      }
    },

    createGame: function () {
      socket.emit('createGame', {
        lobbyId: this.lobbyId,
        settings: {
          level: this.selectedLevel,
          operations: this.selectedOperations
        }

      })

    },

    validatelobbyId() {
      if (this.lobbyId.length === 4) {
        this.lobbyMessage = this.uiLabels.lobbyApprovedMessage || "Lobby-ID godkänt";
      } else {
        this.lobbyMessage = this.uiLabels.lobbyErrorMessage || "Lobby-ID måste vara 4 tecken";
      }
    },

  },

  computed: { //använder computed för att systemet ska uppdateras automatiskt när ngt ändras
    createLobbyReady() {
      return this.lobbyId.length === 4 && //att skriva return är som att skriva return true if, att skrivva && betyder att alla villkor måste vara sanna
        this.selectedOperations.length > 0 &&
        this.selectedLevel !== null;
    }
  }
}

</script>
<style scoped>
.pageDescription {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.createlobbyId {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.operations {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px;
}

.operationIcon {
  width: 110px;
  padding: 50px;
  margin-bottom: 5px;
}

.level {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
}

button {
  cursor: pointer;
  border: ridge 2px var(--blue-base-color)
}

.chosen {
  background-color: lightgreen;
}

.lobbyErrorMessage {
  color: red;
}

.lobbyApprovedMessage {
  color: darkgreen;
}

.createLobbyButton {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.createLobbyButtonReady {
  background-color: lightgreen;
}

.createLobbyButtonNotReady {
  background-color: lightcoral;
}
</style>