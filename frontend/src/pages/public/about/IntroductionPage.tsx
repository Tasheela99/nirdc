import React, { useState, useEffect } from "react";
import PageHero from "@/components/common/PageHero";
import VisionMissionSection from "../home/VisionMissionSection";
import aboutUsContentApi, {
  ObjectiveData,
  ResponsibilityData,
  CoreValueData,
  getMultiLangText,
} from "@/api/AboutUsContentApi";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  DollarSign,
  Scale,
  ShieldCheck,
  Users,
  Building,
  FileText,
  ChevronDown,
  CheckCircle,
  HeartHandshake,
  Leaf,
  Award,
  LucideIcon,
} from "lucide-react";

// Lucide icon mapping
const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  Scale,
  ShieldCheck,
  Users,
  Building,
  FileText,
  Sparkles,
  HeartHandshake,
  CheckCircle,
  Leaf,
  Award,
};

// Default Objectives with multi-lang support
const defaultObjectivesList = [
  {
    badge: { en: "Economic Growth", si: "ආර්ථික වර්ධනය", ta: "பொருளாதார வளர்ச்சி" },
    title: {
      en: "Accelerate R&D Commercialisation",
      si: "පර්යේෂණ හා සංවර්ධන වාණිජකරණය කඩිනම් කිරීම",
      ta: "ஆராய்ச்சி வர்த்தகமயமாக்கலை விரைவுபடுத்துதல்",
    },
    description: {
      en: "Transition over 200 high-potential university and institute-backed technologies into viable commercial businesses over the next 5 years.",
      si: "ඉදිරි වසර 5 තුළ විශ්වවිද්‍යාල සහ පර්යේෂණ ආයතන සතු ඉහළ විභවයක් ඇති තාක්ෂණයන් 200 කට අධික ප්‍රමාණයක් සාර්ථක වාණිජ ව්‍යාපාර බවට පත් කිරීම.",
      ta: "அடுத்த 5 ஆண்டுகளில் பல்கலைக்கழகம் மற்றும் நிறுவன ஆதரவுடைய 200 க்கும் மேற்பட்ட உயர் ஆற்றல் கொண்ட தொழில்நுட்பங்களை வணிக ரீதியாக மாற்றுதல்.",
    },
  },
  {
    badge: { en: "Capital Mobilisation", si: "ප්‍රාග්ධනය සවිබල ගැන්වීම", ta: "மூலதன திரட்டல்" },
    title: {
      en: "Syndicate Private & Angel Capital",
      si: "පුද්ගලික සහ ඒන්ජල් ප්‍රාග්ධනය ඒකාබද්ධ කිරීම",
      ta: "தனியார் முதலீடுகளை ஒருங்கிணைத்தல்",
    },
    description: {
      en: "Unlock LKR 5+ Billion in private enterprise co-investment and venture capital dedicated to Sri Lankan scientific research initiatives.",
      si: "දේශීය විද්‍යාත්මක පර්යේෂණ ප්‍රවේශයන් වෙනුවෙන් රුපියල් බිලියන 5 කට අධික පුද්ගලික ව්‍යවසාය සම-ආයෝජන සහ ව්‍යාපාරික ප්‍රාග්ධනය ආකර්ෂණය කර ගැනීම.",
      ta: "இலங்கை அறிவியல் ஆராய்ச்சி முயற்சிகளுக்காக 5 பில்லியன் ரூபாய்க்கும் அதிகமான தனியார் முதலீட்டைத் திரட்டுதல்.",
    },
  },
  {
    badge: { en: "Tech Sovereignty", si: "තාක්ෂණික ස්වෛරීභාවය", ta: "தொழில்நுட்ப இறையாண்மை" },
    title: {
      en: "Deep Tech & IP Creation",
      si: "උසස් තාක්ෂණය සහ බුද්ධිමය දේපල නිර්මාණය",
      ta: "ஆழமான தொழில்நுட்பம் மற்றும் அறிவுசார் சொத்து உருவாக்கம்",
    },
    description: {
      en: "Double national patent filings and technology transfer agreements across robotics, renewable energy, pharmaceutical synthesis, and smart agriculture.",
      si: "රොබෝ තාක්ෂණය, පුනර්ජනනීය බලශක්තිය, ඖෂධ නිෂ්පාදනය සහ නවීන කෘෂිකර්මාන්තය ඔස්සේ ජාතික පේටන්ට් බලපත්‍ර සහ තාක්ෂණ හුවමාරු ගිවිසුම් දෙගුණ කිරීම.",
      ta: "ரோபோடிக்ஸ், புதுப்பிக்கத்தக்க எரிசக்தி, மருந்துகள் மற்றும் ஸ்மார்ட் விவசாயத்தில் காப்புரிமை பதிவுகளை இரட்டிப்பாக்குதல்.",
    },
  },
  {
    badge: { en: "Talent Retention", si: "දක්ෂතා රැකගැනීම", ta: "திறமைகளைத் தக்கவைத்தல்" },
    title: {
      en: "Curb Brain Drain",
      si: "බුද්ධි ගලනය අවම කිරීම",
      ta: "மூளை வெளியேற்றத்தைக் கட்டுப்படுத்துதல்",
    },
    description: {
      en: "Provide lucrative commercialization avenues, grants, and spin-off equity opportunities to keep top scientific and engineering minds in Sri Lanka.",
      si: "දේශීය විද්‍යාඥයින් සහ ඉංජිනේරුවන් මෙරට රඳවා ගැනීම සඳහා වාණිජකරණ මාර්ග, ප්‍රදාන සහ සමාගම් කොටස් හිමිකාරිත්ව අවස්ථා සැලසීම.",
      ta: "உயர் அறிவியல் மற்றும் பொறியியல் திறமையாளர்களை இலங்கையிலேயே தக்கவைக்க மானியங்கள் மற்றும் வணிகமயமாக்கல் வாய்ப்புகளை வழங்குதல்.",
    },
  },
  {
    badge: { en: "Global Markets", si: "ගෝලීය වෙළඳපල", ta: "உலகளாவிய சந்தைகள்" },
    title: {
      en: "Drive High-Tech Exports",
      si: "උසස් තාක්ෂණික අපනයන ප්‍රවර්ධනය",
      ta: "உயர் தொழில்நுட்ப ஏற்றுமதியை இயக்குதல்",
    },
    description: {
      en: "Enable Sri Lankan high-value manufactured goods and licensed intellectual properties to penetrate premium export destinations worldwide.",
      si: "ලොව පුරා ප්‍රමුඛ අපනයන ගමනාන්ත වෙත ශ්‍රී ලාංකික උසස් තත්ත්වයේ නිපැයුම් සහ බලපත්‍රලාභී බුද්ධිමය දේපල ප්‍රවේශ කිරීම.",
      ta: "இலங்கையின் உயர் பெறுமதி வாய்ந்த உற்பத்திப் பொருட்கள் மற்றும் அறிவுசார் சொத்துக்களை சர்வதேச சந்தைகளுக்கு கொண்டு செல்லல்.",
    },
  },
  {
    badge: { en: "Institutional Synergies", si: "ආයතනික සහයෝගීතාව", ta: "நிறுவன ஒருங்கிணைப்பு" },
    title: {
      en: "Foster Quadruple-Helix Innovation",
      si: "සිව්-පාර්ශ්වීය නවෝත්පාදන ජාලයක් ගොඩනැගීම",
      ta: "நான்கு முனை கண்டுபிடிப்பு வலையமைப்பை உருவாக்குதல்",
    },
    description: {
      en: "Unify universities, research institutes, private industry, and state regulatory bodies into one cohesive, frictionless innovation network.",
      si: "විශ්වවිද්‍යාල, පර්යේෂණ ආයතන, පෞද්ගලික කර්මාන්ත සහ රාජ්‍ය නියාමන ආයතන එකමුතු කර බාධාවකින් තොර ප්‍රබල නවෝත්පාදන ජාලයක් නිර්මාණය කිරීම.",
      ta: "பல்கலைக்கழகங்கள், ஆராய்ச்சி நிறுவனங்கள், தனியார் தொழில் மற்றும் ஒழுங்குமுறை அமைப்புகளை ஒன்றிணைத்தல்.",
    },
  },
];

// Default Duties with multi-lang support
const defaultDuties = [
  {
    icon: "DollarSign",
    section: { en: "Mandate 01", si: "කාර්යවරය 01", ta: "ஆணை 01" },
    title: {
      en: "Capital Allocation & Grant Governance",
      si: "ප්‍රාග්ධන වෙන්කිරීම සහ ප්‍රදාන පාලනය",
      ta: "மூலதன ஒதுக்கீடு மற்றும் மானிய நிர்வாகம்",
    },
    points: [
      {
        en: "Disbursement of competitive research commercialisation grants with zero tolerance for bias.",
        si: "කිසිදු පක්ෂග්‍රාහීත්වයකින් තොරව විනිවිදභාවයෙන් යුතු තරඟකාරී පර්යේෂණ වාණිජකරණ ප්‍රදාන ලබා දීම.",
        ta: "பக்கச்சார்பின்றி போட்டித்தன்மை வாய்ந்த ஆராய்ச்சி வர்த்தகமயமாக்கல் மானியங்களை வழங்குதல்.",
      },
      {
        en: "Auditing and ensuring financial stewardship across all co-invested initiatives.",
        si: "සම-ආයෝජනය කරන ලද සියලුම ප්‍රවේශයන් හරහා මූල්‍ය විනය සහ විගණනය සහතික කිරීම.",
        ta: "அனைத்து இணை முதலீட்டு முயற்சிகளிலும் நிதி நிர்வாகத்தை உறுதி செய்தல்.",
      },
      {
        en: "Structuring milestone-based funding tranches tied directly to proven deliverables.",
        si: "ප්‍රතිඵල සහ ඉලක්ක මත පදනම් වූ අදියරගත අරමුදල් සැපයුම් ව්‍යුහගත කිරීම.",
        ta: "நிரூபிக்கப்பட்ட மைல்கற்களுடன் நேரடியாக இணைக்கப்பட்ட நிதி ஒதுக்கீடுகளை கட்டமைத்தல்.",
      },
    ],
  },
  {
    icon: "Scale",
    section: { en: "Mandate 02", si: "කාර්යවරය 02", ta: "ஆணை 02" },
    title: {
      en: "Intellectual Property Safeguarding",
      si: "බුද්ධිමය දේපල සුරක්ෂිතභාවය",
      ta: "அறிவுசார் சொத்து பாதுகாப்பு",
    },
    points: [
      {
        en: "Providing institutional legal aid for national and PCT international patent applications.",
        si: "ජාතික සහ PCT ජාත්‍යන්තර පේටන්ට් අයදුම්පත් සඳහා ආයතනික නීති ආධාර සැලසීම.",
        ta: "தேசிய மற்றும் சர்வதேச காப்புரிமை விண்ணப்பங்களுக்கு legal உதவி வழங்குதல்.",
      },
      {
        en: "Protecting researcher equity and royalty allocations in licensing deals.",
        si: "බලපත්‍ර ගිවිසුම්වලදී පර්යේෂකයාගේ කොටස් සහ රාජකීයත්ව (Royalty) හිමිකම් ආරක්ෂා කිරීම.",
        ta: "உரிம ஒப்பந்தங்களில் ஆராய்ச்சியாளர்களின் பங்கு மற்றும் ராயல்டி ஒதுக்கீடுகளைப் பாதுகாத்தல்.",
      },
      {
        en: "Establishing sovereign IP protection protocols for indigenous biological and mineral resources.",
        si: "දේශීය ජෛව සහ ඛනිජ සම්පත් සඳහා ස්වෛරී බුද්ධිමය දේපල ආරක්ෂණ ප්‍රොටෝකෝල ස්ථාපිත කිරීම.",
        ta: "உள்நாட்டு உயிரியல் மற்றும் கனிம வளங்களுக்கான இறையாண்மை ஐபி பாதுகாப்பு நெறிமுறைகளை நிறுவுதல்.",
      },
    ],
  },
  {
    icon: "ShieldCheck",
    section: { en: "Mandate 03", si: "කාර්යවරය 03", ta: "ஆணை 03" },
    title: {
      en: "Regulatory & Ethical Compliance",
      si: "නියාමන සහ සදාචාරාත්මක අනුකූලතාව",
      ta: "ஒழுங்குமுறை மற்றும் நெறிமுறை இணக்கம்",
    },
    points: [
      {
        en: "Ensuring biological, medical, and technical research adheres to international safety standards.",
        si: "ජෛව, වෛද්‍ය සහ තාක්ෂණික පර්යේෂණ ජාත්‍යන්තර ආරක්ෂණ ප්‍රමිතීන්ට අනුකූල බව තහවුරු කිරීම.",
        ta: "ஆராய்ச்சிகள் சர்வதேச பாதுகாப்புத் தரங்களுக்கு இணங்குவதை உறுதி செய்தல்.",
      },
      {
        en: "Enforcing strict environmental impact assessment before commercial pilots.",
        si: "වාණිජ නියමු ව්‍යාපෘති ක්‍රියාවට නැංවීමට පෙර දැඩි පාරිසරික බලපෑම් ඇගයීම් ක්‍රියාත්මක කිරීම.",
        ta: "வணிக விமானிகளுக்கு முன் கடுமையான சுற்றுச்சூழல் தாக்க மதிப்பீட்டை நடைமுறைப்படுத்துதல்.",
      },
      {
        en: "Facilitating expedited approvals through streamlined national single-window clearing.",
        si: "ඒකාබද්ධ ජාතික තනි කවුළු නිෂ්කාශනය හරහා කඩිනම් අනුමැතීන් ලබා ගැනීමට පහසුකම් සැලසීම.",
        ta: "ஒரே சாளர அனுமதி மூலம் விரைவான அனுமதிகளை எளிதாக்குதல்.",
      },
    ],
  },
  {
    icon: "Users",
    section: { en: "Mandate 04", si: "කාර්යවරය 04", ta: "ஆணை 04" },
    title: {
      en: "Capacity Building & Commercial Mentorship",
      si: "ධාරිතා වර්ධනය සහ වාණිජ මාර්ගෝපදේශනය",
      ta: "திறன் மேம்பாடு மற்றும் வழிகாட்டல்",
    },
    points: [
      {
        en: "Conducting intensive bootcamps on technology valuation, spin-off structuring, and pitch creation.",
        si: "තාක්ෂණ ඇගයීම, සමාගම් පිහිටුවීම සහ ආයෝජන ඉදිරිපත් කිරීම් පිළිබඳ දැඩි පුහුණු වැඩසටහන් පැවැත්වීම.",
        ta: "தொழில்நுட்ப மதிப்பீடு மற்றும் வணிக உருவாக்கம் குறித்த விரிவான பயிற்சிகளை நடத்துதல்.",
      },
      {
        en: "Pairing scientists with seasoned industry C-suite executives and venture partners.",
        si: "ප්‍රවීණ කාර්මික විධායකයින් සහ ව්‍යාපාරික හවුල්කරුවන් සමඟ විද්‍යාඥයින් සම්බන්ධ කිරීම.",
        ta: "விஞ்ஞானிகளை அனுபவம் வாய்ந்த தொழில்துறை தலைவர்களுடன் இணைத்தல்.",
      },
      {
        en: "Nurturing early-stage student innovators at universities across all nine provinces.",
        si: "දිවයිනේ පළාත් නවය පුරාම විශ්වවිද්‍යාල ශිෂ්‍ය නව නිපැයුම්කරුවන් සවිබල ගැන්වීම.",
        ta: "ஒன்பது மாகாணங்களிலும் உள்ள பல்கலைக்கழகங்களில் ஆரம்ப கட்ட கண்டுபிடிப்பாளர்களை ஊக்குவித்தல்.",
      },
    ],
  },
];

