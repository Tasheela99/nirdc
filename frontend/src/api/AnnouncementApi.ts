import { callAPI } from "../config/AxiosInstance";

// Update endpoints to include / prefix
const announcementEndpoints = {
  CreateAnnouncement: "/announcements/create",
  GetAllAnnouncements: "/announcements/get-all",
  GetAnnouncementById: "/announcements/get-by-id",
  DeleteAnnouncement: "/announcements/admin/delete",
  UpdateAnnouncement: "/announcements/admin/update",
};

const announcementApi = {
  createAnnouncement: async (params: any): Promise<any> => 
    await callAPI("POST", announcementEndpoints.CreateAnnouncement, params),
    
  getAllAnnouncements: async (): Promise<any> => 
    await callAPI("GET", announcementEndpoints.GetAllAnnouncements),
    
  getAnnouncementById: async (id: string): Promise<any> => 
    await callAPI("GET", `${announcementEndpoints.GetAnnouncementById}/${id}`),
    
  deleteAnnouncement: async (id: string): Promise<any> => 
    await callAPI("DELETE", `${announcementEndpoints.DeleteAnnouncement}/${id}`),
    
  updateAnnouncement: async (id: string, params: any ): Promise<any> => 
    await callAPI("PUT", `${announcementEndpoints.UpdateAnnouncement}/${id}`, params),
};

export default announcementApi;