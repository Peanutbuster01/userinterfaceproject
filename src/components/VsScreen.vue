<template>
    <div id="screen">
        <div class="vsPlayer">
            <h1 style="text-shadow: 4px 4px 2px var(--blue-base-color);">{{ playerName }}</h1>
            <img :src="avatars[avatarIndex].image"></img>
        </div>
        <div class="vsPlayer">
            <h1 style="text-shadow: 4px 4px 2px var(--lavender-darker-color);">{{ opponentName }}</h1>
            <img :src="avatars[opponentAvatarIndex].image"></img>
        </div>
        <h1 id="vs">
            VS
        </h1>
    </div>

</template>

<script>
import avatars from "../assets/avatars.json";

export default {
    name: 'VsScreen',
    props: {
        avatarIndex: Number,
        opponentAvatarIndex: Number,
        playerName: String,
        opponentName: String,
    },
    data() {
        return { avatars }
    },
    methods: {}
}

</script>


<style scoped>
#screen {
    position: fixed;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999999;
    background-color: var(--light-blue-base-color);
    pointer-events: none;

    animation: forwards 4s vsScreenAnimation;
}

@media(max-width: 600px) {
    #screen {
        grid-template-columns: 1fr;
    }
}

@keyframes vsScreenAnimation {
    0% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        opacity: 0;

    }
}


.vsPlayer {
    flex-grow: 1;
    justify-items: center;
    overflow: hidden;
    border: 18px ridge var(--blue-base-color);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.vsPlayer img {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 80%;
    display: block;
    object-fit: contain;
}

.vsPlayer:nth-child(2) {
    background-color: var(--lavender-base-color);
    border-color: var(--lavender-darker-color);
}

#vs {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center;
    transform: translate(-50%, -50%) rotate(-20deg);
    font-size: 100px;
    color: var(--light-gray-base-color);
    text-shadow: 0 0 5rem #3b053b;
    margin: 0;

    animation: forwards 4s vsAnimation;
}

@keyframes vsAnimation {
    0% {
        transform: translate(-50%, -50%) scale(0) rotate(-1000deg);
    }

    30% {
        transform: translate(-50%, -50%) scale(1) rotate(-20deg);
    }

    85% {
        transform: translate(-50%, -50%) scale(1) rotate(-20deg);
    }

    100% {
        transform: translate(-50%, -50%) scale(10) rotate(-1000deg);
    }
}
</style>