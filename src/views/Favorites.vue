<script setup lang="js">
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

import { useFavorites } from "@/composables/useFavorites";
import { useRoute, useRouter } from "vue-router";

const { favorites, isFavorite, toggleFavorite } = useFavorites();

import FavoriteIcon from "@/components/favoriteIcon.vue";
import NoImage from "@/assets/NoImage.png"

const games = ref([]);
const loading = ref(true);

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

onMounted(async () => {
    if (!favorites.value.length) {
        loading.value = false;
        return;
    }
    try {
        const response = await axios.get(
            "https://api.rawg.io/api/games",
            {
                params: {
                    key: API_KEY,
                    ids: favorites.value.join(",")
                }
            }
        );
        games.value = response.data.results;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
});
const removeAndUpdate = (id) => {
    toggleFavorite(id);
    games.value = games.value.filter(g => g.id !== id);

    if (currentPage.value > totalPages.value) {
        route.replace({
            path: "/favorites",
            query: { page: totalPages.value || 1 }
        }
        )
    };
};


//ページ送り
const route = useRoute();
const router = useRouter();
const currentPage = ref(Number(route.query.page) || 1);
const pageSize = 9;

const totalPages = computed(() => {
    return Math.ceil(games.value.length / pageSize)
});

const paginated = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return games.value.slice(start, end);
});

const hasNext = computed(() => currentPage.value < totalPages.value);
const hasPrev = computed(() => currentPage.value > 1);

const changePage = (direction) => {
    const nextPage = currentPage.value + direction;
    if (nextPage < 1 || nextPage > totalPages.value) return;//0ページと最大ページ以上にいけないように
    router.push({
        path: "/favorites",
        query: { page: nextPage }
    });
};
//URL変更を監視
watch(() => route.query.page,
    (newPage) => {
        currentPage.value = Number(newPage || 1);
    })
//gamesは全件、paginatedは今表示するべき12件
</script>

<template>
    <div>
        <div class="flex">
            <h1>Favorites List</h1>
        </div>
        <div class="section">
            <div class="container">
                <div v-if="loading">
                    <p class="loading">Loading...</p>
                </div>
                <div v-else-if="!games.length" class="not">
                    <p>No favorite games yet.</p>
                </div>
                <div v-else class="grid">
                    <RouterLink :to="`/games/${game.id}`" v-for="game in paginated" :key="game.id" class="card">
                        <img :src="game.background_image || NoImage" alt="">
                        <FavoriteIcon class="favorite-icon" :active="isFavorite(game.id)"
                            @click.stop.prevent="removeAndUpdate(game.id)">
                        </FavoriteIcon>
                        <h2>{{ game.name }}</h2>
                        <div class="flex">
                            <p class="rate">⭐{{ game.rating }}</p>
                            <p class="release">Release date：{{ game.released }}</p>
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
                    </RouterLink>
                </div>
                <div class="pagination" v-if="totalPages > 0">
                    <button v-if="hasPrev" @click="changePage(-1)">← Prev</button>
                    <span>{{ currentPage }} / {{ totalPages }}</span>
                    <button v-if="hasNext" @click="changePage(1)">Next →</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    margin: 70px auto 0px;
    color: var(--color-font);
}

.loading {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 100px
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
}

.section {
    width: 100%;
    padding: 50px 0 80px;
    background-color: #ffffff;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
}

.card {
    margin: 0;
    background: #ffffff;
    border: 1px solid var(--color-sub);
    border-radius: 16px;
    padding: 10px;
    text-align: left;
    background-color: var(--color-main);
    transition: all 0.3s ease;
    cursor: pointer;
}

.card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 40px;
    font-size: 1.5rem;
    color: var(--color-font);
    font-weight: 600;
}

.pagination button {
    padding: 8px 20px;
    cursor: pointer;
    font-size: 1.2rem;
    border: none;
    background-color: var(--color-main);
    color: var(--color-hover);
    font-weight: 700;
    border-radius: 7px;
}

.pagination button:hover {
    opacity: 0.8;
}

h2 {
    margin-top: 0;
}

.flex {
    display: flex;
    gap: 20px;
}

.favorite-icon {
    width: 22px;
    height: auto;
    margin-top: 10px;
    z-index: 50;
    margin-left: 5px;
    transition: transform 0.2s ease;
}

.favorite-icon:hover {
    transform: scale(1.2);
}

img {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    height: 180px;
    object-fit: cover;
    aspect-ratio: 16 / 9;
}

#rating {
    margin-top: 80px;
}

.rate,
.release {
    font-size: 1.3rem;
}

.not {
    text-align: center;
    font-size: 1.6rem;
    color: #e02f2f;
    font-weight: 700;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }

    img {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}

@media (max-width: 600px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>