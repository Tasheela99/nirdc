import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import {countries} from "countries-list";
import {z} from "zod";
import logo from "../../assets/NIRDC-logo-SVG.svg";
import authApi from "../../api/AuthApi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import {useAlert} from "../../components/common/AlertContextScreen.tsx";
import {motion} from "framer-motion";
import {User, Briefcase, Building2, Mail, Eye, EyeOff, Globe, Phone, ArrowRight, ArrowLeft} from "lucide-react";
import { useTranslation } from "react-i18next";

const SignUpSchema = z.object({
    firstName: z.string().min(2, {message: 'First name must be at least 2 characters'}),
    lastName: z.string().min(2, {message: 'Last name must be at least 2 characters'}),
    designation: z.string().min(1, {message: 'Designation is required'}),
    institution: z.string().min(1, {message: 'Institution is required'}),
    mobile: z.string().min(10, {message: 'Invalid mobile number'}),
    email: z.string().email({message: 'Invalid email address'}),
    country: z.string().min(1, {message: 'Country is required'}),
    password: z.string()
        .min(8, {message: 'Password must be at least 8 characters'})
        .regex(/[A-Z]/, {message: 'Password must contain an uppercase letter'})
        .regex(/[a-z]/, {message: 'Password must contain a lowercase letter'})
        .regex(/[0-9]/, {message: 'Password must contain a number'})
        .regex(/[@$!%*?&]/, {message: 'Password must contain at least one special character (@, $, !, %, *, ?, &)'}),
    confirmPassword: z.string()
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

const SignUpPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {showAlert} = useAlert();
    const [formData, setFormData] = useState<any>({
        firstName: "",
        lastName: "",
        designation: "",
        institution: "",
        mobile: "",
        email: "",
        country: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        designation?: string;
        institution?: string;
        mobile?: string;
        email?: string;
        country?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        try {
            SignUpSchema.parse(formData);
            setErrors({});
            return true;
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                const errorMap = validationError.flatten().fieldErrors;
                const formattedErrors: any = {};
                Object.keys(errorMap).forEach(key => {
                    formattedErrors[key] = errorMap[key]?.[0] || '';
                });
                setErrors(formattedErrors);
                const alertMessage = Object.values(errorMap)
                    .flat()
                    .filter((msg) => msg)
                    .join(", ");
                showAlert(`${alertMessage}`, "error");
            }
            return false;
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await authApi.signUp(formData) as any;
            if (response.status) {
                showAlert(t('messages.registrationSuccess', 'Registration successful!'), "success");
                navigate(`/security/verify-account/${formData.email}`);
            } else {
                if (response.label === "USER_EMAIL_EXISTS") {
                    setErrors((prev) => ({...prev, email: t('messages.emailAlreadyRegistered')}));
                    showAlert(t('messages.emailAlreadyRegistered'), "error");
                }
                if (response.label === "USER_PHONE_EXISTS") {
                    setErrors((prev) => ({...prev, mobile: t('messages.phoneAlreadyRegistered')}));
                    showAlert(t('messages.phoneAlreadyRegistered'), "error");
                } else {
                    showAlert(response.message || t('messages.registrationFailed'), "error");
                }
            }
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;

                if (status === 429) {
                    showAlert(errorData?.message || t('messages.tooManyAttempts'), "error");
                } else if (errorData) {
                    if (errorData.label === "USER_EMAIL_EXISTS") {
                        setErrors((prev) => ({...prev, email: t('messages.emailAlreadyRegistered')}));
                        showAlert(t('messages.emailAlreadyRegistered'), "error");
                    } else if (errorData.label === "USER_PHONE_EXISTS") {
                        setErrors((prev) => ({...prev, mobile: t('messages.phoneAlreadyRegistered')}));
                        showAlert(t('messages.phoneAlreadyRegistered'), "error");
                    } else if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                        showAlert(errorData.errors[0], "error");
                    } else {
                        showAlert(errorData.message || t('messages.registrationFailed'), "error");
                    }
                }
            } else if (error.request) {
                showAlert(t('messages.networkError'), "error");
            } else {
                showAlert(error.message || t('messages.unexpectedError'), "error");
            }
        } finally {
            setIsLoading(false);
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

    const handleMobileChange = (value: string | undefined) => {
        setFormData((prev: any) => ({...prev, mobile: value || ""}));
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev: any) => ({...prev, [field]: value}));
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => {
                const newErrors = {...prev};
                delete newErrors[field as keyof typeof errors];
                return newErrors;
            });
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA] dark:bg-dark-bg px-4 py-12">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="w-full max-w-6xl bg-white dark:bg-dark-surface rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col lg:flex-row border border-black/5 dark:border-white/5"
            >
                {/* Left - Branding Panel */}
                <div className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-12 text-center">
                    <img
                        src={logo}
                        alt="NIRDC Logo"
                        className="w-48 h-auto mb-6 brightness-0 invert"
                    />
                    
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                        {t('auth.register.joinNirdc', 'Accelerate Innovation')}
                    </h2>
                    
                    <p className="text-white/80 text-[0.95rem] max-w-xs leading-relaxed font-body font-light">
                        {t('auth.register.joinText', 'Join the premier platform connecting Sri Lankan researchers with visionary investors to commercialize high-impact R&D projects.')}
                    </p>
                </div>

                {/* Right - Form Panel */}
                <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 overflow-y-auto">
                    <div className="max-w-[480px] w-full mx-auto">
                        <div className="text-center lg:text-left mb-8">
                            <img
                                src={logo}
                                alt="NIRDC Logo"
                                className="w-28 h-auto mx-auto mb-6 lg:hidden"
                            />
                            <h1 className="text-3xl font-extrabold text-[#1A0D15] dark:text-white font-sans tracking-tight mb-2">
                                {t('auth.register.createAccount', 'Create Account')}
                            </h1>
                            <p className="text-[#475569] dark:text-[#94A3B8] font-body text-sm">
                                {t('auth.register.fillDetails', 'Enter your professional details to access the portal.')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <TextField
                                    label={t('auth.register.firstName', 'First Name')}
                                    fullWidth
                                    value={formData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    required
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <User size={16} className="text-[#94A3B8]" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label={t('auth.register.lastName', 'Last Name')}
                                    fullWidth
                                    value={formData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    required
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <User size={16} className="text-[#94A3B8]" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            {/* Profession Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <TextField
                                    label={t('auth.register.designation', 'Designation')}
                                    fullWidth
                                    value={formData.designation}
                                    onChange={(e) => handleChange("designation", e.target.value)}
                                    required
                                    error={!!errors.designation}
                                    helperText={errors.designation}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Briefcase size={16} className="text-[#94A3B8]" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label={t('auth.register.institution', 'Institution')}
                                    fullWidth
                                    value={formData.institution}
                                    onChange={(e) => handleChange("institution", e.target.value)}
                                    required
                                    error={!!errors.institution}
                                    helperText={errors.institution}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Building2 size={16} className="text-[#94A3B8]" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            {/* Location & Contact Group */}
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
                                                borderColor: errors.country ? '#d32f2f' : (state.isFocused ? '#6B1D4A' : '#c4c4c4'),
                                                '&:hover': { borderColor: state.isFocused ? '#6B1D4A' : '#003893' },
                                                boxShadow: state.isFocused ? '0 0 0 1px #6B1D4A' : 'none',
                                                height: '56px',
                                                minHeight: '56px',
                                                borderRadius: '10px',
                                                fontSize: '1rem',
                                                backgroundColor: 'transparent'
                                            }),
                                            menu: (base) => ({...base, zIndex: 1300, borderRadius: '10px', overflow: 'hidden'}),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isSelected ? '#6B1D4A' : state.isFocused ? '#F8F9FA' : 'transparent',
                                                color: state.isSelected ? 'white' : '#1A0D15',
                                                cursor: 'pointer'
                                            })
                                        }}
                                        components={{
                                            IndicatorSeparator: () => null,
                                            DropdownIndicator: () => (
                                                <div className="pr-2">
                                                    <Globe size={16} className="text-[#94A3B8]" />
                                                </div>
                                            ),
                                        }}
                                    />
                                    {errors.country && (
                                        <p className="text-[0.75rem] text-[#d32f2f] mt-1 ml-[14px] font-body">{errors.country}</p>
                                    )}
                                </div>

                                <div>
                                    <div className={`border rounded-[10px] px-3 h-[56px] flex items-center transition-all ${errors.mobile ? 'border-[#d32f2f]' : 'border-black/20 hover:border-black/30 dark:border-white/20 dark:hover:border-white/30'} focus-within:border-[#6B1D4A] focus-within:ring-1 focus-within:ring-[#6B1D4A] dark:focus-within:border-[#F2B705] dark:focus-within:ring-[#F2B705]`}>
                                        <FormControl fullWidth sx={{
                                            '& .PhoneInput': { width: '100%', display: 'flex', alignItems: 'center' },
                                            '& .PhoneInputInput': { border: 'none', outline: 'none', fontSize: '1rem', width: '100%', background: 'transparent', color: 'inherit' },
                                            '& .PhoneInputInput:focus, & .PhoneInputInput:focus-visible': { outline: 'none !important', border: 'none !important', boxShadow: 'none !important' }
                                        }}>
                                            <div className="flex items-center w-full">
                                                <PhoneInput
                                                    international
                                                    value={formData.mobile}
                                                    onChange={handleMobileChange}
                                                    className="PhoneInput PhoneInputInput font-body outline-none border-none focus:outline-none focus:ring-0"
                                                    defaultCountry="LK"
                                                    placeholder={t('auth.register.mobilePlaceholder', 'Mobile Number *')}
                                                    autoComplete="tel"
                                                />
                                                <Phone size={18} className="text-[#94A3B8] shrink-0 ml-2" />
                                            </div>
                                        </FormControl>
                                    </div>
                                    {errors.mobile ? (
                                        <p className="text-[0.75rem] text-[#d32f2f] mt-1 ml-[14px] font-body">{errors.mobile}</p>
                                    ) : (
                                        <p className="text-[0.75rem] text-[#64748B] mt-1 ml-[14px] font-body">
                                            {t('auth.register.mobileHelper', 'Used for account verification and project updates.')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <TextField
                                label={t('auth.register.emailAddress', 'Email Address')}
                                type="email"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                                required
                                error={!!errors.email}
                                helperText={errors.email}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Mail size={16} className="text-[#94A3B8]" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Password Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <TextField
                                    label={t('auth.password', 'Password')}
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    value={formData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                                    required
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small" className="hover:bg-transparent">
                                                    {showPassword ? <Eye size={16} className="text-[#64748B]" /> : <EyeOff size={16} className="text-[#94A3B8]" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label={t('auth.register.confirmPassword', 'Confirm Password')}
                                    type={showConfirmPassword ? "text" : "password"}
                                    fullWidth
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                    onKeyDown={(e) => { if (e.key === " ") e.preventDefault(); }}
                                    required
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end" size="small" className="hover:bg-transparent">
                                                    {showConfirmPassword ? <Eye size={16} className="text-[#64748B]" /> : <EyeOff size={16} className="text-[#94A3B8]" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex items-center justify-center gap-2 bg-[#6B1D4A] hover:bg-[#8C2963] text-white font-sans font-semibold py-3 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgba(107,29,74,0.3)] hover:shadow-[0_6px_20px_rgba(107,29,74,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none overflow-hidden cursor-pointer"
                                >
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                                    {isLoading ? (
                                        <CircularProgress size={22} color="inherit" />
                                    ) : (
                                        <>
                                            <span className="text-[0.95rem] tracking-wide">{t('auth.register.createAccount', 'Create Account')}</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="w-full flex items-center justify-center gap-1.5 text-[#475569] dark:text-[#94A3B8] hover:text-[#6B1D4A] dark:hover:text-[#F2B705] font-medium py-2 rounded-xl transition-colors duration-200 text-[0.85rem] cursor-pointer"
                                >
                                    <ArrowLeft size={14} />
                                    {t('auth.backToLogin', 'Already have an account? Sign in')}
                                </button>
                                
                                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/reviewer-registration")}
                                        className="text-[#003893] dark:text-blue-400 hover:underline font-medium text-[0.85rem] cursor-pointer"
                                    >
                                        I want to be a Reviewer
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUpPage;
