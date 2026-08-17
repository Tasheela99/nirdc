import { callAPI } from "../config/AxiosInstance";

// Update endpoints to include / prefix
const blogEndpoints = {
    CreateBlogs: "/blogs/create",
    GetAllBlogs: "/blogs/get-all",
    GetBlogById: "/blogs/get-by-id",
    DeleteBlogs: "/blogs/admin/delete",
    UpdateBlogs: "/blogs/admin/update",
};

const blogApi = {
    createBlog: async (params: any): Promise<any> => 
        await callAPI("POST", blogEndpoints.CreateBlogs, params),
        
    getAllBlogs: async (): Promise<any> => 
        await callAPI("GET", blogEndpoints.GetAllBlogs),
        
    getBlogById: async (id: string): Promise<any> => 
        await callAPI("GET", `${blogEndpoints.GetBlogById}/${id}`),
        
    deleteBlog: async (id: string): Promise<any> => 
        await callAPI("DELETE", `${blogEndpoints.DeleteBlogs}/${id}`),
        
    updateBlog: async (id: string, params: any): Promise<any> => 
        await callAPI("PUT", `${blogEndpoints.UpdateBlogs}/${id}`, params),
};

export default blogApi;