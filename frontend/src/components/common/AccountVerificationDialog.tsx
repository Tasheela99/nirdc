import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, X } from "lucide-react";


// Define supported languages
const languagesList = [
    { code: "en", label: "EN", nativeName: "English" },
    { code: "si", label: "සිං", nativeName: "සිංහල" },
    { code: "ta", label: "த", nativeName: "தமிழ்" },
] as const;
type LanguageType = (typeof languagesList)[number]["code"];

// Define the content object with type safety
const content: Record<LanguageType, { title: string; steps: string[]; note: JSX.Element; button: string; intro: string }> = {
    en: {
        title: "Account Verification Instructions",
        intro: "Please follow these steps to verify your account:",
        steps: [
            "Check your email inbox for the verification code (OTP).",
            "Enter the OTP in the field provided to complete your account verification.",
            "If you don't see the email, check your spam or junk folder.",
        ],
        note: (
            <>
                If you haven't received the OTP, you can use the{" "}
                <Link to="/resend-otp" className="text-pink-300 hover:text-pink-200 underline font-semibold transition-colors">
                    Didn't Receive OTP?
                </Link>{" "}
                link to request a new code.
            </>
        ),
        button: "Got it!",
    },
    si: {
        title: "ගිණුම සත්‍යාපන උපදෙස්",
        intro: "කරුණාකර ඔබගේ ගිණුම සත්‍යාපනය කිරීම සඳහා මෙම පියවරයන් අනුගමනය කරන්න:",
        steps: [
            "සත්‍යාපන කේතය (OTP) සඳහා ඔබගේ ඊමේල් එන ලිපිනය පරීක්ෂා කරන්න.",
            "ගිණුම සත්‍යාපනය සම්පූර්ණ කිරීම සඳහා OTP අදාළ ක්ෂේත්‍රයට ඇතුළත් කරන්න.",
            "ඊමේල් එක පෙනෙන්නේ නැත්නම්, ඔබේ spam හෝ junk ෆෝල්ඩරය පරීක්ෂා කරන්න.",
        ],
        note: (
            <>
                ඔබට OTP ලැබී නොමැති නම්, ඔබට පහත දැක්වෙන{" "}
                <Link to="/resend-otp" className="text-pink-300 hover:text-pink-200 underline font-semibold transition-colors">
                    OTP ලැබුණේ නැද්ද?
                </Link>{" "}
                සබැඳිය භාවිතා කර නව කේතයක් ඉල්ලා සිටිය හැක.
            </>
        ),
        button: "තේරුණා!",
    },
    ta: {
        title: "கணக்கு சரிபார்ப்பு வழிமுறைகள்",
        intro: "உங்கள் கணக்கை சரிபார்க்க பின்வரும் படிகளைப் பின்பற்றவும்:",
        steps: [
            "சரிபார்ப்பு குறியீட்டை (OTP) பெற உங்கள் மின்னஞ்சல் இன்பாக்ஸை சரிபார்க்கவும்.",
            "உங்கள் கணக்கு சரிபார்ப்பை முடிக்க OTP ஐ வழங்கப்பட்ட புலத்தில் உள்ளிடவும்.",
            "மின்னஞ்சல் தெரியவில்லை என்றால், உங்கள் ஸ்பேம் அல்லது ஜங்க் கோப்புறையை சரிபார்க்கவும்.",
        ],
        note: (
            <>
                நீங்கள் OTP பெறவில்லை என்றால், புதிய குறியீடுகளை கோருவதற்கு{" "}
                <Link to="/resend-otp" className="text-pink-300 hover:text-pink-200 underline font-semibold transition-colors">
                    OTP பெறவில்லையா?
                </Link>{" "}
                இணைப்பை பயன்படுத்தலாம்.
            </>
        ),
        button: "புரிந்தது!",
    },
};


// Define component props
interface AccountVerificationDialogProps {
    openDialog: boolean;
    handleCloseDialog: () => void;
}

const AccountVerificationDialog: React.FC<AccountVerificationDialogProps> = ({ openDialog, handleCloseDialog }) => {
    const { i18n } = useTranslation();
    const language = (i18n.language as LanguageType) || "en";
    // Fallback to "en" if language not in our content map
    const lang: LanguageType = content[language] ? language : "en";

    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 100%)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    borderRadius: "24px",
                    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.35)",
                    color: "#ffffff",
                    overflow: "hidden",
                    margin: { xs: 2, sm: 3 },
                },
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                    },
                },
            }}
        >
            {/* Dialog Title (Seamless with box) */}
            <DialogTitle
                id="alert-dialog-title"
                sx={{
                    p: 0,
                }}
            >
                <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C2963] to-[#4A1536] border border-white/25 flex items-center justify-center shadow-[0_0_15px_rgba(140,41,99,0.5)]">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                            {content[lang].title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Language Selector (EN / සිං / த) */}
                        <div className="flex items-center bg-white/[0.08] p-0.5 rounded-lg border border-white/15">
                            {languagesList.map((item) => (
                                <button
                                    key={item.code}
                                    type="button"
                                    onClick={() => {
                                        i18n.changeLanguage(item.code);
                                        document.documentElement.lang = item.code;
                                    }}
                                    className={`px-2 py-0.5 rounded-md text-xs font-semibold transition-all ${
                                        lang === item.code
                                            ? "bg-white/25 text-white shadow-sm"
                                            : "text-white/60 hover:text-white hover:bg-white/10"
                                    }`}
                                    title={item.nativeName}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleCloseDialog}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, py: 1.5 }}>
                <p className="text-sm sm:text-base text-white/90 font-medium mb-3">
                    {content[lang].intro}
                </p>

                {/* Instructions List (Frosted glass cards) */}
                <div className="space-y-2.5 my-3">
                    {content[lang].steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200"
                        >
                            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-[#8C2963] to-[#4A1536] border border-white/20 flex items-center justify-center text-xs font-bold text-white shadow-sm mt-0.5">
                                {index + 1}
                            </span>
                            <p className="text-sm text-white/90 leading-relaxed">
                                {step}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Note Section */}
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white/75 leading-relaxed mt-4">
                    {content[lang].note}
                </div>
            </DialogContent>

            {/* Dialog Actions (Seamless without top border or separate background) */}
            <DialogActions
                sx={{
                    px: { xs: 2.5, sm: 3 },
                    pb: { xs: 2.5, sm: 3 },
                    pt: 1,
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    onClick={handleCloseDialog}
                    variant="contained"
                    sx={{
                        background: "linear-gradient(135deg, #8C2963 0%, #a03273 50%, #6B1D4A 100%)",
                        color: "#ffffff",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "12px",
                        px: 4,
                        py: 1,
                        fontSize: "0.95rem",
                        boxShadow: "0 4px 18px rgba(140, 41, 99, 0.45)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #a03273 0%, #b83d85 50%, #7d2257 100%)",
                            boxShadow: "0 6px 24px rgba(140, 41, 99, 0.65)",
                            transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    {content[lang].button}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AccountVerificationDialog;
