import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import CryptoJS from "crypto-js";
import BASE_URL from "./ApiConfig";

const ENCRYPTION_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY;

const decryptToken = (encryptedToken: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        throw new Error("Invalid token");
    }
};

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 120000, // Increased timeout to 120 seconds to allow large file uploads
    withCredentials: true, // Enable credentials
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Request interceptor
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        try {
            const encryptedToken = localStorage.getItem("token");

            if (encryptedToken) {
                const token = decryptToken(encryptedToken);

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userInfo");
                    window.location.href = "/login";
                }
            }

            if (config.data instanceof FormData) {
                delete config.headers["Content-Type"];
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            window.location.href = "/login";
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            window.location.href = "/login";
        }

        // Normalize 429 responses — ensure data is always an object with a message
        if (error.response?.status === 429) {
            const data = error.response.data;
            if (typeof data === 'string') {
                error.response.data = { status: false, message: data, label: 'RATE_LIMITED' };
            }
        }

        return Promise.reject(error);
    }
);

// Centralized API call function
export const callAPI = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    endpoint: string,
    params?: any,
    additionalHeaders?: Record<string, string>
): Promise<T> => {
    try {
        const response: AxiosResponse = await instance({
            method,
            url: endpoint,
            data: params,
            headers: {
                ...additionalHeaders,
            },
        });

        return response.data as T;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            throw error;
        }
        throw new Error("An unexpected error occurred. Please try again.");
    }
};

export default instance;
