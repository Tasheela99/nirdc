import React, { useState, useEffect, FormEvent } from "react";
import { Dialog, DialogTitle, DialogContent, CircularProgress } from "@mui/material";
import { countries } from "countries-list";
import { useAlert } from "../../../components/common/AlertContextScreen";
import adminApi from "../../../api/AdminApi";
import { User, Briefcase, Building2, Phone, Mail, Globe, X, Edit3 } from "lucide-react";

interface ValidationErrors {
  [key: string]: string;
}

interface EditDirectorModalProps {
  open: boolean;
  director: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditDirectorModal: React.FC<EditDirectorModalProps> = ({ open, director, onClose, onSuccess }) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    designation: "",
    institution: "",
    mobile: "",
    email: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const countryOptions = Object.entries(countries).map(([, { name }]) => name);

  useEffect(() => {
    if (director && open) {
      setFormData({
        firstName: director.firstName || "",
        lastName: director.lastName || "",
        designation: director.designation || "",
        institution: director.institution || "",
        mobile: director.mobile || "",
        email: director.email || "",
        country: director.country || "",
      });
      setValidationErrors({});
    }
  }, [director, open]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.firstName) errors.firstName = "First name is required.";
    if (!formData.lastName) errors.lastName = "Last name is required.";
    if (!formData.designation) errors.designation = "Designation is required.";
    if (!formData.institution) errors.institution = "Institution or organization name is required.";
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^\+\d{11,15}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be in the format +947XXXXXXXX.";
    }
    if (!formData.email) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }
    if (!formData.country) errors.country = "Country selection is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = (await adminApi.updateUser(director._id, formData)) as any;
      if (response.status) {
        showAlert("Director updated successfully.", "success");
        onSuccess();
      } else {
        throw new Error(response.message || "Failed to update director");
      }
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      const fallbackMessage = err instanceof Error ? err.message : "Network error occurred";
      showAlert(backendMessage || fallbackMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value.trim() }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const renderField = (
    name: string,
    label: string,
    icon: React.ReactNode,
    type: string = "text",
    placeholder: string = ""
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all ${
            validationErrors[name] ? 'border-red-400' : 'border-gray-200'
          }`}
        />
      </div>
      {validationErrors[name] && (
        <p className="text-xs text-red-500 mt-1">{validationErrors[name]}</p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ m: 0, p: 0 }}>
        <div className="bg-[#003893] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Edit3 size={20} />
            <h2 className="text-lg font-bold m-0">Edit Director</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: "24px !important" }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {renderField("firstName", "First Name", <User size={16} />, "text", "John")}
            {renderField("lastName", "Last Name", <User size={16} />, "text", "Doe")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {renderField("designation", "Designation", <Briefcase size={16} />, "text", "e.g. Professor")}
            {renderField("institution", "Institution", <Building2 size={16} />, "text", "e.g. University of Colombo")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {renderField("mobile", "Mobile Number", <Phone size={16} />, "tel", "+947XXXXXXXX")}
            {renderField("email", "Email Address", <Mail size={16} />, "email", "director@example.com")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Globe size={16} />
              </div>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all appearance-none bg-white ${
                  validationErrors.country ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value="">Select Country</option>
                {countryOptions.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            {validationErrors.country && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.country}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 bg-[#003893]"
            >
              {isLoading ? (
                <CircularProgress size={18} sx={{ color: 'white' }} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDirectorModal;
