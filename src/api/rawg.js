import axios from "axios";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

const rawgAPI = axios.create({
    baseURL: "https://api.rawg.io/api",
    params: {
        key: API_KEY,
    }
});

//例：https://api.rawg.io/api/games?ordering=-rating&page_size=9

//人気ゲーム fetch 取得する
export const fetchPopularGames = async () => {
    const response = await rawgAPI.get("/games", {
        params: {
            ordering: "-rating",//評価が高い順 -がつくと降順
            page_size: 9,//1ページ当たりの取得件数
            platforms: 7,
            esrb_rating: "everyone,teen,mature"
        },
    });
    //console.log("RAWG full response:", response.data);
    //console.log(response.data.results[0].platforms);
    //console.log(response.data.results[0].genres);
    //ここで中身確認できる！
    return response.data.results.filter(game =>
        game.esrb_rating?.slug !== "adults-only"
    );
};

//リリース順
export const fetchReleasedGames = async () => {
    const today = new Date().toISOString().split("T")[0];
    const response = await rawgAPI.get("/games", {
        params: {
            ordering: "-released",//リリース日の降順
            page_size: 9,
            platforms: "7, 187",
            dates: `1900-01-01,${today}`,//dates: 開始日,終了日
            esrb_rating: "everyone,teen,mature"
        },
    });
    return response.data.results.filter(game =>
        game.esrb_rating?.slug !== "adults-only"
    );
};

//検索
export const searchGames = async (
    keyword,
    page = 1,
    platforms = [],
    genres = []
) => {
    const response = await rawgAPI.get("/games", {
        params: {
            search: keyword,
            page_size: 12,
            platforms: "7, 187, 18, 1 ,186, 3, 21",
            page: page,
            platforms: platforms.length
                ? platforms.join(",")
                : undefined,
            genres: genres.length
                ? genres.join(",")
                : undefined,
            esrb_rating: "everyone,teen,mature"
        },
    });
    return response.data;
}
