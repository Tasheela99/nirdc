import { useState } from 'react';
import { useAutoSave } from '../../../../../../hooks/useAutoSave';
import { FormData } from '../research-types/FormTypes.ts';
import { getInitialFormData, getStorageKey, getExpirationKey, clearFormDataFromStorage } from '../research-utils/FormUtils.ts';

// Data migration function to fix corrupted data structures
const migrateFormData = (data: any): FormData => {
    const correctedData = { ...data };
    
    // Fix: If technologyReadinessLevel is nested in intellectualProperty, move it to root
    if (correctedData.intellectualProperty?.technologyReadinessLevel) {
        correctedData.technologyReadinessLevel = correctedData.intellectualProperty.technologyReadinessLevel;
        delete correctedData.intellectualProperty.technologyReadinessLevel;
    }
    
    // Fix: If publications is nested in intellectualProperty, move it to root
    if (correctedData.intellectualProperty?.publications) {
        correctedData.publications = correctedData.intellectualProperty.publications;
        delete correctedData.intellectualProperty.publications;
    }
    
    // Ensure proper structure for intellectualProperty
    if (!correctedData.intellectualProperty || typeof correctedData.intellectualProperty !== 'object') {
        correctedData.intellectualProperty = {
            status: "",
            patentNumber: "",
            receivedDate: "",
            localOrInternational: ""
        };
    }
    
    // Ensure proper structure for significance
    if (!correctedData.significance || typeof correctedData.significance !== 'object') {
        correctedData.significance = {
            exportPotential: false,
            importSubstitution: false,
            other: "",
            socialImpact: "",
            environmentalImpact: "",
            economicImpactType: ""
        };
    }
    
    // Ensure all required fields exist
    const defaultData = getInitialFormData();
    Object.keys(defaultData).forEach(key => {
        if (correctedData[key] === undefined) {
            correctedData[key] = defaultData[key as keyof FormData];
        }
    });
    
    return correctedData as FormData;
};

export const useFormData = (title?: string) => {
    const [formData, setFormData] = useState<FormData>(() => {
        const savedData = localStorage.getItem(getStorageKey(title));
        const expiration = localStorage.getItem(getExpirationKey(title));
        const isExpired = expiration && new Date().getTime() > parseInt(expiration, 10);

        if (savedData && !isExpired) {
            try {
                const parsedData = JSON.parse(savedData) as any;
                const migratedData = migrateFormData(parsedData);
                return migratedData;
            } catch (error) {
                console.error("Error parsing saved data:", error);
                return getInitialFormData(title);
            }
        }

        return getInitialFormData(title);
    });

    // Auto-save to localStorage
    const { status: autoSaveStatus, lastSavedAt } = useAutoSave({
        data: formData,
        onSave: (data: FormData) => {
            const expirationTime = new Date().getTime() + 14 * 24 * 60 * 60 * 1000; // 14 days
            try {
                const dataToStore = {
                    ...data,
                    supportingDocuments: null,
                    certifications: null
                };
                localStorage.setItem(getStorageKey(title), JSON.stringify(dataToStore));
                localStorage.setItem(getExpirationKey(title), expirationTime.toString());
            } catch (error) {
                console.error("Error saving form data:", error);
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
            const labelText = target.nextElementSibling?.textContent?.trim() || "";

            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...(prev[section as keyof FormData] as any),
                    [field]: target.checked ? labelText : "",
                },
            }));
        } else if (type === "file") {
            const target = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: target.files,
            }));
        } else if (type === "date") {
            const formattedDate = value ? new Date(value).toISOString().split("T")[0] : "";
            const parts = name.split(".");
            
            if (parts.length > 1) {
                setFormData((prev) => {
                    const newState = { ...prev };
                    let current: any = newState;
                    for (let i = 0; i < parts.length - 1; i++) {
                        if (i === 0) {
                            current[parts[i]] = { ...current[parts[i] as keyof FormData] };
                        } else {
                            current[parts[i]] = { ...current[parts[i]] };
                        }
                        current = current[parts[i]];
                    }
                    current[parts[parts.length - 1]] = formattedDate;
                    return newState;
                });
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: formattedDate,
                }));
            }
        } else {
            const formattedValue = name === "technologyReadinessLevel" && value ? `TRL ${value}` : value;
            const parts = name.split(".");

            if (parts.length > 1) {
                setFormData((prev) => {
                    const newState = { ...prev };
                    let current: any = newState;
                    for (let i = 0; i < parts.length - 1; i++) {
                        if (i === 0) {
                            current[parts[i]] = { ...current[parts[i] as keyof FormData] };
                        } else {
                            current[parts[i]] = { ...current[parts[i]] };
                        }
                        current = current[parts[i]];
                    }
                    current[parts[parts.length - 1]] = formattedValue;
                    
                    // Special handling for economic impact type to sync boolean flags
                    if (name === "significance.economicImpactType") {
                        // Update the boolean flags in the significance section
                        current.exportPotential = formattedValue === "exportPotential";
                        current.importSubstitution = formattedValue === "importSubstitution";
                        // console.log removed: Economic Impact Type Updated
                    }
                    
                    return newState;
                });
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [name]: formattedValue,
                }));
            }
        }
    };

    const resetForm = () => {
        setFormData(getInitialFormData());
        clearFormDataFromStorage(title);
        // console.log removed: Form reset and localStorage cleared
    };

    const fixDataStructure = () => {
        const correctedData = migrateFormData(formData);
        setFormData(correctedData);
        // console.log removed: Data structure fixed
    };

    return {
        formData,
        setFormData,
        handleChange,
        resetForm,
        fixDataStructure,
        autoSaveStatus,
        lastSavedAt
    };
};
