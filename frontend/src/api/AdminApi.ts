import { callAPI } from "../config/AxiosInstance";

const adminEndpoints = {
    CreateDirector: "/users/admin/create-director",
    GetAllDirectors: "/users/admin/get-all-directors",
    GetAllQuestionnaires: "/questionnaire/admin/get-all",
    GetAllUsers: "/users/admin/get-all-users",
    GetApprovedReviewers: "/users/admin/reviewers/approved",
    GetAllReviewers: "/users/admin/reviewers/all",
    DeleteUser: "/users/admin/delete-user",
    UpdateUser: "/users/admin/update-user",
    UpdateUserRole: "/users/admin/update-user-role",
};

const adminApi = {
    createDirector: async (params: any) =>
        await callAPI("POST", adminEndpoints.CreateDirector, params),
    getAllDirectors: async () =>
        await callAPI("GET", adminEndpoints.GetAllDirectors),
    getAllQuestionnaires: async () =>
        await callAPI("GET", adminEndpoints.GetAllQuestionnaires),
    getAllUsers: async (page: number = 1, limit: number = 10) =>
        await callAPI("GET", `${adminEndpoints.GetAllUsers}?page=${page}&limit=${limit}`),
    getApprovedReviewers: async (page = 1, limit = 1000) =>
        await callAPI("GET", `${adminEndpoints.GetApprovedReviewers}?page=${page}&limit=${limit}`),
    getAllReviewers: async () =>
        await callAPI("GET", adminEndpoints.GetAllReviewers),
    deleteUser: async (userId: string, adminPassword: string) =>
        await callAPI("DELETE", adminEndpoints.DeleteUser, { userId, adminPassword }),
    updateUser: async (userId: string, data: any) =>
        await callAPI("PUT", `${adminEndpoints.UpdateUser}/${userId}`, data),
    updateUserRole: async (userId: string, data: { role: string, adminPassword: string }) =>
        await callAPI("PUT", `${adminEndpoints.UpdateUserRole}/${userId}`, data),
};

export default adminApi;