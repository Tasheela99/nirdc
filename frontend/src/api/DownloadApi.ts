import { callAPI } from "../config/AxiosInstance";

const downloadEndpoints = {
    CreateDownload: "/downloads/create",
    GetAllDownloads: "/downloads/get-all",
    DeleteDownload: "/downloads/admin/delete",
};

const DownloadApi = {
    getAllDownloads: async (): Promise<any> => 
        await callAPI("GET", downloadEndpoints.GetAllDownloads),

    createDownload: async (formData: FormData): Promise<any> => 
        await callAPI("POST", downloadEndpoints.CreateDownload, formData, {
            'Content-Type': 'multipart/form-data'
        }),

    deleteDownload: async (id: string): Promise<any> => 
        await callAPI("DELETE", `${downloadEndpoints.DeleteDownload}/${id}`),
};

export default DownloadApi;
