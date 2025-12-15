<template>
<div class="PlayerBox">
<h1>Player {{ playerNumber }}: {{ playerName }}</h1>
<p>Hello There!</p>
</div>
</template>

<script>
export default {
    props: [
        'playerNumber'
    ],
    data: function() {
        return {
            playerName: '',
            playerImage: ''
        }
    }
}
</script>

<style>
 .PlayerBox {
    border-width: 2px;
    border-color: black;
    width: auto%;
    border-style: solid;
    padding: 5%;
    margin: 2%;
    }
</style>