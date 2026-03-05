<script setup lang="js">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { fetchPopularGames } from "@/api/rawg.js";
import { fetchReleasedGames } from "@/api/rawg.js";
import { searchGames } from "@/api/rawg.js";

import { useFavorites } from "@/composables/useFavorites";

import FavoriteIcon from "@/components/favoriteIcon.vue";
import NoImage from "@/assets/NoImage.png"

const loading = ref(true);
const popularGames = ref([]);
const newGames = ref([]);

const searchResults = ref([]);
const isSearching = ref(false);

const currentPage = ref(1);
const hasNext = ref(false);
const hasPrev = ref(false);
const totalPages = ref(0);
const pageSize = 12;
const totalCount = ref(0);

onMounted(async () => {
    try {
        const [popular, released] = await Promise.all([
            fetchPopularGames(),
            fetchReleasedGames()
        ]);

        popularGames.value = popular;
        newGames.value = released;

    } catch (error) {
        console.error("API error", error);
    } finally {
        loading.value = false;
    }
});

//検索結果 URLの ?q= を監視  /?q=persona検索結果表示
const route = useRoute();

watch(() => [
    route.query.q,
    route.query.page,
    route.query.platforms,
    route.query.genres
],
    async ([newKeyword, newPage, newPlatforms, newGenres]) => {

        if (!newKeyword && !route.query.platforms && !route.query.genres) {
            //空欄の時トップに戻る
            isSearching.value = false;
            searchResults.value = [];
            currentPage.value = 1;
            totalPages.value = 0;
            totalCount.value = 0;
            return;
        }
        loading.value = true;
        isSearching.value = true;

        const page = Number(newPage) || 1;

        const platformsArray = newPlatforms
            ? newPlatforms.split(",").map(Number)
            : [];

        const genresArray = newGenres
            ? newGenres.split(",").map(Number)
            : [];

        try {
            const data = await searchGames(
                newKeyword, page, platformsArray, genresArray);

            searchResults.value = data.results;
            totalCount.value = data.count;
            hasNext.value = !!data.next;
            hasPrev.value = !!data.previous;

            totalPages.value = Math.ceil(data.count / pageSize);
            //count=240 pageSize=12 240 / 12 = 20ページ
            //cielは小数点を切り上げて整数にする
            currentPage.value = page;
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    },
    { immediate: true }
    //Watchのオプション　初期表示の時にも1回だけ即実行する(
    //watchは値が変わった時だけ実行するものだから)
);

//ページ送り
const router = useRouter();

const changePage = async (direction) => {
    const nextPage = currentPage.value + direction;

    if (nextPage < 1 || nextPage > totalPages.value) return;//0ページと最大ページ以上にいけないように
    router.push({
        path: "/",
        query: {
            q: route.query.q,
            page: nextPage,
            platforms: route.query.platforms,
            genres: route.query.genres
        }
    });
};

//お気に入り登録
const { isFavorite, toggleFavorite } = useFavorites();

//検索内容表示 computed　値が変更されたら再計算
const searchKeyword = computed(() => route.query.q || "");
//HOMEに名前がないのでID→名前の変換が必要なため
const platformMap = {
    7: "Nintendo Switch",
    187: "PlayStation5",
    18: "PlayStation4",
    1: "Xbox One",
    186: "Xbox Series S/X",
    3: "iOS",
    21: "Android"
};
const genresMap = {
    3: "Adventure",
    5: "RPG",
    4: "Action",
    14: "Simulation",
    15: "Sport",
    7: "Puzzle",
    51: "Indie",
};

const selectedPlatformNames = computed(() => {
    if (!route.query.platforms) return [];
    return route.query.platforms
        .split(",")
        .map(id => platformMap[id])
        .filter(Boolean);
});

const selectedGenresNames = computed(() => {
    if (!route.query.genres) return [];
    return route.query.genres
        .split(",")
        .map(id => genresMap[id])
        .filter(Boolean);
});
</script>

<template>
    <div v-if="isSearching">
        <!--検索結果-->
        <div class="section">
            <div class="container">
                <h1 id="rating">Search Results</h1>
                <p id="hits">{{ totalCount }}</p>
                <div v-if="loading">
                    <p class="loading">Loading...</p>
                </div>
                <div v-else>
                    <!---検索結果の内容表示-->
                    <div class="search-summary" v-if="searchKeyword ||
                        selectedPlatformNames.length || selectedGenresNames.length">
                        <p>
                            Keyword: <strong>{{ searchKeyword }}</strong>
                        </p>
                        <p v-if="selectedPlatformNames.length">
                            Platform:<span v-for="p in selectedPlatformNames" :key="p">
                                {{ p }}
                            </span>
                        </p>
                        <p v-if="selectedGenresNames.length">
                            Platform:<span v-for="g in selectedGenresNames" :key="g">
                                {{ g }}
                            </span>
                        </p>
                    </div>
                    <p v-if="searchResults.length === 0" class="no-result">
                        No games matched your search.
                    </p>
                    <div class="grid">
                        <RouterLink :to="`/games/${game.id}`" v-for="game in searchResults" :key="game.id"
                            class="card popular">
                            <img :src="game.background_image || NoImage" @error="e => e.target.src = NoImage" alt=""
                                class="game-img">
                            <FavoriteIcon class="favorite-icon" :active="isFavorite(game.id)"
                                @click.stop.prevent="toggleFavorite(game.id)">
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
    </div>

    <!--人気ゲーム-->
    <div v-else>
        <div class="section">
            <div class="container">
                <h1 id="rating">Popular Games(Switch&PS5)</h1>
                <div v-if="loading">
                    <p class="loading">Loading...</p>
                </div>
                <div v-else class="grid">
                    <RouterLink :to="`/games/${game.id}`" v-for="game in popularGames" :key="game.id"
                        class="card popular">
                        <img :src="game.background_image || NoImage" alt="" class="game-img">
                        <FavoriteIcon class="favorite-icon" :active="isFavorite(game.id)"
                            @click.stop.prevent="toggleFavorite(game.id)">
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
            </div>
        </div>

        <!--新作ゲーム-->
        <div class="section">
            <div class="container">
                <h1>New Releases(Switch&PS5)</h1>
                <div v-if="loading">
                    <p class="loading">Loading...</p>
                </div>
                <div v-else class="grid">
                    <RouterLink :to="`/games/${game.id}`" v-for="game in newGames" :key="game.id" class="card">
                        <img :src="game.background_image || NoImage" alt="" class="game-img">
                        <FavoriteIcon class="favorite-icon" :active="isFavorite(game.id)"
                            @click.stop.prevent="toggleFavorite(game.id)">
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
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
    color: var(--color-font);
    margin-bottom: 30px;
}

.no-result {
    text-align: center;
    font-size: 1.6rem;
    color: #f04f4f;
    font-weight: 700;
}

.section {
    width: 100%;
    padding: 50px 0 80px;
}

.section:nth-child(even) {
    background-color: var(--color-main);
}

.section:nth-child(odd) {
    background-color: #ffffff;
}


.card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
}

.card {
    margin: 0;
    background: #ffffff;
    border: 1px solid var(--color-sub);
    border-radius: 16px;
    padding: 10px;
    text-align: left;

    transition: all 0.3s ease;
    cursor: pointer;
}


.popular {
    background: var(--color-main);
}


#hits {
    font-size: 1.5rem;
    color: var(--color-font);
    font-weight: 600;
    margin: 0 0 15px 18px;
    background-color: #e2d9d9;
    display: inline-block;
    padding: 5px 15px;
    border-radius: 20px;
}

h2 {
    margin-top: 0;
}

#rating {
    margin-top: 80px;
}

.search-summary {
    margin-bottom: 10px;
    font-size: 14px;
    opacity: 0.85;
    font-size: 1.3rem;
}

.search-summary span {
    margin-left: 10px;
    font-weight: 700;
}

.search-summary p {
    margin-bottom: 0;
    margin-top: 0;
}
</style>