<template>
    <div class="logo">
      <img src="/img/logo.png">
      {{ uiLabels.siteName }}
      <img src="../assets/logo.svg">
    </div>
</template>
<script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");

    export default{
        data: function(){
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en"
        },
        created: function(){
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
</style>