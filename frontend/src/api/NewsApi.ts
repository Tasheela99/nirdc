import {callAPI} from "../config/AxiosInstance";

const newsEndpoints = {
    CreateNews: "/news/create",
    GetAllNews: "/news/get-all",
    GetNewsById: "/news/get-by-id",
    DeleteNews: "/news/admin/delete",
    UpdateNews: "/news/admin/update",
};

const newsApi = {
    createNews: async (params: any) =>
        await callAPI("POST", newsEndpoints.CreateNews, params),
    getAllNews: async () =>
        await callAPI("GET", newsEndpoints.GetAllNews),
    getNewsById: async (id: any) =>
        await callAPI("GET", `${newsEndpoints.GetNewsById}/${id}`),
    deleteNews: async (id: any) =>
        await callAPI("DELETE", `${newsEndpoints.DeleteNews}/${id}`),
    updateNews: async (id: any, params: any) =>
        await callAPI("PUT", `${newsEndpoints.UpdateNews}/${id}`, params),
};

export default newsApi;