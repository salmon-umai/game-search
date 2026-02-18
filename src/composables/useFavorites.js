//お気に入り登録共通化
import { ref } from "vue";

//お気に入りIDの一覧を保持するリアクティブ変数の作成
const favorites = ref(
    JSON.parse(localStorage.getItem("favorites")) || []
    //localStorage.getItem("favorites")→localstrageからfavoritesというキーで保持された文字列を取り出す
    //JSON.parse(...)→文字列を配列に返す
    //　||[]→もし何も保存されていなければnull、空配列を使う
    // ref(...)→その配列をリアクティブなfavoritesとして保持
);

//useFacoritesという関数を外に公開し、コンポーネント側で使えるようにする
export function useFavorites() {
    //そのIDがお気に入りに入っているかどうかを判定する関数
    const isFavorite = (id) => {
        return favorites.value.includes(id);
    }

    const toggleFavorite = (id) => {
        if (isFavorite(id)) {
            favorites.value = favorites.value.filter(f => f !== id);
        } else {
            favorites.value.push(id);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites.value));
    };
    return { favorites, isFavorite, toggleFavorite };
}


