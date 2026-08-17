import { callAPI } from "../config/AxiosInstance";

const adminEndpoints = {
    CreateDirector: "/users/admin/create-director",
    GetAllDirectors: "/users/admin/get-all-directors",
    GetAllQuestionnaires: "/questionnaire/admin/get-all",
    GetAllUsers: "/users/admin/get-all-users",
    GetApprovedReviewers: "/users/admin/reviewers/approved",
    GetAllReviewers: "/users/admin/reviewers/all",
    DeleteUser: "/users/admin/delete-user",
};

const adminApi = {
    createDirector: async (params: any) =>
        await callAPI("POST", adminEndpoints.CreateDirector, params),
    getAllDirectors: async () =>
        await callAPI("GET", adminEndpoints.GetAllDirectors),
    getAllQuestionnaires: async () =>
        await callAPI("GET", adminEndpoints.GetAllQuestionnaires),
    getAllUsers: async () =>
        await callAPI("GET", adminEndpoints.GetAllUsers),
    getApprovedReviewers: async (page = 1, limit = 1000) =>
        await callAPI("GET", `${adminEndpoints.GetApprovedReviewers}?page=${page}&limit=${limit}`),
    getAllReviewers: async () =>
        await callAPI("GET", adminEndpoints.GetAllReviewers),
    deleteUser: async (userId: string, adminPassword: string) =>
        await callAPI("DELETE", adminEndpoints.DeleteUser, { userId, adminPassword }),
};

export default adminApi;