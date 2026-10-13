import { callAPI } from "../config/AxiosInstance";

export interface MultiLangString {
  en: string;
  si: string;
  ta: string;
}

export interface IntroductionData {
  _id?: string;
  badge?: MultiLangString;
  title: MultiLangString;
  subtitle?: MultiLangString;
  overviewTitle?: MultiLangString;
  overviewHeading?: MultiLangString;
  paragraphs: MultiLangString[];
  image?: string | null;
  imageCaption?: MultiLangString;
  isActive?: boolean;
}

export interface DirectorMessageData {
  _id?: string;
  badge?: MultiLangString;
  quote: MultiLangString;
  directorName: MultiLangString;
  directorRole: MultiLangString;
  directorImage?: string | null;
  credentials: MultiLangString[];
  messageTitle?: MultiLangString;
  paragraphs: MultiLangString[];
  signoffName?: MultiLangString;
  signoffRole?: MultiLangString;
  isActive?: boolean;
}

export interface HistoryMilestoneData {
  _id?: string;
  year: string;
  title: MultiLangString;
  description: MultiLangString;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface CoreValueData {
  _id?: string;
  title: MultiLangString;
  description: MultiLangString;
  icon: string;
  order?: number;
  isActive?: boolean;
}

export interface ObjectiveData {
  _id?: string;
  badge?: MultiLangString;
  title: MultiLangString;
  description: MultiLangString;
  icon: string;
  order?: number;
  isActive?: boolean;
}

export interface ResponsibilityData {
  _id?: string;
  section?: MultiLangString;
  title: MultiLangString;
  points: MultiLangString[];
  icon: string;
  order?: number;
  isActive?: boolean;
}

export interface FunctionServiceData {
  _id?: string;
  category: MultiLangString;
  description: MultiLangString;
  offerings: MultiLangString[];
  icon: string;
  actionLink?: string;
  actionText?: MultiLangString;
  order?: number;
  isActive?: boolean;
}

export interface TeamMemberData {
  _id?: string;
  name: MultiLangString;
  role: MultiLangString;
  division?: MultiLangString;
  bio: MultiLangString;
  initials?: string;
  color?: string;
  image?: string | null;
  phone?: string;
  email?: string;
  linkedin?: string;
  badge?: MultiLangString;
  order?: number;
  isActive?: boolean;
}

export interface OrganizationalStructureData {
  _id?: string;
  title: MultiLangString;
  focus: MultiLangString;
  subUnits: MultiLangString[];
  icon: string;
  order?: number;
  isActive?: boolean;
}

const aboutUsContentApi = {
  // Generic Media Upload
  uploadMedia: async (file: File, subfolder: string = 'general'): Promise<{ status: boolean; message: string; url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subfolder", subfolder);
    return await callAPI("POST", "/about/upload", formData);
  },

  // 1. Introduction (Singleton)
  getIntroduction: async (): Promise<any> =>
    await callAPI("GET", "/about/introduction"),
  saveIntroduction: async (data: Partial<IntroductionData>): Promise<any> =>
    await callAPI("POST", "/about/introduction", data),
  updateIntroduction: async (id: string, data: Partial<IntroductionData>): Promise<any> =>
    await callAPI("PUT", `/about/introduction/${id}`, data),

  // 2. Director Message (Singleton)
  getDirectorMessage: async (): Promise<any> =>
    await callAPI("GET", "/about/director-message"),
  saveDirectorMessage: async (data: Partial<DirectorMessageData>): Promise<any> =>
    await callAPI("POST", "/about/director-message", data),
  updateDirectorMessage: async (id: string, data: Partial<DirectorMessageData>): Promise<any> =>
    await callAPI("PUT", `/about/director-message/${id}`, data),

  // 3. History Milestones (Collection)
  getAllMilestones: async (): Promise<any> =>
    await callAPI("GET", "/about/history/all"),
  createMilestone: async (data: Partial<HistoryMilestoneData>): Promise<any> =>
    await callAPI("POST", "/about/history", data),
  updateMilestone: async (id: string, data: Partial<HistoryMilestoneData>): Promise<any> =>
    await callAPI("PUT", `/about/history/${id}`, data),
  deleteMilestone: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/about/history/${id}`),

  // 4. Core Values (Collection)
  getAllCoreValues: async (): Promise<any> =>
    await callAPI("GET", "/about/values/all"),
  createCoreValue: async (data: Partial<CoreValueData>): Promise<any> =>
    await callAPI("POST", "/about/values", data),
  updateCoreValue: async (id: string, data: Partial<CoreValueData>): Promise<any> =>
    await callAPI("PUT", `/about/values/${id}`, data),
  deleteCoreValue: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/about/values/${id}`),

