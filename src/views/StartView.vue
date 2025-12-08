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



    <button popovertarget="ruleSquare">
      {{ uiLabels.rules }}
    </button>

  </ResponsiveNav>

  <div id="createJoin">
    <button>
      <router-link to="/create/">
        {{ uiLabels.createGame }}
      </router-link>
    </button>

    <label>
      {{ uiLabels.writeGameID }}
      <input type="text" v-model="newPollId">
    </label>

    <button>
      <router-link v-bind:to="'/lobby/' + newPollId">
        {{ uiLabels.joinGame }}
      </router-link>
    </button>
  </div>


  <div id="ruleSquare" popover="">

    {{ uiLabels.ruleBody }}

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
      newPollId: "",
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
    showRules: function () {
      if (!this.showRulesBoolean) {
        ruleSquare.style.display = 'none';
      }
      this.showRulesBoolean = !this.showRulesBoolean
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

#ruleSquare {
  margin: 10% auto;
  color: blue;
  width: 50rem;
  background-color: aqua;
  opacity: 0.5;
  white-space: pre-line;
}
</style>
