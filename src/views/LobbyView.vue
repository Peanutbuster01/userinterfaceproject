<template>
<title>Lobby - {{uiLabels.siteName}}</title>
<header>
    <div class="logo">
      {{ uiLabels.siteName }}
    </div>
    </header>
<div class = 'ruleDiv'>

</div>
<div class = 'lobbyDiv'>

</div>
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
</style>