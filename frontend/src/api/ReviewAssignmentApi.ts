import axiosInstance from "../config/AxiosInstance";

class ReviewAssignmentApi {
    // Admin functions
    async assignReviewer(proposalId: string, proposalType: string, reviewerId: string) {
        try {
            const response = await axiosInstance.post('/review-assignments/assign', {
                proposalId,
                proposalType,
                reviewerId
            });
            return response.data;
        } catch (error: any) {
            return error.response?.data || { status: false, message: 'API Request failed' };
        }
    }

    async getReviewsForProposal(proposalId: string, page = 1, limit = 100) {
        try {
            const response = await axiosInstance.get(`/review-assignments/proposal/${proposalId}?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error: any) {
            return error.response?.data || { status: false, message: 'API Request failed' };
        }
    }

    async removeAssignment(assignmentId: string) {
        try {
            const response = await axiosInstance.delete(`/review-assignments/${assignmentId}`);
            return response.data;
        } catch (error: any) {
            return error.response?.data || { status: false, message: 'API Request failed' };
        }
    }

    // Reviewer functions
    async getAssignedProposals(page = 1, limit = 10, status?: string) {
        try {
            const statusQuery = status ? `&status=${status}` : '';
            const response = await axiosInstance.get(`/review-assignments/my-assignments?page=${page}&limit=${limit}${statusQuery}`);
            return response.data;
        } catch (error: any) {
            return error.response?.data || { status: false, message: 'API Request failed' };
        }
    }

    async submitReview(assignmentId: string, marks: number, comment: string) {
        try {
            const response = await axiosInstance.put(`/review-assignments/${assignmentId}/submit`, {
                marks,
                comment
            });
            return response.data;
        } catch (error: any) {
            return error.response?.data || { status: false, message: 'API Request failed' };
        }
    }
}

export default new ReviewAssignmentApi();
