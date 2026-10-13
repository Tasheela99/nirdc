import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAlert } from "../../../components/common/AlertContextScreen";
import aboutUsContentApi, {
  MultiLangString,
  IntroductionData,
  DirectorMessageData,
  HistoryMilestoneData,
  CoreValueData,
  ObjectiveData,
  ResponsibilityData,
  FunctionServiceData,
  TeamMemberData,
  OrganizationalStructureData,
} from "../../../api/AboutUsContentApi";
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
  Save,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Quote,
  Shield,
  Layers,
  Building,
  CheckCircle2,
  Phone,
  Mail,
  Linkedin,
  Compass,
  Eye,
  EyeOff,
  Menu,
} from "lucide-react";

type LangKey = "en" | "si" | "ta";

const LANG_CONFIG: { key: LangKey; label: string; badge: string; color: string }[] = [
  { key: "en", label: "English", badge: "EN", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { key: "si", label: "සිංහල", badge: "SI", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { key: "ta", label: "தமிழ்", badge: "TA", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
];

const emptyMultiLang = (): MultiLangString => ({ en: "", si: "", ta: "" });

export interface NavCategoryItem {
  key: string;
  label: string;
  path: string;
  desc: string;
}

export interface NavCategoryGroup {
  category: string;
  description: string;
  items: NavCategoryItem[];
}

const NAV_CATEGORIES: NavCategoryGroup[] = [
  {
    category: "Who We Are",
    description: "Foundational identity and historical background links",
    items: [
      { key: "introduction", label: "Introduction", path: "/about-us/introduction", desc: "Overview of NIRDC mandate and foundation" },
      { key: "history", label: "Our History", path: "/about-us/history", desc: "Milestone timeline and achievements" },
      { key: "visionMission", label: "Our Vision & Mission", path: "/about-us/vision-mission", desc: "Guiding mission and strategic vision" },
      { key: "values", label: "Our Values", path: "/about-us/values", desc: "Core institutional ethics and pillars" },
    ],
  },
  {
    category: "What We Do",
    description: "Operational scope, statutory duties and public services",
    items: [
      { key: "objectives", label: "Our Objectives", path: "/about-us/objectives", desc: "Strategic benchmarks and targets" },
      { key: "responsibilities", label: "Our Responsibilities", path: "/about-us/responsibilities", desc: "Statutory mandates and legal duties" },
      { key: "functionsServices", label: "Functions and Services", path: "/about-us/functions-services", desc: "Core services provided to public and researchers" },
    ],
  },
  {
    category: "Leadership",
    description: "Executive hierarchy, directorship and staff directories",
    items: [
      { key: "directorMessage", label: "Director Message", path: "/about-us/director-message", desc: "Official address from Director General" },
      { key: "team", label: "Our Team", path: "/about-us/team", desc: "Key leadership and executive personnel" },
      { key: "organizationalStructure", label: "Organizational Structure", path: "/about-us/organizational-structure", desc: "Hierarchy, departments and operational divisions" },
    ],
  },
  {
    category: "Resources",
    description: "Knowledge products, public reports and circulars",
    items: [
      { key: "downloads", label: "Downloads", path: "/resources/downloads", desc: "Forms, templates and official notices" },
      { key: "reportsPublications", label: "Reports & Publications", path: "/resources/reports-publications", desc: "Annual and special investigation reports" },
      { key: "newsletters", label: "Newsletters", path: "/resources/newsletters", desc: "Quarterly and monthly bulletins" },
    ],
  },
];

export default function AboutUsContentManagementPage() {
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState(0);
  const [activeLang, setActiveLang] = useState<LangKey>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ─────────────────────────────────────────────
  // 1. INTRODUCTION (Singleton)
  // ─────────────────────────────────────────────
  const introFileInputRef = useRef<HTMLInputElement>(null);
  const [introId, setIntroId] = useState<string | null>(null);
  const [introBadge, setIntroBadge] = useState<MultiLangString>(emptyMultiLang());
  const [introTitle, setIntroTitle] = useState<MultiLangString>(emptyMultiLang());
  const [introSubtitle, setIntroSubtitle] = useState<MultiLangString>(emptyMultiLang());
  const [introOverviewTitle, setIntroOverviewTitle] = useState<MultiLangString>(emptyMultiLang());
  const [introOverviewHeading, setIntroOverviewHeading] = useState<MultiLangString>(emptyMultiLang());
  const [introParagraphs, setIntroParagraphs] = useState<MultiLangString[]>([]);
  const [introImage, setIntroImage] = useState<string>("");
  const [isUploadingIntroImg, setIsUploadingIntroImg] = useState(false);

  // ─────────────────────────────────────────────
  // 2. DIRECTOR MESSAGE (Singleton)
  // ─────────────────────────────────────────────
  const dirFileInputRef = useRef<HTMLInputElement>(null);
  const [dirId, setDirId] = useState<string | null>(null);
  const [dirBadge, setDirBadge] = useState<MultiLangString>(emptyMultiLang());
  const [dirQuote, setDirQuote] = useState<MultiLangString>(emptyMultiLang());
  const [dirName, setDirName] = useState<MultiLangString>(emptyMultiLang());
  const [dirRole, setDirRole] = useState<MultiLangString>(emptyMultiLang());
  const [dirImage, setDirImage] = useState<string>("");
  const [isUploadingDirImg, setIsUploadingDirImg] = useState(false);
  const [dirCredentials, setDirCredentials] = useState<MultiLangString[]>([]);
  const [dirParagraphs, setDirParagraphs] = useState<MultiLangString[]>([]);
  const [dirSignoffName, setDirSignoffName] = useState<MultiLangString>(emptyMultiLang());
  const [dirSignoffRole, setDirSignoffRole] = useState<MultiLangString>(emptyMultiLang());

  // ─────────────────────────────────────────────
  // 3. HISTORY MILESTONES (Collection)
  // ─────────────────────────────────────────────
  const [milestones, setMilestones] = useState<HistoryMilestoneData[]>([]);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneYear, setMilestoneYear] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState<MultiLangString>(emptyMultiLang());
  const [milestoneDesc, setMilestoneDesc] = useState<MultiLangString>(emptyMultiLang());
  const [milestoneOrder, setMilestoneOrder] = useState<number>(0);
  const [milestoneIsActive, setMilestoneIsActive] = useState<boolean>(true);

  // ─────────────────────────────────────────────
  // 4. CORE VALUES (Collection)
  // ─────────────────────────────────────────────
  const [coreValues, setCoreValues] = useState<CoreValueData[]>([]);
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [valueTitle, setValueTitle] = useState<MultiLangString>(emptyMultiLang());
  const [valueDesc, setValueDesc] = useState<MultiLangString>(emptyMultiLang());
  const [valueIcon, setValueIcon] = useState("Sparkles");
  const [valueOrder, setValueOrder] = useState<number>(0);
  const [valueIsActive, setValueIsActive] = useState<boolean>(true);

  // ─────────────────────────────────────────────
  // 5. OBJECTIVES (Collection)
  // ─────────────────────────────────────────────
  const [objectives, setObjectives] = useState<ObjectiveData[]>([]);
  const [objModalOpen, setObjModalOpen] = useState(false);
  const [editingObjId, setEditingObjId] = useState<string | null>(null);
  const [objBadge, setObjBadge] = useState<MultiLangString>(emptyMultiLang());
  const [objTitle, setObjTitle] = useState<MultiLangString>(emptyMultiLang());
  const [objDesc, setObjDesc] = useState<MultiLangString>(emptyMultiLang());
  const [objIcon, setObjIcon] = useState("Target");
  const [objOrder, setObjOrder] = useState<number>(0);
  const [objIsActive, setObjIsActive] = useState<boolean>(true);

  // ─────────────────────────────────────────────
  // 6. RESPONSIBILITIES (Collection)
  // ─────────────────────────────────────────────
  const [responsibilities, setResponsibilities] = useState<ResponsibilityData[]>([]);
  const [respModalOpen, setRespModalOpen] = useState(false);
  const [editingRespId, setEditingRespId] = useState<string | null>(null);
  const [respSection, setRespSection] = useState<MultiLangString>(emptyMultiLang());
  const [respTitle, setRespTitle] = useState<MultiLangString>(emptyMultiLang());
  const [respPoints, setRespPoints] = useState<MultiLangString[]>([]);
  const [respIcon, setRespIcon] = useState("ShieldCheck");
  const [respOrder, setRespOrder] = useState<number>(0);
  const [respIsActive, setRespIsActive] = useState<boolean>(true);

  // ─────────────────────────────────────────────
  // 7. FUNCTIONS & SERVICES (Collection)
  // ─────────────────────────────────────────────
  const [services, setServices] = useState<FunctionServiceData[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceCategory, setServiceCategory] = useState<MultiLangString>(emptyMultiLang());
  const [serviceDesc, setServiceDesc] = useState<MultiLangString>(emptyMultiLang());
  const [serviceOfferings, setServiceOfferings] = useState<MultiLangString[]>([]);
  const [serviceIcon, setServiceIcon] = useState("Lightbulb");
  const [serviceLink, setServiceLink] = useState("");
  const [serviceActionText, setServiceActionText] = useState<MultiLangString>(emptyMultiLang());
  const [serviceOrder, setServiceOrder] = useState<number>(0);
  const [serviceIsActive, setServiceIsActive] = useState<boolean>(true);

  // ─────────────────────────────────────────────
  // 8. TEAM MEMBERS (Collection)
  // ─────────────────────────────────────────────
  const teamPhotoInputRef = useRef<HTMLInputElement>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<MultiLangString>(emptyMultiLang());
  const [memberRole, setMemberRole] = useState<MultiLangString>(emptyMultiLang());
  const [memberDivision, setMemberDivision] = useState<MultiLangString>(emptyMultiLang());
  const [memberBio, setMemberBio] = useState<MultiLangString>(emptyMultiLang());
  const [memberInitials, setMemberInitials] = useState("");
  const [memberColor, setMemberColor] = useState("from-purple-600 to-pink-600");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberLinkedin, setMemberLinkedin] = useState("");
  const [memberImage, setMemberImage] = useState<string>("");
  const [isUploadingMemberPhoto, setIsUploadingMemberPhoto] = useState(false);
  const [memberOrder, setMemberOrder] = useState<number>(0);
  const [memberIsActive, setMemberIsActive] = useState<boolean>(true);

  // ─────────────────────────────────────────────
  // 9. ORGANIZATIONAL STRUCTURE (Collection)
  // ─────────────────────────────────────────────
  const [divisions, setDivisions] = useState<OrganizationalStructureData[]>([]);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [orgTitle, setOrgTitle] = useState<MultiLangString>(emptyMultiLang());
  const [orgFocus, setOrgFocus] = useState<MultiLangString>(emptyMultiLang());
  const [orgSubUnits, setOrgSubUnits] = useState<MultiLangString[]>([]);
  const [orgIcon, setOrgIcon] = useState("Building");
  const [orgOrder, setOrgOrder] = useState<number>(0);
  const [orgIsActive, setOrgIsActive] = useState<boolean>(true);

  // Reference for reserved collection states
  if (false as boolean) {
    console.log([
      introId, dirId, services, serviceModalOpen, setServiceModalOpen,
      editingServiceId, setEditingServiceId, serviceCategory, setServiceCategory,
      serviceDesc, setServiceDesc, serviceOfferings, setServiceOfferings,
      serviceIcon, setServiceIcon, serviceLink, setServiceLink,
      serviceActionText, setServiceActionText, serviceOrder, setServiceOrder,
      serviceIsActive, setServiceIsActive, divisions, orgModalOpen,
      setOrgModalOpen, editingOrgId, setEditingOrgId, orgTitle, setOrgTitle,
      orgFocus, setOrgFocus, orgSubUnits, setOrgSubUnits, orgIcon,
      setOrgIcon, orgOrder, setOrgOrder, orgIsActive, setOrgIsActive
    ]);
  }

  // ─────────────────────────────────────────────
  // 10. NAVIGATION VISIBILITY
  // ─────────────────────────────────────────────
  const [navVisibility, setNavVisibility] = useState<Record<string, boolean>>({
    introduction: true,
    history: true,
    visionMission: true,
    values: true,
    objectives: true,
    responsibilities: true,
    functionsServices: true,
    directorMessage: true,
    team: true,
    organizationalStructure: true,
    downloads: true,
    reportsPublications: true,
    newsletters: true,
  });
  const [isSavingNav, setIsSavingNav] = useState(false);

  // ─────────────────────────────────────────────
  // LOAD ALL DATA
  // ─────────────────────────────────────────────
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Introduction
      try {
        const introRes: any = await aboutUsContentApi.getIntroduction();
        if (introRes?.data) {
          const d = introRes.data;
          setIntroId(d._id || null);
          setIntroBadge(d.badge || emptyMultiLang());
          setIntroTitle(d.title || emptyMultiLang());
          setIntroSubtitle(d.subtitle || emptyMultiLang());
          setIntroOverviewTitle(d.overviewTitle || emptyMultiLang());
          setIntroOverviewHeading(d.overviewHeading || emptyMultiLang());
          setIntroParagraphs(Array.isArray(d.paragraphs) ? d.paragraphs : []);
          setIntroImage(d.image || "");
        }
      } catch (_) {}

      // 2. Director Message
      try {
        const dirRes: any = await aboutUsContentApi.getDirectorMessage();
        if (dirRes?.data) {
          const d = dirRes.data;
          setDirId(d._id || null);
          setDirBadge(d.badge || emptyMultiLang());
          setDirQuote(d.quote || emptyMultiLang());
          setDirName(d.directorName || emptyMultiLang());
          setDirRole(d.directorRole || emptyMultiLang());
          setDirImage(d.directorImage || "");
          setDirCredentials(Array.isArray(d.credentials) ? d.credentials : []);
          setDirParagraphs(Array.isArray(d.paragraphs) ? d.paragraphs : []);
          setDirSignoffName(d.signoffName || emptyMultiLang());
          setDirSignoffRole(d.signoffRole || emptyMultiLang());
        }
      } catch (_) {}

      // 3. Milestones
      try {
        const mRes: any = await aboutUsContentApi.getAllMilestones();
        if (mRes?.data) setMilestones(mRes.data);
      } catch (_) {}

      // 4. Values
      try {
        const vRes: any = await aboutUsContentApi.getAllCoreValues();
        if (vRes?.data) setCoreValues(vRes.data);
      } catch (_) {}

      // 5. Objectives
      try {
        const oRes: any = await aboutUsContentApi.getAllObjectives();
        if (oRes?.data) setObjectives(oRes.data);
      } catch (_) {}

      // 6. Responsibilities
      try {
        const rRes: any = await aboutUsContentApi.getAllResponsibilities();
        if (rRes?.data) setResponsibilities(rRes.data);
      } catch (_) {}

      // 7. Services
      try {
        const sRes: any = await aboutUsContentApi.getAllFunctionServices();
        if (sRes?.data) setServices(sRes.data);
      } catch (_) {}

      // 8. Team Members
      try {
        const tRes: any = await aboutUsContentApi.getAllTeamMembers();
        if (tRes?.data) setTeamMembers(tRes.data);
      } catch (_) {}

      // 9. Organizational Structure
      try {
        const orgRes: any = await aboutUsContentApi.getAllDivisions();
        if (orgRes?.data) setDivisions(orgRes.data);
      } catch (_) {}

      // 10. Navigation Visibility Config
      try {
        const navRes: any = await aboutUsContentApi.getNavConfig();
        if (navRes?.data) {
          setNavVisibility((prev) => ({ ...prev, ...navRes.data }));
        }
      } catch (_) {}
    } catch (err: any) {
      showAlert("Failed to load some About Us sections", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ─────────────────────────────────────────────
  // NAVIGATION VISIBILITY HANDLERS
  // ─────────────────────────────────────────────
  const handleToggleNavItem = (key: string, value: boolean) => {
    setNavVisibility((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleToggleCategory = (catItems: NavCategoryItem[], value: boolean) => {
    setNavVisibility((prev) => {
      const next = { ...prev };
      catItems.forEach((item) => {
        next[item.key] = value;
      });
      return next;
    });
  };

  const handleSetAllNavItems = (value: boolean) => {
    setNavVisibility((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = value;
      });
      return next;
    });
  };

  const handleSaveNavVisibility = async () => {
    setIsSavingNav(true);
    try {
      await aboutUsContentApi.updateNavConfig(navVisibility);
      showAlert("About Us navigation menu visibility updated successfully!", "success");
    } catch (err: any) {
      showAlert(err?.message || "Failed to update navigation visibility", "error");
    } finally {
      setIsSavingNav(false);
    }
  };

  // ─────────────────────────────────────────────
  // SAVE INTRODUCTION (Singleton)
  // ─────────────────────────────────────────────
  const handleSaveIntroduction = async () => {
    if (!introTitle[activeLang]?.trim() && !introTitle.en?.trim()) {
      showAlert("Please enter an introduction title in English or current language", "error");
      return;
    }
    setIsSaving(true);
    try {
      const payload: Partial<IntroductionData> = {
        badge: introBadge,
        title: introTitle,
        subtitle: introSubtitle,
        overviewTitle: introOverviewTitle,
        overviewHeading: introOverviewHeading,
        paragraphs: introParagraphs,
        image: introImage,
        isActive: true,
      };

      const res: any = await aboutUsContentApi.saveIntroduction(payload);
      if (res?.data?._id) setIntroId(res.data._id);
      showAlert("Introduction section saved successfully!", "success");
    } catch (err: any) {
      showAlert(err?.message || "Failed to save introduction", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Introduction Image
  const handleUploadIntroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingIntroImg(true);
    try {
      const res = await aboutUsContentApi.uploadMedia(file, "intro");
      if (res?.url) {
        setIntroImage(res.url);
        showAlert("Introduction image uploaded!", "success");
      }
    } catch (err: any) {
      showAlert("Failed to upload image", "error");
    } finally {
      setIsUploadingIntroImg(false);
      if (introFileInputRef.current) introFileInputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // SAVE DIRECTOR'S MESSAGE (Singleton)
  // ─────────────────────────────────────────────
  const handleSaveDirectorMessage = async () => {
    if (!dirQuote[activeLang]?.trim() && !dirQuote.en?.trim()) {
      showAlert("Please enter a director quote", "error");
      return;
    }
    setIsSaving(true);
    try {
      const payload: Partial<DirectorMessageData> = {
        badge: dirBadge,
        quote: dirQuote,
        directorName: dirName,
        directorRole: dirRole,
        directorImage: dirImage,
        credentials: dirCredentials,
        paragraphs: dirParagraphs,
        signoffName: dirSignoffName,
        signoffRole: dirSignoffRole,
        isActive: true,
      };

      const res: any = await aboutUsContentApi.saveDirectorMessage(payload);
      if (res?.data?._id) setDirId(res.data._id);
      showAlert("Director Message saved successfully!", "success");
    } catch (err: any) {
      showAlert(err?.message || "Failed to save director message", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Director Photo
  const handleUploadDirPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDirImg(true);
    try {
      const res = await aboutUsContentApi.uploadMedia(file, "director");
      if (res?.url) {
        setDirImage(res.url);
        showAlert("Director photo uploaded!", "success");
      }
    } catch (err: any) {
      showAlert("Failed to upload director photo", "error");
    } finally {
      setIsUploadingDirImg(false);
      if (dirFileInputRef.current) dirFileInputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // MILESTONES (Collection Handlers)
  // ─────────────────────────────────────────────
  const openMilestoneModal = (item?: HistoryMilestoneData) => {
    if (item) {
      setEditingMilestoneId(item._id || null);
      setMilestoneYear(item.year || "");
      setMilestoneTitle(item.title || emptyMultiLang());
      setMilestoneDesc(item.description || emptyMultiLang());
      setMilestoneOrder(item.order || 0);
      setMilestoneIsActive(item.isActive !== false);
    } else {
      setEditingMilestoneId(null);
      setMilestoneYear("");
      setMilestoneTitle(emptyMultiLang());
      setMilestoneDesc(emptyMultiLang());
      setMilestoneOrder(milestones.length);
      setMilestoneIsActive(true);
    }
    setMilestoneModalOpen(true);
  };

  const handleSaveMilestone = async () => {
    if (!milestoneYear.trim() || !milestoneTitle.en.trim()) {
      showAlert("Year and English title are required.", "error");
      return;
    }
    try {
      const payload: Partial<HistoryMilestoneData> = {
        year: milestoneYear,
        title: milestoneTitle,
        description: milestoneDesc,
        order: milestoneOrder,
        isActive: milestoneIsActive,
      };

      if (editingMilestoneId) {
        await aboutUsContentApi.updateMilestone(editingMilestoneId, payload);
        showAlert("Milestone updated!", "success");
      } else {
        await aboutUsContentApi.createMilestone(payload);
        showAlert("Milestone created!", "success");
      }
      setMilestoneModalOpen(false);
      const res: any = await aboutUsContentApi.getAllMilestones();
      if (res?.data) setMilestones(res.data);
    } catch (err: any) {
      showAlert(err?.message || "Failed to save milestone", "error");
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this milestone?")) return;
    try {
      await aboutUsContentApi.deleteMilestone(id);
      showAlert("Milestone deleted", "success");
      setMilestones((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      showAlert("Failed to delete milestone", "error");
    }
  };

  // ─────────────────────────────────────────────
  // CORE VALUES (Collection Handlers)
  // ─────────────────────────────────────────────
  const openValueModal = (item?: CoreValueData) => {
    if (item) {
      setEditingValueId(item._id || null);
      setValueTitle(item.title || emptyMultiLang());
      setValueDesc(item.description || emptyMultiLang());
      setValueIcon(item.icon || "Sparkles");
      setValueOrder(item.order || 0);
      setValueIsActive(item.isActive !== false);
    } else {
      setEditingValueId(null);
      setValueTitle(emptyMultiLang());
      setValueDesc(emptyMultiLang());
      setValueIcon("Sparkles");
      setValueOrder(coreValues.length);
      setValueIsActive(true);
    }
    setValueModalOpen(true);
  };

  const handleSaveValue = async () => {
    if (!valueTitle.en.trim() || !valueDesc.en.trim()) {
      showAlert("English title and description are required.", "error");
      return;
    }
    try {
      const payload: Partial<CoreValueData> = {
        title: valueTitle,
        description: valueDesc,
        icon: valueIcon,
        order: valueOrder,
        isActive: valueIsActive,
      };

      if (editingValueId) {
        await aboutUsContentApi.updateCoreValue(editingValueId, payload);
        showAlert("Core Value updated!", "success");
      } else {
        await aboutUsContentApi.createCoreValue(payload);
        showAlert("Core Value created!", "success");
      }
      setValueModalOpen(false);
      const res: any = await aboutUsContentApi.getAllCoreValues();
      if (res?.data) setCoreValues(res.data);
    } catch (err: any) {
      showAlert(err?.message || "Failed to save core value", "error");
    }
  };

  const handleDeleteValue = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this value?")) return;
    try {
      await aboutUsContentApi.deleteCoreValue(id);
      showAlert("Core Value deleted", "success");
      setCoreValues((prev) => prev.filter((v) => v._id !== id));
    } catch (err: any) {
      showAlert("Failed to delete core value", "error");
    }
  };

  // ─────────────────────────────────────────────
  // OBJECTIVES (Collection Handlers)
  // ─────────────────────────────────────────────
  const openObjModal = (item?: ObjectiveData) => {
    if (item) {
      setEditingObjId(item._id || null);
      setObjBadge(item.badge || emptyMultiLang());
      setObjTitle(item.title || emptyMultiLang());
      setObjDesc(item.description || emptyMultiLang());
      setObjIcon(item.icon || "Target");
      setObjOrder(item.order || 0);
      setObjIsActive(item.isActive !== false);
    } else {
      setEditingObjId(null);
      setObjBadge(emptyMultiLang());
      setObjTitle(emptyMultiLang());
      setObjDesc(emptyMultiLang());
      setObjIcon("Target");
      setObjOrder(objectives.length);
      setObjIsActive(true);
    }
    setObjModalOpen(true);
  };

  const handleSaveObjective = async () => {
    if (!objTitle.en.trim() || !objDesc.en.trim()) {
      showAlert("English title and description are required.", "error");
      return;
    }
    try {
      const payload: Partial<ObjectiveData> = {
        badge: objBadge,
        title: objTitle,
        description: objDesc,
        icon: objIcon,
        order: objOrder,
        isActive: objIsActive,
      };

      if (editingObjId) {
        await aboutUsContentApi.updateObjective(editingObjId, payload);
        showAlert("Objective updated!", "success");
      } else {
        await aboutUsContentApi.createObjective(payload);
        showAlert("Objective created!", "success");
      }
      setObjModalOpen(false);
      const res: any = await aboutUsContentApi.getAllObjectives();
      if (res?.data) setObjectives(res.data);
    } catch (err: any) {
      showAlert(err?.message || "Failed to save objective", "error");
    }
  };

  const handleDeleteObjective = async (id: string) => {
    if (!window.confirm("Delete this objective?")) return;
    try {
      await aboutUsContentApi.deleteObjective(id);
      showAlert("Objective deleted", "success");
      setObjectives((prev) => prev.filter((o) => o._id !== id));
    } catch (err: any) {
      showAlert("Failed to delete objective", "error");
    }
  };

  // ─────────────────────────────────────────────
  // RESPONSIBILITIES (Collection Handlers)
  // ─────────────────────────────────────────────
  const openRespModal = (item?: ResponsibilityData) => {
    if (item) {
      setEditingRespId(item._id || null);
      setRespSection(item.section || emptyMultiLang());
      setRespTitle(item.title || emptyMultiLang());
      setRespPoints(Array.isArray(item.points) ? item.points : []);
      setRespIcon(item.icon || "ShieldCheck");
      setRespOrder(item.order || 0);
      setRespIsActive(item.isActive !== false);
    } else {
      setEditingRespId(null);
      setRespSection(emptyMultiLang());
      setRespTitle(emptyMultiLang());
      setRespPoints([]);
      setRespIcon("ShieldCheck");
      setRespOrder(responsibilities.length);
      setRespIsActive(true);
    }
    setRespModalOpen(true);
  };

  const handleSaveResponsibility = async () => {
    if (!respTitle.en.trim()) {
      showAlert("English title is required.", "error");
      return;
    }
    try {
      const payload: Partial<ResponsibilityData> = {
        section: respSection,
        title: respTitle,
        points: respPoints,
        icon: respIcon,
        order: respOrder,
        isActive: respIsActive,
      };

      if (editingRespId) {
        await aboutUsContentApi.updateResponsibility(editingRespId, payload);
        showAlert("Responsibility mandate updated!", "success");
      } else {
        await aboutUsContentApi.createResponsibility(payload);
        showAlert("Responsibility mandate created!", "success");
      }
      setRespModalOpen(false);
      const res: any = await aboutUsContentApi.getAllResponsibilities();
      if (res?.data) setResponsibilities(res.data);
    } catch (err: any) {
      showAlert(err?.message || "Failed to save responsibility", "error");
    }
  };

  const handleDeleteResponsibility = async (id: string) => {
    if (!window.confirm("Delete this responsibility mandate?")) return;
    try {
      await aboutUsContentApi.deleteResponsibility(id);
      showAlert("Responsibility deleted", "success");
      setResponsibilities((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      showAlert("Failed to delete responsibility", "error");
    }
  };

  // ─────────────────────────────────────────────
  // TEAM MEMBERS (Collection Handlers)
  // ─────────────────────────────────────────────
  const openMemberModal = (item?: TeamMemberData) => {
    if (item) {
      setEditingMemberId(item._id || null);
      setMemberName(item.name || emptyMultiLang());
      setMemberRole(item.role || emptyMultiLang());
      setMemberDivision(item.division || emptyMultiLang());
      setMemberBio(item.bio || emptyMultiLang());
      setMemberInitials(item.initials || "");
      setMemberColor(item.color || "from-purple-600 to-pink-600");
      setMemberPhone(item.phone || "");
      setMemberEmail(item.email || "");
      setMemberLinkedin(item.linkedin || "");
      setMemberImage(item.image || "");
      setMemberOrder(item.order || 0);
      setMemberIsActive(item.isActive !== false);
    } else {
      setEditingMemberId(null);
      setMemberName(emptyMultiLang());
      setMemberRole(emptyMultiLang());
      setMemberDivision(emptyMultiLang());
      setMemberBio(emptyMultiLang());
      setMemberInitials("");
      setMemberColor("from-purple-600 to-pink-600");
      setMemberPhone("");
      setMemberEmail("");
      setMemberLinkedin("");
      setMemberImage("");
      setMemberOrder(teamMembers.length);
      setMemberIsActive(true);
    }
    setMemberModalOpen(true);
  };

  const handleSaveMember = async () => {
    if (!memberName.en.trim() || !memberRole.en.trim()) {
      showAlert("English name and role are required.", "error");
      return;
    }
    try {
      const payload: Partial<TeamMemberData> = {
        name: memberName,
        role: memberRole,
        division: memberDivision,
        bio: memberBio,
        initials: memberInitials,
        color: memberColor,
        phone: memberPhone,
        email: memberEmail,
        linkedin: memberLinkedin,
        image: memberImage,
        order: memberOrder,
        isActive: memberIsActive,
      };

      if (editingMemberId) {
        await aboutUsContentApi.updateTeamMember(editingMemberId, payload);
        showAlert("Team member updated!", "success");
      } else {
        await aboutUsContentApi.createTeamMember(payload);
        showAlert("Team member added!", "success");
      }
      setMemberModalOpen(false);
      const res: any = await aboutUsContentApi.getAllTeamMembers();
      if (res?.data) setTeamMembers(res.data);
    } catch (err: any) {
      showAlert(err?.message || "Failed to save team member", "error");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm("Delete this team member?")) return;
    try {
      await aboutUsContentApi.deleteTeamMember(id);
      showAlert("Team member deleted", "success");
      setTeamMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      showAlert("Failed to delete team member", "error");
    }
  };

  const handleUploadMemberPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMemberPhoto(true);
    try {
      const res = await aboutUsContentApi.uploadMedia(file, "team");
      if (res?.url) {
        setMemberImage(res.url);
        showAlert("Member photo uploaded!", "success");
      }
    } catch (err: any) {
      showAlert("Failed to upload photo", "error");
    } finally {
      setIsUploadingMemberPhoto(false);
      if (teamPhotoInputRef.current) teamPhotoInputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <Box className="space-y-6">
      {/* Page Header */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div>
          <Typography variant="h5" className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Building className="text-primary" size={26} />
            About Us Content Management
          </Typography>
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400 mt-1">
            Configure, translate, and manage all About Us sections across English, Sinhala, and Tamil.
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-700/60 p-1 rounded-xl">
            {LANG_CONFIG.map((lang) => (
              <button
                key={lang.key}
                onClick={() => setActiveLang(lang.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeLang === lang.key
                    ? "bg-white dark:bg-slate-900 text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <Button
            variant="outlined"
            onClick={loadAllData}
            startIcon={<RefreshCw size={16} />}
            disabled={isLoading}
            size="small"
            sx={{ borderRadius: "10px", textTransform: "none" }}
          >
            Refresh
          </Button>
        </div>
      </Box>

      {/* Tabs Navigation */}
      <Paper elevation={0} className="rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: "background.paper",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 52 },
          }}
        >
          <Tab icon={<BookOpen size={18} />} iconPosition="start" label="Introduction" />
          <Tab icon={<Quote size={18} />} iconPosition="start" label="Director Message" />
          <Tab icon={<Sparkles size={18} />} iconPosition="start" label="Our History" />
          <Tab icon={<Shield size={18} />} iconPosition="start" label="Core Values" />
          <Tab icon={<Target size={18} />} iconPosition="start" label="Objectives" />
          <Tab icon={<Layers size={18} />} iconPosition="start" label="Responsibilities" />
          <Tab icon={<Users2 size={18} />} iconPosition="start" label="Team Members" />
          <Tab icon={<Compass size={18} />} iconPosition="start" label="Navigation Visibility" />
        </Tabs>
      </Paper>

      {isLoading ? (
        <Box className="flex justify-center items-center py-24">
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Box>
          {/* TAB 0: INTRODUCTION (Singleton) */}
          {activeTab === 0 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">Introduction Section</h3>
                  <p className="text-xs text-gray-500">Edit the apex intro banner, titles, and paragraphs.</p>
                </div>
                <Button
                  variant="contained"
                  startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                  onClick={handleSaveIntroduction}
                  disabled={isSaving}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Save Introduction
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  fullWidth
                  label={`Badge (${activeLang.toUpperCase()})`}
                  value={introBadge[activeLang] || ""}
                  onChange={(e) => setIntroBadge({ ...introBadge, [activeLang]: e.target.value })}
                  placeholder="e.g. Who We Are"
                  size="small"
                />
                <TextField
                  fullWidth
                  label={`Main Title (${activeLang.toUpperCase()})`}
                  value={introTitle[activeLang] || ""}
                  onChange={(e) => setIntroTitle({ ...introTitle, [activeLang]: e.target.value })}
                  placeholder="e.g. Introduction"
                  size="small"
                  required
                />
                <TextField
                  fullWidth
                  label={`Subtitle (${activeLang.toUpperCase()})`}
                  value={introSubtitle[activeLang] || ""}
                  onChange={(e) => setIntroSubtitle({ ...introSubtitle, [activeLang]: e.target.value })}
                  placeholder="Hero subtitle summary..."
                  size="small"
                  className="md:col-span-2"
                />
                <TextField
                  fullWidth
                  label={`Overview Section Title (${activeLang.toUpperCase()})`}
                  value={introOverviewTitle[activeLang] || ""}
                  onChange={(e) => setIntroOverviewTitle({ ...introOverviewTitle, [activeLang]: e.target.value })}
                  placeholder="e.g. Overview & Purpose"
                  size="small"
                />
                <TextField
                  fullWidth
                  label={`Overview Main Heading (${activeLang.toUpperCase()})`}
                  value={introOverviewHeading[activeLang] || ""}
                  onChange={(e) => setIntroOverviewHeading({ ...introOverviewHeading, [activeLang]: e.target.value })}
                  placeholder="e.g. Pioneering Sri Lanka's R&D Commercial Ecosystem"
                  size="small"
                />
              </div>

              {/* Image Upload for Introduction */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" />
                    Introduction Banner Image
                  </span>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={isUploadingIntroImg ? <CircularProgress size={14} /> : <Upload size={14} />}
                    onClick={() => introFileInputRef.current?.click()}
                    disabled={isUploadingIntroImg}
                  >
                    Upload Photo
                  </Button>
                  <input
                    ref={introFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadIntroImage}
                  />
                </div>
                {introImage ? (
                  <div className="flex items-center gap-4">
                    <img src={introImage} alt="Intro preview" className="w-32 h-20 object-cover rounded-xl border" />
                    <span className="text-xs text-gray-500 break-all">{introImage}</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No image uploaded yet.</p>
                )}
              </div>

              {/* Paragraphs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold">Body Paragraphs ({introParagraphs.length})</h4>
                  <Button
                    size="small"
                    startIcon={<Plus size={14} />}
                    onClick={() => setIntroParagraphs([...introParagraphs, emptyMultiLang()])}
                  >
                    Add Paragraph
                  </Button>
                </div>
                {introParagraphs.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      label={`Paragraph ${idx + 1} (${activeLang.toUpperCase()})`}
                      value={p[activeLang] || ""}
                      onChange={(e) => {
                        const updated = [...introParagraphs];
                        updated[idx] = { ...updated[idx], [activeLang]: e.target.value };
                        setIntroParagraphs(updated);
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => setIntroParagraphs(introParagraphs.filter((_, i) => i !== idx))}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Paper>
          )}

          {/* TAB 1: DIRECTOR'S MESSAGE (Singleton) */}
          {activeTab === 1 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">Director's Message Section</h3>
                  <p className="text-xs text-gray-500">Edit the Director General statement, photo, and letter body.</p>
                </div>
                <Button
                  variant="contained"
                  startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                  onClick={handleSaveDirectorMessage}
                  disabled={isSaving}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Save Message
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  fullWidth
                  label={`Badge (${activeLang.toUpperCase()})`}
                  value={dirBadge[activeLang] || ""}
                  onChange={(e) => setDirBadge({ ...dirBadge, [activeLang]: e.target.value })}
                  placeholder="e.g. Leadership"
                  size="small"
                />
                <TextField
                  fullWidth
                  label={`Director Name (${activeLang.toUpperCase()})`}
                  value={dirName[activeLang] || ""}
                  onChange={(e) => setDirName({ ...dirName, [activeLang]: e.target.value })}
                  placeholder="e.g. Dr. Kalinga Wickramasinghe"
                  size="small"
                />
                <TextField
                  fullWidth
                  label={`Director Role (${activeLang.toUpperCase()})`}
                  value={dirRole[activeLang] || ""}
                  onChange={(e) => setDirRole({ ...dirRole, [activeLang]: e.target.value })}
                  placeholder="e.g. Director General, NIRDC"
                  size="small"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={`Key Quote (${activeLang.toUpperCase()})`}
                  value={dirQuote[activeLang] || ""}
                  onChange={(e) => setDirQuote({ ...dirQuote, [activeLang]: e.target.value })}
                  placeholder="Quote highlighted in callout banner..."
                  size="small"
                  className="md:col-span-2"
                  required
                />
              </div>

              {/* Director Photo Upload */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon size={18} className="text-primary" />
                    Director Photo
                  </span>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={isUploadingDirImg ? <CircularProgress size={14} /> : <Upload size={14} />}
                    onClick={() => dirFileInputRef.current?.click()}
                    disabled={isUploadingDirImg}
                  >
                    Upload Photo
                  </Button>
                  <input
                    ref={dirFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadDirPhoto}
                  />
                </div>
                {dirImage ? (
                  <div className="flex items-center gap-4">
                    <img src={dirImage} alt="Director preview" className="w-20 h-20 object-cover rounded-full border" />
                    <span className="text-xs text-gray-500 break-all">{dirImage}</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No photo uploaded yet.</p>
                )}
              </div>

              {/* Message Paragraphs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold">Letter Paragraphs ({dirParagraphs.length})</h4>
                  <Button
                    size="small"
                    startIcon={<Plus size={14} />}
                    onClick={() => setDirParagraphs([...dirParagraphs, emptyMultiLang()])}
                  >
                    Add Paragraph
                  </Button>
                </div>
                {dirParagraphs.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      label={`Paragraph ${idx + 1} (${activeLang.toUpperCase()})`}
                      value={p[activeLang] || ""}
                      onChange={(e) => {
                        const updated = [...dirParagraphs];
                        updated[idx] = { ...updated[idx], [activeLang]: e.target.value };
                        setDirParagraphs(updated);
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => setDirParagraphs(dirParagraphs.filter((_, i) => i !== idx))}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Paper>
          )}

          {/* TAB 2: OUR HISTORY (Collection) */}
          {activeTab === 2 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">Our History Timeline Milestones</h3>
                  <p className="text-xs text-gray-500">Manage chronologically ordered milestones and achievements.</p>
                </div>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => openMilestoneModal()}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Add Milestone
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestones.map((m) => (
                  <Card key={m._id} className="rounded-xl border border-gray-200 shadow-none hover:shadow-sm transition-all">
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Chip label={m.year} color="primary" size="small" className="font-bold" />
                        <div className="flex gap-1">
                          <IconButton size="small" onClick={() => openMilestoneModal(m)}>
                            <Edit size={16} />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => m._id && handleDeleteMilestone(m._id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                      <h4 className="font-bold text-base leading-snug">{m.title[activeLang] || m.title.en}</h4>
                      <p className="text-xs text-gray-500 line-clamp-3">{m.description[activeLang] || m.description.en}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Paper>
          )}

          {/* TAB 3: CORE VALUES (Collection) */}
          {activeTab === 3 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">Core Values</h3>
                  <p className="text-xs text-gray-500">Manage values displayed on the Our Values page.</p>
                </div>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => openValueModal()}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Add Value
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreValues.map((v) => (
                  <Card key={v._id} className="rounded-xl border border-gray-200 shadow-none hover:shadow-sm transition-all">
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Chip label={v.icon || "Sparkles"} size="small" variant="outlined" />
                        <div className="flex gap-1">
                          <IconButton size="small" onClick={() => openValueModal(v)}>
                            <Edit size={16} />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => v._id && handleDeleteValue(v._id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                      <h4 className="font-bold text-base leading-snug">{v.title[activeLang] || v.title.en}</h4>
                      <p className="text-xs text-gray-500 line-clamp-3">{v.description[activeLang] || v.description.en}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Paper>
          )}

          {/* TAB 4: OBJECTIVES (Collection) */}
          {activeTab === 4 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">Strategic Objectives</h3>
                  <p className="text-xs text-gray-500">Manage strategic targets with category badges.</p>
                </div>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => openObjModal()}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Add Objective
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {objectives.map((o) => (
                  <Card key={o._id} className="rounded-xl border border-gray-200 shadow-none hover:shadow-sm transition-all">
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Chip label={o.badge?.[activeLang] || o.badge?.en || "Target"} size="small" color="primary" />
                        <div className="flex gap-1">
                          <IconButton size="small" onClick={() => openObjModal(o)}>
                            <Edit size={16} />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => o._id && handleDeleteObjective(o._id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                      <h4 className="font-bold text-base leading-snug">{o.title[activeLang] || o.title.en}</h4>
                      <p className="text-xs text-gray-500 line-clamp-3">{o.description[activeLang] || o.description.en}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Paper>
          )}

          {/* TAB 5: RESPONSIBILITIES (Collection) */}
          {activeTab === 5 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">Responsibilities & Mandates</h3>
                  <p className="text-xs text-gray-500">Manage the statutory mandate accordion blocks.</p>
                </div>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => openRespModal()}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Add Mandate
                </Button>
              </div>

              <div className="space-y-4">
                {responsibilities.map((r) => (
                  <div key={r._id} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-primary">{r.section?.[activeLang] || r.section?.en || "Mandate"}</span>
                      <h4 className="font-bold text-base">{r.title[activeLang] || r.title.en}</h4>
                      <p className="text-xs text-gray-500">{r.points?.length || 0} key duty bullet points</p>
                    </div>
                    <div className="flex gap-1">
                      <IconButton size="small" onClick={() => openRespModal(r)}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => r._id && handleDeleteResponsibility(r._id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </Paper>
          )}

          {/* TAB 6: TEAM MEMBERS (Collection) */}
          {activeTab === 6 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="text-lg font-bold">Team Members</h3>
                  <p className="text-xs text-gray-500">Manage leadership profiles, direct phone numbers, email, and LinkedIn links.</p>
                </div>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => openMemberModal()}
                  sx={{ borderRadius: "10px", textTransform: "none" }}
                >
                  Add Member
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((m) => (
                  <Card key={m._id} className="rounded-2xl border border-gray-200 shadow-none hover:shadow-sm transition-all overflow-hidden">
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {m.image ? (
                            <img src={m.image} alt={m.name.en} className="w-12 h-12 rounded-xl object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold flex items-center justify-center text-sm">
                              {m.initials || "TM"}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-sm leading-tight">{m.name[activeLang] || m.name.en}</h4>
                            <p className="text-xs text-primary font-medium">{m.role[activeLang] || m.role.en}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <IconButton size="small" onClick={() => openMemberModal(m)}>
                            <Edit size={16} />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => m._id && handleDeleteMember(m._id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2">{m.bio[activeLang] || m.bio.en}</p>

                      <div className="pt-2 border-t flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          {m.phone && <span title={m.phone}><Phone size={14} className="text-gray-600" /></span>}
                          {m.email && <span title={m.email}><Mail size={14} className="text-gray-600" /></span>}
                          {m.linkedin && <span title={m.linkedin}><Linkedin size={14} className="text-gray-600" /></span>}
                        </div>
                        <span className="text-[11px] font-semibold">{m.division?.[activeLang] || m.division?.en || "Executive"}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Paper>
          )}

          {/* TAB 7: NAVIGATION VISIBILITY */}
          {activeTab === 7 && (
            <Paper className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Compass className="text-primary" size={22} />
                    About Us Navigation Visibility
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Turn individual links ON or OFF in the public header 'About Us' mega-menu and mobile accordion.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Eye size={15} />}
                    onClick={() => handleSetAllNavItems(true)}
                    sx={{ borderRadius: "10px", textTransform: "none", fontSize: "12px" }}
                  >
                    Show All
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="inherit"
                    startIcon={<EyeOff size={15} />}
                    onClick={() => handleSetAllNavItems(false)}
                    sx={{ borderRadius: "10px", textTransform: "none", fontSize: "12px" }}
                  >
                    Hide All
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={isSavingNav ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                    onClick={handleSaveNavVisibility}
                    disabled={isSavingNav}
                    sx={{ borderRadius: "10px", textTransform: "none", px: 2.5 }}
                  >
                    Save Visibility Settings
                  </Button>
                </div>
              </div>

              {/* Metric Overview Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200/60 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block">Total Nav Links</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      {NAV_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0)}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Menu size={20} />
                  </div>
                </div>

                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-semibold block">Visible in Nav</span>
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                      {NAV_CATEGORIES.reduce(
                        (acc, cat) => acc + cat.items.filter((it) => navVisibility[it.key] !== false).length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Eye size={20} />
                  </div>
                </div>

                <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200/60 dark:border-rose-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-rose-700 dark:text-rose-400 uppercase tracking-wider font-semibold block">Hidden from Nav</span>
                    <span className="text-2xl font-black text-rose-700 dark:text-rose-300">
                      {NAV_CATEGORIES.reduce(
                        (acc, cat) => acc + cat.items.filter((it) => navVisibility[it.key] === false).length,
                        0
                      )}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <EyeOff size={20} />
                  </div>
                </div>
              </div>

              {/* 4 Category Groups */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {NAV_CATEGORIES.map((catGroup) => {
                  const visibleCount = catGroup.items.filter((it) => navVisibility[it.key] !== false).length;
                  const allVisible = visibleCount === catGroup.items.length;
                  const allHidden = visibleCount === 0;

                  return (
                    <Card
                      key={catGroup.category}
                      className="rounded-2xl border border-gray-200 dark:border-white/5 shadow-none overflow-hidden transition-all hover:border-primary/30"
                    >
                      {/* Category Header */}
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800/80 dark:to-slate-800/40 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                              {catGroup.category}
                            </h4>
                            <Chip
                              label={`${visibleCount}/${catGroup.items.length} Visible`}
                              size="small"
                              color={allVisible ? "success" : allHidden ? "default" : "primary"}
                              sx={{ height: 22, fontSize: "11px", fontWeight: 700 }}
                            />
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{catGroup.description}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="small"
                            onClick={() => handleToggleCategory(catGroup.items, true)}
                            disabled={allVisible}
                            sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: "11px", textTransform: "none" }}
                          >
                            All
                          </Button>
                          <span className="text-gray-300">|</span>
                          <Button
                            size="small"
                            color="inherit"
                            onClick={() => handleToggleCategory(catGroup.items, false)}
                            disabled={allHidden}
                            sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: "11px", textTransform: "none" }}
                          >
                            None
                          </Button>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="p-4 divide-y divide-gray-100 dark:divide-white/5 space-y-3">
                        {catGroup.items.map((item) => {
                          const isVisible = navVisibility[item.key] !== false;

                          return (
                            <div
                              key={item.key}
                              className="pt-3 first:pt-0 flex items-center justify-between gap-4 group"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                    {item.label}
                                  </span>
                                  <code className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {item.path}
                                  </code>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                                  {item.desc}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                                    isVisible
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                                      : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400 border border-gray-200 dark:border-slate-700"
                                  }`}
                                >
                                  {isVisible ? (
                                    <>
                                      <CheckCircle2 size={11} /> Visible
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff size={11} /> Hidden
                                    </>
                                  )}
                                </span>

                                <Switch
                                  checked={isVisible}
                                  onChange={(e) => handleToggleNavItem(item.key, e.target.checked)}
                                  color="primary"
                                  size="medium"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Live Simulated Mega Menu Preview */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Eye size={16} className="text-primary" />
                      Live Public Navigation Preview
                    </h4>
                    <p className="text-xs text-gray-500">
                      Preview of how the 'About Us' dropdown currently appears to public visitors.
                    </p>
                  </div>
                  <Chip
                    label="Simulated Header Output"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "11px" }}
                  />
                </div>

                <div
                  className="rounded-2xl p-6 overflow-hidden relative shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                    color: "#ffffff",
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {NAV_CATEGORIES.map((cat) => {
                      const visibleCatItems = cat.items.filter((it) => navVisibility[it.key] !== false);

                      if (visibleCatItems.length === 0) {
                        return (
                          <div
                            key={cat.category}
                            className="rounded-xl border border-dashed border-white/10 p-4 text-center opacity-40"
                          >
                            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">
                              {cat.category}
                            </p>
                            <p className="text-[11px] text-white/40">Entire column hidden</p>
                          </div>
                        );
                      }

                      return (
                        <div key={cat.category} className="space-y-3">
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/20 pb-2">
                            {cat.category}
                          </h5>
                          <ul className="space-y-2">
                            {visibleCatItems.map((item) => (
                              <li
                                key={item.key}
                                className="text-xs text-white/80 flex items-center gap-2 hover:text-white transition-colors"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{item.label}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Paper>
          )}
        </Box>
      )}

      {/* ─────────────────────────────────────────────
          MODAL: HISTORY MILESTONE
      ───────────────────────────────────────────── */}
      <Dialog open={milestoneModalOpen} onClose={() => setMilestoneModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMilestoneId ? "Edit Milestone" : "Add New Milestone"}</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="Year / Period"
            placeholder="e.g. 2020 or 2025 & Beyond"
            value={milestoneYear}
            onChange={(e) => setMilestoneYear(e.target.value)}
            size="small"
            required
          />
          <TextField
            fullWidth
            label={`Title (${activeLang.toUpperCase()})`}
            value={milestoneTitle[activeLang] || ""}
            onChange={(e) => setMilestoneTitle({ ...milestoneTitle, [activeLang]: e.target.value })}
            size="small"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label={`Description (${activeLang.toUpperCase()})`}
            value={milestoneDesc[activeLang] || ""}
            onChange={(e) => setMilestoneDesc({ ...milestoneDesc, [activeLang]: e.target.value })}
            size="small"
          />
          <div className="flex items-center justify-between">
            <TextField
              type="number"
              label="Display Order"
              value={milestoneOrder}
              onChange={(e) => setMilestoneOrder(Number(e.target.value))}
              size="small"
              sx={{ width: 140 }}
            />
            <FormControlLabel
              control={<Switch checked={milestoneIsActive} onChange={(e) => setMilestoneIsActive(e.target.checked)} />}
              label="Active"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMilestoneModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMilestone}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ─────────────────────────────────────────────
          MODAL: CORE VALUE
      ───────────────────────────────────────────── */}
      <Dialog open={valueModalOpen} onClose={() => setValueModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingValueId ? "Edit Core Value" : "Add Core Value"}</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label={`Title (${activeLang.toUpperCase()})`}
            value={valueTitle[activeLang] || ""}
            onChange={(e) => setValueTitle({ ...valueTitle, [activeLang]: e.target.value })}
            size="small"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label={`Description (${activeLang.toUpperCase()})`}
            value={valueDesc[activeLang] || ""}
            onChange={(e) => setValueDesc({ ...valueDesc, [activeLang]: e.target.value })}
            size="small"
            required
          />
          <TextField
            fullWidth
            label="Icon Name (e.g. Sparkles, Shield, Leaf, HeartHandshake)"
            value={valueIcon}
            onChange={(e) => setValueIcon(e.target.value)}
            size="small"
          />
          <div className="flex items-center justify-between">
            <TextField
              type="number"
              label="Display Order"
              value={valueOrder}
              onChange={(e) => setValueOrder(Number(e.target.value))}
              size="small"
              sx={{ width: 140 }}
            />
            <FormControlLabel
              control={<Switch checked={valueIsActive} onChange={(e) => setValueIsActive(e.target.checked)} />}
              label="Active"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setValueModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveValue}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ─────────────────────────────────────────────
          MODAL: OBJECTIVE
      ───────────────────────────────────────────── */}
      <Dialog open={objModalOpen} onClose={() => setObjModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingObjId ? "Edit Objective" : "Add Objective"}</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label={`Category Badge (${activeLang.toUpperCase()})`}
            placeholder="e.g. Economic Growth"
            value={objBadge[activeLang] || ""}
            onChange={(e) => setObjBadge({ ...objBadge, [activeLang]: e.target.value })}
            size="small"
          />
          <TextField
            fullWidth
            label={`Title (${activeLang.toUpperCase()})`}
            value={objTitle[activeLang] || ""}
            onChange={(e) => setObjTitle({ ...objTitle, [activeLang]: e.target.value })}
            size="small"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label={`Description (${activeLang.toUpperCase()})`}
            value={objDesc[activeLang] || ""}
            onChange={(e) => setObjDesc({ ...objDesc, [activeLang]: e.target.value })}
            size="small"
            required
          />
          <TextField
            fullWidth
            label="Icon Name (e.g. Target, TrendingUp, Cpu, Briefcase)"
            value={objIcon}
            onChange={(e) => setObjIcon(e.target.value)}
            size="small"
          />
          <div className="flex items-center justify-between">
            <TextField
              type="number"
              label="Display Order"
              value={objOrder}
              onChange={(e) => setObjOrder(Number(e.target.value))}
              size="small"
              sx={{ width: 140 }}
            />
            <FormControlLabel
              control={<Switch checked={objIsActive} onChange={(e) => setObjIsActive(e.target.checked)} />}
              label="Active"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setObjModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveObjective}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ─────────────────────────────────────────────
          MODAL: RESPONSIBILITY
      ───────────────────────────────────────────── */}
      <Dialog open={respModalOpen} onClose={() => setRespModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRespId ? "Edit Mandate" : "Add Responsibility Mandate"}</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label={`Mandate Section Tag (${activeLang.toUpperCase()})`}
            placeholder="e.g. Mandate 01"
            value={respSection[activeLang] || ""}
            onChange={(e) => setRespSection({ ...respSection, [activeLang]: e.target.value })}
            size="small"
          />
          <TextField
            fullWidth
            label={`Mandate Title (${activeLang.toUpperCase()})`}
            value={respTitle[activeLang] || ""}
            onChange={(e) => setRespTitle({ ...respTitle, [activeLang]: e.target.value })}
            size="small"
            required
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Duty Bullet Points ({respPoints.length})</span>
              <Button size="small" onClick={() => setRespPoints([...respPoints, emptyMultiLang()])}>
                Add Point
              </Button>
            </div>
            {respPoints.map((pt, i) => (
              <div key={i} className="flex gap-2">
                <TextField
                  fullWidth
                  size="small"
                  label={`Point ${i + 1} (${activeLang.toUpperCase()})`}
                  value={pt[activeLang] || ""}
                  onChange={(e) => {
                    const updated = [...respPoints];
                    updated[i] = { ...updated[i], [activeLang]: e.target.value };
                    setRespPoints(updated);
                  }}
                />
                <IconButton color="error" onClick={() => setRespPoints(respPoints.filter((_, idx) => idx !== i))}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <TextField
              type="number"
              label="Display Order"
              value={respOrder}
              onChange={(e) => setRespOrder(Number(e.target.value))}
              size="small"
              sx={{ width: 140 }}
            />
            <FormControlLabel
              control={<Switch checked={respIsActive} onChange={(e) => setRespIsActive(e.target.checked)} />}
              label="Active"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRespModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveResponsibility}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ─────────────────────────────────────────────
          MODAL: TEAM MEMBER
      ───────────────────────────────────────────── */}
      <Dialog open={memberModalOpen} onClose={() => setMemberModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingMemberId ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label={`Full Name (${activeLang.toUpperCase()})`}
              value={memberName[activeLang] || ""}
              onChange={(e) => setMemberName({ ...memberName, [activeLang]: e.target.value })}
              size="small"
              required
            />
            <TextField
              fullWidth
              label={`Designation/Role (${activeLang.toUpperCase()})`}
              value={memberRole[activeLang] || ""}
              onChange={(e) => setMemberRole({ ...memberRole, [activeLang]: e.target.value })}
              size="small"
              required
            />
            <TextField
              fullWidth
              label={`Division / Directorate (${activeLang.toUpperCase()})`}
              value={memberDivision[activeLang] || ""}
              onChange={(e) => setMemberDivision({ ...memberDivision, [activeLang]: e.target.value })}
              size="small"
            />
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="+94 11 267 8901"
              value={memberPhone}
              onChange={(e) => setMemberPhone(e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Email Address"
              placeholder="dg@nirdc.gov.lk"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              value={memberLinkedin}
              onChange={(e) => setMemberLinkedin(e.target.value)}
              size="small"
            />
          </div>

          <TextField
            fullWidth
            multiline
            rows={3}
            label={`Bio (${activeLang.toUpperCase()})`}
            value={memberBio[activeLang] || ""}
            onChange={(e) => setMemberBio({ ...memberBio, [activeLang]: e.target.value })}
            size="small"
          />

          {/* Member Photo Upload */}
          <div className="p-3 rounded-xl border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {memberImage ? (
                <img src={memberImage} alt="Member preview" className="w-12 h-12 rounded-xl object-cover border" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                  <ImageIcon size={20} className="text-gray-400" />
                </div>
              )}
              <div>
                <span className="text-xs font-semibold block">Member Profile Photo</span>
                <span className="text-[11px] text-gray-400">JPG, PNG, WebP supported</span>
              </div>
            </div>
            <Button
              variant="outlined"
              size="small"
              startIcon={isUploadingMemberPhoto ? <CircularProgress size={12} /> : <Upload size={12} />}
              onClick={() => teamPhotoInputRef.current?.click()}
              disabled={isUploadingMemberPhoto}
            >
              Upload Photo
            </Button>
            <input
              ref={teamPhotoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadMemberPhoto}
            />
          </div>

          <div className="flex items-center justify-between">
            <TextField
              type="number"
              label="Display Order"
              value={memberOrder}
              onChange={(e) => setMemberOrder(Number(e.target.value))}
              size="small"
              sx={{ width: 140 }}
            />
            <FormControlLabel
              control={<Switch checked={memberIsActive} onChange={(e) => setMemberIsActive(e.target.checked)} />}
              label="Active"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMemberModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMember}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
