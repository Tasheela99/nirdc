import { callAPI } from "../config/AxiosInstance";

const adEndpoints = {
    // Public
    GetActiveAds: "/ads/active",
    GetPopupAd: "/ads/popup",
    GetAdById: "/ads/get-by-id",
    // Admin
    CreateAd: "/ads/admin/create",
    GetAllAds: "/ads/admin/get-all",
    UpdateAd: "/ads/admin/update",
    DeleteAd: "/ads/admin/delete",
};

const adApi = {
    // Public
    getActiveAds: async (): Promise<any> =>
        await callAPI("GET", adEndpoints.GetActiveAds),

    getPopupAd: async (): Promise<any> =>
        await callAPI("GET", adEndpoints.GetPopupAd),

    getAdById: async (id: string): Promise<any> =>
        await callAPI("GET", `${adEndpoints.GetAdById}/${id}`),

    // Admin
    createAd: async (params: any): Promise<any> =>
        await callAPI("POST", adEndpoints.CreateAd, params),

    getAllAds: async (): Promise<any> =>
        await callAPI("GET", adEndpoints.GetAllAds),

    updateAd: async (id: string, params: any): Promise<any> =>
        await callAPI("PUT", `${adEndpoints.UpdateAd}/${id}`, params),

    deleteAd: async (id: string): Promise<any> =>
        await callAPI("DELETE", `${adEndpoints.DeleteAd}/${id}`),
};

export default adApi;
