import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAlert } from "../../../components/common/AlertContextScreen";
import homePageContentApi, {
  MultiLangString,
  HeroSectionData,
  VisionMissionData,
  PartnerCardData,
  ContactInfoData,
  HeroButton,
} from "../../../api/HomePageContentApi";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Sparkles,
  Target,
  Users2,
  PhoneCall,
  Save,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Languages,
  RefreshCw,
  Upload,
} from "lucide-react";

type LangKey = "en" | "si" | "ta";

const LANG_CONFIG: { key: LangKey; label: string; badge: string; color: string }[] = [
  { key: "en", label: "English", badge: "EN", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { key: "si", label: "සිංහල", badge: "SI", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { key: "ta", label: "தமிழ்", badge: "TA", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
];

const emptyMultiLang = (): MultiLangString => ({ en: "", si: "", ta: "" });

export default function HomePageContentManagementPage() {
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState(0);
  const [activeLang, setActiveLang] = useState<LangKey>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ─────────────────────────────────────────────
  // 1. HERO SECTION STATE
  // ─────────────────────────────────────────────
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroPreTitle, setHeroPreTitle] = useState<MultiLangString>(emptyMultiLang());
  const [heroMainTitle, setHeroMainTitle] = useState<MultiLangString>(emptyMultiLang());
  const [heroDescription, setHeroDescription] = useState<MultiLangString>(emptyMultiLang());
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [isUploadingHeroImg, setIsUploadingHeroImg] = useState(false);
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);

  // ─────────────────────────────────────────────
  // 2. VISION & MISSION STATE
  // ─────────────────────────────────────────────
  const [vmId, setVmId] = useState<string | null>(null);
  const [visionTitle, setVisionTitle] = useState<MultiLangString>(emptyMultiLang());
  const [visionHighlight, setVisionHighlight] = useState<MultiLangString>(emptyMultiLang());
  const [visionDesc, setVisionDesc] = useState<MultiLangString>(emptyMultiLang());

  const [missionTitle, setMissionTitle] = useState<MultiLangString>(emptyMultiLang());
  const [missionHighlight, setMissionHighlight] = useState<MultiLangString>(emptyMultiLang());
  const [missionDesc, setMissionDesc] = useState<MultiLangString>(emptyMultiLang());

  // ─────────────────────────────────────────────
  // 3. PARTNER CARDS STATE
  // ─────────────────────────────────────────────
  const partnerLogoInputRef = useRef<HTMLInputElement>(null);
  const [partnerCards, setPartnerCards] = useState<PartnerCardData[]>([]);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [partnerTitle, setPartnerTitle] = useState<MultiLangString>(emptyMultiLang());
  const [partnerDesc, setPartnerDesc] = useState<MultiLangString>(emptyMultiLang());
  const [partnerLogoUrl, setPartnerLogoUrl] = useState("");
  const [partnerLogoFile, setPartnerLogoFile] = useState<File | null>(null);
  const [partnerLogoPreview, setPartnerLogoPreview] = useState<string | null>(null);
  const [isUploadingPartnerLogo, setIsUploadingPartnerLogo] = useState(false);
  const [partnerLinkUrl, setPartnerLinkUrl] = useState("");
  const [partnerOrder, setPartnerOrder] = useState<number>(0);
  const [partnerIsActive, setPartnerIsActive] = useState<boolean>(true);

  // ─────────────────────────────────────────────
  // 4. CONTACT INFO STATE
  // ─────────────────────────────────────────────
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactOrgName, setContactOrgName] = useState<MultiLangString>(emptyMultiLang());
  const [contactLocTitle, setContactLocTitle] = useState<MultiLangString>(emptyMultiLang());
  const [contactLocAddress, setContactLocAddress] = useState<MultiLangString>(emptyMultiLang());
  const [contactEmailTitle, setContactEmailTitle] = useState<MultiLangString>(emptyMultiLang());
  const [contactEmailAddress, setContactEmailAddress] = useState("");
  const [contactPhoneTitle, setContactPhoneTitle] = useState<MultiLangString>(emptyMultiLang());
  const [contactPhoneNumber, setContactPhoneNumber] = useState("");
  const [contactHoursTitle, setContactHoursTitle] = useState<MultiLangString>(emptyMultiLang());
  const [contactHoursSchedule, setContactHoursSchedule] = useState<MultiLangString>(emptyMultiLang());

  // ─────────────────────────────────────────────
  // FETCH ALL HOMEPAGE DATA
  // ─────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Hero
      const heroRes = await homePageContentApi.getHeroSection();
      if (heroRes?.data) {
        const d: HeroSectionData = heroRes.data;
        setHeroId(d._id || null);
        setHeroPreTitle(d.preTitle || emptyMultiLang());
        setHeroMainTitle(d.mainTitle || emptyMultiLang());
        setHeroDescription(d.description || emptyMultiLang());
        setHeroImages(d.images || []);
        setHeroButtons(d.buttons || []);
      }

      // 2. Vision & Mission
      const vmRes = await homePageContentApi.getVisionMission();
      if (vmRes?.data) {
        const d: VisionMissionData = vmRes.data;
        setVmId(d._id || null);
        if (d.vision) {
          setVisionTitle(d.vision.title || emptyMultiLang());
          setVisionHighlight(d.vision.highlightText || emptyMultiLang());
          setVisionDesc(d.vision.description || emptyMultiLang());
        }
        if (d.mission) {
          setMissionTitle(d.mission.title || emptyMultiLang());
          setMissionHighlight(d.mission.highlightText || emptyMultiLang());
          setMissionDesc(d.mission.description || emptyMultiLang());
        }
      }

      // 3. Partner Cards
      const partnersRes = await homePageContentApi.getPartnerCards();
      if (partnersRes?.data && Array.isArray(partnersRes.data)) {
        setPartnerCards(partnersRes.data);
      }

      // 4. Contact Info
      const contactRes = await homePageContentApi.getContactInfo();
      if (contactRes?.data) {
        const d: ContactInfoData = contactRes.data;
        setContactId(d._id || null);
        setContactOrgName(d.organizationName || emptyMultiLang());
        if (d.location) {
          setContactLocTitle(d.location.title || emptyMultiLang());
          setContactLocAddress(d.location.address || emptyMultiLang());
        }
        if (d.email) {
          setContactEmailTitle(d.email.title || emptyMultiLang());
          setContactEmailAddress(d.email.address || "");
        }
        if (d.telephone) {
          setContactPhoneTitle(d.telephone.title || emptyMultiLang());
          setContactPhoneNumber(d.telephone.number || "");
        }
        if (d.workingHours) {
          setContactHoursTitle(d.workingHours.title || emptyMultiLang());
          setContactHoursSchedule(d.workingHours.schedule || emptyMultiLang());
        }
      }
    } catch (err: any) {
      showAlert(err?.message || "Failed to load homepage content", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─────────────────────────────────────────────
  // HERO HANDLERS
  // ─────────────────────────────────────────────
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingHeroImg(true);
    let successCount = 0;
    try {
      for (const file of files) {
        try {
          const res = await homePageContentApi.uploadHeroImage(file);
          if (res?.status && res.url) {
            setHeroImages((prev) => [...prev, res.url]);
            successCount++;
          }
        } catch (fileErr: any) {
          showAlert(`Failed to upload ${file.name}: ${fileErr?.message || "Error"}`, "error");
        }
      }
      if (successCount > 0) {
        showAlert(`${successCount} hero image(s) uploaded to AWS S3!`, "success");
      }
    } finally {
      setIsUploadingHeroImg(false);
      if (heroFileInputRef.current) heroFileInputRef.current.value = "";
    }
  };

  const handleRemoveHeroImage = (idx: number) => {
    setHeroImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddHeroButton = () => {
    setHeroButtons((prev) => [
      ...prev,
      {
        label: emptyMultiLang(),
        subLabel: emptyMultiLang(),
        link: "",
        iconUrl: "",
      },
    ]);
  };

  const handleRemoveHeroButton = (idx: number) => {
    setHeroButtons((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveHero = async () => {
    if (heroImages.length === 0) {
      showAlert("Please provide at least one hero image URL.", "error");
      return;
    }
    setIsSaving(true);
    try {
      const payload: Partial<HeroSectionData> = {
        preTitle: heroPreTitle,
        mainTitle: heroMainTitle,
        description: heroDescription,
        images: heroImages,
        buttons: heroButtons,
        isActive: true,
      };

      let res;
      if (heroId) {
        res = await homePageContentApi.updateHeroSection(heroId, payload);
      } else {
        res = await homePageContentApi.createHeroSection(payload);
      }

      if (res?.status) {
        showAlert("Hero section saved successfully!", "success");
        if (res.data?._id) setHeroId(res.data._id);
      } else {
        showAlert(res?.message || "Failed to save Hero section", "error");
      }
    } catch (err: any) {
      showAlert(err?.response?.data?.message || err?.message || "Error saving Hero section", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────
  // VISION & MISSION HANDLERS
  // ─────────────────────────────────────────────
  const handleSaveVisionMission = async () => {
    setIsSaving(true);
    try {
      const payload: Partial<VisionMissionData> = {
        vision: {
          title: visionTitle,
          highlightText: visionHighlight,
          description: visionDesc,
        },
        mission: {
          title: missionTitle,
          highlightText: missionHighlight,
          description: missionDesc,
        },
        isActive: true,
      };

      let res;
      if (vmId) {
        res = await homePageContentApi.updateVisionMission(vmId, payload);
      } else {
        res = await homePageContentApi.createVisionMission(payload);
      }

      if (res?.status) {
        showAlert("Vision & Mission saved successfully!", "success");
        if (res.data?._id) setVmId(res.data._id);
      } else {
        showAlert(res?.message || "Failed to save Vision & Mission", "error");
      }
    } catch (err: any) {
      showAlert(err?.response?.data?.message || err?.message || "Error saving Vision & Mission", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────
  // PARTNER CARDS HANDLERS
  // ─────────────────────────────────────────────
  const handleOpenAddPartner = () => {
    setEditingPartnerId(null);
    setPartnerTitle(emptyMultiLang());
    setPartnerDesc(emptyMultiLang());
    setPartnerLogoUrl("");
    setPartnerLogoFile(null);
    setPartnerLogoPreview(null);
    setPartnerLinkUrl("");
    setPartnerOrder(partnerCards.length + 1);
    setPartnerIsActive(true);
    setPartnerModalOpen(true);
  };

  const handleOpenEditPartner = (card: PartnerCardData) => {
    setEditingPartnerId(card._id || null);
    setPartnerTitle(card.title || emptyMultiLang());
    setPartnerDesc(card.description || emptyMultiLang());
    setPartnerLogoUrl(card.logoUrl || "");
    setPartnerLogoFile(null);
    setPartnerLogoPreview(card.logoUrl || null);
    setPartnerLinkUrl(card.linkUrl || "");
    setPartnerOrder(card.order || 0);
    setPartnerIsActive(card.isActive !== undefined ? card.isActive : true);
    setPartnerModalOpen(true);
  };

  const handlePartnerLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPartnerLogoFile(file);
      setPartnerLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSavePartner = async () => {
    let finalLogoUrl = partnerLogoUrl;

    if (partnerLogoFile) {
      setIsUploadingPartnerLogo(true);
      try {
        const uploadRes = await homePageContentApi.uploadPartnerLogo(partnerLogoFile);
        if (uploadRes?.status && uploadRes.url) {
          finalLogoUrl = uploadRes.url;
        } else {
          showAlert("Failed to upload partner logo to AWS S3", "error");
          setIsUploadingPartnerLogo(false);
          return;
        }
      } catch (uploadErr: any) {
        showAlert(uploadErr?.message || "Error uploading logo to AWS", "error");
        setIsUploadingPartnerLogo(false);
        return;
      } finally {
        setIsUploadingPartnerLogo(false);
      }
    }

    if (!finalLogoUrl.trim()) {
      showAlert("Please select a logo image file for the partner.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<PartnerCardData> = {
        title: partnerTitle,
        description: partnerDesc,
        logoUrl: finalLogoUrl,
        linkUrl: partnerLinkUrl,
        order: Number(partnerOrder) || 0,
        isActive: partnerIsActive,
      };

      let res;
      if (editingPartnerId) {
        res = await homePageContentApi.updatePartnerCard(editingPartnerId, payload);
      } else {
        res = await homePageContentApi.createPartnerCard(payload);
      }

      if (res?.status) {
        showAlert(editingPartnerId ? "Partner card updated!" : "Partner card added!", "success");
        setPartnerModalOpen(false);
        // Refresh partner cards
        const updated = await homePageContentApi.getPartnerCards();
        if (updated?.data) setPartnerCards(updated.data);
      } else {
        showAlert(res?.message || "Failed to save partner card", "error");
      }
    } catch (err: any) {
      showAlert(err?.response?.data?.message || err?.message || "Error saving partner card", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this partner card?")) return;
    try {
      const res = await homePageContentApi.deletePartnerCard(id);
      if (res?.status) {
        showAlert("Partner card deleted!", "success");
        setPartnerCards((prev) => prev.filter((c) => c._id !== id));
      } else {
        showAlert(res?.message || "Failed to delete partner card", "error");
      }
    } catch (err: any) {
      showAlert(err?.message || "Error deleting partner card", "error");
    }
  };

  // ─────────────────────────────────────────────
  // CONTACT INFO HANDLERS
  // ─────────────────────────────────────────────
  const handleSaveContactInfo = async () => {
    if (!contactEmailAddress.trim() || !contactPhoneNumber.trim()) {
      showAlert("Email Address and Telephone Number are required.", "error");
      return;
    }
    setIsSaving(true);
    try {
      const payload: Partial<ContactInfoData> = {
        organizationName: contactOrgName,
        location: {
          title: contactLocTitle,
          address: contactLocAddress,
        },
        email: {
          title: contactEmailTitle,
          address: contactEmailAddress,
        },
        telephone: {
          title: contactPhoneTitle,
          number: contactPhoneNumber,
        },
        workingHours: {
          title: contactHoursTitle,
          schedule: contactHoursSchedule,
        },
        isActive: true,
      };

      let res;
      if (contactId) {
        res = await homePageContentApi.updateContactInfo(contactId, payload);
      } else {
        res = await homePageContentApi.createContactInfo(payload);
      }

      if (res?.status) {
        showAlert("Contact Information saved successfully!", "success");
        if (res.data?._id) setContactId(res.data._id);
      } else {
        showAlert(res?.message || "Failed to save contact info", "error");
      }
    } catch (err: any) {
      showAlert(err?.response?.data?.message || err?.message || "Error saving contact info", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────
  // RENDER MULTI-LANG INPUT FIELD COMPONENT
  // ─────────────────────────────────────────────
  const renderMultiLangField = (
    label: string,
    value: MultiLangString,
    onChange: (val: MultiLangString) => void,
    multiline = false,
    rows = 3
  ) => {
    return (
      <Box mb={2.5}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.75}>
          <Typography variant="caption" fontWeight={700} sx={{ color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {label}
          </Typography>
          <Box display="flex" gap={1}>
            {LANG_CONFIG.map((cfg) => {
              const hasVal = Boolean(value[cfg.key]?.trim());
              return (
                <span
                  key={cfg.key}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    activeLang === cfg.key ? "ring-2 ring-blue-500" : ""
                  } ${hasVal ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}
                  title={`${cfg.label}: ${hasVal ? "Filled" : "Empty"}`}
                >
                  {cfg.badge} {hasVal ? "✓" : "•"}
                </span>
              );
            })}
          </Box>
        </Box>
        <TextField
          fullWidth
          size="small"
          multiline={multiline}
          rows={rows}
          placeholder={`Enter ${label} in ${LANG_CONFIG.find((l) => l.key === activeLang)?.label}...`}
          value={value[activeLang] || ""}
          onChange={(e) =>
            onChange({
              ...value,
              [activeLang]: e.target.value,
            })
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: 2,
            },
          }}
        />
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" gap={2}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading homepage content...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
        <div>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#111827" }}>
            Home Page Content Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            Manage Hero Section, Vision & Mission, Partner Cards, and Contact Details in all 3 languages (EN, SI, TA).
          </Typography>
        </div>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={15} />}
            onClick={fetchData}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* ─── Language Selector Bar (Sticky Top Indicator) ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          backgroundColor: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Languages size={18} className="text-blue-600" />
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#1F2937" }}>
            Active Editing Language:
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {LANG_CONFIG.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setActiveLang(lang.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border cursor-pointer flex items-center gap-1.5 ${
                activeLang === lang.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <span>{lang.badge}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </Box>
      </Paper>

      {/* ─── Section Tabs ─── */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
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
          <Tab icon={<Sparkles size={17} />} iconPosition="start" label="1. Hero Banner Section" />
          <Tab icon={<Target size={17} />} iconPosition="start" label="2. Vision & Mission" />
          <Tab icon={<Users2 size={17} />} iconPosition="start" label="3. Partner Cards" />
          <Tab icon={<PhoneCall size={17} />} iconPosition="start" label="4. Contact Information" />
        </Tabs>

        <Box p={4} bgcolor="#FAFAFA">
          {/* ══════════════════════════════════════════════════════════════
              TAB 1: HERO BANNER SECTION
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 0 && (
            <Box className="space-y-6">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                    Hero Banner Settings
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                    Customize main headlines, background slideshow images, and CTA action buttons.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                  onClick={handleSaveHero}
                  disabled={isSaving}
                  sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, px: 3 }}
                >
                  Save Hero Section
                </Button>
              </Box>

              {/* Multi-language Text Content */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary" mb={2}>
                    Text Content ({LANG_CONFIG.find((l) => l.key === activeLang)?.label})
                  </Typography>
                  {renderMultiLangField("Pre-Title", heroPreTitle, setHeroPreTitle)}
                  {renderMultiLangField("Main Title", heroMainTitle, setHeroMainTitle)}
                  {renderMultiLangField("Description", heroDescription, setHeroDescription, true, 4)}
                </CardContent>
              </Card>

              {/* Background Slideshow Images */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary" mb={1}>
                    Background Images ({heroImages.length})
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6B7280" }} display="block" mb={2}>
                    Add image URLs for the hero background slideshow carousel.
                  </Typography>

                  {/* Hidden file input for AWS Upload */}
                  <input
                    ref={heroFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleHeroFileUpload}
                    style={{ display: "none" }}
                  />

                  {/* Drag and Drop / Upload Button Box */}
                  <Paper
                    elevation={0}
                    onClick={() => heroFileInputRef.current?.click()}
                    sx={{
                      border: "2px dashed #93C5FD",
                      borderRadius: 3,
                      p: 3,
                      mb: 3,
                      textAlign: "center",
                      backgroundColor: "#F0F7FF",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#2563EB", backgroundColor: "#EBF5FF" },
                    }}
                  >
                    {isUploadingHeroImg ? (
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <CircularProgress size={28} />
                        <Typography variant="body2" fontWeight={600} color="primary">
                          Uploading image(s) to AWS S3...
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Upload size={32} className="mx-auto mb-2 text-blue-500" />
                        <Typography variant="body2" fontWeight={700} sx={{ color: "#1E40AF" }}>
                          Click to select and upload image file(s) to AWS S3
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6B7280" }}>
                          Supports JPG, PNG, WebP (Uploaded directly using AWS S3 storage util)
                        </Typography>
                      </Box>
                    )}
                  </Paper>

                  {heroImages.length > 0 && (
                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                      {heroImages.map((img, i) => (
                        <Box
                          key={i}
                          sx={{
                            position: "relative",
                            height: 120,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <img src={img} alt={`Hero ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveHeroImage(i)}
                            sx={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              bgcolor: "rgba(220, 38, 38, 0.9)",
                              color: "white",
                              "&:hover": { bgcolor: "#b91c1c" },
                            }}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* CTA Action Buttons */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <div>
                      <Typography variant="subtitle2" fontWeight={800} color="primary">
                        Call-to-Action Buttons ({heroButtons.length})
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6B7280" }}>
                        Interactive hero buttons with primary and secondary labels.
                      </Typography>
                    </div>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Plus size={15} />}
                      onClick={handleAddHeroButton}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Add Button
                    </Button>
                  </Box>

                  {heroButtons.map((btn, btnIdx) => (
                    <Paper
                      key={btnIdx}
                      elevation={0}
                      sx={{ p: 2.5, mb: 2, border: "1px solid #E5E7EB", borderRadius: 2, bgcolor: "#F9FAFB" }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Typography variant="body2" fontWeight={700} sx={{ color: "#374151" }}>
                          Button #{btnIdx + 1}
                        </Typography>
                        <IconButton size="small" color="error" onClick={() => handleRemoveHeroButton(btnIdx)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2}>
                        {renderMultiLangField(`Label (Button ${btnIdx + 1})`, btn.label, (val) => {
                          const updated = [...heroButtons];
                          updated[btnIdx].label = val;
                          setHeroButtons(updated);
                        })}
                        {renderMultiLangField(`Sub-Label (Button ${btnIdx + 1})`, btn.subLabel, (val) => {
                          const updated = [...heroButtons];
                          updated[btnIdx].subLabel = val;
                          setHeroButtons(updated);
                        })}
                      </Box>
                      <TextField
                        fullWidth
                        size="small"
                        label="Destination Link / Route"
                        placeholder="/proposals or https://..."
                        value={btn.link || ""}
                        onChange={(e) => {
                          const updated = [...heroButtons];
                          updated[btnIdx].link = e.target.value;
                          setHeroButtons(updated);
                        }}
                        sx={{ bgcolor: "white", mt: 1 }}
                      />
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Box>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 2: VISION & MISSION
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 1 && (
            <Box className="space-y-6">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                    Vision & Mission Statements
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                    Define the institutional vision, mission, highlight phrases, and descriptions in all 3 languages.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                  onClick={handleSaveVisionMission}
                  disabled={isSaving}
                  sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, px: 3 }}
                >
                  Save Vision & Mission
                </Button>
              </Box>

              {/* Vision Section */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Target size={18} className="text-blue-600" />
                    <Typography variant="subtitle2" fontWeight={800} color="primary">
                      Our Vision ({LANG_CONFIG.find((l) => l.key === activeLang)?.label})
                    </Typography>
                  </Box>
                  {renderMultiLangField("Vision Title", visionTitle, setVisionTitle)}
                  {renderMultiLangField("Vision Highlight Text", visionHighlight, setVisionHighlight)}
                  {renderMultiLangField("Vision Full Description", visionDesc, setVisionDesc, true, 4)}
                </CardContent>
              </Card>

              {/* Mission Section */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Sparkles size={18} className="text-blue-600" />
                    <Typography variant="subtitle2" fontWeight={800} color="primary">
                      Our Mission ({LANG_CONFIG.find((l) => l.key === activeLang)?.label})
                    </Typography>
                  </Box>
                  {renderMultiLangField("Mission Title", missionTitle, setMissionTitle)}
                  {renderMultiLangField("Mission Highlight Text", missionHighlight, setMissionHighlight)}
                  {renderMultiLangField("Mission Full Description", missionDesc, setMissionDesc, true, 4)}
                </CardContent>
              </Card>
            </Box>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 3: PARTNER CARDS
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 2 && (
            <Box className="space-y-6">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                    Partner & Stakeholder Cards
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                    Manage institutional partners, logos, descriptions, and redirection links.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Plus size={16} />}
                  onClick={handleOpenAddPartner}
                  sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, px: 3 }}
                >
                  Add Partner Card
                </Button>
              </Box>

              {partnerCards.length === 0 ? (
                <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px solid #E5E7EB", borderRadius: 3 }}>
                  <Users2 size={36} className="mx-auto mb-2 text-gray-300" />
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    No partner cards added yet. Click &quot;Add Partner Card&quot; to create your first partner showcase!
                  </Typography>
                </Paper>
              ) : (
                <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={3}>
                  {partnerCards.map((card) => (
                    <Card
                      key={card._id}
                      elevation={0}
                      sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: "#3B82F6", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)" },
                      }}
                    >
                      <Box sx={{ height: 110, p: 2, bgcolor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #E5E7EB" }}>
                        {card.logoUrl ? (
                          <img src={card.logoUrl} alt={card.title?.[activeLang] || "Partner"} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                        ) : (
                          <Users2 size={32} className="text-gray-300" />
                        )}
                      </Box>
                      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#111827" }}>
                            {card.title?.[activeLang] || card.title?.en || "Untitled Partner"}
                          </Typography>
                          <Chip size="small" label={`Order: ${card.order ?? 0}`} variant="outlined" sx={{ fontSize: 11 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: "#6B7280", flex: 1 }} display="block" mb={2}>
                          {card.description?.[activeLang] || card.description?.en || "No description"}
                        </Typography>
                        {card.linkUrl && (
                          <a
                            href={card.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-3"
                          >
                            <ExternalLink size={12} /> {card.linkUrl}
                          </a>
                        )}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" pt={1} borderTop="1px solid #F3F4F6">
                          <Chip
                            size="small"
                            label={card.isActive !== false ? "Active" : "Inactive"}
                            color={card.isActive !== false ? "success" : "default"}
                            sx={{ height: 22, fontSize: 11 }}
                          />
                          <Box display="flex" gap={1}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenEditPartner(card)}>
                              <Edit size={15} />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => card._id && handleDeletePartner(card._id)}>
                              <Trash2 size={15} />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB 4: CONTACT INFORMATION
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 3 && (
            <Box className="space-y-6">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                    Contact Information Settings
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                    Configure the organization address, telephone numbers, emails, and operating schedule.
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                  onClick={handleSaveContactInfo}
                  disabled={isSaving}
                  sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, px: 3 }}
                >
                  Save Contact Information
                </Button>
              </Box>

              {/* Organization Name */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary" mb={2}>
                    Organization Entity Name
                  </Typography>
                  {renderMultiLangField("Organization Name", contactOrgName, setContactOrgName)}
                </CardContent>
              </Card>

              {/* Location */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary" mb={2}>
                    Location & Physical Address
                  </Typography>
                  {renderMultiLangField("Location Section Title", contactLocTitle, setContactLocTitle)}
                  {renderMultiLangField("Full Postal Address", contactLocAddress, setContactLocAddress, true, 3)}
                </CardContent>
              </Card>

              {/* Email & Telephone */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary" mb={2}>
                    Electronic & Phone Inquiries
                  </Typography>
                  <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={3}>
                    <div>
                      {renderMultiLangField("Email Card Title", contactEmailTitle, setContactEmailTitle)}
                      <TextField
                        fullWidth
                        size="small"
                        label="Official Email Address"
                        placeholder="info@nirdc.gov.lk"
                        value={contactEmailAddress}
                        onChange={(e) => setContactEmailAddress(e.target.value)}
                        sx={{ bgcolor: "white" }}
                      />
                    </div>
                    <div>
                      {renderMultiLangField("Phone Card Title", contactPhoneTitle, setContactPhoneTitle)}
                      <TextField
                        fullWidth
                        size="small"
                        label="Official Telephone Number"
                        placeholder="+94 11 234 5678"
                        value={contactPhoneNumber}
                        onChange={(e) => setContactPhoneNumber(e.target.value)}
                        sx={{ bgcolor: "white" }}
                      />
                    </div>
                  </Box>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary" mb={2}>
                    Working Hours & Schedule
                  </Typography>
                  {renderMultiLangField("Hours Card Title", contactHoursTitle, setContactHoursTitle)}
                  {renderMultiLangField("Working Schedule Hours", contactHoursSchedule, setContactHoursSchedule)}
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Paper>

      {/* ─────────────────────────────────────────────
          PARTNER CARD ADD / EDIT DIALOG
         ───────────────────────────────────────────── */}
      <Dialog
        open={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#111827", pb: 1 }}>
          {editingPartnerId ? "Edit Partner Card" : "Add New Partner Card"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }} className="space-y-4">
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} p={1} bgcolor="#F3F4F6" borderRadius={2}>
            <Typography variant="caption" fontWeight={700}>
              Language for Titles:
            </Typography>
            <Box display="flex" gap={1}>
              {LANG_CONFIG.map((cfg) => (
                <button
                  key={cfg.key}
                  onClick={() => setActiveLang(cfg.key)}
                  className={`text-xs px-2 py-1 rounded font-bold cursor-pointer ${
                    activeLang === cfg.key ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
                  }`}
                >
                  {cfg.badge}
                </button>
              ))}
            </Box>
          </Box>

          {renderMultiLangField("Partner Title / Name", partnerTitle, setPartnerTitle)}
          {renderMultiLangField("Partner Short Description", partnerDesc, setPartnerDesc, true, 2)}

          {/* Logo File Upload with AWS S3 Util */}
          <Box mb={2}>
            <Typography variant="caption" fontWeight={700} sx={{ color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px" }} display="block" mb={0.75}>
              Partner Logo Image (AWS S3 Upload)
            </Typography>

            <input
              ref={partnerLogoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePartnerLogoSelect}
              style={{ display: "none" }}
            />

            <Box
              onClick={() => partnerLogoInputRef.current?.click()}
              sx={{
                border: "2px dashed #93C5FD",
                borderRadius: 2.5,
                p: 2.5,
                textAlign: "center",
                bgcolor: "#F0F7FF",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#2563EB", bgcolor: "#EBF5FF" },
              }}
            >
              {isUploadingPartnerLogo ? (
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <CircularProgress size={24} />
                  <Typography variant="caption" fontWeight={600} color="primary">
                    Uploading logo to AWS S3...
                  </Typography>
                </Box>
              ) : partnerLogoPreview ? (
                <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 140,
                      height: 70,
                      p: 1,
                      bgcolor: "white",
                      borderRadius: 2,
                      border: "1px solid #E5E7EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={partnerLogoPreview}
                      alt="Logo preview"
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </Box>
                  <Typography variant="caption" fontWeight={600} color="primary">
                    {partnerLogoFile ? `Selected: ${partnerLogoFile.name}` : "Click to change logo image"}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Upload size={28} className="mx-auto mb-1 text-blue-500" />
                  <Typography variant="body2" fontWeight={700} sx={{ color: "#1E40AF" }}>
                    Click to choose Partner Logo Image
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6B7280" }}>
                    PNG, JPG, SVG, WebP (Uploads to AWS S3 storage util)
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Partner Website / Redirection URL (Optional)"
            placeholder="https://example.com"
            value={partnerLinkUrl}
            onChange={(e) => setPartnerLinkUrl(e.target.value)}
            sx={{ bgcolor: "white" }}
          />

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Display Order"
              value={partnerOrder}
              onChange={(e) => setPartnerOrder(Number(e.target.value))}
              sx={{ bgcolor: "white" }}
            />
            <Box display="flex" alignItems="center">
              <FormControlLabel
                control={<Switch checked={partnerIsActive} onChange={(e) => setPartnerIsActive(e.target.checked)} />}
                label={<Typography variant="body2" fontWeight={600}>Active</Typography>}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPartnerModalOpen(false)} sx={{ textTransform: "none", color: "#6B7280" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePartner}
            disabled={isSaving}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            {isSaving ? <CircularProgress size={16} color="inherit" /> : editingPartnerId ? "Update Partner" : "Save Partner"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
