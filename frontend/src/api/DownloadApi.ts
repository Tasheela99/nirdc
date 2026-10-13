import { callAPI } from "../config/AxiosInstance";

export interface MultiLangString {
    en: string;
    si: string;
    ta: string;
}

export type DownloadCategoryKey = 'CIRCULAR' | 'REPORT' | 'ETHICS' | 'DOCUMENT' | 'APPLICATION' | 'OTHER';

export interface DownloadData {
    _id?: string;
    title: MultiLangString;
    categoryKey: DownloadCategoryKey;
    category: MultiLangString;
    description?: MultiLangString;
    fileUrl: string;
    fileName?: string;
    fileType: string;
    fileSize: string;
    documentNumber?: string;
    publishDate?: string;
    downloadCount?: number;
    order?: number;
    activeState?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const DownloadApi = {
    // Public: Get all active downloads with optional category & search filter
    getAllDownloads: async (params?: { categoryKey?: string; search?: string }): Promise<any> => {
        const query = new URLSearchParams();
        if (params?.categoryKey && params.categoryKey !== 'ALL') {
            query.append('categoryKey', params.categoryKey);
        }
        if (params?.search) {
            query.append('search', params.search);
        }
        const qs = query.toString();
        return await callAPI("GET", `/downloads${qs ? `?${qs}` : ''}`);
    },

    // Public: Get category presets
    getCategories: async (): Promise<any> =>
        await callAPI("GET", "/downloads/categories"),

    // Public: Get single download
    getDownloadById: async (id: string): Promise<any> =>
        await callAPI("GET", `/downloads/${id}`),

    // Public: Increment download count
    trackDownload: async (id: string): Promise<any> =>
        await callAPI("PATCH", `/downloads/${id}/download`),

    // Admin: Get all downloads (including inactive)
    getAllDownloadsAdmin: async (params?: { categoryKey?: string }): Promise<any> => {
        const query = new URLSearchParams();
        if (params?.categoryKey && params.categoryKey !== 'ALL') {
            query.append('categoryKey', params.categoryKey);
        }
        const qs = query.toString();
        return await callAPI("GET", `/downloads/admin/all${qs ? `?${qs}` : ''}`);
    },

    // Admin: Create download item
    createDownload: async (formData: FormData): Promise<any> =>
        await callAPI("POST", "/downloads", formData, {
            'Content-Type': 'multipart/form-data'
        }),

    // Admin: Update download item
    updateDownload: async (id: string, formData: FormData | Partial<DownloadData>): Promise<any> =>
        await callAPI("PUT", `/downloads/${id}`, formData),

    // Admin: Delete download item
    deleteDownload: async (id: string): Promise<any> =>
        await callAPI("DELETE", `/downloads/${id}`),
};

export default DownloadApi;
