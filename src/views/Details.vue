<script setup lang="js">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useFavorites } from "@/composables/useFavorites";

import axios from "axios";

import BackIcon from "../assets/arrow-left.svg";
import FavoriteIcon from "@/components/favoriteIcon.vue";

const route = useRoute();
const router = useRouter();

const game = ref(null);
const loading = ref(true);

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

onMounted(async () => {
    try {
        const response = await axios.get(
            `https://api.rawg.io/api/games/${route.params.id}`,
            {
                params: { key: API_KEY }
            }
        );
        game.value = response.data;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
});


//<p v-html="game.description"></p>のHTML除去
const MAX_LEN = 500;

const cleanDescription = computed(() => {
    const html = game.value?.description ?? "";

    // 改行整形
    const withNewlines = html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n");

    // タグ除去
    const noTags = withNewlines.replace(/<[^>]*>/g, "");

    // HTMLエンティティをデコード
    const textarea = document.createElement("textarea");
    textarea.innerHTML = noTags;
    const decoded = textarea.value;

    const text = decoded
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    if (text.length <= MAX_LEN) return text;
    return text.slice(0, MAX_LEN) + "…";
});

//お気に入り登録
const { isFavorite, toggleFavorite } = useFavorites();
</script>

<template>
    <div class="section">
        <div class="container">
            <button class="back-btn" @click="router.back()">
                <img :src="BackIcon" class="back">
            </button>
            <div v-if="loading">
                <p class="loading">Loading...</p>
            </div>

            <div v-else class="game">
                <div class="card">
                    <img :src="game.background_image" alt="">
                    <div class="title-row">
                        <FavoriteIcon class="favorite-icon" :active="isFavorite(game.id)"
                            @click.stop.prevent="toggleFavorite(game.id)">
                        </FavoriteIcon>
                        <h1>{{ game.name }}</h1>
                    </div>
                    <p class="meta">
                        <span v-if="game.genres?.length" class="genres">
                            {{game.genres.map(g => g.name).join(" / ")}}
                        </span>
                    </p>
                    <p class="meta">
                        <span v-if="game.platforms?.length" class="platforms">
                            {{game.platforms.map(p => p.platform.name).join(" / ")}}
                        </span>
                    </p>
                    <p class="rating">⭐{{ game.rating }}</p>
                    <p v-if="game.website" class="official">Official Site:
                        <a :href="game.website" target="_blank" rel="noopener noreferrer">
                            {{ game.website }}
                        </a>
                    </p>
                    <p class="released">Release date：{{ game.released }}</p>
                    <p class="desc">{{ cleanDescription }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.section {
    padding: 140px 0;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #206272;
    border-radius: 16px;
    padding: 10px;
    text-align: left;
    position: relative;
}

.card {
    margin: auto 40px 30px;
}

.detail-img {
    width: 100%;
    border-radius: 16px;
    margin-bottom: 30px;
}

.desc {
    white-space: pre-line;

}

h1 {
    max-width: 700px;
    margin: auto;
    position: relative;
}

.desc,
.released,
.rating,
.official,
.meta {
    font-size: 1.4rem;
    max-width: 700px;
    margin: 0 auto;
}

.genres,
.platforms {
    display: inline-block;
    margin-bottom: 10px;
}

.released {
    margin-bottom: 30px;
    padding-bottom: 10px;
    border-bottom: 4px dotted var(--color-main);
}

.official a {
    color: var(--color-hover);
    text-decoration: underline;
    word-break: break-all;
    /*URLが長くても崩れないように */
}

.official a:hover {
    opacity: 0.7;
}

.back {
    width: 60px;
    height: auto;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    margin-bottom: 20px;
    position: absolute;
    top: -70px;
    transition: transform 0.2s ease;
}

.back-btn:hover {
    transform: translateX(-2px);
}

img {
    width: 100%;
    max-width: 500px;
    display: block;
    margin: 30px auto;
    border-radius: 8px;
    height: auto;
}

.favorite-icon {
    width: 25px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.favorite-icon:hover {
    transform: scale(1.2);
}

.title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 700px;
    margin: 0 auto 10px;
}

.title-row h1 {
    margin: 0;
}
</style>
