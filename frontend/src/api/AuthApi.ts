import { callAPI } from "../config/AxiosInstance.ts";
const authEndpoints = {
    SignIn: "/users/sign-in",
    SignUp: "/users/sign-up",
    VerifyEmailOtp: "/users/verify-email",
    VerifyPhoneOtp: "/users/verify-mobile",
    ForgotPassword: "/users/forgot-password",
    ResetPassword: "/users/reset-password",
    ResendOtp: "/users/resend-otp",
    ChangePassword: "/users/user/change-password",
};

const authApi = {
    signIn: async (params: any) =>
        await callAPI("POST", authEndpoints.SignIn, params),

    signUp: async (params: any) =>
        await callAPI("POST", authEndpoints.SignUp, params),

    verifyEmailOtp: async (params: { email: string, emailOtp: string }) =>
        await callAPI("POST", authEndpoints.VerifyEmailOtp, {
            ...params,
            verificationType: 'email'
        }),

    verifyPhoneOtp: async (params: { email: string, mobileOtp: string }) =>
        await callAPI("POST", authEndpoints.VerifyPhoneOtp, {
            ...params,
            verificationType: 'mobile'
        }),

    resendOtp: async (params: any) =>
        await callAPI("POST", authEndpoints.ResendOtp, params),

    forgotPassword: async (email: string) =>
        await callAPI("POST", authEndpoints.ForgotPassword, { email }),

    resetPassword: async (params: any) =>
        await callAPI("POST", authEndpoints.ResetPassword, params),

    changePassword: async (params: any) =>
        await callAPI("POST", authEndpoints.ChangePassword, params),

    registerReviewer: async (params: any) => {
        return await callAPI("POST", "/users/register-reviewer", params);
    },

    startReviewerSession: async () => 
        await callAPI("POST", "/reviewer-registration/start-session", {}),

    getReviewerSessionState: async (sessionId: string) => 
        await callAPI("GET", `/reviewer-registration/${sessionId}/state`),

    completeReviewerSessionStep: async (sessionId: string, step: string) => 
        await callAPI("POST", `/reviewer-registration/${sessionId}/complete-step`, { step })
};

export default authApi;