  // 5. Objectives (Collection)
  getAllObjectives: async (): Promise<any> =>
    await callAPI("GET", "/about/objectives/all"),
  createObjective: async (data: Partial<ObjectiveData>): Promise<any> =>
    await callAPI("POST", "/about/objectives", data),
  updateObjective: async (id: string, data: Partial<ObjectiveData>): Promise<any> =>
    await callAPI("PUT", `/about/objectives/${id}`, data),
  deleteObjective: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/about/objectives/${id}`),

  // 6. Responsibilities (Collection)
  getAllResponsibilities: async (): Promise<any> =>
    await callAPI("GET", "/about/responsibilities/all"),
  createResponsibility: async (data: Partial<ResponsibilityData>): Promise<any> =>
    await callAPI("POST", "/about/responsibilities", data),
  updateResponsibility: async (id: string, data: Partial<ResponsibilityData>): Promise<any> =>
    await callAPI("PUT", `/about/responsibilities/${id}`, data),
  deleteResponsibility: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/about/responsibilities/${id}`),

  // 7. Functions & Services (Collection)
  getAllFunctionServices: async (): Promise<any> =>
    await callAPI("GET", "/about/functions-services/all"),
  createFunctionService: async (data: Partial<FunctionServiceData>): Promise<any> =>
    await callAPI("POST", "/about/functions-services", data),
  updateFunctionService: async (id: string, data: Partial<FunctionServiceData>): Promise<any> =>
    await callAPI("PUT", `/about/functions-services/${id}`, data),
  deleteFunctionService: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/about/functions-services/${id}`),

  // 8. Team Members (Collection)
  getAllTeamMembers: async (): Promise<any> =>
    await callAPI("GET", "/about/team/all"),
  createTeamMember: async (data: Partial<TeamMemberData>): Promise<any> =>
    await callAPI("POST", "/about/team", data),
  updateTeamMember: async (id: string, data: Partial<TeamMemberData>): Promise<any> =>
    await callAPI("PUT", `/about/team/${id}`, data),
  deleteTeamMember: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/about/team/${id}`),

  // 9. Organizational Structure (Collection)
  getAllDivisions: async (): Promise<any> =>
    await callAPI("GET", "/about/organizational-structure/all"),
  createDivision: async (data: Partial<OrganizationalStructureData>): Promise<any> =>
    await callAPI("POST", "/about/organizational-structure", data),
  updateDivision: async (id: string, data: Partial<OrganizationalStructureData>): Promise<any> =>
    await callAPI("PUT", `/about/organizational-structure/${id}`, data),
  deleteDivision: async (id: string): Promise<any> =>
    await callAPI("DELETE", `/about/organizational-structure/${id}`),

  // 10. Navigation Visibility Config
  getNavConfig: async (): Promise<any> =>
    await callAPI("GET", "/about/nav-config"),
  updateNavConfig: async (visibility: AboutNavVisibility): Promise<any> =>
    await callAPI("PUT", "/about/nav-config", { visibility }),

  // 11. Public GET Endpoints (No auth needed, returns active items only)
  getPublicMilestones: async (): Promise<any> =>
    await callAPI("GET", "/about/history"),
  getPublicCoreValues: async (): Promise<any> =>
    await callAPI("GET", "/about/values"),
  getPublicObjectives: async (): Promise<any> =>
    await callAPI("GET", "/about/objectives"),
  getPublicResponsibilities: async (): Promise<any> =>
    await callAPI("GET", "/about/responsibilities"),
  getPublicFunctionServices: async (): Promise<any> =>
    await callAPI("GET", "/about/functions-services"),
  getPublicTeamMembers: async (): Promise<any> =>
    await callAPI("GET", "/about/team"),
  getPublicDivisions: async (): Promise<any> =>
    await callAPI("GET", "/about/organizational-structure"),
};

export const getMultiLangText = (
  obj?: MultiLangString,
  lang: string = "en",
  fallback: string = ""
): string => {
  if (!obj) return fallback;
  const key: "en" | "si" | "ta" = lang.startsWith("si")
    ? "si"
    : lang.startsWith("ta")
    ? "ta"
    : "en";
  return obj[key] || obj.en || fallback;
};

export interface AboutNavVisibility {
  introduction?: boolean;
  history?: boolean;
  visionMission?: boolean;
  values?: boolean;
  objectives?: boolean;
  responsibilities?: boolean;
  functionsServices?: boolean;
  directorMessage?: boolean;
  team?: boolean;
  organizationalStructure?: boolean;
  downloads?: boolean;
  reportsPublications?: boolean;
  newsletters?: boolean;
}

export default aboutUsContentApi;

