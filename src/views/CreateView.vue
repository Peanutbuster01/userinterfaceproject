<template>
    <title>{{uiLabels.create}}</title>
    <header>
    <div class="logo">
      {{ uiLabels.siteName }}
    </div>
    </header>   
</template>
<script>
    import io from 'socket.io-client';
    const socket = io("localhost:3000");

    export default{
        data: function(){
            return{
            uiLabels: {},
            lang: localStorage.getItem("lang") || "sv"
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
<style scoped>
header {
  background-color: gray;
  width: 100%;
  grid-template-columns: 2em auto;
}
.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 2.5rem;
  color: white; 
  padding-top: 0.2em;
}

</style>