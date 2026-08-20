import React, { useState } from "react";
import { TextField, InputAdornment, FormControl, IconButton, CircularProgress, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { User, Briefcase, Building2, Mail, Eye, EyeOff } from "lucide-react";
import Select from "react-select";
import { countries } from "countries-list";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const SignUpSchema = z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    designation: z.string().min(1, { message: 'Designation is required' }),
    institution: z.string().min(1, { message: 'Institution is required' }),
    mobile: z.string().min(10, { message: 'Invalid mobile number' }),
    email: z.string().email({ message: 'Invalid email address' }),
    country: z.string().min(1, { message: 'Country is required' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain a lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain a number' })
        .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)' }),
    confirmPassword: z.string(),
    areasOfExpertise: z.array(z.string()).min(1, { message: 'Please select at least one predefined area of expertise' }),
    customExpertise: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

interface OptionType {
    value: string;
    label: string;
    phoneCode: string;
}

const countryOptions: OptionType[] = Object.entries(countries).map(([, country]) => ({
    value: country.name,
    label: country.name,
    phoneCode: `+${country.phone}`,
}));

const PREDEFINED_EXPERTISE = [
    "Technology",
    "Environment",
    "Food and sustenance",
    "Social development",
    "Well-being and intellectual",
    "Other"
];

interface Props {
    initialData: any;
    onComplete: (data: any) => void;
    cvUploadComponent?: React.ReactNode;
    isLoading?: boolean;
}

const ReviewerForm: React.FC<Props> = ({ initialData, onComplete, cvUploadComponent, isLoading }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(initialData || {
        firstName: "",
        lastName: "",
        designation: "",
        institution: "",
        mobile: "",
        email: "",
        country: "",
        password: "",
        confirmPassword: "",
        areasOfExpertise: [] as string[],
        customExpertise: "",
    });
    
    const [errors, setErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleCountryChange = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            setFormData((prev: any) => ({
                ...prev,
                country: selectedOption.value,
                mobile: selectedOption.phoneCode,
            }));
        }
    };

    const handleExpertiseToggle = (expertise: string) => {
        setFormData((prev: any) => {
            const current = prev.areasOfExpertise as string[];
            const updated = current.includes(expertise)
                ? current.filter(e => e !== expertise)
                : [...current, expertise];
            
            if (errors.areasOfExpertise && updated.length > 0) {
                setErrors((errs: any) => {
                    const newErrs = { ...errs };
                    delete newErrs.areasOfExpertise;
                    return newErrs;
                });
            }
            
            return { ...prev, areasOfExpertise: updated };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            SignUpSchema.parse(formData);
            setErrors({});
            const customArr = formData.customExpertise 
                ? formData.customExpertise.split(',').map((s: string) => s.trim()).filter(Boolean) 
                : [];
            // Create a copy of formData and merge the expertise
            const finalData = { 
                ...formData, 
                areasOfExpertise: [...formData.areasOfExpertise, ...customArr] 
            };
            onComplete(finalData);
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                const errorMap = validationError.flatten().fieldErrors;
                const formattedErrors: any = {};
                Object.keys(errorMap).forEach(key => {
                    formattedErrors[key] = errorMap[key as keyof typeof errorMap]?.[0] || '';
                });
                setErrors(formattedErrors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                    label={t('auth.register.firstName', 'First Name')}
                    fullWidth value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    error={!!errors.firstName} helperText={errors.firstName}
                    InputProps={{ endAdornment: <InputAdornment position="end"><User size={16} className="text-[#94A3B8]" /></InputAdornment> }}
                />
                <TextField
                    label={t('auth.register.lastName', 'Last Name')}
                    fullWidth value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    error={!!errors.lastName} helperText={errors.lastName}
                    InputProps={{ endAdornment: <InputAdornment position="end"><User size={16} className="text-[#94A3B8]" /></InputAdornment> }}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                    label={t('auth.register.designation', 'Designation')}
                    fullWidth value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    error={!!errors.designation} helperText={errors.designation}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Briefcase size={16} className="text-[#94A3B8]" /></InputAdornment> }}
                />
                <TextField
                    label={t('auth.register.institution', 'Institution')}
                    fullWidth value={formData.institution}
                    onChange={(e) => handleChange("institution", e.target.value)}
                    error={!!errors.institution} helperText={errors.institution}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Building2 size={16} className="text-[#94A3B8]" /></InputAdornment> }}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <Select
                        options={countryOptions}
                        onChange={handleCountryChange}
                        placeholder={t('auth.register.selectCountry', 'Select Country')}
                        value={countryOptions.find(option => option.value === formData.country)}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                backgroundColor: 'transparent',
                                borderColor: errors.country ? '#d32f2f' : (state.isFocused ? '#6B1D4A' : 'rgba(128, 128, 128, 0.4)'),
                                height: '56px', minHeight: '56px', borderRadius: '10px', fontSize: '1rem',
                                boxShadow: 'none'
                            }),
                            singleValue: (base) => ({ ...base, color: 'inherit' }),
                            input: (base) => ({ ...base, color: 'inherit' }),
                            placeholder: (base) => ({ ...base, color: '#94A3B8' }),
                            menu: (base) => ({ ...base, zIndex: 9999, backgroundColor: '#ffffff', borderRadius: '10px', overflow: 'hidden' }),
                            option: (base, state) => ({
                                ...base,
                                color: state.isSelected ? '#ffffff' : '#1e293b',
                                backgroundColor: state.isSelected ? '#6B1D4A' : (state.isFocused ? '#f1f5f9' : '#ffffff'),
                                cursor: 'pointer',
                                '&:active': { backgroundColor: '#8C2963', color: '#ffffff' }
                            })
                        }}
                    />
                    {errors.country && <p className="text-[0.75rem] text-[#d32f2f] mt-1 ml-[14px]">{errors.country}</p>}
                </div>
                <div>
                    <div className={`border rounded-[10px] px-3 h-[56px] flex items-center transition-colors ${errors.mobile ? 'border-[#d32f2f]' : 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40'}`}>
                        <FormControl fullWidth sx={{ '& .PhoneInputInput': { border: 'none', outline: 'none', width: '100%', backgroundColor: 'transparent', color: 'inherit', fontSize: '1rem' }, '& .PhoneInput': { display: 'flex', alignItems: 'center' } }}>
                            <PhoneInput
                                international
                                value={formData.mobile}
                                onChange={(val) => handleChange("mobile", val || "")}
                                defaultCountry="LK"
                                placeholder={t('auth.register.mobilePlaceholder', 'Mobile Number *')}
                            />
                        </FormControl>
                    </div>
                    {errors.mobile && <p className="text-[0.75rem] text-[#d32f2f] mt-1 ml-[14px]">{errors.mobile}</p>}
                </div>
            </div>
            <TextField
                label={t('auth.register.emailAddress', 'Email Address')}
                type="email" fullWidth value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email} helperText={errors.email}
                InputProps={{ endAdornment: <InputAdornment position="end"><Mail size={16} className="text-[#94A3B8]" /></InputAdornment> }}
            />
            
            <div className="grid grid-cols-1 gap-2 mt-2">
                <p className={`font-semibold ${errors.areasOfExpertise ? 'text-[#d32f2f]' : 'text-gray-700 dark:text-gray-200'}`}>
                    {t('auth.register.selectExpertise', 'Areas of Expertise *')}
                </p>
                <div className={`p-4 border rounded-xl ${errors.areasOfExpertise ? 'border-[#d32f2f]' : 'border-gray-200 dark:border-white/10'}`}>
                    <FormGroup className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        {PREDEFINED_EXPERTISE.map((expertise) => (
                            <FormControlLabel
                                key={expertise}
                                control={
                                    <Checkbox
                                        checked={(formData.areasOfExpertise as string[]).includes(expertise)}
                                        onChange={() => handleExpertiseToggle(expertise)}
                                        sx={{
                                            color: '#94A3B8',
                                            '&.Mui-checked': { color: '#6B1D4A' },
                                        }}
                                    />
                                }
                                label={<span className="text-sm text-gray-700 dark:text-gray-300">{expertise}</span>}
                            />
                        ))}
                    </FormGroup>
                    {errors.areasOfExpertise && <p className="text-[0.75rem] text-[#d32f2f] mt-2">{errors.areasOfExpertise}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <TextField
                    label={t('auth.register.customExpertise', 'Other / Additional Expertise')}
                    fullWidth 
                    value={formData.customExpertise}
                    onChange={(e) => handleChange("customExpertise", e.target.value)}
                    helperText={t('auth.register.expertiseHint', 'Separate multiple areas with commas')}
                    placeholder={t('auth.register.expertisePlaceholder', 'e.g. Artificial Intelligence, Data Science')}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <TextField
                    label={t('auth.register.password', 'Password')}
                    type={showPassword ? "text" : "password"} fullWidth
                    value={formData.password} onChange={(e) => handleChange("password", e.target.value)}
                    error={!!errors.password} helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label={t('auth.register.confirmPassword', 'Confirm Password')}
                    type={showConfirmPassword ? "text" : "password"} fullWidth
                    value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    error={!!errors.confirmPassword} helperText={errors.confirmPassword}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            
            {cvUploadComponent}

            <div className="flex justify-end pt-4 mt-8">
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-8 py-3 bg-[#6B1D4A] text-white rounded-xl font-semibold hover:bg-[#8C2963] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : (t('reviewerRegistration.personalDetails.submitBtn', 'Submit Registration') as string)}
                </button>
            </div>
        </form>
    );
};

export default ReviewerForm;
