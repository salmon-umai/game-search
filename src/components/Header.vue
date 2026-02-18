<script setup lang="js">
import favoriteIcon from "../assets/heart.svg";
import searchIcon from "../assets/search.svg";

import { useRouter } from "vue-router";

const emit = defineEmits(["open-search"]);

const router = useRouter();
</script>

<template>
    <header>
        <div id="header-inner">
            <button class="back-btn" @click="router.push('/')">TOP</button>
            <button class="btn" @click="emit('open-search')">
                <img :src="searchIcon" alt="" id="search">
            </button>
            <RouterLink to="/favorites" class="btn favorite-btn">
                <img :src="favoriteIcon" alt="" id="heart">
            </RouterLink>
        </div>
    </header>
</template>

<style scoped>
header {
    background-color: var(--color-main);
    padding: 10px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
}

.btn {
    background: none;
    border: none;
    cursor: pointer;
}

#search {
    width: 20px;
    height: auto;
}

#heart {
    width: 20px;
    height: auto;
}

#header-inner {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin-right: 50px;
}

.back-btn {
    background: none;
    border: none;
    color: var(--color-font2);
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 6px;
    letter-spacing: 0.3rem;
    cursor: pointer;
    font-family: "Yomogi", cursive;
}

.back-btn:hover,
#search:hover,
#heart:hover {
    opacity: 0.7;
}
</style>