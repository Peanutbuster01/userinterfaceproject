<template>
    <body>
<p>Player 1: {{ player1Name }}</p>
</body>
</template>

<script>
export default {
    data() {
        return {
            player1Name: '',
            player1Image: ''
        }
    }
}
</script>

<style>
body {
    border-width: 2px;
    border-color: black;
}
</style>