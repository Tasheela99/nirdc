import { callAPI } from "../config/AxiosInstance";

const bannerEndpoints = {
    GetAll: "/home-page-details/get-all",
    UploadBanner: "/home-page-details/create",
    DeleteBanner: "/home-page-details/delete",
    UploadAboutUs: "/home-page-details/about-us/upload",
    DeleteAboutUs: "/home-page-details/about-us/delete",
};

const bannerApi = {
    // Get all homepage images (banner + about us)
    getAllHomepageImages: async (): Promise<any> =>
        await callAPI("GET", bannerEndpoints.GetAll),

    // Banner
    uploadBannerImages: async (formData: FormData): Promise<any> =>
        await callAPI("POST", bannerEndpoints.UploadBanner, formData),

    deleteBannerImage: async (encodedUrl: string): Promise<any> =>
        await callAPI("GET", `${bannerEndpoints.DeleteBanner}/${encodedUrl}`),

    // About Us
    uploadAboutUsImages: async (formData: FormData): Promise<any> =>
        await callAPI("POST", bannerEndpoints.UploadAboutUs, formData),

    deleteAboutUsImage: async (encodedUrl: string): Promise<any> =>
        await callAPI("GET", `${bannerEndpoints.DeleteAboutUs}/${encodedUrl}`),
};

export default bannerApi;
