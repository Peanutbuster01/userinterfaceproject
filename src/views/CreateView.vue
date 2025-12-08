<template>
    <title>{{uiLabels.create}}</title>
    <header>
    <div class="logo">
      {{ uiLabels.siteName }}
    </div>
    </header>
    <div class="lobbyID">Lobby-ID: </div>

    <div class="operations" style="display: inline-block;">
        <h2>{{ uiLabels.chooseOperation }}</h2>

        <div class="addition" style="display: inline-block;">
            <img class="operationIcon" src="https://media.istockphoto.com/id/688550958/sv/vektor/svart-plustecken-positiv-symbol.jpg?s=612x612&w=0&k=20&c=MIncoKsDiH3_rqcyhbU0MDb4chOb53f0pY-Crfqs6c4=" alt="addition">
            <br/>
            <button v-on:click="selectedOperation = 'addition'">
           {{ uiLabels.addition }}
        </button>
        </div>
       
        <div class="subtraction"style="display: inline-block;">
            <img class="operationIcon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlMnfRAhJvsIfA4WXPEb5f0NwbqC_a55QGyw&s" alt="subtraktion">
            <br/>
            <button v-on:click="selectedOperation = 'subtraction'">
            {{ uiLabels.subtraction }}
        </button>
        </div>

        <div class="multiplication" style="display: inline-block;">
            <img class="operationIcon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6MV_7nOc5ByQanA9ipuGv269z3VctZEjBbA&s" alt="multiplikation">
           <br/>
            <button v-on:click="selectedOperation = 'multiplication'">
          {{ uiLabels.multiplication }}
        </button>
        </div>

        <div class="divison" style="display: inline-block;">
            <img class="operationIcon" src="https://media.istockphoto.com/id/1188614861/sv/vektor/dela-ikon-platt-illustration-av-division-dividera-tecken-symbol-vektor.jpg?s=612x612&w=0&k=20&c=ES3UBeS3nxi-AVwS5-lC1siR0Qht5LT6IDo7_2d6N-g=" alt="division">
            <br/>
            <button v-on:click="selectedOperation = 'division'">
          {{ uiLabels.division }}
        </button>
        </div>

      </div>
      <br/>
    <div class="level" style="display: inline-block;">
        <h2>{{ uiLabels.level }}</h2>

       <div class="easy" style="display: inline-block;">
            <img class="operationIcon" src="https://static.vecteezy.com/ti/gratis-vektor/p1/5205736-tecknad-bebiskaraktar-anvander-napp-gratis-vector.jpg" alt="easy">
            <br/>
            <button v-on:click="selectedLevel = 'easy'">
           {{ uiLabels.easy }}
        </button>
        </div> 

        <div class="medium" style="display: inline-block;">
            <img class="operationIcon" src="https://img.freepik.com/premium-vektor/sot-liten-pojke-tecknad-tillbaka-till-skolan_991386-44.jpg" alt="medium">
            <br/>
            <button v-on:click="selectedLevel = 'medium'">
           {{ uiLabels.medium }}
        </button>
        </div> 

        <div class="hard" style="display: inline-block;">
            <img class="operationIcon" src="https://static.vecteezy.com/system/resources/previews/013/697/031/non_2x/blond-strong-man-free-vector.jpg" alt="hard">
            <br/>
            <button v-on:click="selectedLevel = 'hard'">
           {{ uiLabels.hard }}
        </button>
        </div> 

        <div class="nightmare" style="display: inline-block;">
            <img class="operationIcon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThSWeM6t3h7-tVnr0z8n-lk7ROcqNFGH4vTQ&s" alt="nightmare">
            <br/>
            <button v-on:click="selectedLevel = 'nightmare'">
           {{ uiLabels.nightmare }}
        </button>
        </div>
    </div>
    
    
    
  
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
  grid: 0%;
}
.lobbyID {
    font-size: 2rem;
    padding-top: 0.5em;
}

.operations {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
}

.operationIcon {
    width: 150px;
    padding: 50px;
}

.level{
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
}

</style>