import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Details from '@/views/Details.vue';
import Favorites from '@/views/Favorites.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/games/:id",
      name: "details",
      component: Details,
    },
    {
      path: "/favorites",
      name: "Favorites",
      component: Favorites,
    }

  ],
})

export default router;