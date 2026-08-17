import { useState } from 'react';
import { useAutoSave } from '../../../../../../hooks/useAutoSave';
import { InvestmentFormData } from '../investment-types/InvestmentFormTypes.ts';
import { getInitialInvestmentFormData, getInvestmentStorageKey, getInvestmentExpirationKey, clearInvestmentFormDataFromStorage } from '../investment-utils/InvestmentFormUtils.ts';

export const useInvestmentFormData = (title?: string) => {
    const [formData, setFormData] = useState<InvestmentFormData>(() => {
        const savedData = localStorage.getItem(getInvestmentStorageKey(title));
        const expiration = localStorage.getItem(getInvestmentExpirationKey(title));
        const isExpired = expiration && new Date().getTime() > parseInt(expiration, 10);

        if (savedData && !isExpired) {
            return JSON.parse(savedData) as InvestmentFormData;
        }

        return getInitialInvestmentFormData(title);
    });

    // Auto-save to localStorage
    const { status: autoSaveStatus, lastSavedAt } = useAutoSave({
        data: formData,
        onSave: (data: InvestmentFormData) => {
            const expirationTime = new Date().getTime() + 14 * 24 * 60 * 60 * 1000; // 14 days
            try {
                localStorage.setItem(getInvestmentStorageKey(title), JSON.stringify(data));
                localStorage.setItem(getInvestmentExpirationKey(title), expirationTime.toString());
            } catch (error) {
                console.error("Error saving investment form data:", error);
            }
        },
        delay: 1500,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const target = e.target as HTMLInputElement;
            const [section, field] = name.split(".");
            setFormData((prev: any) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: target.checked,
                },
            }));
        } else if (type === "file") {
            const target = e.target as HTMLInputElement;
            setFormData((prev: any) => ({
                ...prev,
                [name]: target.files,
            }));
        } else {
            const parts = name.split(".");
            if (parts.length > 1) {
                setFormData((prev: any) => {
                    const newState: any = { ...prev };
                    let current: any = newState;
                    for (let i = 0; i < parts.length - 1; i++) {
                        current[parts[i]] = { ...current[parts[i]] };
                        current = current[parts[i]];
                    }
                    current[parts[parts.length - 1]] = value;
                    return newState;
                });
            } else {
                setFormData((prev: any) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
    };

    const resetForm = () => {
        setFormData(getInitialInvestmentFormData(title));
        clearInvestmentFormDataFromStorage(title);
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
