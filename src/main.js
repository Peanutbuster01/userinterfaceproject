import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { playSound } from "./assets/utils/sound";

const app = createApp(App)

app.use(router)

app.mount('#app')

document.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    playSound("buttonClick");
  }
});

