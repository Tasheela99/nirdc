import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Building2,
  Mail,
  Phone,
  Printer,
  Clock,
  Save,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Users,
  MessageSquare,
  Search,
  ExternalLink,
  RefreshCw,
  Filter,
} from "lucide-react";
import ContactApi, {
  ContactInfoData,
  HeadOfficeOfficerData,
  InquiryData,
  MultiLangString,
} from "../../../api/ContactApi";

const emptyMultiLang = (): MultiLangString => ({ en: "", si: "", ta: "" });

type TabType = "general" | "officers" | "inquiries";
const TAB_KEYS: TabType[] = ["general", "officers", "inquiries"];

interface ManageContactContentPageProps {
  defaultTab?: TabType;
}

const ManageContactContentPage: React.FC<ManageContactContentPageProps> = ({ defaultTab = "general" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || defaultTab);

  useEffect(() => {
    if (tabParam && TAB_KEYS.includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [tabParam, defaultTab]);

  const activeTabIndex = Math.max(0, TAB_KEYS.indexOf(activeTab));

  const handleTabChange = (index: number) => {
    const selected = TAB_KEYS[index] || "general";
    setActiveTab(selected);
    setSearchParams({ tab: selected });
  };

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // 1. GENERAL CONTACT & INQUIRY INFO STATE
  // ─────────────────────────────────────────────
  const [contactId, setContactId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<MultiLangString>({
    en: "National Initiative for Research and Development Commercialization",
    si: "පර්යේෂණ හා සංවර්ධන වාණිජකරණ ජාතික ප්‍රවේශය",
    ta: "தேசிய ஆராய்ச்சி மற்றும் அபிவிருத்தி வணிகமயமாக்கல் முயற்சி",
  });
  const [locTitle, setLocTitle] = useState<MultiLangString>({
    en: "President's Office",
    si: "ජනාධිපති කාර්යාලය",
    ta: "ஜனாதிபதி அலுவலகம்",
  });
  const [locAddress, setLocAddress] = useState<MultiLangString>({
    en: "President's Office, Galle Face, Colombo 01, Sri Lanka.",
    si: "ජනාධිපති කාර්යාලය, ගාලුමුවදොර, කොළඹ 01, ශ්‍රී ලංකාව.",
    ta: "ஜனாதிபதி அலுவலகம், காலி முகத்திடல், கொழும்பு 01, இலங்கை.",
  });
  const [telephone, setTelephone] = useState("+94 (0)11 2354 354");
  const [fax, setFax] = useState("+94 (0)11 2354 355");
  const [email, setEmail] = useState("nirdc@presidentsoffice.lk");
  const [hoursSchedule, setHoursSchedule] = useState<MultiLangString>({
    en: "Monday - Friday: 8:30 AM - 4:30 PM",
    si: "සඳුදා - සිකුරාදා: පෙ.ව. 8:30 - ප.ව. 4:30",
    ta: "திங்கள் - வெள்ளி: காலை 8:30 - மாலை 4:30",
  });

  // ─────────────────────────────────────────────
  // 2. HEAD OFFICE OFFICERS STATE
  // ─────────────────────────────────────────────
  const [officers, setOfficers] = useState<HeadOfficeOfficerData[]>([]);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [editingOfficerId, setEditingOfficerId] = useState<string | null>(null);
  const [officerForm, setOfficerForm] = useState<{
    name: MultiLangString;
    designation: MultiLangString;
    division: MultiLangString;
    generalNumber: string;
    mobileNumber: string;
    email: string;
    order: number;
    isActive: boolean;
  }>({
    name: emptyMultiLang(),
    designation: emptyMultiLang(),
    division: emptyMultiLang(),
    generalNumber: "",
    mobileNumber: "",
    email: "",
    order: 0,
    isActive: true,
  });

  // ─────────────────────────────────────────────
  // 3. RECEIVED INQUIRIES STATE
  // ─────────────────────────────────────────────
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("ALL");

  const showFeedback = (msg: string, isError = false) => {
    if (isError) {
      setSaveError(msg);
      setSaveSuccess(null);
    } else {
      setSaveSuccess(msg);
      setSaveError(null);
    }
    setTimeout(() => {
      setSaveSuccess(null);
      setSaveError(null);
    }, 4500);
  };

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Contact info
      const contactRes = await ContactApi.getContactInfo();
      if (contactRes?.data) {
        const d = contactRes.data;
        setContactId(d._id || null);
        if (d.organizationName) setOrgName(d.organizationName);
        if (d.location?.title) setLocTitle(d.location.title);
        if (d.location?.address) setLocAddress(d.location.address);
        if (d.telephone?.number) setTelephone(d.telephone.number);
        if (d.fax?.number) setFax(d.fax.number);
        if (d.email?.address) setEmail(d.email.address);
        if (d.workingHours?.schedule) setHoursSchedule(d.workingHours.schedule);
      }

      // 2. Head Office Officers
      const officersRes = await ContactApi.getAllHeadOfficeOfficers();
      if (officersRes?.data) {
        setOfficers(officersRes.data);
      }

      // 3. Inquiries
      const inquiriesRes = await ContactApi.getAllInquiries();
      if (inquiriesRes?.data) {
        setInquiries(inquiriesRes.data);
      }
    } catch (err: any) {
      console.error("Failed to load contact data:", err);
      showFeedback("Could not load contact data. Please check your connection.", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save General Contact Information
  const handleSaveGeneralContact = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const payload: Partial<ContactInfoData> = {
        organizationName: orgName,
        location: {
          title: locTitle,
          address: locAddress,
        },
        telephone: {
          title: { en: "Telephone", si: "දුරකථනය", ta: "தொலைபேசி" },
          number: telephone,
        },
        fax: {
          title: { en: "Fax", si: "ෆැක්ස්", ta: "தொலைநகல்" },
          number: fax,
        },
        email: {
          title: { en: "Email Inquiries", si: "විද්‍යුත් තැපෑල", ta: "மின்னஞ்சல்" },
          address: email,
        },
        workingHours: {
          title: { en: "Working Hours", si: "සේවා කාලය", ta: "வேலை நேரம்" },
          schedule: hoursSchedule,
        },
        isActive: true,
      };

      if (contactId) {
        await ContactApi.updateContactInfo(contactId, payload);
      } else {
        const res = await ContactApi.createContactInfo(payload);
        if (res?.data?._id) setContactId(res.data._id);
      }
      showFeedback("Contact and Inquiry information updated successfully!");
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || "Failed to save contact info", true);
    } finally {
      setLoading(false);
    }
  };

  // Officers Management
  const handleOpenOfficerModal = (officer?: HeadOfficeOfficerData) => {
    if (officer) {
      setEditingOfficerId(officer._id || null);
      setOfficerForm({
        name: officer.name || emptyMultiLang(),
        designation: officer.designation || emptyMultiLang(),
        division: officer.division || emptyMultiLang(),
        generalNumber: officer.generalNumber || "",
        mobileNumber: officer.mobileNumber || "",
        email: officer.email || "",
        order: officer.order || 0,
        isActive: officer.isActive !== false,
      });
    } else {
      setEditingOfficerId(null);
      setOfficerForm({
        name: emptyMultiLang(),
        designation: emptyMultiLang(),
        division: emptyMultiLang(),
        generalNumber: "",
        mobileNumber: "",
        email: "",
        order: officers.length + 1,
        isActive: true,
      });
    }
    setShowOfficerModal(true);
  };

  const handleSaveOfficer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!officerForm.name.en.trim() || !officerForm.designation.en.trim()) {
      showFeedback("Please provide at least the English Name and Designation.", true);
      return;
    }

    setLoading(true);
    try {
      if (editingOfficerId) {
        await ContactApi.updateHeadOfficeOfficer(editingOfficerId, officerForm);
        showFeedback("Officer information updated successfully!");
      } else {
        await ContactApi.createHeadOfficeOfficer(officerForm);
        showFeedback("New officer added successfully!");
      }
      setShowOfficerModal(false);
      const res = await ContactApi.getAllHeadOfficeOfficers();
      if (res?.data) setOfficers(res.data);
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || "Failed to save officer", true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOfficer = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this officer?")) return;
    setLoading(true);
    try {
      await ContactApi.deleteHeadOfficeOfficer(id);
      showFeedback("Officer removed successfully!");
      setOfficers((prev) => prev.filter((o) => o._id !== id));
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || "Failed to delete officer", true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOfficerStatus = async (officer: HeadOfficeOfficerData) => {
    if (!officer._id) return;
    try {
      const newStatus = !officer.isActive;
      await ContactApi.updateHeadOfficeOfficer(officer._id, { isActive: newStatus });
      setOfficers((prev) =>
        prev.map((o) => (o._id === officer._id ? { ...o, isActive: newStatus } : o))
      );
      showFeedback(`Officer marked as ${newStatus ? "Active" : "Inactive"}`);
    } catch {
      showFeedback("Failed to update status", true);
    }
  };

  // Inquiries Status Update
  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      await ContactApi.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status: newStatus as any } : inq))
      );
      if (selectedInquiry?._id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      showFeedback(`Inquiry status changed to ${newStatus}`);
    } catch {
      showFeedback("Failed to update inquiry status", true);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
    setLoading(true);
    try {
      await ContactApi.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
      showFeedback("Inquiry deleted successfully.");
    } catch (err: any) {
      showFeedback(err?.response?.data?.message || "Failed to delete inquiry.", true);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = inquiryStatusFilter === "ALL" || inq.status === inquiryStatusFilter;
    const query = inquirySearch.toLowerCase();
    const matchesSearch =
      inq.name.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      inq.subject.toLowerCase().includes(query) ||
      inq.message.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <Box className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
        <div>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#111827" }}>
            {activeTab === "inquiries"
              ? "Citizen Contact Inquiries"
              : activeTab === "officers"
              ? "Head Office Officers Directory"
              : "Contact & Inquiry Information Management"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            Manage official inquiry details, head office staff directory, and review citizen inquiries from one unified place.
          </Typography>
        </div>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={15} className={loading ? "animate-spin" : ""} />}
            onClick={fetchData}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Refresh
          </Button>
          {activeTab === "officers" && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={() => handleOpenOfficerModal()}
              sx={{
                backgroundColor: "#2563EB",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": { backgroundColor: "#1D4ED8" },
              }}
            >
              Add New Officer
            </Button>
          )}
        </Box>
      </Box>

      {/* ─── Paper Tabs Container ─── */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        <Tabs
          value={activeTabIndex}
          onChange={(_, val) => handleTabChange(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "white",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
              py: 2,
              minHeight: 56,
            },
          }}
        >
          <Tab icon={<Building2 size={17} />} iconPosition="start" label="1. Inquiry & Contact Details" />
          <Tab icon={<Users size={17} />} iconPosition="start" label={`2. Head Office Officers (${officers.length})`} />
          <Tab
            icon={<MessageSquare size={17} />}
            iconPosition="start"
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <span>3. Received Inquiries ({inquiries.length})</span>
                {pendingCount > 0 && (
                  <Chip
                    size="small"
                    label={`${pendingCount} new`}
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      bgcolor: "#F59E0B",
                      color: "white",
                    }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>

        {/* ─── Tab Content Box ─── */}
        <Box p={4} bgcolor="#FAFAFA">
          {/* Notifications */}
          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSaveSuccess(null)}>
              {saveSuccess}
            </Alert>
          )}
          {saveError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSaveError(null)}>
              {saveError}
            </Alert>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: INQUIRY & GENERAL CONTACT INFO
             ───────────────────────────────────────────────────────────── */}
          {activeTab === "general" && (
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E5E7EB", bgcolor: "white", p: { xs: 3, md: 4 } }}>
              <form onSubmit={handleSaveGeneralContact} className="space-y-6">
                <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" pb={2.5} sx={{ borderBottom: "1px solid #F3F4F6" }} gap={2}>
                  <div>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                      Inquiry & Public Contact Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      These details display on the Public Inquiry page and the home page contact card.
                    </Typography>
                  </div>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<Save size={16} />}
                    sx={{
                      backgroundColor: "#2563EB",
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 700,
                      boxShadow: "none",
                      "&:hover": { backgroundColor: "#1D4ED8" },
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>

                {/* Organization Name (3 languages) */}
                <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Organization Name
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">English (EN)</span>
                      <input
                        type="text"
                        value={orgName.en}
                        onChange={(e) => setOrgName({ ...orgName, en: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">Sinhala (සිංහල)</span>
                      <input
                        type="text"
                        value={orgName.si}
                        onChange={(e) => setOrgName({ ...orgName, si: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">Tamil (தமிழ்)</span>
                      <input
                        type="text"
                        value={orgName.ta}
                        onChange={(e) => setOrgName({ ...orgName, ta: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Address / Location (3 languages) */}
                <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Official Address (ලිපිනය)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">English (EN)</span>
                      <textarea
                        rows={3}
                        value={locAddress.en}
                        onChange={(e) => setLocAddress({ ...locAddress, en: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">Sinhala (සිංහල)</span>
                      <textarea
                        rows={3}
                        value={locAddress.si}
                        onChange={(e) => setLocAddress({ ...locAddress, si: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">Tamil (தமிழ்)</span>
                      <textarea
                        rows={3}
                        value={locAddress.ta}
                        onChange={(e) => setLocAddress({ ...locAddress, ta: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Numbers & Channels */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                      <Phone size={14} className="text-emerald-600" />
                      Telephone (දුරකථනය)
                    </label>
                    <input
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium"
                      placeholder="+94 (0)11 2354 354"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                      <Printer size={14} className="text-sky-600" />
                      Fax Number (ෆැක්ස් අංකය)
                    </label>
                    <input
                      type="text"
                      value={fax}
                      onChange={(e) => setFax(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium"
                      placeholder="+94 (0)11 2354 355"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                      <Mail size={14} className="text-pink-600" />
                      Official Email (විද්‍යුත් තැපෑල)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium"
                      placeholder="nirdc@presidentsoffice.lk"
                    />
                  </div>
                </div>

                {/* Working Hours Schedule (3 languages) */}
                <div className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                    <Clock size={14} className="text-amber-600" />
                    Working Hours Schedule (සේවා කාලය)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">English (EN)</span>
                      <input
                        type="text"
                        value={hoursSchedule.en}
                        onChange={(e) => setHoursSchedule({ ...hoursSchedule, en: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="Monday - Friday: 8:30 AM - 4:30 PM"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">Sinhala (සිංහල)</span>
                      <input
                        type="text"
                        value={hoursSchedule.si}
                        onChange={(e) => setHoursSchedule({ ...hoursSchedule, si: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="සඳුදා - සිකුරාදා: පෙ.ව. 8:30 - ප.ව. 4:30"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500">Tamil (தமிழ்)</span>
                      <input
                        type="text"
                        value={hoursSchedule.ta}
                        onChange={(e) => setHoursSchedule({ ...hoursSchedule, ta: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="திங்கள் - வெள்ளி: காலை 8:30 - மாலை 4:30"
                      />
                    </div>
                  </div>
                </div>

                <Box display="flex" justifyContent="flex-end" pt={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<Save size={16} />}
                    sx={{
                      backgroundColor: "#2563EB",
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 4,
                      py: 1.2,
                      boxShadow: "none",
                      "&:hover": { backgroundColor: "#1D4ED8" },
                    }}
                  >
                    Save All Changes
                  </Button>
                </Box>
              </form>
            </Card>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: HEAD OFFICE OFFICERS DIRECTORY
             ───────────────────────────────────────────────────────────── */}
          {activeTab === "officers" && (
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E5E7EB", bgcolor: "white", overflow: "hidden" }}>
              <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" p={3} sx={{ borderBottom: "1px solid #F3F4F6" }} gap={2}>
                <div>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                    Head Office Officers & Staff Directory
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Manage the officer directory shown on the Head Office page. You can add, edit, disable, or delete officers.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => handleOpenOfficerModal()}
                  sx={{
                    backgroundColor: "#2563EB",
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "#1D4ED8" },
                  }}
                >
                  Add New Officer
                </Button>
              </Box>

              {/* Officers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Officer Name & Designation</th>
                      <th className="py-3.5 px-4 font-bold">General Number</th>
                      <th className="py-3.5 px-4 font-bold">Official Mobile</th>
                      <th className="py-3.5 px-4 font-bold">Email</th>
                      <th className="py-3.5 px-4 font-bold text-center">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {officers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-400">
                          No officers found. Click "Add New Officer" to add your first staff entry.
                        </td>
                      </tr>
                    ) : (
                      officers.map((officer) => (
                        <tr key={officer._id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-bold text-gray-900">{officer.name?.en || "Unnamed"}</p>
                              <p className="text-xs text-primary font-semibold mt-0.5">
                                {officer.designation?.en || "-"}
                              </p>
                              {officer.division?.en && (
                                <p className="text-[11px] text-gray-500 mt-0.5">{officer.division.en}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-800">
                            {officer.generalNumber || "-"}
                          </td>
                          <td className="py-4 px-4 font-medium">
                            {officer.mobileNumber ? (
                              <span className="text-gray-900 font-semibold">{officer.mobileNumber}</span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Not Issued</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs font-medium text-gray-600">
                            {officer.email || "-"}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleOfficerStatus(officer)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                officer.isActive !== false
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {officer.isActive !== false ? "Active" : "Hidden"}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenOfficerModal(officer)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteOfficer(officer._id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 3: RECEIVED INQUIRIES & MESSAGES
             ───────────────────────────────────────────────────────────── */}
          {activeTab === "inquiries" && (
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E5E7EB", bgcolor: "white", overflow: "hidden" }}>
              <Box p={3} sx={{ borderBottom: "1px solid #F3F4F6" }} display="flex" flexDirection="column" gap={2}>
                <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
                  <div>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                      Received Citizen Inquiries
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      Inquiries and feedback messages submitted by visitors through the online Contact & Inquiry form.
                    </Typography>
                  </div>
                  <TextField
                    size="small"
                    placeholder="Search by name, email, subject..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    sx={{ width: { xs: "100%", sm: 320 }, bgcolor: "white" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} className="text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Status Filter Chips */}
                <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
                  <Typography variant="caption" fontWeight={700} sx={{ color: "#6B7280", mr: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Filter size={13} /> Filter:
                  </Typography>
                  {[
                    { id: "ALL", label: "All", count: inquiries.length },
                    { id: "PENDING", label: "Pending", count: inquiries.filter((i) => i.status === "PENDING").length },
                    { id: "REVIEWED", label: "Reviewed", count: inquiries.filter((i) => i.status === "REVIEWED").length },
                    { id: "RESPONDED", label: "Responded", count: inquiries.filter((i) => i.status === "RESPONDED").length },
                  ].map((f) => (
                    <Chip
                      key={f.id}
                      label={`${f.label} (${f.count})`}
                      onClick={() => setInquiryStatusFilter(f.id)}
                      color={inquiryStatusFilter === f.id ? "primary" : "default"}
                      variant={inquiryStatusFilter === f.id ? "filled" : "outlined"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        cursor: "pointer",
                        ...(inquiryStatusFilter === f.id ? { bgcolor: "#2563EB", color: "white" } : {}),
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Inquiries Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Sender</th>
                      <th className="py-3.5 px-4 font-bold">Subject</th>
                      <th className="py-3.5 px-4 font-bold">Method</th>
                      <th className="py-3.5 px-4 font-bold">Date</th>
                      <th className="py-3.5 px-4 font-bold text-center">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-400">
                          No inquiries found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-gray-900">{inq.name}</p>
                            <a href={`mailto:${inq.email}`} className="text-xs text-primary hover:underline">
                              {inq.email}
                            </a>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-gray-800 line-clamp-1">{inq.subject}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{inq.message}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                inq.submissionMethod === "EMAIL_CLIENT"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {inq.submissionMethod === "EMAIL_CLIENT" ? "Email Client" : "Web App"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-500 font-medium">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border-0 focus:ring-1 focus:ring-primary/40 cursor-pointer ${
                                inq.status === "RESPONDED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : inq.status === "REVIEWED"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="REVIEWED">Reviewed</option>
                              <option value="RESPONDED">Responded</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedInquiry(inq)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <a
                                href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                title="Reply via Email"
                              >
                                <Mail size={16} />
                              </a>
                              <button
                                onClick={() => handleDeleteInquiry(inq._id)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Inquiry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </Box>
      </Paper>

      {/* ─────────────────────────────────────────────────────────────
          DIALOG: ADD / EDIT OFFICER
         ───────────────────────────────────────────────────────────── */}
      <Dialog
        open={showOfficerModal}
        onClose={() => setShowOfficerModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#111827" }}>
          {editingOfficerId ? "Edit Officer Information" : "Add New Head Office Officer"}
        </DialogTitle>
        <DialogContent dividers>
          <form id="officer-form" onSubmit={handleSaveOfficer} className="space-y-4 pt-1">
            {/* Name (3 languages) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Officer Name (නම) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="English *"
                  value={officerForm.name.en}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      name: { ...officerForm.name, en: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="සිංහල"
                  value={officerForm.name.si}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      name: { ...officerForm.name, si: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="தமிழ்"
                  value={officerForm.name.ta}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      name: { ...officerForm.name, ta: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Designation (3 languages) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Designation (තනතුර) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="English *"
                  value={officerForm.designation.en}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      designation: { ...officerForm.designation, en: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="සිංහල"
                  value={officerForm.designation.si}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      designation: { ...officerForm.designation, si: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="தமிழ்"
                  value={officerForm.designation.ta}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      designation: { ...officerForm.designation, ta: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Division (3 languages) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Division / Directorate (අංශය)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="English Division"
                  value={officerForm.division.en}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      division: { ...officerForm.division, en: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="සිංහල අංශය"
                  value={officerForm.division.si}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      division: { ...officerForm.division, si: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  placeholder="தமிழ் பிரிவு"
                  value={officerForm.division.ta}
                  onChange={(e) =>
                    setOfficerForm({
                      ...officerForm,
                      division: { ...officerForm.division, ta: e.target.value },
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Phone Numbers & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  General Number (පොදු දුරකථන අංකය)
                </label>
                <input
                  type="text"
                  placeholder="+94 (0)11 2354 354 Ext. 101"
                  value={officerForm.generalNumber}
                  onChange={(e) =>
                    setOfficerForm({ ...officerForm, generalNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Official Mobile (කාර්යාලීය භාවිතයට පමණි)
                </label>
                <input
                  type="text"
                  placeholder="+94 (0)71 2345 678 (if issued)"
                  value={officerForm.mobileNumber}
                  onChange={(e) =>
                    setOfficerForm({ ...officerForm, mobileNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Official Email (විද්‍යුත් තැපෑල)
              </label>
              <input
                type="email"
                placeholder="officer@presidentsoffice.lk"
                value={officerForm.email}
                onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Status & Order */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={officerForm.isActive}
                  onChange={(e) =>
                    setOfficerForm({ ...officerForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span>Visible on Public Website</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Display Order:</span>
                <input
                  type="number"
                  value={officerForm.order}
                  onChange={(e) =>
                    setOfficerForm({ ...officerForm, order: parseInt(e.target.value) || 0 })
                  }
                  className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-lg text-center"
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowOfficerModal(false)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="officer-form"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
            sx={{
              backgroundColor: "#2563EB",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1D4ED8" },
            }}
          >
            {editingOfficerId ? "Update Officer" : "Add Officer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─────────────────────────────────────────────────────────────
          DIALOG: VIEW INQUIRY DETAILS
         ───────────────────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(selectedInquiry)}
        onClose={() => setSelectedInquiry(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#111827" }}>
          Inquiry Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedInquiry && (
            <div className="space-y-4 text-sm pt-1">
              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Sender Name</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{selectedInquiry.name}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Email Address</p>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  {selectedInquiry.email}
                  <ExternalLink size={14} />
                </a>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Subject</p>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedInquiry.subject}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-400">Message Content</p>
                <div className="mt-1 p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                <span>Method: {selectedInquiry.submissionMethod}</span>
                <span>Date: {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleUpdateInquiryStatus(selectedInquiry._id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 border-0 cursor-pointer"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="RESPONDED">Responded</option>
                </select>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          {selectedInquiry && (
            <Button
              color="error"
              size="small"
              startIcon={<Trash2 size={16} />}
              onClick={() => handleDeleteInquiry(selectedInquiry._id)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Delete
            </Button>
          )}
          <Box display="flex" gap={1}>
            {selectedInquiry && (
              <Button
                variant="contained"
                size="small"
                startIcon={<Mail size={16} />}
                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#2563EB",
                  fontWeight: 700,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#1D4ED8" },
                }}
              >
                Reply via Email
              </Button>
            )}
            <Button
              onClick={() => setSelectedInquiry(null)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageContactContentPage;
