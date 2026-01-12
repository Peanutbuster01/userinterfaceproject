<template>
    <div class="board" :class="{ opponentBoard: isOpponent }">
        <div class="overlay">
            <div v-for="(x, i) in 12" :key="'sqr-' + i" class="square" :class="[{ selectedShot: selectedSquareIndex === i && shots[selectedSquareIndex] === undefined },
            { unselectable: shots[i] != undefined }]" @click="$emit('squareClicked', i)">

                <img class="placedAvatarShip" v-if="(!isOpponent && placedShips?.includes(i)) || shots[i] === 'hit'"
                    :src="avatars[avatarIndex].image">
                <img v-if="shots[i] === 'hit'" class="hitShot" src="/img/cross.png" />
                <span v-else-if="shots[i] === 'miss'" class="missedShot"></span>
            </div>
        </div>
        <div v-if="isBoardLocked" class="boardLock"></div>
    </div>
</template>

<script>
import avatars from "../assets/avatars.json";

export default {
    name: 'GameBoard',
    props: {
        isOpponent: Boolean,
        placedShips: Array,
        shots: Object,
        avatarIndex: Number,
        selectedSquareIndex: Number,
        isBoardLocked: Boolean
    },
    emits: ['squareClicked'],
    data() {
        return { avatars }
    },
    methods: {}
}

</script>


<style scoped>
.board {
    position: relative;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    aspect-ratio: 4 / 3;
    border: 12px ridge var(--blue-base-color);
    border-radius: 12px;
    box-shadow: 3px 3px 2px 0px var(--pink-darker-color);
}

.opponentBoard {
    border-color: var(--lavender-darker-color);
}

.opponentBoard .overlay {
    background-color: var(--lavender-base-color);
}

.overlay {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    background-color: var(--light-blue-base-color);
    gap: 5px;
}

.square {
    z-index: 50;
    box-shadow: inset 0 0 4px rgb(255, 255, 255);
    position: relative;
    overflow: hidden;
}

.square:not(.unselectable):hover {
    transform: scale(0.95);
    cursor: pointer;
}

.placedAvatarShip {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
}

.boardLock {
    position: absolute;
    inset: 0;
    z-index: 9999;
    pointer-events: auto;
}

.selectedShot {
    border: 4px solid #ff0000;
}

.missedShot {
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(139, 136, 136, 0.7);
}

.hitShot {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}
</style>