import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    onComplete: () => void;
}

const ReviewerNDA: React.FC<Props> = ({ onComplete }) => {
    const [checked, setChecked] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#6B1D4A] dark:text-[#B84B8E]">{t('reviewerRegistration.nda.heading')}</h3>
            
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6 h-64 overflow-y-auto shadow-inner text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-body space-y-4">
                <h4 className="font-bold text-center mb-4">{t('reviewerRegistration.nda.docTitle')}</h4>
                <p>{t('reviewerRegistration.nda.p1')}</p>
                
                <p><strong>{t('reviewerRegistration.nda.p2').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p2').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p3').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p3').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p4').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p4').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p5').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p5').split(':')[1]}</p>
                <p><strong>{t('reviewerRegistration.nda.p6').split(':')[0]}:</strong> {t('reviewerRegistration.nda.p6').split(':')[1]}</p>
                
                <p className="mt-4 font-semibold text-center italic">
                    {t('reviewerRegistration.nda.p7')}
                </p>
            </div>
            
            <div className="mt-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg flex items-center">
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={checked} 
                            onChange={(e) => setChecked(e.target.checked)}
                            sx={{ '&.Mui-checked': { color: '#6B1D4A' } }}
                        />
                    }
                    label={t('reviewerRegistration.nda.confirm')}
                    className="text-sm font-medium"
                />
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => checked && onComplete()}
                    disabled={!checked}
                    className={`px-8 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-semibold ${checked ? 'bg-[#6B1D4A] text-white hover:bg-[#8C2963] shadow-md' : 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
                >
                    <CheckCircle size={18} />
                    {t('reviewerRegistration.nda.acceptBtn')}
                </button>
            </div>
        </div>
    );
};

export default ReviewerNDA;