// Default Values with multi-lang support
const defaultCoreValues = [
  {
    icon: "Sparkles",
    title: { en: "Excellence in Innovation", si: "නවෝත්පාදනයේ විශිෂ්ටත්වය", ta: "கண்டுபிடிப்பில் சிறப்பு" },
    description: {
      en: "We champion world-class standards in scientific research, product design, and commercial deployment, refusing mediocrity at every stage.",
      si: "විද්‍යාත්මක පර්යේෂණ, නිෂ්පාදන සැලසුම්කරණය සහ වාණිජ භාවිතයේදී ලෝක මට්ටමේ උසස් ප්‍රමිතීන් ආරක්ෂා කරමින් විශිෂ්ටත්වය අත්කර ගැනීම.",
      ta: "அறிவியல் ஆராய்ச்சி, தயாரிப்பு வடிவமைப்பு மற்றும் வணிக பயன்பாட்டில் உலகத்தரம் வாய்ந்த தரத்தை நிலைநிறுத்துதல்.",
    },
  },
  {
    icon: "ShieldCheck",
    title: { en: "Uncompromising Integrity", si: "නොසැලෙන අවංකභාවය සහ විනිවිදභාවය", ta: "சமரசமற்ற நேர்மை" },
    description: {
      en: "We operate with total transparency, ethical stewardship, and strict meritocracy in all reviews, partnerships, and grant disbursements.",
      si: "සියලුම ඇගයීම්, හවුල්කාරිත්වයන් සහ ප්‍රදාන බෙදාහැරීම්වලදී උපරිම විනිවිදභාවය, ආචාරධර්ම සහ කුසලතා පදනම මත පමණක් ක්‍රියාත්මක වීම.",
      ta: "அனைத்து மதிப்பாய்வுகள், கூட்டாண்மைகள் மற்றும் மானிய விநியோகங்களிலும் முழுமையான வெளிப்படைத்தன்மையுடன் செயல்படுதல்.",
    },
  },
  {
    icon: "HeartHandshake",
    title: { en: "Tripartite Collaboration", si: "ත්‍රිපාර්ශ්වීය සහයෝගීතාව", ta: "முத்தரப்பு ஒத்துழைப்பு" },
    description: {
      en: "We believe real breakthroughs happen when academia, private capital, and government institutions co-create with mutual respect and shared ownership.",
      si: "ශාස්ත්‍රාලීය ප්‍රජාව, පෞද්ගලික ප්‍රාග්ධනය සහ රාජ්‍ය ආයතන එකමුතුවෙන් කටයුතු කරන විට සැබෑ ජාතික ජයග්‍රහණ අත්පත් වන බව අප තරයේ විශ්වාස කරමු.",
      ta: "கல்வித்துறையினர், தனியார் முதலீடு மற்றும் அரசு நிறுவனங்கள் இணைந்து செயல்படும் போது உண்மையான முன்னேற்றங்கள் நிகழ்கின்றன.",
    },
  },
  {
    icon: "CheckCircle",
    title: { en: "Measurable Impact", si: "මැනිය හැකි සැබෑ ප්‍රතිඵල", ta: "அளவிடக்கூடிய தாக்கம்" },
    description: {
      en: "Our success is defined not by papers published, but by patents licensed, industries revitalized, and high-quality jobs generated.",
      si: "අපගේ සාර්ථකත්වය මනිනු ලබන්නේ පළ කළ ලිපි ලේඛන වලින් නොව, පේටන්ට් බලපත්‍ර වාණිජකරණය, නව කර්මාන්ත බිහිවීම සහ උසස් රැකියා උත්පාදනය මගිනි.",
      ta: "எங்கள் வெற்றி வெளியிடப்பட்ட ஆவணங்களால் அல்ல, பெறப்பட்ட காப்புரிமைகள் மற்றும் உருவாக்கப்பட்ட வேலைவாய்ப்புகளால் வரையறுக்கப்படுகிறது.",
    },
  },
  {
    icon: "Leaf",
    title: { en: "Environmental Sustainability", si: "පාරිසරික තිරසාරභාවය", ta: "சுற்றுச்சூழல் நிலைத்தன்மை" },
    description: {
      en: "We prioritize circular economic solutions, clean technologies, and eco-conscious engineering that preserve Sri Lanka's unique natural heritage.",
      si: "ශ්‍රී ලංකාවේ අසමසම ස්වභාවික උරුමය සුරකිමින් හරිත තාක්ෂණය, ප්‍රතිචක්‍රීකරණ ආර්ථික විසඳුම් සහ පරිසර හිතකාමී ඉංජිනේරු ශිල්පයට ප්‍රමුඛත්වය දීම.",
      ta: "இலங்கையின் தனித்துவமான இயற்கை பாரம்பரியத்தைப் பாதுகாக்கும் பசுமை தொழில்நுட்பங்களுக்கு நாங்கள் முன்னுரிமை அளிக்கிறோம்.",
    },
  },
  {
    icon: "Users",
    title: { en: "Inclusive Empowerment", si: "සර්වපාක්ෂික සවිබල ගැන්වීම", ta: "உள்ளடக்கிய வலுவூட்டல்" },
    description: {
      en: "We bridge regional divides to ensure innovators across all provinces, universities, and backgrounds have equal access to capital and mentorship.",
      si: "පළාත්, විශ්වවිද්‍යාල හෝ පසුබිම් භේදයකින් තොරව සෑම නව නිපැයුම්කරුවෙකුටම සමාන අවස්ථා, ප්‍රාග්ධනය සහ මගපෙන්වීම හිමිකර දීම.",
      ta: "அனைத்து மாகாணங்கள், பல்கலைக்கழகங்கள் மற்றும் பின்னணியில் உள்ள கண்டுபிடிப்பாளர்களுக்கு சமமான வாய்ப்புகளை உறுதி செய்தல்.",
    },
  },
];

const IntroductionPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [openDutyIndex, setOpenDutyIndex] = useState<number | null>(0);

  const [dbObjectives, setDbObjectives] = useState<ObjectiveData[]>([]);
  const [dbDuties, setDbDuties] = useState<ResponsibilityData[]>([]);
  const [dbValues, setDbValues] = useState<CoreValueData[]>([]);

  // Fetch data from backend
  useEffect(() => {
    let isMounted = true;

    aboutUsContentApi
      .getPublicObjectives()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbObjectives(res.data);
        }
      })
      .catch(() => {});

    aboutUsContentApi
      .getPublicResponsibilities()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbDuties(res.data);
        }
      })
      .catch(() => {});

    aboutUsContentApi
      .getPublicCoreValues()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setDbValues(res.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleDuty = (idx: number) => {
    setOpenDutyIndex(openDutyIndex === idx ? null : idx);
  };

  // Process Objectives (without icons as requested)
  const objectives =
    dbObjectives.length > 0
      ? dbObjectives.map((o) => ({
          badge: getMultiLangText(o.badge, currentLang, ""),
          title: getMultiLangText(o.title, currentLang),
          description: getMultiLangText(o.description, currentLang),
        }))
      : defaultObjectivesList.map((o) => ({
          badge: getMultiLangText(o.badge, currentLang),
          title: getMultiLangText(o.title, currentLang),
          description: getMultiLangText(o.description, currentLang),
        }));

  // Process Duties
  const duties =
    dbDuties.length > 0
      ? dbDuties.map((d) => ({
          icon: d.icon || "ShieldCheck",
          section: getMultiLangText(d.section, currentLang, "Mandate"),
          title: getMultiLangText(d.title, currentLang),
          points: d.points.map((pt) => getMultiLangText(pt, currentLang)),
        }))
      : defaultDuties.map((d) => ({
          icon: d.icon,
          section: getMultiLangText(d.section, currentLang),
          title: getMultiLangText(d.title, currentLang),
          points: d.points.map((pt) => getMultiLangText(pt, currentLang)),
        }));

  // Process Core Values
  const values =
    dbValues.length > 0
      ? dbValues.map((v) => ({
          icon: v.icon || "Sparkles",
          title: getMultiLangText(v.title, currentLang),
          description: getMultiLangText(v.description, currentLang),
        }))
      : defaultCoreValues.map((v) => ({
          icon: v.icon,
          title: getMultiLangText(v.title, currentLang),
          description: getMultiLangText(v.description, currentLang),
        }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c050b] text-gray-900 dark:text-gray-100">
      <PageHero
        badge={t("header.about", "About Us")}
        title={t("header.aboutIntroduction", "Introduction")}
        subtitle={t(
          "about.introSubtitle",
          "Our strategic vision, mission, objectives, responsibilities, and core values driving national research commercialisation."
        )}
        breadcrumbs={[
          { label: t("header.about", "About Us"), href: "/about-us" },
          { label: t("header.aboutIntroduction", "Introduction") },
        ]}
      />

      {/* 1. VISION & MISSION */}
      <section id="vision-mission-section-wrapper" className="bg-[#edf2f7] dark:bg-[#151c28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-2 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t("about.visionMission", "Our Vision & Mission")}
          </h2>
        </div>

        <VisionMissionSection
          showQuickLinks={false}
          showComplaintsBar={false}
        />
      </section>

      {/* Horizontal Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-slate-200/90 dark:border-white/10" />
      </div>

      {/* 2. OBJECTIVES (with distinctive background color and NO icons as requested) */}
      <section id="objectives-section-wrapper" className="py-12 sm:py-16 bg-white dark:bg-[#0c050b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center pb-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("about.objectives", "Our Objectives")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {objectives.map((item, index) => (
              <div
                key={index}
                className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {item.badge && (
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
                {item.description && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-slate-200/90 dark:border-white/10" />
      </div>

      {/* 3. RESPONSIBILITIES */}
      <section id="responsibilities-section-wrapper" className="py-12 sm:py-16 bg-[#edf2f7] dark:bg-[#151c28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center pb-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("about.responsibilities", "Our Responsibilities")}
            </h2>
          </div>

          <div className="space-y-4">
            {duties.map((item, index) => {
              const IconComponent = iconMap[item.icon] || ShieldCheck;
              const isOpen = openDutyIndex === index;

              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleDuty(index)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary dark:text-pink-400 flex items-center justify-center shrink-0">
                        <IconComponent size={24} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-pink-400 block mb-0.5">
                          {item.section}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-white/5">
                      <ul className="space-y-2.5 ml-1 sm:ml-16">
                        {item.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Horizontal Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-slate-200/90 dark:border-white/10" />
      </div>

      {/* 4. CORE VALUES */}
      <section id="values-section-wrapper" className="py-12 sm:py-16 bg-white dark:bg-[#0c050b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center pb-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("about.values", "Our Values")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {values.map((val, index) => {
              const IconComponent = iconMap[val.icon] || Sparkles;

              return (
                <div
                  key={index}
                  className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-slate-900 dark:text-white">
                      {val.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroductionPage;
