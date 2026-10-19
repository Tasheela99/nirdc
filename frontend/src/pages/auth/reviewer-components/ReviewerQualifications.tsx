import React, { useState } from "react";
import { Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    completed: boolean;
    onComplete: () => void | Promise<void>;
}

const ReviewerQualifications: React.FC<Props> = ({ completed, onComplete }) => {
    const [checked, setChecked] = useState(completed);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    React.useEffect(() => {
        setChecked(completed);
    }, [completed]);

    const handleComplete = async () => {
        if (!checked) return;
        setIsLoading(true);
        try {
            await onComplete();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-pink-300 tracking-wide">{t('reviewerRegistration.qualifications.heading')}</h3>
            <div className="text-white/85 text-sm leading-relaxed space-y-2 ml-4 font-light">
                <ul className="list-disc space-y-2">
                    <li>{t('reviewerRegistration.qualifications.q1')}</li>
                    <li>{t('reviewerRegistration.qualifications.q2')}</li>
                    <li>{t('reviewerRegistration.qualifications.q3')}</li>
                    <li>{t('reviewerRegistration.qualifications.q4')}</li>
                </ul>
            </div>
            
            <div className="mt-4 bg-white/[0.04] border border-white/15 p-3.5 rounded-xl flex items-center backdrop-blur-md">
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={checked} 
                            onChange={(e) => setChecked(e.target.checked)}
                            sx={{ color: 'rgba(255, 255, 255, 0.6)', '&.Mui-checked': { color: '#ec4899' } }}
                        />
                    }
                    label={<span className="text-sm text-white/90 font-medium">{t('reviewerRegistration.qualifications.confirm')}</span>}
                />
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleComplete}
                    disabled={!checked || isLoading}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                        checked 
                            ? 'bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#9d2e6f] hover:to-[#7c2256] text-white shadow-[0_4px_20px_rgba(140,41,99,0.4)] cursor-pointer' 
                            : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle size={18} />}
                    {t('reviewerRegistration.buttons.confirmProceed')}
                </button>
            </div>
        </div>
    );
};

export default ReviewerQualifications;
