import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";
import { ApiResponse } from "../../../utils/ApiResponse.ts";
import adminApi from "../../../api/AdminApi.ts";
import {
  CircularProgress,
} from "@mui/material";
import { useAlert } from "../../../components/common/AlertContextScreen.tsx";
import { UserPlus, ArrowLeft, Mail, Phone, Building2, Briefcase, Globe, User } from "lucide-react";

interface ValidationErrors {
  [key: string]: string;
}

const RegisterDirectorScreen = () => {
  const navigate = useNavigate();
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
      showAlert("Please correct the validation errors.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = (await adminApi.createDirector(formData)) as ApiResponse;
      if (!response.status) {
        throw new Error(response.message || "Registration failed");
      }
      showAlert(response.message || "Director registered successfully. Welcome email sent!", "success");
      navigate("/admin/manage-directors");
    } catch (err: any) {
      // Extract backend error message from Axios error response
      const backendMessage = err?.response?.data?.message;
      const fallbackMessage = err instanceof Error ? err.message : "Network error occurred";
      showAlert(backendMessage || fallbackMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all ${
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div
            className="p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #001d4a 0%, #003893 100%)' }}
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <UserPlus size={28} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Register New Director</h1>
            <p className="text-white/70 text-sm mt-1">
              A temporary password will be emailed to the director
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              {renderField("firstName", "First Name", <User size={16} />, "text", "John")}
              {renderField("lastName", "Last Name", <User size={16} />, "text", "Doe")}
            </div>

            {/* Designation + Institution Row */}
            <div className="grid grid-cols-2 gap-3">
              {renderField("designation", "Designation", <Briefcase size={16} />, "text", "e.g. Professor")}
              {renderField("institution", "Institution", <Building2 size={16} />, "text", "e.g. University of Colombo")}
            </div>

            {/* Mobile + Email Row */}
            <div className="grid grid-cols-2 gap-3">
              {renderField("mobile", "Mobile Number", <Phone size={16} />, "tel", "+947XXXXXXXX")}
              {renderField("email", "Email Address", <Mail size={16} />, "email", "director@example.com")}
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Globe size={16} />
                </div>
                <select
                  value={formData.country}
                  onChange={(e) => {
                    setFormData((prev: any) => ({ ...prev, country: e.target.value }));
                    setValidationErrors((prev) => ({ ...prev, country: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all appearance-none bg-white ${
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

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
              <Mail size={16} className="text-[#003893] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                A welcome email with a <strong>temporary password</strong> and login link will be sent to the director's email address. They will be required to change this password on first login.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/manage-directors")}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-[2] py-2.5 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #003893, #2E86C1)' }}
              >
                {isLoading ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  <>
                    <UserPlus size={16} />
                    Register Director
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDirectorScreen;