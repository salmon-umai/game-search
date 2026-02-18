<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import Header from './components/Header.vue';
import SearcModal from './views/SearcModal.vue';

const isSearchOpen = ref(false);

const router = useRouter();
const handleSearch = ({ keyword, platforms, genres }) => {
  router.push({
    path: "/",
    query: {
      q: keyword,
      page: 1,
      platforms: platforms && platforms.length ? platforms.join(",")
        : undefined,
      genres: genres && genres.length ? genres.join(",")
        : undefined,
    }
  });
  isSearchOpen.value = false;
};

</script>

<template>
  <Header @open-search="isSearchOpen = true"></Header>
  <SearcModal v-if="isSearchOpen" @search="handleSearch" @close="isSearchOpen = false">
  </SearcModal>
  <RouterView></RouterView>
</template>
