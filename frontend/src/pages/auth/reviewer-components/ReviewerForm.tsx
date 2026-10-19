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

    const glassInputSx = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(8px)",
            borderRadius: "14px",
            color: "#ffffff",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.22)",
            },
            "&:hover fieldset": {
                borderColor: "rgba(235, 120, 180, 0.6)",
            },
            "&.Mui-focused": {
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                "& fieldset": {
                    borderColor: "#e279b5",
                    borderWidth: "1.5px",
                },
            },
        },
        "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.75)",
            "&.Mui-focused": {
                color: "#f8a5d3",
                fontWeight: 600,
            },
        },
        "& .MuiInputBase-input": {
            color: "#ffffff",
        },
        "& .MuiFormHelperText-root": {
            color: "rgba(255, 255, 255, 0.7)",
            "&.Mui-error": {
                color: "#f87171",
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                    label={t('auth.register.firstName', 'First Name')}
                    fullWidth value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    error={!!errors.firstName} helperText={errors.firstName}
                    sx={glassInputSx}
                    InputProps={{ endAdornment: <InputAdornment position="end"><User size={16} className="text-white/60" /></InputAdornment> }}
                />
                <TextField
                    label={t('auth.register.lastName', 'Last Name')}
                    fullWidth value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    error={!!errors.lastName} helperText={errors.lastName}
                    sx={glassInputSx}
                    InputProps={{ endAdornment: <InputAdornment position="end"><User size={16} className="text-white/60" /></InputAdornment> }}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                    label={t('auth.register.designation', 'Designation')}
                    fullWidth value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    error={!!errors.designation} helperText={errors.designation}
                    sx={glassInputSx}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Briefcase size={16} className="text-white/60" /></InputAdornment> }}
                />
                <TextField
                    label={t('auth.register.institution', 'Institution')}
                    fullWidth value={formData.institution}
                    onChange={(e) => handleChange("institution", e.target.value)}
                    error={!!errors.institution} helperText={errors.institution}
                    sx={glassInputSx}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Building2 size={16} className="text-white/60" /></InputAdornment> }}
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
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                backdropFilter: 'blur(8px)',
                                borderColor: errors.country ? '#d32f2f' : (state.isFocused ? '#e279b5' : 'rgba(255, 255, 255, 0.22)'),
                                '&:hover': { borderColor: state.isFocused ? '#e279b5' : 'rgba(235, 120, 180, 0.6)' },
                                height: '56px', minHeight: '56px', borderRadius: '14px', fontSize: '1rem',
                                boxShadow: state.isFocused ? '0 0 0 1px #e279b5' : 'none',
                                color: '#ffffff'
                            }),
                            singleValue: (base) => ({ ...base, color: '#ffffff' }),
                            input: (base) => ({ ...base, color: '#ffffff' }),
                            placeholder: (base) => ({ ...base, color: 'rgba(255, 255, 255, 0.75)' }),
                            menu: (base) => ({ ...base, zIndex: 9999, backgroundColor: '#1b0817', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '14px', overflow: 'hidden', backdropFilter: 'blur(16px)' }),
                            option: (base, state) => ({
                                ...base,
                                color: '#ffffff',
                                backgroundColor: state.isSelected ? '#8C2963' : (state.isFocused ? 'rgba(140, 41, 99, 0.3)' : 'transparent'),
                                cursor: 'pointer',
                                '&:active': { backgroundColor: '#8C2963', color: '#ffffff' }
                            })
                        }}
                    />
                    {errors.country && <p className="text-[0.75rem] text-[#f87171] mt-1 ml-[14px]">{errors.country}</p>}
                </div>
                <div>
                    <div className={`border rounded-[14px] px-3 h-[56px] flex items-center transition-colors bg-white/[0.08] backdrop-blur-[8px] ${errors.mobile ? 'border-[#d32f2f]' : 'border-white/22 hover:border-pink-400/50'}`}>
                        <FormControl fullWidth sx={{
                            '& .PhoneInputInput': { border: 'none', outline: 'none', width: '100%', backgroundColor: 'transparent', color: '#ffffff', fontSize: '1rem' },
                            '& .PhoneInputInput::placeholder': { color: 'rgba(255, 255, 255, 0.75)' },
                            '& .PhoneInput': { display: 'flex', alignItems: 'center' }
                        }}>
                            <PhoneInput
                                international
                                value={formData.mobile}
                                onChange={(val) => handleChange("mobile", val || "")}
                                defaultCountry="LK"
                                placeholder={t('auth.register.mobilePlaceholder', 'Mobile Number *')}
                            />
                        </FormControl>
                    </div>
                    {errors.mobile && <p className="text-[0.75rem] text-[#f87171] mt-1 ml-[14px]">{errors.mobile}</p>}
                </div>
            </div>
            <TextField
                label={t('auth.register.emailAddress', 'Email Address')}
                type="email" fullWidth value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email} helperText={errors.email}
                sx={glassInputSx}
                InputProps={{ endAdornment: <InputAdornment position="end"><Mail size={16} className="text-white/60" /></InputAdornment> }}
            />
            
            <div className="grid grid-cols-1 gap-2 mt-2">
                <p className={`font-semibold ${errors.areasOfExpertise ? 'text-[#f87171]' : 'text-white/90'}`}>
                    {t('auth.register.selectExpertise', 'Areas of Expertise *')}
                </p>
                <div className={`p-4 border rounded-xl backdrop-blur-sm ${errors.areasOfExpertise ? 'border-[#d32f2f] bg-red-500/10' : 'border-white/15 bg-white/[0.04]'}`}>
                    <FormGroup className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        {PREDEFINED_EXPERTISE.map((expertise) => (
                            <FormControlLabel
                                key={expertise}
                                control={
                                    <Checkbox
                                        checked={(formData.areasOfExpertise as string[]).includes(expertise)}
                                        onChange={() => handleExpertiseToggle(expertise)}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            '&.Mui-checked': { color: '#e279b5' },
                                        }}
                                    />
                                }
                                label={<span className="text-sm text-white/90">{expertise}</span>}
                            />
                        ))}
                    </FormGroup>
                    {errors.areasOfExpertise && <p className="text-[0.75rem] text-[#f87171] mt-2">{errors.areasOfExpertise}</p>}
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
                    sx={glassInputSx}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <TextField
                    label={t('auth.register.password', 'Password')}
                    type={showPassword ? "text" : "password"} fullWidth
                    value={formData.password} onChange={(e) => handleChange("password", e.target.value)}
                    error={!!errors.password} helperText={errors.password}
                    sx={glassInputSx}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                    {showPassword ? <Eye size={16} className="text-pink-300" /> : <EyeOff size={16} className="text-white/50" />}
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
                    sx={glassInputSx}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                                    {showConfirmPassword ? <Eye size={16} className="text-pink-300" /> : <EyeOff size={16} className="text-white/50" />}
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
                    className="px-8 py-3.5 bg-gradient-to-r from-[#8C2963] via-[#a03273] to-[#6B1D4A] hover:from-[#9C3872] hover:to-[#8C2963] text-white rounded-xl font-semibold shadow-lg shadow-[#8C2963]/30 hover:shadow-xl hover:shadow-[#8C2963]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : (t('reviewerRegistration.personalDetails.submitBtn', 'Submit Registration') as string)}
                </button>
            </div>
        </form>
    );
};

export default ReviewerForm;
