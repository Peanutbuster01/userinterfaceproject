<template>
  <title>{{ uiLabels.createGame }}</title>
  <h3>{{ uiLabels.yourGameId }} {{ gameId }}</h3>

  <div id="container">
    <div class="createSection">
      <h2>{{ uiLabels.pageDescription }}</h2>
    </div>

    <div class="createSection">
      <h3>{{ uiLabels.chooseOperation }}</h3>


      <div class="chooseSettings">
        <div class="pictureAndButton">
          <img class="settingIcon" src="https://www.pngmart.com/files/21/Addition-PNG-Photos.png" alt="addition">

          <button class="createButton" :class="selectedOperations.includes('addition') ? 'chosen' : ''"
            @click="chooseOperation('addition')">
            {{ uiLabels.addition }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://www.freeiconspng.com/uploads/subtract-icon-png-26.png"
            alt="subtraktion">

          <button class="createButton" :class="selectedOperations.includes('subtraction') ? 'chosen' : ''"
            @click="chooseOperation('subtraction')">
            {{ uiLabels.subtraction }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://iconape.com/wp-content/png_logo_vector/arrow-7.png"
            alt="multiplication">


          <button class="createButton" :class="selectedOperations.includes('multiplication') ? 'chosen' : ''"
            @click="chooseOperation('multiplication')">
            {{ uiLabels.multiplication }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://static.thenounproject.com/png/517809-200.png" alt="division">


          <button class="createButton" :class="selectedOperations.includes('division') ? 'chosen' : ''"
            @click="chooseOperation('division')">
            {{ uiLabels.division }}
          </button>
        </div>
      </div>
    </div>


    <div class="createSection">
      <img class="infoIcon" src="https://upload.wikimedia.org/wikipedia/commons/4/43/Minimalist_info_Icon.png"
        @click="difficultyPopupShowing = !difficultyPopupShowing">
      <h3>{{ uiLabels.level }}</h3>
      <div class="chooseSettings">
        <div class="pictureAndButton">
          <img class="settingIcon"
            src="https://image.similarpng.com/file/similarpng/original-picture/2021/10/Cartoon-baby-hand-drawn-on-transpsrent-background-PNG.png"
            alt="easy">

          <button class="createButton" :class="selectedLevel === 'easy' ? 'chosen' : ''" @click="chooseLevel('easy')">
            {{ uiLabels.easy }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon"
            src="https://static.vecteezy.com/system/resources/previews/027/728/659/non_2x/cute-little-boy-cartoon-standing-free-png.png"
            alt="medium">

          <button class="createButton" :class="selectedLevel === 'medium' ? 'chosen' : ''"
            @click="chooseLevel('medium')">
            {{ uiLabels.medium }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon"
            src="https://cdni.iconscout.com/illustration/premium/thumb/strongman-illustration-svg-download-png-5367726.png"
            alt="hard">

          <button class="createButton" :class="selectedLevel === 'hard' ? 'chosen' : ''" @click="chooseLevel('hard')">
            {{ uiLabels.hard }}
          </button>
        </div>

        <div class="pictureAndButton">
          <img class="settingIcon" src="https://japaclip.com/en/files/cb01-crying.png" alt="nightmare">

          <button class="createButton" :class="selectedLevel === 'nightmare' ? 'chosen' : ''"
            @click="chooseLevel('nightmare')">
            {{ uiLabels.nightmare }}
          </button>
        </div>
      </div>
    </div>

    <div class="createSection">
      <h3>{{ uiLabels.createGameRequirement }}</h3>
      <button class="createButton" @click="createGame"
        :class="createGameReady ? 'createGameButtonReady' : 'createGameButtonNotReady'">
        {{ createGameReady ? uiLabels.createGameButtonReady : uiLabels.createGameButtonNotReady }}
      </button>
    </div>
  </div>
  <div class="popup" v-if="difficultyPopupShowing">
    <p>{{ uiLabels.difficultyInfo }}</p>
    <button class="okButton" @click="difficultyPopupShowing = false">Ok</button>
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
      selectedOperations: [],
      selectedLevel: null,
      gameId: "",
      gameMessage: "",
      difficultyPopupShowing: false,
    }
  },

  created: function () {
    socket.on("gameGenerated", (id) => {
      this.gameId = id;
    });

    socket.on("gameCreated", (gameId) => {
      console.log("spel skapat", gameId);
      this.$router.push({ path: `/join/${gameId}` });
    });

    socket.emit("generateGameId");
  },


  methods: {
    chooseOperation: function (name) {
      const index = this.selectedOperations.indexOf(name);
      if (index === -1) {
        this.selectedOperations.push(name);
      } else {
        this.selectedOperations.splice(index, 1);
      }

    },

    chooseLevel: function (name) {
      if (this.selectedLevel === name) {
        this.selectedLevel = null;
      }
      else {
        this.selectedLevel = name;
      }
    },

    createGame: function () {
      if (this.gameId.length === 4 &&
        this.selectedOperations.length > 0 &&
        this.selectedLevel !== null) {
        socket.emit('createGame', {
          gameId: this.gameId,
          settings: {
            level: this.selectedLevel,
            operations: this.selectedOperations
          }
        })
      }
    },
  },

  computed: {
    createGameReady() {
      return this.selectedOperations.length > 0 &&
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
.createSection>h3 {
  text-shadow: 4px 4px 2px var(--blue-base-color);
}

.createSection {
  border: 10px ridge var(--pink-darker-color);
  background-color: var(--light-blue-base-color);
  box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
  border-radius: 0.25rem;
  padding: 2%;
  margin-bottom: 1rem;
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


.createButton {
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
  box-shadow: 3px 3px 2px 0px var(--blue-base-color);
}

button:hover {
  transform: scale(1.1);
}

.chosen {
  background-color: var(--green-base-color);
  border-color: var(--green-darker-color);
}


.createGameButtonReady {
  background-color: var(--green-base-color);
  border-color: var(--green-darker-color);
  padding: 10px 5px;
  width: 60%;
}

.createGameButtonNotReady {
  background-color: var(--red-base-color);
  border-color: var(--red-darker-color);
  padding: 10px 5px;
  width: 70%;
  cursor: auto;
}

.createGameButtonNotReady:hover {
  transform: none;
}

.infoIcon {
  width: 5%;
  position: absolute;
  left: 5%;
  cursor: pointer;
}

@media(min-width: 600px) {

  .createGameButtonNotReady {
    width: 30%;
  }

  .createGameButtonReady {
    width: 20%;
  }
}
</style>