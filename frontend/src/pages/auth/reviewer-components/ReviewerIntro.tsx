import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    onComplete: () => void;
}

const ReviewerIntro: React.FC<Props> = ({ onComplete }) => {
    const [checked, setChecked] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#6B1D4A] dark:text-[#B84B8E]">{t('reviewerRegistration.intro.heading')}</h3>
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-3">
                <p>{t('reviewerRegistration.intro.p1')}</p>
                <p>{t('reviewerRegistration.intro.p2')}</p>
            </div>
            
            <div className="mt-4 bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={checked} 
                            onChange={(e) => setChecked(e.target.checked)}
                            sx={{ '&.Mui-checked': { color: '#6B1D4A' } }}
                        />
                    }
                    label={t('reviewerRegistration.intro.confirm')}
                    className="text-sm"
                />
            </div>

            <div className="flex justify-end pt-2">
                <button 
                    onClick={onComplete}
                    disabled={!checked}
                    className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${checked ? 'bg-[#6B1D4A] text-white hover:bg-[#8C2963]' : 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
                >
                    <CheckCircle size={18} />
                    {t('reviewerRegistration.buttons.confirmProceed')}
                </button>
            </div>
        </div>
    );
};

export default ReviewerIntro;
