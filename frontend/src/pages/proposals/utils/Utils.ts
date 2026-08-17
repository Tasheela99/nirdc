import { ProposalField } from "../types/Types";

export const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Invalid Date';
    }
};

export const formatCurrency = (amount: any, currency: string = 'USD'): string => {
    if (!amount || isNaN(Number(amount))) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(Number(amount));
};

export const formatBoolean = (value: any): string => {
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' ? 'Yes' : 'No';
    }
    return 'N/A';
};

export const validateForm = (formData: any): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.projectTitle?.trim()) {
        errors.projectTitle = 'Project title is required';
    }
    if (!formData.department?.trim()) {
        errors.department = 'Department is required';
    }
    if (formData.budget && isNaN(Number(formData.budget))) {
        errors.budget = 'Budget must be a valid number';
    }
    
    return Object.keys(errors).length === 0;
};

export const getNestedValue = (obj: any, path: string): any => {
    if (!obj) return undefined;
    return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
};

export const groupFieldsByCategory = (fields: ProposalField[]): Record<string, ProposalField[]> => {
    return fields.reduce((acc, field) => {
        const category = field.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(field);
        return acc;
    }, {} as Record<string, ProposalField[]>);
};

export const formatFieldValue = (value: any, type?: string): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    
    try {
        switch (type) {
            case 'date':
                return formatDate(value);
            case 'currency':
                if (typeof value === 'number') {
                    return formatCurrency(value);
                } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
                    return formatCurrency(parseFloat(value));
                }
                return value?.toString() || 'N/A';
            case 'boolean':
                return formatBoolean(value);
            case 'email':
                return value?.toString() || 'N/A';
            case 'phone':
                return value?.toString() || 'N/A';
            case 'array':
                if (Array.isArray(value)) {
                    return value.join(", ");
                }
                return value?.toString() || 'N/A';
            case 'object':
                if (value && typeof value === 'object') {
                    return JSON.stringify(value);
                }
                return 'Complex Object';
            default:
                if (typeof value === 'object') {
                    return JSON.stringify(value);
                }
                return value?.toString() || 'N/A';
        }
    } catch (error) {
        console.error("Error formatting field value:", error);
        return 'Error formatting value';
    }
};

export const formatForPDF = (text: string): string => {
    if (!text || text === 'N/A') return 'N/A';
    
    if (text.length > 1000) {
        return text.substring(0, 997) + '...';
    }
    
    return text.replace(/\\n/g, '\n');
};