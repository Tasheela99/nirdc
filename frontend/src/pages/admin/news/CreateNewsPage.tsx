import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import newsApi from "../../../api/NewsApi.ts";
import { ApiResponse } from "../../../utils/ApiResponse.ts";
import { useAlert } from "../../../components/common/AlertContextScreen.tsx";
import RichTextEditor from "../../../components/common/RichTextEditor";
import {
    Button,
    TextField,
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    CircularProgress,
    Grid,
    Paper,
    Divider,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Container,
    Fade,
    LinearProgress,
    Stack,
    Tabs,
    Tab,
} from "@mui/material";
import {
    CloudUpload as CloudUploadIcon,
    Preview as PreviewIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Today as TodayIcon,
    Title as TitleIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Newspaper as NewspaperIcon,
    Publish as PublishIcon,
    Edit as EditIcon,
    AttachFile as AttachFileIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import DOMPurify from 'dompurify';

const LOCAL_STORAGE_KEY = "newsFormData";
const EXPIRATION_KEY = "newsFormDataExpiration";

interface NewsFormData {
    titleEn: string;
    titleSi: string;
    titleTa: string;
    contentEn: string;
    contentSi: string;
    contentTa: string;
    commonImage: FileList | null;
    imageEn: FileList | null;
    imageSi: FileList | null;
    imageTa: FileList | null;
    date: string;
}

interface EditNews {
    _id: string;
    titleEn: string;
    titleSi: string;
    titleTa: string;
    contentEn: string;
    contentSi: string;
    contentTa: string;
    date: string;
    commonImage?: string;
    imageEn?: string;
    imageSi?: string;
    imageTa?: string;
}

const CreateNewsScreen = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const theme = useTheme();
    const { showAlert } = useAlert();

    // Check if we're in edit mode
    const editNews = state?.news as EditNews;

    const defaultFormData: NewsFormData = {
        titleEn: "",
        titleSi: "",
        titleTa: "",
        contentEn: "",
        contentSi: "",
        contentTa: "",
        commonImage: null,
        imageEn: null,
        imageSi: null,
        imageTa: null,
        date: "",
    };

    const [formData, setFormData] = useState<NewsFormData>(() => {
        // If in edit mode, initialize with edit data
        if (editNews) {
            return {
                titleEn: editNews.titleEn || "",
                titleSi: editNews.titleSi || "",
                titleTa: editNews.titleTa || "",
                contentEn: editNews.contentEn || "",
                contentSi: editNews.contentSi || "",
                contentTa: editNews.contentTa || "",
                commonImage: null,
                imageEn: null,
                imageSi: null,
                imageTa: null,
                date: editNews.date ? editNews.date.substring(0, 10) : "",
            };
        }

        // Otherwise, try to load from localStorage
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const expiration = localStorage.getItem(EXPIRATION_KEY);
        const isExpired = expiration && new Date().getTime() > parseInt(expiration, 10);

        if (savedData && !isExpired) {
            return JSON.parse(savedData);
        }

        return defaultFormData;
    });

    const [activeTab, setActiveTab] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<{ [key: string]: string | null }>({
        commonImage: null,
        imageEn: null,
        imageSi: null,
        imageTa: null
    });
    const [isDraftSaved, setIsDraftSaved] = useState(false);

    // Initialize image preview for edit mode
    useEffect(() => {
        if (editNews) {
            setImagePreviewUrls({
                commonImage: editNews.commonImage || null,
                imageEn: editNews.imageEn || null,
                imageSi: editNews.imageSi || null,
                imageTa: editNews.imageTa || null
            });
        }
    }, [editNews]);

    // Auto-save draft functionality (only in create mode)
    useEffect(() => {
        if (editNews) return; // Don't auto-save in edit mode

        const timer = setTimeout(() => {
            if (formData.titleEn.trim() || formData.contentEn.trim()) {
                const expirationTime = new Date().getTime() + 15 * 60 * 1000;
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
                localStorage.setItem(EXPIRATION_KEY, expirationTime.toString());
                setIsDraftSaved(true);
                setTimeout(() => setIsDraftSaved(false), 2000);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [formData, editNews]);

    useEffect(() => {
        return () => {
            // Revoke object URLs on unmount
            ['commonImage', 'imageEn', 'imageSi', 'imageTa'].forEach(key => {
                if (imagePreviewUrls[key] && !(editNews as any)?.[key]) {
                    URL.revokeObjectURL(imagePreviewUrls[key] as string);
                }
            });
        };
    }, [imagePreviewUrls, editNews]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, type } = e.target;

        if (type === "file") {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];

            if (file) {
                if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
                    showAlert("Please upload a valid image file (JPG, PNG, or WEBP)", "error");
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    showAlert("File size should not exceed 5MB", "error");
                    return;
                }

                if (imagePreviewUrls[name] && !(editNews as any)?.[name]) {
                    URL.revokeObjectURL(imagePreviewUrls[name] as string);
                }
                setImagePreviewUrls(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
                setFormData((prev) => ({ ...prev, [name]: target.files }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: e.target.value }));
        }
    };

    const validateForm = (): boolean => {
        if (!formData.date.trim()) {
            showAlert("Publication Date is required", "error");
            return false;
        }
        
        if (!editNews && (!formData.commonImage || formData.commonImage.length === 0)) {
            showAlert("Common Image is required", "error");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("titleEn", formData.titleEn.trim());
            formDataToSend.append("titleSi", formData.titleSi.trim());
            formDataToSend.append("titleTa", formData.titleTa.trim());
            
            // Sanitize HTML content before sending
            formDataToSend.append("contentEn", DOMPurify.sanitize(formData.contentEn));
            formDataToSend.append("contentSi", DOMPurify.sanitize(formData.contentSi));
            formDataToSend.append("contentTa", DOMPurify.sanitize(formData.contentTa));
            
            formDataToSend.append("date", formData.date.trim());

            if (formData.commonImage?.[0]) formDataToSend.append("commonImage", formData.commonImage[0]);
            if (formData.imageEn?.[0]) formDataToSend.append("imageEn", formData.imageEn[0]);
            if (formData.imageSi?.[0]) formDataToSend.append("imageSi", formData.imageSi[0]);
            if (formData.imageTa?.[0]) formDataToSend.append("imageTa", formData.imageTa[0]);

            let response: ApiResponse;
            if (editNews) {
                // Update existing news
                response = await newsApi.updateNews(editNews._id, formDataToSend) as ApiResponse;
            } else {
                // Create new news
                response = await newsApi.createNews(formDataToSend) as ApiResponse;
            }

            if (response?.status) {
                showAlert(
                    editNews ? "News updated successfully!" : "News created successfully!",
                    "success"
                );
                
                // Clean up and navigate back
                setFormData(defaultFormData);
                ['commonImage', 'imageEn', 'imageSi', 'imageTa'].forEach(key => {
                    if (imagePreviewUrls[key] && !(editNews as any)?.[key]) {
                        URL.revokeObjectURL(imagePreviewUrls[key] as string);
                    }
                });
                setImagePreviewUrls({ commonImage: null, imageEn: null, imageSi: null, imageTa: null });
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                localStorage.removeItem(EXPIRATION_KEY);
                
                // Navigate back to manage news
                navigate("/admin/manage-news");
            } else {
                showAlert(
                    response?.message || `Failed to ${editNews ? "update" : "create"} news article.`,
                    "error"
                );
            }
        } catch (error: any) {
            showAlert(
                error?.response?.data?.message ||
                `An error occurred while ${editNews ? "updating" : "creating"} the news article.`,
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditorChange = (content: string, field: string) => {
        setFormData(prev => ({ ...prev, [field]: content }));
    };

    const activeTitle = activeTab === 0 ? formData.titleEn : activeTab === 1 ? formData.titleSi : formData.titleTa;
    const activeContent = activeTab === 0 ? formData.contentEn : activeTab === 1 ? formData.contentSi : formData.contentTa;
    const activeImage = activeTab === 0 ? (imagePreviewUrls.imageEn || imagePreviewUrls.commonImage)
                      : activeTab === 1 ? (imagePreviewUrls.imageSi || imagePreviewUrls.commonImage)
                      : (imagePreviewUrls.imageTa || imagePreviewUrls.commonImage);

    const hasTitle = formData.titleEn || formData.titleSi || formData.titleTa;
    const hasContent = formData.contentEn || formData.contentSi || formData.contentTa;
    const hasImage = formData.commonImage || formData.imageEn || formData.imageSi || formData.imageTa || (editNews && editNews.commonImage);
    
    const progressScore = ((hasTitle ? 1 : 0) + (hasContent ? 1 : 0) + (formData.date ? 1 : 0) + (hasImage ? 1 : 0));
    const progressPercent = Math.round((progressScore / 4) * 100);

    return (
        <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
            {/* Advanced Header Section */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    mb: 4, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.3
                    }
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
                    <Box display="flex" alignItems="center" gap={3}>
                        <Avatar 
                            sx={{ 
                                bgcolor: 'rgba(255,255,255,0.15)', 
                                width: 72, 
                                height: 72,
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            <NewspaperIcon sx={{ color: 'white', fontSize: 36 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h3" color="white" fontWeight="700" sx={{ mb: 1 }}>
                                {editNews ? 'Edit News Article' : 'Create News Article'}
                            </Typography>
                            <Typography variant="h6" color="rgba(255,255,255,0.8)" fontWeight="400">
                                {editNews 
                                    ? 'Update and modify your news article content' 
                                    : 'Craft and publish professional news articles to your audience'
                                }
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2} mt={2}>
                                {!editNews && (
                                    <Chip 
                                        icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                                        label={isDraftSaved ? "Draft Saved" : "Auto-save enabled"}
                                        size="small"
                                        sx={{ 
                                            bgcolor: isDraftSaved ? 'success.main' : 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            '& .MuiChip-icon': { color: 'white' }
                                        }}
                                    />
                                )}
                                <Chip 
                                    icon={<EditIcon sx={{ fontSize: 16 }} />}
                                    label="Rich Editor"
                                    size="small"
                                    sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        '& .MuiChip-icon': { color: 'white' }
                                    }}
                                />
                                {editNews && (
                                    <Chip 
                                        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                                        label="Edit Mode"
                                        size="small"
                                        sx={{ 
                                            bgcolor: 'warning.main',
                                            color: 'white',
                                            '& .MuiChip-icon': { color: 'white' }
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Tooltip title="Save as Draft">
                            <Button
                                variant="outlined"
                                startIcon={<SaveIcon />}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        bgcolor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Save Draft
                            </Button>
                        </Tooltip>
                        <Tooltip title="Go Back">
                            <IconButton 
                                onClick={() => navigate(-1)}
                                sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.1)', 
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>
            </Paper>

            {/* Progress Indicator */}
            <Paper 
                elevation={0} 
                sx={{ 
                    mb: 4, 
                    p: 3, 
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="600">
                        Form Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {progressPercent}% Complete
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={progressPercent} 
                    sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 6,
                            background: 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)'
                        }
                    }}
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Stack direction="row" spacing={1}>
                        <Chip 
                            label="Title" 
                            size="small" 
                            color={hasTitle ? "success" : "default"}
                            variant={hasTitle ? "filled" : "outlined"}
                            icon={hasTitle ? <CheckCircleIcon /> : <EditIcon />}
                        />
                        <Chip 
                            label="Content" 
                            size="small" 
                            color={hasContent ? "success" : "default"}
                            variant={hasContent ? "filled" : "outlined"}
                            icon={hasContent ? <CheckCircleIcon /> : <DescriptionIcon />}
                        />
                        <Chip 
                            label="Date" 
                            size="small" 
                            color={formData.date ? "success" : "default"}
                            variant={formData.date ? "filled" : "outlined"}
                            icon={formData.date ? <CheckCircleIcon /> : <TodayIcon />}
                        />
                        <Chip 
                            label="Media" 
                            size="small" 
                            color={hasImage ? "success" : "default"}
                            variant={hasImage ? "filled" : "outlined"}
                            icon={hasImage ? <CheckCircleIcon /> : <AttachFileIcon />}
                        />
                    </Stack>
                </Box>
            </Paper>

            <Grid container spacing={4}>
                {/* Enhanced Form Section */}
                <Grid item xs={12} md={8}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: 4, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            overflow: 'hidden'
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar 
                                    sx={{ 
                                        bgcolor: 'primary.main',
                                        width: 48,
                                        height: 48,
                                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                                    }}
                                >
                                    <DescriptionIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                            }
                            title={
                                <Typography variant="h5" fontWeight="700" color="text.primary">
                                    News Article Details
                                </Typography>
                            }
                            subheader={
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Fill in the information below to create your professional news article
                                </Typography>
                            }
                            action={
                                <LinearProgress 
                                    variant="determinate" 
                                    value={progressPercent} 
                                    sx={{ 
                                        width: 120, 
                                        height: 8, 
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                                        }
                                    }}
                                />
                            }
                            sx={{ pb: 2 }}
                        />
                        <Divider sx={{ borderColor: 'divider' }} />
                        <CardContent sx={{ p: 5 }}>
                            <form onSubmit={handleSubmit}>
                                {/* Language Tabs */}
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="language tabs">
                                        <Tab label="English" />
                                        <Tab label="Sinhala" />
                                        <Tab label="Tamil" />
                                    </Tabs>
                                </Box>

                                {/* Enhanced Title Section */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        borderRadius: 3,
                                        bgcolor: 'grey.50',
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                            <TitleIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="h6" fontWeight="700" color="text.primary">
                                                Article Title ({activeTab === 0 ? 'English' : activeTab === 1 ? 'Sinhala' : 'Tamil'})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Create a compelling headline that captures attention
                                            </Typography>
                                        </Box>
                                        <Chip 
                                            label={`${(activeTab === 0 ? formData.titleEn : activeTab === 1 ? formData.titleSi : formData.titleTa).length}/200`} 
                                            size="small" 
                                            color={(activeTab === 0 ? formData.titleEn : activeTab === 1 ? formData.titleSi : formData.titleTa).length > 180 ? "warning" : "default"}
                                            sx={{ minWidth: 70 }}
                                        />
                                    </Box>
                                    <TextField
                                        key={`title-${activeTab}`}
                                        fullWidth
                                        name={activeTab === 0 ? "titleEn" : activeTab === 1 ? "titleSi" : "titleTa"}
                                        placeholder={`Enter news article title in ${activeTab === 0 ? 'English' : activeTab === 1 ? 'Sinhala' : 'Tamil'}...`}
                                        value={activeTab === 0 ? formData.titleEn : activeTab === 1 ? formData.titleSi : formData.titleTa}
                                        onChange={handleChange}
                                        variant="outlined"
                                        inputProps={{ maxLength: 200 }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: 'white',
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'black',
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: 'grey.500',
                                                opacity: 1,
                                            }
                                        }}
                                    />
                                </Paper>

                                {/* Enhanced Content Section */}
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        mb: 3, 
                                        borderRadius: 3,
                                        bgcolor: 'grey.50',
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                            <DescriptionIcon sx={{ fontSize: 20 }} />
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="h6" fontWeight="700" color="text.primary">
                                                Article Content ({activeTab === 0 ? 'English' : activeTab === 1 ? 'Sinhala' : 'Tamil'})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Write engaging content using our rich text editor
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Chip 
                                                icon={<EditIcon />}
                                                label="Rich Text" 
                                                size="small" 
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Stack>
                                    </Box>
                                    <Box 
                                        sx={{ 
                                            backgroundColor: 'white',
                                            color: 'black',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'grey.300',
                                            '& .ql-editor': {
                                                color: 'black',
                                            },
                                            '& .ql-toolbar': {
                                                borderColor: 'grey.300'
                                            },
                                            '& .ql-container': {
                                                borderColor: 'grey.300'
                                            }
                                        }}
                                    >
                                        <RichTextEditor
                                            key={`content-${activeTab}`}
                                            label="Content"
                                            value={activeContent}
                                            onChange={(content: string) => handleEditorChange(content, activeTab === 0 ? 'contentEn' : activeTab === 1 ? 'contentSi' : 'contentTa')}
                                            placeholder={`Write your news article content in ${activeTab === 0 ? 'English' : activeTab === 1 ? 'Sinhala' : 'Tamil'}...`}
                                            height={200}
                                        />
                                    </Box>
                                </Paper>

                                {/* Enhanced Date and Media Section */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Paper 
                                            elevation={0} 
                                            sx={{ 
                                                p: 3, 
                                                borderRadius: 3,
                                                bgcolor: 'grey.50',
                                                border: '1px solid',
                                                borderColor: 'grey.200',
                                                height: '100%'
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                                    <TodayIcon sx={{ fontSize: 20 }} />
                                                </Avatar>
                                                <Box flex={1}>
                                                    <Typography variant="h6" fontWeight="700" color="text.primary">
                                                        Publication Date
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        When should this article be published?
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                variant="outlined"
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        backgroundColor: 'white',
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'primary.main',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'primary.main',
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        color: 'black',
                                                    },
                                                    '& input::-webkit-calendar-picker-indicator': {
                                                        opacity: 1,
                                                        display: 'block',
                                                        cursor: 'pointer',
                                                        width: '28px',
                                                        height: '28px',
                                                        color: 'primary.main',
                                                        filter: 'invert(0.5) sepia(1) saturate(5) hue-rotate(180deg)'
                                                    }
                                                }}
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Paper 
                                            elevation={0} 
                                            sx={{ 
                                                p: 3, 
                                                borderRadius: 3,
                                                bgcolor: 'grey.50',
                                                border: '1px solid',
                                                borderColor: 'grey.200',
                                                height: '100%'
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                                    <AttachFileIcon sx={{ fontSize: 20 }} />
                                                </Avatar>
                                                <Box flex={1}>
                                                    <Typography variant="h6" fontWeight="700" color="text.primary">
                                                        Common Featured Image {!editNews && <span style={{ color: 'red' }}>*</span>}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        JPG, PNG, or WEBP (max 5MB)
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<CloudUploadIcon />}
                                                fullWidth
                                                sx={{
                                                    height: 56,
                                                    borderRadius: 2,
                                                    borderStyle: 'dashed',
                                                    backgroundColor: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'grey.50',
                                                        borderColor: 'primary.main',
                                                    },
                                                }}
                                            >
                                                {formData.commonImage?.[0]?.name || 'Choose Common Image'}
                                                <input
                                                    type="file"
                                                    name="commonImage"
                                                    onChange={handleChange}
                                                    accept="image/jpeg,image/png,image/webp"
                                                    style={{ display: 'none' }}
                                                />
                                            </Button>
                                        </Paper>
                                    </Grid>

                                    {/* Language-Specific Images (Optional) */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
                                            Optional Language-Specific Images
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" mb={2}>
                                            Upload these only if you want a different image to appear for specific languages.
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {[
                                                { name: 'imageEn', label: 'English Image' },
                                                { name: 'imageSi', label: 'Sinhala Image' },
                                                { name: 'imageTa', label: 'Tamil Image' }
                                            ].map((imgField) => (
                                                <Grid item xs={12} md={4} key={imgField.name}>
                                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                                                        <Typography variant="subtitle1" fontWeight="600" mb={2}>
                                                            {imgField.label}
                                                        </Typography>
                                                        <Button
                                                            component="label"
                                                            variant="outlined"
                                                            startIcon={<CloudUploadIcon />}
                                                            fullWidth
                                                            sx={{
                                                                height: 56,
                                                                borderRadius: 2,
                                                                borderStyle: 'dashed',
                                                                backgroundColor: 'white',
                                                            }}
                                                        >
                                                            {(formData as any)[imgField.name]?.[0]?.name || 'Choose Image'}
                                                            <input
                                                                type="file"
                                                                name={imgField.name}
                                                                onChange={handleChange}
                                                                accept="image/jpeg,image/png,image/webp"
                                                                style={{ display: 'none' }}
                                                            />
                                                        </Button>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Enhanced Submit Section */}
                                <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid', borderColor: 'grey.200' }}>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            startIcon={<ArrowBackIcon />}
                                            onClick={() => navigate(-1)}
                                            sx={{
                                                minWidth: 140,
                                                height: 48,
                                                borderRadius: 3,
                                                borderColor: 'grey.300',
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    borderColor: 'grey.400',
                                                    backgroundColor: 'grey.50',
                                                },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={
                                                isSubmitting ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : editNews ? (
                                                    <SaveIcon />
                                                ) : (
                                                    <PublishIcon />
                                                )
                                            }
                                            disabled={isSubmitting}
                                            sx={{
                                                minWidth: 180,
                                                height: 48,
                                                borderRadius: 3,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                '&:hover': {
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                                },
                                                '&:disabled': {
                                                    background: 'grey.300',
                                                },
                                            }}
                                        >
                                            {isSubmitting 
                                                ? (editNews ? 'Updating...' : 'Publishing...') 
                                                : (editNews ? 'Update Article' : 'Publish Article')
                                            }
                                        </Button>
                                    </Stack>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Enhanced Preview Section */}
                <Grid item xs={12} md={4}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            position: 'sticky',
                            top: 24,
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            overflow: 'hidden'
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar 
                                    sx={{ 
                                        bgcolor: 'success.main',
                                        width: 48,
                                        height: 48,
                                        background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
                                    }}
                                >
                                    <PreviewIcon sx={{ fontSize: 24 }} />
                                </Avatar>
                            }
                            title={
                                <Typography variant="h5" fontWeight="700" color="text.primary">
                                    Live Preview
                                </Typography>
                            }
                            subheader={
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    See how your news article will look
                                </Typography>
                            }
                            action={
                                <Stack direction="row" spacing={1}>
                                    {editNews && (
                                        <Chip 
                                            icon={<EditIcon />}
                                            label="Edit Mode" 
                                            size="small" 
                                            color="warning"
                                            variant="filled"
                                        />
                                    )}
                                    {isDraftSaved && (
                                        <Fade in={isDraftSaved}>
                                            <Chip 
                                                icon={<CheckCircleIcon />}
                                                label="Saved" 
                                                size="small" 
                                                color="success"
                                                variant="filled"
                                            />
                                        </Fade>
                                    )}
                                </Stack>
                            }
                            sx={{ pb: 2 }}
                        />
                        <Divider sx={{ borderColor: 'divider' }} />
                        <CardContent sx={{ p: 0 }}>
                            {/* Preview Content */}
                            <Box sx={{ p: 3 }}>
                                {activeImage ? (
                                    <CardMedia
                                        component="img"
                                        src={activeImage}
                                        alt="Preview"
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            mb: 2,
                                            border: '1px solid',
                                            borderColor: 'grey.200'
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'grey.100',
                                            borderRadius: 2,
                                            mb: 2,
                                            border: '2px dashed',
                                            borderColor: 'grey.300'
                                        }}
                                    >
                                        <Stack alignItems="center" spacing={1}>
                                            <AttachFileIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                No image selected
                                            </Typography>
                                        </Stack>
                                    </Box>
                                )}
                                
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                    sx={{ 
                                        color: 'text.primary',
                                        fontWeight: 700,
                                        lineHeight: 1.2
                                    }}
                                >
                                    {activeTitle || 'News Article Title'}
                                </Typography>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Chip 
                                        icon={<TodayIcon />}
                                        label={formData.date || 'Publication date not set'}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                    {activeContent ? (
                                        <div 
                                            dangerouslySetInnerHTML={{ 
                                                __html: DOMPurify.sanitize(activeContent) 
                                            }} 
                                            style={{ 
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                lineHeight: 1.7,
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            Article content will appear here as you type...
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CreateNewsScreen;