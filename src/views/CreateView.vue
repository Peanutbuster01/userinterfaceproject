<template>
  <title>{{ uiLabels.createGame }}</title>

  <div class="pageDescription">
    <h2>{{ uiLabels.pageDescription }}</h2>
  </div>

  <div class="createlobbyId">
    <h2>{{ uiLabels.createlobbyId }}</h2>
    <!-- Inputfält för lobby ID -->
    <input type="text" v-model="lobbyId" :placeholder="uiLabels.fourCharlobbyId" maxlength="4" @input="validatelobbyId"
      class="lobbyInput">

    <p v-if="lobbyMessage" :class="lobbyId.length === 4 ? 'lobbyApprovedMessage' : 'lobbyErrorMessage'">
      {{ lobbyMessage }}
    </p>
  </div>

  <div class="operations">
    <h2>{{ uiLabels.chooseOperation }}</h2>

    <div class="addition" style="display: inline-block;">
      <img class="operationIcon"
        src="https://media.istockphoto.com/id/688550958/sv/vektor/svart-plustecken-positiv-symbol.jpg?s=612x612&w=0&k=20&c=MIncoKsDiH3_rqcyhbU0MDb4chOb53f0pY-Crfqs6c4="
        alt="addition">
      <br />

      <button :class="selectedOperations.includes('addition') ? 'chosen' : ''" @click="chooseOperation('addition')">
        {{ uiLabels.addition }}
      </button>
    </div>

    <div class="subtraction" style="display: inline-block;">
      <img class="operationIcon"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlMnfRAhJvsIfA4WXPEb5f0NwbqC_a55QGyw&s"
        alt="subtraktion">
      <br />

      <button :class="selectedOperations.includes('subtraction') ? 'chosen' : ''"
        @click="chooseOperation('subtraction')">
        {{ uiLabels.subtraction }}
      </button>
    </div>

    <div class="multiplication" style="display: inline-block;">
      <img class="operationIcon"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6MV_7nOc5ByQanA9ipuGv269z3VctZEjBbA&s"
        alt="multiplikation">
      <br />

      <button :class="selectedOperations.includes('multiplication') ? 'chosen' : ''"
        @click="chooseOperation('multiplication')">
        {{ uiLabels.multiplication }}
      </button>
    </div>

    <div class="divison" style="display: inline-block;">
      <img class="operationIcon"
        src="https://media.istockphoto.com/id/1188614861/sv/vektor/dela-ikon-platt-illustration-av-division-dividera-tecken-symbol-vektor.jpg?s=612x612&w=0&k=20&c=ES3UBeS3nxi-AVwS5-lC1siR0Qht5LT6IDo7_2d6N-g="
        alt="division">
      <br />

      <button :class="selectedOperations.includes('division') ? 'chosen' : ''" @click="chooseOperation('division')">
        {{ uiLabels.division }}
      </button>
    </div>
  </div>
  <br />

  <div class="level">
    <h2>{{ uiLabels.level }}</h2>

    <div class="easy" style="display: inline-block;">
      <img class="operationIcon"
        src="https://static.vecteezy.com/ti/gratis-vektor/p1/5205736-tecknad-bebiskaraktar-anvander-napp-gratis-vector.jpg"
        alt="easy">
      <br />
      <button :class="selectedLevel === 'easy' ? 'chosen' : ''" @click="chooseLevel('easy')">
        {{ uiLabels.easy }}
      </button>
    </div>

    <div class="medium" style="display: inline-block;">
      <img class="operationIcon"
        src="https://img.freepik.com/premium-vektor/sot-liten-pojke-tecknad-tillbaka-till-skolan_991386-44.jpg"
        alt="medium">
      <br />
      <button :class="selectedLevel === 'medium' ? 'chosen' : ''" @click="chooseLevel('medium')">
        {{ uiLabels.medium }}
      </button>
    </div>

    <div class="hard" style="display: inline-block;">
      <img class="operationIcon"
        src="https://static.vecteezy.com/system/resources/previews/013/697/031/non_2x/blond-strong-man-free-vector.jpg"
        alt="hard">
      <br />
      <button :class="selectedLevel === 'hard' ? 'chosen' : ''" @click="chooseLevel('hard')">
        {{ uiLabels.hard }}
      </button>
    </div>

    <div class="nightmare" style="display: inline-block;">
      <img class="operationIcon"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThSWeM6t3h7-tVnr0z8n-lk7ROcqNFGH4vTQ&s"
        alt="nightmare">
      <br />
      <button :class="selectedLevel === 'nightmare' ? 'chosen' : ''" @click="chooseLevel('nightmare')">
        {{ uiLabels.nightmare }}
      </button>
    </div>
  </div>

  <div class="createLobbyButton">
    <p>{{ uiLabels.createLobbyInstructions }}</p>
    <button @click="createGame" :class="createLobbyReady ? 'createLobbyButtonReady' : 'createLobbyButtonNotReady'">
      {{ createLobbyReady ? uiLabels.createLobbyButtonReady : uiLabels.createLobbyButtonNotReady }}
    </button>
  </div>

</template>
<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

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