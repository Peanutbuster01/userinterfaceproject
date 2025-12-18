<template>

  <header class="topBar">
    <div class="left">
      <button class="langBtn" :style="{ backgroundImage: `url(${uiLabels.flag})` }" @click="switchLanguage"> </button>

      <button class="rulesButton" @click="showRulesBoolean = !showRulesBoolean">
        {{ uiLabels.rules }} </button>

    </div>

    <div class="logo">
      {{ uiLabels.siteName }}
    </div>
  </header>

  <div class="ruleSquare" v-if="showRulesBoolean">
    {{ uiLabels.ruleBody }}
  </div>

  <RouterView v-slot="{ Component }">
    <component :is="Component" :uiLabels="uiLabels" />
  </RouterView>

</template>

<script>
import { RouterView } from 'vue-router'
import io from 'socket.io-client';
const socket = io();

export default {
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "sv",
      hideNav: true,
      showRulesBoolean: false
    }
  },
  created: function () {
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.emit("getUILabels", this.lang);
  },

  methods: {
    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv";
      } else {
        this.lang = "en";
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("getUILabels", this.lang);
    }
  }
}

</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/super-funky');
@import url('https://fonts.googleapis.com/css2?family=ADLaM+Display&display=swap');


.topBar {
  display: grid;
  background-color: var(--lavender-base-color);
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: ridge 5px var(--lavender-darker-color);
  margin-bottom: 10px;
}

@media (max-width: 600px) {
  .topBar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}

.left {
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: clamp(2rem, 6vw, 3.5rem);
  color: var(--light-gray-base-color);
  text-align: center;
  font-family: 'Super Funky', sans-serif;
  text-shadow: 5px 4px 1px var(--lavender-darker-color);
}

.langBtn {
  background: transparent;
  border: none;
  cursor: pointer;
  height: 2rem;
  aspect-ratio: 1200 / 750;
  background-size: contain;
  margin: 0;
  padding: 0;
  border-radius: 0.25rem;
  border: ridge 2px var(--lavender-darker-color);
}

.langBtn:hover {
  transform: scale(1.1);
}

.flag {
  width: 60px;
}

.ruleSquare {
  margin: 5% auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  white-space: pre-line;
  position: fixed;

  padding: 20px;
  color: var(--light-gray-base-color);
  background-color: var(--lavender-base-color);
  border-radius: 0.25rem;
  border: ridge 10px var(--lavender-darker-color);
  font-family: 'ADLaM Display', sans-serif;
  box-shadow: 5px 4px 5px var(--pink-darker-color);
  z-index: 100000;

}

.rulesButton {
  padding: 5px;
  margin: 5px;
  color: var(--lavender-base-color);
  background-color: var(--light-gray-base-color);
  font-family: 'Super Funky', sans-serif;

  border-radius: 0.25rem;
  border: ridge 3px var(--lavender-darker-color);
  cursor: pointer;
}

.rulesButton:hover {
  transform: scale(1.1);
}
</style>
