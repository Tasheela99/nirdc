import { callAPI } from "../config/AxiosInstance";

export interface MultiLangString {
    en: string;
    si: string;
    ta: string;
}

export interface InquiryPayload {
    name: string;
    email: string;
    subject: string;
    message: string;
    submissionMethod?: 'APP' | 'EMAIL_CLIENT';
}

export interface InquiryData {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    submissionMethod: 'APP' | 'EMAIL_CLIENT';
    status: 'PENDING' | 'REVIEWED' | 'RESPONDED';
    createdAt: string;
    updatedAt: string;
}

export interface ContactInfoDetail {
    title: MultiLangString;
    address?: MultiLangString;
    number?: string;
    schedule?: MultiLangString;
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
    fax?: {
        title: MultiLangString;
        number: string;
    };
    workingHours: {
        title: MultiLangString;
        schedule: MultiLangString;
    };
    isActive?: boolean;
}

export interface HeadOfficeOfficerData {
    _id?: string;
    name: MultiLangString;
    designation: MultiLangString;
    division?: MultiLangString;
    generalNumber: string;
    mobileNumber?: string;
    email?: string;
    order?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    status: boolean;
    message?: string;
    data: T;
}

export const ContactApi = {
    // Contact Info (Inquiry / Address / Phone / Fax / Hours)
    getContactInfo: async () => {
        return callAPI<ApiResponse<ContactInfoData>>('GET', '/contact-info');
    },
    createContactInfo: async (data: Partial<ContactInfoData>) => {
        return callAPI<ApiResponse<ContactInfoData>>('POST', '/contact-info', data);
    },
    updateContactInfo: async (id: string, data: Partial<ContactInfoData>) => {
        return callAPI<ApiResponse<ContactInfoData>>('PUT', `/contact-info/${id}`, data);
    },

    // Inquiries
    submitInquiry: async (payload: InquiryPayload) => {
        return callAPI<any>('POST', '/inquiries', payload);
    },
    getInquiries: async () => {
        return callAPI<ApiResponse<InquiryData[]>>('GET', '/inquiries');
    },
    getAllInquiries: async () => {
        return callAPI<ApiResponse<InquiryData[]>>('GET', '/inquiries');
    },
    updateInquiryStatus: async (id: string, status: string) => {
        return callAPI<any>('PATCH', `/inquiries/${id}/status`, { status });
    },
    deleteInquiry: async (id: string) => {
        return callAPI<any>('DELETE', `/inquiries/${id}`);
    },

    // Head Office Officers
    getHeadOfficeOfficers: async () => {
        return callAPI<ApiResponse<HeadOfficeOfficerData[]>>('GET', '/head-office-officers');
    },
    getAllHeadOfficeOfficers: async () => {
        return callAPI<ApiResponse<HeadOfficeOfficerData[]>>('GET', '/head-office-officers/all');
    },
    createHeadOfficeOfficer: async (data: Partial<HeadOfficeOfficerData>) => {
        return callAPI<ApiResponse<HeadOfficeOfficerData>>('POST', '/head-office-officers', data);
    },
    updateHeadOfficeOfficer: async (id: string, data: Partial<HeadOfficeOfficerData>) => {
        return callAPI<ApiResponse<HeadOfficeOfficerData>>('PUT', `/head-office-officers/${id}`, data);
    },
    deleteHeadOfficeOfficer: async (id: string) => {
        return callAPI<any>('DELETE', `/head-office-officers/${id}`);
    }
};

export default ContactApi;
