import { useState } from "react";
import { useAutoSave } from "../../../../../../hooks/useAutoSave";
import { InvestorFormData, EconomicImpactType } from "../investor-types/InvestorFormTypes.ts";
import { 
    loadInvestorFormDataFromStorage, 
    saveInvestorFormDataToStorage, 
    getDefaultInvestorFormData,
    clearInvestorFormDataFromStorage 
} from "../investor-utils/InvestorFormUtils.ts";

export const useInvestorFormData = (title?: string) => {
    const [formData, setFormData] = useState<InvestorFormData>(() => 
        loadInvestorFormDataFromStorage(title)
    );

    const { status: autoSaveStatus, lastSavedAt } = useAutoSave({
        data: formData,
        onSave: saveInvestorFormDataToStorage,
        delay: 1500,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            const [section, field] = name.includes(".") ? name.split(".") : [null, name];

            if (section) {
                // For nested fields
                setFormData((prev) => ({
                    ...prev,
                    [section]: {
                        ...((prev[section as keyof InvestorFormData] as Record<string, unknown>) || {}),
                        [field]: target.checked,
                    },
                }));
            } else {
                // For top-level checkbox fields
                setFormData((prev) => ({
                    ...prev,
                    [field]: target.checked,
                }));
            }
        } else if (type === "radio") {
            const [section, field] = name.split(".");
            if (section === "significance" && field === "economicImpactType") {
                setFormData((prev) => ({
                    ...prev,
                    significance: {
                        ...prev.significance,
                        economicImpactType: value as EconomicImpactType,
                        other: value === "other" ? prev.significance.other : "",
                    },
                }));
            }
        } else if (type === "file") {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                setFormData((prev) => ({ ...prev, documents: target.files }));
            }
        } else {
            const [section, field] = name.includes(".") ? name.split(".") : [null, name];

            if (section) {
                // For nested fields
                setFormData((prev) => ({
                    ...prev,
                    [section]: {
                        ...((prev[section as keyof InvestorFormData] as Record<string, unknown>) || {}),
                        [field]: value,
                    },
                }));
            } else {
                // For top-level fields
                setFormData((prev) => ({
                    ...prev,
                    [field]: value,
                }));
            }
        }
    };

    const resetForm = () => {
        const defaultData = getDefaultInvestorFormData(title);
        setFormData(defaultData);
        clearInvestorFormDataFromStorage(title);
    };

    return {
        formData,
        setFormData,
        handleChange,
        resetForm,
        autoSaveStatus,
        lastSavedAt
    };
};
