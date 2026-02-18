<script setup lang="js">
import { ref } from "vue";

const keyword = ref("");
const emit = defineEmits(["close", "search"]);

const selectedPlatforms = ref([]);//選択したプラットフォームIDを入れる
const platforms = [
    { id: 7, name: "Nintendo Switch" },
    { id: 187, name: "PlayStation5" },
    { id: 18, name: "PlayStation4" },
    //{ id: 4, name: "PC" },
    //{ id: 5, name: "macOS" },
    { id: 1, name: "Xbox One" },
    { id: 186, name: "Xbox Series S/X" },
    { id: 3, name: "iOS" },
    { id: 21, name: "Android" }
];

const selectedGenres = ref([]);
const genres = [
    { id: 3, name: "Adventure" },
    { id: 5, name: "RPG" },
    { id: 4, name: "Action" },
    { id: 14, name: "Simulation" },
    { id: 15, name: "Sport" },
    { id: 7, name: "Puzzle" },
    { id: 51, name: "Indie" },
]


//選択するプラットフォームボタンの切り替え
const togglePlatform = (id) => {
    //id:選択したプラットフォームのID
    if (selectedPlatforms.value.includes(id)) {
        //selectedPlatforms：選択中のプラットフォームIDの配列
        //includes(id) そのIDが含まれているか？
        selectedPlatforms.value =
            selectedPlatforms.value.filter(p => p !== id);
        //filter(p => p !== id):配列の中からidと一致しないものだけ残す⇒削除する
    } else {//まだ選択されていない場合はここにくる
        selectedPlatforms.value.push(id);
        //selectedPlatforms.value.push(id) 配列の末尾にidを追加
        //[1,3] id2をpush　⇒[1,2,3]
    }
};

const toggleGenres = (id) => {
    if (selectedGenres.value.includes(id)) {
        selectedGenres.value = selectedGenres.value.filter(g => g !== id);
    } else {
        selectedGenres.value.push(id);
    }
};

const submitSearch = () => {
    emit("search", {
        keyword: keyword.value,
        platforms: selectedPlatforms.value,
        genres: selectedGenres.value
    });
    emit("close");
};


</script>

<template>
    <div class="overlay">
        <div class="modal">

            <button @click="$emit('close')" id="close-btn">
                ×
            </button>
            <form @submit.prevent="submitSearch" class="form">
                <h1>Search</h1>
                <input type="text" v-model="keyword" placeholder="Search games..." class="text">
                <div>
                    <p class="title">Platform:</p>
                    <div class="platforms-btn">
                        <button type="button" v-for="p in platforms" :key="p.id"
                            :class="{ active: selectedPlatforms.includes(p.id) }" @click="togglePlatform(p.id)">
                            {{ p.name }}
                        </button>
                    </div>
                    <p class="title">Genres:</p>
                    <div class="genres-btn">
                        <button type="button" v-for="g in genres" :key="g.id"
                            :class="{ active: selectedGenres.includes(g.id) }" @click="toggleGenres(g.id)">
                            {{ g.name }}
                        </button>
                    </div>
                    <div class="btn-row">
                        <button type="submit" id="search-btn">
                            Search
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(190, 190, 190, 0.705);
    backdrop-filter: blur(4px);
    z-index: 1000;
}

h1 {
    margin: auto;
    color: var(--color-font);
    letter-spacing: 0.4px;
    border-bottom: 6px dotted var(--color-main);
    padding: 0 40px;
    margin-bottom: 20px;
}

#close-btn {
    position: absolute;
    top: 16px;
    right: 20px;
    background: none;
    border: none;

    cursor: pointer;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 2.9rem;
}

form {
    width: 100%;
    max-width: 700px;
}

.modal {
    background-color: #fff;
    max-width: 800px;
    height: 100vh;
    width: 100%;

    margin: auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

input[type=text] {
    flex: 1;
    font-size: 1.5rem;
    padding: 5px 6px;
    height: 40px;
}

#search-btn {
    cursor: pointer;
    background-color: var(--color-main);
    color: var(--color-font2);
    border: 1px solid var(--color-font2);
    cursor: pointer;
    font-size: 1.6rem;
    padding: 10px 30px;
    border-radius: 8px;
    max-width: 160px;
    margin-top: 20px;
}

#search-btn:hover {
    background-color: var(--color-hover);
}

.form {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.btn-row {
    display: flex;
    justify-content: flex-end;
}

.platforms-btn,
.genres-btn {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.platforms-btn button,
.genres-btn button {
    font-size: 1.2rem;
    background-color: #8fa09c;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    color: #000;
    cursor: pointer;
}

.platforms-btn button:hover,
.genres-btn button:hover {
    background-color: var(--color-main);
}

.platforms-btn button.active,
.genres-btn button.active {
    background-color: var(--color-main);
    color: var(--color-font);
}

.title {
    font-size: 1.4rem;
    margin-bottom: 0;
    color: var(--color-font);
    font-weight: 700;
}

@media (max-width: 600px) {
    .modal {
        padding-left: 10px;
        padding-right: 10px;
    }

    .text {
        max-width: 350px;
    }
}
</style>