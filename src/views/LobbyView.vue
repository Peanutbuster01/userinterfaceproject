<template>
<head>
<title>Lobby - {{uiLabels.siteName}}</title>
</head>
<header>
    <div class="logo">
      <img src="/img/logo.png">
      {{ uiLabels.siteName }}
      <img src="../assets/logo.svg">
    </div>
</header>
<div class = 'wrapper'>
<div class = 'ruleDiv'>
 <p>{{ uiLabels.ruleBody }}</p>
</div>
<div class = 'lobbyDiv'>
<PlayerCardComponent/>
<PlayerCardComponent/>
<button class="readyButton" v-on:pointerover="">{{ uiLabels.ready }}</button>
</div></div>
</template>
<script>
    import io from 'socket.io-client';
import PlayerCardComponent from '../components/PlayerCardComponent.vue';
    const socket = io("localhost:3000");

    export default{
        data: function(){
            return{
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            PlayerCardComponent: {}
            }
        },
        created: function(){
            socket.on( "uiLabels", labels => this.uiLabels = labels );
            socket.emit( "getUILabels", this.lang );
        },
        methods: function(){
            
        }
    }
</script>
<style>

.lobbyID{
    text-align: center;
    margin: 3%;
    font-size: 1.5rem;
}
.wrapper {
    display: grid;
    grid-gap: 0%;
    grid-template-columns: 30% 30% 30%;
    grid-template-rows: 100%;
    padding-left: 1.5%;
    padding-right: 1.5%;
    grid-column-gap: 1%;
    height: auto;
}
.lobbyDiv {
    background-color: blue;
    grid-column: 1 /span 2;
    grid-row: 1;
    padding-top: 5%;
}
.ruleDiv{
    background-color: red;
    grid-column: 3;
    grid-row: 1;
    padding: 5%;
}
.readyButton {
    font-size: 400%;
    background-color: rgb(0, 100, 0);
    
    border-width: 5px;
    
}
.readyButton:hover {
    background-color: green;
}
</style>