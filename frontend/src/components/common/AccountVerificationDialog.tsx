import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { themeColorValues } from "../../theme/theme";


// Define supported languages
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const languages = ["en", "si", "ta"] as const;
type LanguageType = (typeof languages)[number];

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
                <Link to="/resend-otp" style={{ color: themeColorValues.primary.main, textDecoration: "underline" }}>
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
                <Link to="/resend-otp" style={{ color: themeColorValues.primary.main, textDecoration: "underline" }}>
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
                <Link to="/resend-otp" style={{ color: themeColorValues.primary.main, textDecoration: "underline" }}>
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
            maxWidth="md"
            fullWidth
        >
            {/* Dialog Title with Language Toggle Button */}
            <DialogTitle
                id="alert-dialog-title"
                sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {content[lang].title}
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{mt: 2}}>
                    <Typography variant="body1" gutterBottom>
                        {content[lang].intro}
                    </Typography>

                    {/* Instructions List */}
                    <List sx={{ listStyleType: "decimal", pl: 2 }}>
                        {content[lang].steps.map((step, index) => (
                            <ListItem key={index} sx={{ display: "list-item" }}>
                                <ListItemText primary={step} primaryTypographyProps={{ fontSize: "1rem" }} />
                            </ListItem>
                        ))}
                    </List>

                    {/* Note Section */}
                    <Typography variant="body2" color="text.secondary" mt={2}>
                        {content[lang].note}
                    </Typography>
                </DialogContentText>
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleCloseDialog}
                    variant="contained"
                    sx={{
                        backgroundColor: "primary.main",
                        "&:hover": { backgroundColor: "primary.dark" },
                    }}
                >
                    {content[lang].button}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AccountVerificationDialog;
