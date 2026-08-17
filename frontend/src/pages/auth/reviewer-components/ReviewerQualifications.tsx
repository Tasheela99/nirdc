import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    onComplete: () => void;
}

const ReviewerQualifications: React.FC<Props> = ({ onComplete }) => {
    const [checked, setChecked] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#6B1D4A] dark:text-[#B84B8E]">{t('reviewerRegistration.qualifications.heading')}</h3>
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-2 ml-4">
                <ul className="list-disc space-y-2">
                    <li>{t('reviewerRegistration.qualifications.q1')}</li>
                    <li>{t('reviewerRegistration.qualifications.q2')}</li>
                    <li>{t('reviewerRegistration.qualifications.q3')}</li>
                    <li>{t('reviewerRegistration.qualifications.q4')}</li>
                </ul>
            </div>
            
            <div className="mt-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg flex items-center">
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={checked} 
                            onChange={(e) => setChecked(e.target.checked)}
                            sx={{ '&.Mui-checked': { color: '#6B1D4A' } }}
                        />
                    }
                    label={t('reviewerRegistration.qualifications.confirm')}
                    className="text-sm"
                />
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => checked && onComplete()}
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

export default ReviewerQualifications;
