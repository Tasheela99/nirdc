import { useState, useEffect, useCallback, useRef } from "react";
import { useAlert } from "../../../components/common/AlertContextScreen";
import bannerApi from "../../../api/BannerApi";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import { Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";

// ─── Reusable Image Upload Section ───
const ImageUploadSection = ({
  title,
  subtitle,
  images,
  isLoading,
  fieldName,
  onUpload,
  onDelete,
}: {
  title: string;
  subtitle: string;
  images: string[];
  isLoading: boolean;
  fieldName: string;
  onUpload: (files: File[], fieldName: string) => Promise<void>;
  onDelete: (url: string) => Promise<void>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    setSelectedFiles(imageFiles);
    setPreviews(imageFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    await onUpload(selectedFiles, fieldName);
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsUploading(false);
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Box mb={5}>
      <Typography variant="h6" fontWeight={700} mb={0.5} sx={{ color: "#111827" }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#4B5563" }} mb={2}>
        {subtitle}
      </Typography>

      {/* Upload zone */}
      <Paper
        elevation={0}
        sx={{
          border: "2px dashed #d1d5db",
          borderRadius: 3,
          p: 3,
          mb: 3,
          textAlign: "center",
          backgroundColor: "white",
          transition: "border-color 0.2s",
          "&:hover": { borderColor: "#111827" },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {previews.length === 0 ? (
          <Box>
            <Upload size={32} className="mx-auto mb-2 text-gray-400" />
            <Typography variant="body2" sx={{ color: "#4B5563" }} mb={1.5}>
              Click to select images
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Plus size={14} />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                borderColor: "#4B5563",
                color: "#111827",
                textTransform: "none",
                fontSize: 13,
                "&:hover": { borderColor: "#111827", backgroundColor: "rgba(17,24,39,0.04)" },
              }}
            >
              Select Images
            </Button>
          </Box>
        ) : (
          <Box>
            <Box display="flex" flexWrap="wrap" gap={1.5} justifyContent="center" mb={2}>
              {previews.map((url, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 160,
                    height: 100,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    border: "2px solid #e5e7eb",
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
            <Box display="flex" gap={1.5} justifyContent="center">
              <Button
                variant="outlined"
                size="small"
                onClick={clearSelection}
                sx={{ textTransform: "none", borderColor: "#dc2626", color: "#dc2626", fontSize: 13 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={isUploading ? <CircularProgress size={14} color="inherit" /> : <Upload size={14} />}
                onClick={handleUpload}
                disabled={isUploading}
                sx={{
                  backgroundColor: "#111827",
                  color: "white",
                  textTransform: "none",
                  fontSize: 13,
                  "&:hover": { backgroundColor: "#374151" },
                }}
              >
                {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} Image(s)`}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Current images grid */}
      <Typography variant="body2" fontWeight={600} mb={1.5} sx={{ color: "#4B5563" }}>
        Current Images ({images.length})
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={28} />
        </Box>
      ) : images.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ border: "1px solid #e5e7eb", borderRadius: 2, p: 4, textAlign: "center", bgcolor: "white" }}
        >
          <ImageIcon size={32} className="mx-auto mb-1 text-gray-300" />
          <Typography variant="body2" sx={{ color: "#4B5563" }}>
            No custom images uploaded. Default images are being used.
          </Typography>
        </Paper>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={2}>
          {images.map((url, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                overflow: "hidden",
                "&:hover .del-icon": { opacity: 1 },
              }}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }}
              />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={1.5}
                py={0.5}
                sx={{ backgroundColor: "#fafbfc" }}
              >
                <Typography fontSize={12} color="text.secondary">
                  Image {index + 1}
                </Typography>
                <IconButton
                  className="del-icon"
                  size="small"
                  onClick={() => onDelete(url)}
                  sx={{
                    color: "#dc2626",
                    opacity: 0.5,
                    transition: "opacity 0.2s",
                    "&:hover": { backgroundColor: "#fef2f2", opacity: 1 },
                  }}
                >
                  <Trash2 size={14} />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─── Main Screen ───
const ManageBannerScreen = () => {
  const { showAlert } = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [aboutUsImages, setAboutUsImages] = useState<string[]>([]);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = (await bannerApi.getAllHomepageImages()) as any;
      if (response.status === true && response.data) {
        setBannerImages(response.data.bannerImages || []);
        setAboutUsImages(response.data.aboutUsImages || []);
      }
    } catch {
      // Silent - fallback to defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Banner handlers ───
  const handleBannerUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("bannerImages", f));
      const res = (await bannerApi.uploadBannerImages(formData)) as any;
      if (res.status === true) {
        showAlert(res.message || "Banner images uploaded!", "success");
        fetchAll();
      } else {
        showAlert(res.message || "Upload failed", "error");
      }
    } catch (e: any) {
      showAlert(e?.response?.data?.message || "Upload error", "error");
    }
  };

  const handleBannerDelete = async (url: string) => {
    if (!window.confirm("Delete this banner image?")) return;
    try {
      const res = (await bannerApi.deleteBannerImage(encodeURIComponent(url))) as any;
      if (res.status === true) {
        setBannerImages((prev) => prev.filter((u) => u !== url));
        showAlert("Deleted", "success");
      } else {
        showAlert(res.message || "Delete failed", "error");
      }
    } catch (e: any) {
      showAlert(e?.response?.data?.message || "Delete error", "error");
    }
  };

  // ─── About Us handlers ───
  const handleAboutUsUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("aboutUsImages", f));
      const res = (await bannerApi.uploadAboutUsImages(formData)) as any;
      if (res.status === true) {
        showAlert(res.message || "About Us images uploaded!", "success");
        fetchAll();
      } else {
        showAlert(res.message || "Upload failed", "error");
      }
    } catch (e: any) {
      showAlert(e?.response?.data?.message || "Upload error", "error");
    }
  };

  const handleAboutUsDelete = async (url: string) => {
    if (!window.confirm("Delete this About Us image?")) return;
    try {
      const res = (await bannerApi.deleteAboutUsImage(encodeURIComponent(url))) as any;
      if (res.status === true) {
        setAboutUsImages((prev) => prev.filter((u) => u !== url));
        showAlert("Deleted", "success");
      } else {
        showAlert(res.message || "Delete failed", "error");
      }
    } catch (e: any) {
      showAlert(e?.response?.data?.message || "Delete error", "error");
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ color: "#111827" }} fontWeight="bold" mb={4}>
        Manage Homepage Images
      </Typography>

      {/* Hero Banner Section */}
      <ImageUploadSection
        title="Hero Banner Images"
        subtitle="These images rotate in the hero banner at the top of the homepage."
        images={bannerImages}
        isLoading={isLoading}
        fieldName="bannerImages"
        onUpload={handleBannerUpload}
        onDelete={handleBannerDelete}
      />

      <Divider sx={{ my: 4 }} />

      {/* About Us Section */}
      <ImageUploadSection
        title="About Us Images"
        subtitle="The 3 images shown in the About Us section on the homepage."
        images={aboutUsImages}
        isLoading={isLoading}
        fieldName="aboutUsImages"
        onUpload={handleAboutUsUpload}
        onDelete={handleAboutUsDelete}
      />
    </Box>
  );
};

export default ManageBannerScreen;
