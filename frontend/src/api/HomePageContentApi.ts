import { callAPI } from "../config/AxiosInstance";

export interface MultiLangString {
  en: string;
  si: string;
  ta: string;
}

export interface HeroButton {
  _id?: string;
  label: MultiLangString;
  subLabel: MultiLangString;
  iconUrl?: string;
  link?: string;
}

export interface HeroSectionData {
  _id?: string;
  preTitle: MultiLangString;
  mainTitle: MultiLangString;
  description: MultiLangString;
  images: string[];
  buttons: HeroButton[];
  isActive?: boolean;
}

export interface VisionMissionData {
  _id?: string;
  vision: {
    title: MultiLangString;
    highlightText: MultiLangString;
    description: MultiLangString;
  };
  mission: {
    title: MultiLangString;
    highlightText: MultiLangString;
    description: MultiLangString;
  };
  isActive?: boolean;
}

export interface PartnerCardData {
  _id?: string;
  title: MultiLangString;
  description: MultiLangString;
  logoUrl: string;
  linkUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface ContactInfoData {
  _id?: string;
  organizationName: MultiLangString;
  location: {
    title: MultiLangString;
    address: MultiLangString;
  };
  email: {
    title: MultiLangString;
    address: string;
  };
  telephone: {
    title: MultiLangString;
    number: string;
  };
  workingHours: {
    title: MultiLangString;
    schedule: MultiLangString;
  };
  isActive?: boolean;
}

const homePageContentApi = {
  // Hero Section
  getHeroSection: async (): Promise<any> =>
    await callAPI("GET", "/hero-section"),
  getAllHeroSectionsAdmin: async (): Promise<any> =>
    await callAPI("GET", "/hero-section/all"),
  uploadHeroImage: async (file: File): Promise<{ status: boolean; message: string; url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    return await callAPI("POST", "/hero-section/upload-image", formData);
  },
  createHeroSection: async (data: FormData | Partial<HeroSectionData>): Promise<any> =>
    await callAPI("POST", "/hero-section", data),
  updateHeroSection: async (id: string, data: FormData | Partial<HeroSectionData>): Promise<any> =>
    await callAPI("PUT", `/hero-section/${id}`, data),

  // Vision & Mission
  getVisionMission: async (): Promise<any> =>
    await callAPI("GET", "/vision-mission"),
  getAllVisionMissionsAdmin: async (): Promise<any> =>
    await callAPI("GET", "/vision-mission/all"),
  createVisionMission: async (data: Partial<VisionMissionData>): Promise<any> =>
    await callAPI("POST", "/vision-mission", data),
  updateVisionMission: async (id: string, data: Partial<VisionMissionData>): Promise<any> =>
    await callAPI("PUT", `/vision-mission/${id}`, data),

  // Partner Cards
  getPartnerCards: async (): Promise<any> =>
    await callAPI("GET", "/partner-cards"),
  getAllPartnerCardsAdmin: async (): Promise<any> =>
    await callAPI("GET", "/partner-cards/all"),
  uploadPartnerLogo: async (file: File): Promise<{ status: boolean; message: string; url: string }> => {
    const formData = new FormData();
    formData.append("logo", file);
    return await callAPI("POST", "/partner-cards/upload-logo", formData);
  },
  createPartnerCard: async (data: FormData | Partial<PartnerCardData>): Promise<any> =>
    await callAPI("POST", "/partner-cards", data),
  updatePartnerCard: async (id: string, data: FormData | Partial<PartnerCardData>): Promise<any> =>
    await callAPI("PUT", `/partner-cards/${id}`, data),
  deletePartnerCard: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/partner-cards/${id}`),

  // Contact Info
  getContactInfo: async (): Promise<any> =>
    await callAPI("GET", "/contact-info"),
  getAllContactInfoAdmin: async (): Promise<any> =>
    await callAPI("GET", "/contact-info/all"),
  createContactInfo: async (data: Partial<ContactInfoData>): Promise<any> =>
    await callAPI("POST", "/contact-info", data),
  updateContactInfo: async (id: string, data: Partial<ContactInfoData>): Promise<any> =>
    await callAPI("PUT", `/contact-info/${id}`, data),
};

export default homePageContentApi;
