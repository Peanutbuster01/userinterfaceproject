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
 Lobbystuff here
</div></div>
</template>
<script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");

    export default{
        data: function(){
            return{
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
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
  grid-area: 1/span 2;
}
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
}
.ruleDiv{
    background-color: red;
    grid-column: 3;
    grid-row: 1;
}
.logo img {
  height: 2.5rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
}
</style>