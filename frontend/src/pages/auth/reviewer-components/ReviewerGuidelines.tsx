import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

interface Props {
    agreed: boolean;
    onComplete: () => void;
}

const ReviewerGuidelines: React.FC<Props> = ({ agreed, onComplete }) => {
    const [isChecked, setIsChecked] = useState(agreed);

    const handleComplete = () => {
        if (isChecked) {
            onComplete();
        }
    };

    return (
        <div className="space-y-6 py-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30 text-sm text-[#334155] dark:text-[#CBD5E1] space-y-4">
                <h3 className="text-lg font-semibold text-[#1E293B] dark:text-[#F8FAFC]">How to become a reviewer?</h3>
                <p>Thank you for your interest in becoming a reviewer for NIRDC. As a reviewer, you play a critical role in maintaining the quality and integrity of our proposals.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>You must provide accurate information about your qualifications and institutional affiliations.</li>
                    <li>You agree to review proposals assigned to you within the stipulated timeframe.</li>
                    <li>You must declare any conflicts of interest before accepting a review assignment.</li>
                    <li>All proposal details and associated intellectual property must be kept strictly confidential.</li>
                </ul>
                <p>By proceeding, you agree to abide by these guidelines and all policies set forth by NIRDC.</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={isChecked} 
                            onChange={(e) => setIsChecked(e.target.checked)} 
                            disabled={agreed}
                            sx={{ color: '#6B1D4A', '&.Mui-checked': { color: '#6B1D4A' } }}
                        />
                    }
                    label={<span className="text-sm font-medium text-[#475569] dark:text-[#94A3B8]">I have read and agree to the Reviewer Guidelines</span>}
                />
                <button 
                    onClick={handleComplete} 
                    disabled={!isChecked || agreed}
                    className="px-6 py-2 bg-[#6B1D4A] text-white rounded-lg hover:bg-[#8C2963] transition-colors disabled:opacity-50"
                >
                    Save and Continue
                </button>
            </div>
        </div>
    );
};

export default ReviewerGuidelines;
