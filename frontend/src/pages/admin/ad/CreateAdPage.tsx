import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../../../components/common/AlertContextScreen";
import adApi from "../../../api/AdApi";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";

interface AdFormData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  showAsPopup: boolean;
  status: string;
  image: File | null;
}

const CreateAdScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const editAd = location.state?.ad;
  const isEdit = !!editAd;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AdFormData>({
    title: "",
    description: "",
    category: "General",
    startDate: "",
    endDate: "",
    showAsPopup: false,
    status: "Active",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editAd) {
      setFormData({
        title: editAd.title || "",
        description: editAd.description || "",
        category: editAd.category || "General",
        startDate: editAd.startDate ? new Date(editAd.startDate).toISOString().split("T")[0] : "",
        endDate: editAd.endDate ? new Date(editAd.endDate).toISOString().split("T")[0] : "",
        showAsPopup: editAd.showAsPopup || false,
        status: editAd.status || "Active",
        image: null,
      });
      if (editAd.imageUrl) {
        setImagePreview(editAd.imageUrl);
      }
    }
  }, [editAd]);

  const handleChange = (field: keyof AdFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!formData.title.trim()) {
      showAlert("Title is required", "error");
      return;
    }
    if (!formData.description.trim()) {
      showAlert("Description is required", "error");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      showAlert("Start date and end date are required", "error");
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      showAlert("End date must be after start date", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("startDate", formData.startDate);
      payload.append("endDate", formData.endDate);
      payload.append("showAsPopup", String(formData.showAsPopup));
      payload.append("status", formData.status);
      if (formData.image) {
        payload.append("image", formData.image);
      }

      let response: any;
      if (isEdit) {
        response = await adApi.updateAd(editAd._id, payload);
      } else {
        response = await adApi.createAd(payload);
      }

      if (response.status === true) {
        showAlert(
          isEdit ? "Ad updated successfully!" : "Ad created successfully!",
          "success"
        );
        navigate("/admin/manage-ads");
      } else {
        showAlert(response.message || "Failed to save ad", "error");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Error saving ad";
      showAlert(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <button
          onClick={() => navigate("/admin/manage-ads")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <Typography variant="h4" sx={{ color: "#003893" }} fontWeight="bold">
          {isEdit ? "Edit Advertisement" : "Create Advertisement"}
        </Typography>
      </Box>

      <div className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        {/* Title */}
        <TextField
          fullWidth
          label="Title"
          required
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          required
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* Category & Status */}
        <Box display="flex" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <MenuItem value="Vacancy">Vacancy</MenuItem>
              <MenuItem value="Tender">Tender</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
              <MenuItem value="General">General</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Dates */}
        <Box display="flex" gap={3}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            required
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            required
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </Box>

        {/* Popup Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.showAsPopup}
              onChange={(e) => handleChange("showAsPopup", e.target.checked)}
              color="primary"
            />
          }
          label={
            <div>
              <span className="font-medium">Show as Popup</span>
              <p className="text-sm text-gray-500 mt-0.5">
                Display this ad as a popup when users visit the website
              </p>
            </div>
          }
        />

        {/* Image Upload */}
        <div>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Banner Image (Optional)
          </Typography>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#003893] transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
              id="adImageUpload"
            />
            <label htmlFor="adImageUpload" className="cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-cover"
                />
              ) : (
                <div className="text-gray-400">
                  <p className="text-lg font-medium">Click to upload image</p>
                  <p className="text-sm mt-1">JPG, PNG, WebP (Max 5MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit */}
        <Box display="flex" justifyContent="flex-end" gap={2} pt={2}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/manage-ads")}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
            sx={{
              backgroundColor: "#003893",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#002a6e" },
            }}
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Ad" : "Create Ad"}
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default CreateAdScreen;
