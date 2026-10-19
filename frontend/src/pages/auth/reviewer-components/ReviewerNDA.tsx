import React, { useState } from "react";
import { Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    completed: boolean;
    onComplete: () => void | Promise<void>;
}

const ReviewerNDA: React.FC<Props> = ({ completed, onComplete }) => {
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
            <h3 className="text-lg font-semibold text-pink-300 tracking-wide">{t('reviewerRegistration.nda.heading')}</h3>
            
            <div className="bg-black/40 border border-white/15 rounded-2xl p-6 h-64 overflow-y-auto shadow-inner text-sm text-white/85 leading-relaxed font-body space-y-4 backdrop-blur-md">
                <h4 className="font-bold text-center mb-4 text-white text-base">{t('reviewerRegistration.nda.docTitle')}</h4>
                <p>{t('reviewerRegistration.nda.p1')}</p>
                
                <p><strong>{t('reviewerRegistration.nda.p2').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p2').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p3').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p3').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p4').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p4').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p5').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p5').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p6').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p6').split(':')[1]}</p>
                
                <p className="mt-4 font-semibold text-center italic text-pink-200">
                    {t('reviewerRegistration.nda.p7')}
                </p>
            </div>
            
            <div className="mt-2 bg-white/[0.04] border border-white/15 p-3.5 rounded-xl flex items-center backdrop-blur-md">
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={checked} 
                            onChange={(e) => setChecked(e.target.checked)}
                            sx={{ color: 'rgba(255, 255, 255, 0.6)', '&.Mui-checked': { color: '#ec4899' } }}
                        />
                    }
                    label={<span className="text-sm font-medium text-white/90">{t('reviewerRegistration.nda.confirm')}</span>}
                />
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleComplete}
                    disabled={!checked || isLoading}
                    className={`px-8 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold ${
                        checked 
                            ? 'bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#9d2e6f] hover:to-[#7c2256] text-white shadow-[0_4px_20px_rgba(140,41,99,0.4)] cursor-pointer' 
                            : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle size={18} />}
                    {t('reviewerRegistration.nda.acceptBtn')}
                </button>
            </div>
        </div>
    );
};

export default ReviewerNDA;
