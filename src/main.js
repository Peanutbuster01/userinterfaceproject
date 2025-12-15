import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PlayerCardComponent from './components/PlayerCardComponent.vue'

const app = createApp(App)
app.component(PlayerCardComponent)
app.use(router)

app.mount('#app')
