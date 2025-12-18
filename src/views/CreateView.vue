<template>
  <title>{{ uiLabels.createGame }}</title>

  <div id="container">
    <div class="createSection">
      <h2>{{ uiLabels.pageDescription }}</h2>
    </div>

    <div class="createSection">
      <h3>{{ uiLabels.createLobbyId }}</h3>
      <input type="text" v-model="lobbyId" :placeholder="uiLabels.fourCharlobbyId" maxlength="4"
        @input="validatelobbyId" class="lobbyInput">

      <p v-if="lobbyMessage" :class="lobbyId.length === 4 ? 'lobbyApprovedMessage' : 'lobbyErrorMessage'">
        {{ lobbyMessage }}
      </p>
    </div>

    <div class="createSection">
      <h3>{{ uiLabels.chooseOperation }}</h3>


      <div class="chooseSettings">
        <div class="pictureAndButton">
          <img class="settingIcon" src="https://www.pngmart.com/files/21/Addition-PNG-Photos.png" alt="addition">

          <button :class="selectedOperations.includes('addition') ? 'chosen' : ''" @click="chooseOperation('addition')">
            {{ uiLabels.addition }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://www.freeiconspng.com/uploads/subtract-icon-png-26.png"
            alt="subtraktion">

          <button :class="selectedOperations.includes('subtraction') ? 'chosen' : ''"
            @click="chooseOperation('subtraction')">
            {{ uiLabels.subtraction }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://iconape.com/wp-content/png_logo_vector/arrow-7.png"
            alt="multiplikation">


          <button :class="selectedOperations.includes('multiplication') ? 'chosen' : ''"
            @click="chooseOperation('multiplication')">
            {{ uiLabels.multiplication }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://static.thenounproject.com/png/517809-200.png" alt="division">


          <button :class="selectedOperations.includes('division') ? 'chosen' : ''" @click="chooseOperation('division')">
            {{ uiLabels.division }}
          </button>
        </div>
      </div>
    </div>


    <div class="createSection">
      <h3>{{ uiLabels.level }}</h3>
      <div class="chooseSettings">
        <div class="pictureAndButton">
          <img class="settingIcon"
            src="https://image.similarpng.com/file/similarpng/original-picture/2021/10/Cartoon-baby-hand-drawn-on-transpsrent-background-PNG.png"
            alt="easy">

          <button :class="selectedLevel === 'easy' ? 'chosen' : ''" @click="chooseLevel('easy')">
            {{ uiLabels.easy }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon"
            src="https://static.vecteezy.com/system/resources/previews/027/728/659/non_2x/cute-little-boy-cartoon-standing-free-png.png"
            alt="medium">

          <button :class="selectedLevel === 'medium' ? 'chosen' : ''" @click="chooseLevel('medium')">
            {{ uiLabels.medium }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon"
            src="https://cdni.iconscout.com/illustration/premium/thumb/strongman-illustration-svg-download-png-5367726.png"
            alt="hard">

          <button :class="selectedLevel === 'hard' ? 'chosen' : ''" @click="chooseLevel('hard')">
            {{ uiLabels.hard }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://japaclip.com/en/files/cb01-crying.png" alt="nightmare">

          <button :class="selectedLevel === 'nightmare' ? 'chosen' : ''" @click="chooseLevel('nightmare')">
            {{ uiLabels.nightmare }}
          </button>
        </div>
      </div>
    </div>

    <div class="createSection">
      <h3>{{ uiLabels.createLobbyInstructions }}</h3>
      <button @click="createGame" :class="createLobbyReady ? 'createLobbyButtonReady' : 'createLobbyButtonNotReady'">
        {{ createLobbyReady ? uiLabels.createLobbyButtonReady : uiLabels.createLobbyButtonNotReady }}
      </button>
    </div>
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
      if (this.lobbyId.length === 4 &&
        this.selectedOperations.length > 0 &&
        this.selectedLevel !== null) {
        socket.emit('createGame', {
          lobbyId: this.lobbyId,
          settings: {
            level: this.selectedLevel,
            operations: this.selectedOperations
          }
        })
      }

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
#container {
  padding: 20px;
}

h2,
h3 {
  text-shadow: 4px 4px 2px var(--blue-base-color);
}

.createSection {
  border: 10px ridge var(--pink-darker-color);
  background-color: var(--light-blue-base-color);
  border-radius: 0.25rem;
  padding: 2%;
  margin-bottom: 1rem;

}

.lobbyInput {
  padding: 5px;
  border-radius: 0.25rem;
  border: ridge 2px var(--blue-base-color);
  max-width: 4rem;
  font-family: 'Super Funky', sans-serif;
  letter-spacing: 0.1em;
  color: var(--blue-base-color);
  text-align: center;
}

textarea:focus,
input:focus {
  outline: none;
}

.chooseSettings {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
}

@media(max-width: 700px) {
  .chooseSettings {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    justify-items: center;
  }
}

.pictureAndButton {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.settingIcon {
  width: 110px;
  height: 110px;
  padding: 20px;
  margin-bottom: 5px;
}




button {
  cursor: pointer;
  border-radius: 0.25rem;

  padding: 10px 2px;
  font-size: 12px;
  width: 90%;
  text-align: center;
  margin: 0 auto;
  box-sizing: border-box;
  border: ridge 4px var(--lavender-darker-color);
  background-color: var(--lavender-base-color);
  color: var(--light-gray-base-color);
  font-family: 'Super Funky', sans-serif;
  letter-spacing: 1px;
}

button:hover {
  transform: scale(1.1);
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


.createLobbyButtonReady {
  background-color: lightgreen;
  padding: 10px 5px;
  width: 60%;
}

.createLobbyButtonNotReady {
  background-color: lightcoral;
  padding: 10px 5px;
  width: 70%;
}

@media(min-width: 600px) {

  .createLobbyButtonNotReady {
    width: 30%;
  }

  .createLobbyButtonReady {
    width: 15%;
  }
}
</style>