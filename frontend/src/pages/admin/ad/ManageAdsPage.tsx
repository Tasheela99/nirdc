import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../components/common/AlertContextScreen";
import UserContext from "../../../store/UserContext";
import adApi from "../../../api/AdApi";
import {
  Box,
  Button,
  TableCell,
  TableRow,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Plus, Search, Pencil, Trash2, RefreshCw } from "lucide-react";
import AdminTable from "../../../components/admin/AdminTable";

const ManageAdsScreen = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { isLoggedIn, isAdmin } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [ads, setAds] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = (await adApi.getAllAds()) as any;
      if (response.status === true) {
        setAds(response.data);
      } else {
        showAlert(response.message || "Failed to fetch ads", "error");
      }
    } catch {
      showAlert("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  const handleDelete = async (id: string) => {
    if (!isLoggedIn || !isAdmin) {
      showAlert("You don't have permission to delete ads", "error");
      return;
    }

    if (window.confirm("Are you sure you want to delete this ad?")) {
      setIsLoading(true);
      try {
        const response = (await adApi.deleteAd(id)) as any;
        if (response.status === true) {
          setAds((prev) => prev.filter((ad) => ad._id !== id));
          showAlert("Ad deleted successfully", "success");
        } else {
          showAlert(response.message || "Failed to delete ad", "error");
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Error deleting ad";
        showAlert(msg, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (ad: any) => {
    navigate("/admin/create-ad", { state: { ad } });
  };

  const getStatus = (ad: any) => {
    if (ad.status === "Inactive") return { label: "Inactive", color: "#6b7280" };
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);
    if (now < start) return { label: "Scheduled", color: "#ca8a04" };
    if (now > end) return { label: "Expired", color: "#dc2626" };
    return { label: "Active", color: "#16a34a" };
  };

  const filteredAds = ads.filter((ad) =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return (
    <Box className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
        <div>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#111827" }}>
            Advertisements Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            Create, schedule, and manage promotional popup alerts and banner notices across the portal.
          </Typography>
        </div>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={15} />}
            onClick={fetchAds}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => navigate("/admin/create-ad")}
            sx={{
              backgroundColor: "#2563EB",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1D4ED8" }
            }}
          >
            Create New Ad
          </Button>
        </Box>
      </Box>

      {/* ─── Paper Container ─── */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {/* Search & Meta Bar */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white", px: 3, py: 2 }}>
          <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2}>
            <TextField
              size="small"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: "100%", sm: 380 }, bgcolor: "white" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
            <Chip
              label={`Total Ads: ${ads.length}`}
              size="small"
              sx={{ fontWeight: 700, bgcolor: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}
            />
          </Box>
        </Box>

        {/* Table Content */}
        <Box p={3} bgcolor="#FAFAFA">
          <AdminTable
            isLoading={isLoading}
            emptyMessage={searchQuery ? 'No ads match your search.' : 'No advertisements yet. Create one to get started!'}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'status', label: 'Status' },
              { key: 'start', label: 'Start Date' },
              { key: 'end', label: 'End Date' },
              { key: 'popup', label: 'Popup' },
              { key: 'actions', label: 'Actions', align: 'center', width: 90 },
            ]}
            rows={filteredAds.map((ad) => {
              const status = getStatus(ad);
              return (
                <TableRow key={ad._id} sx={{ '&:last-child td': { borderBottom: 0 }, bgcolor: 'white' }}>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={14}>{ad.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={ad.category} size="small" variant="outlined" sx={{ borderColor: '#D1D5DB', color: '#4B5563', fontWeight: 600, fontSize: 12 }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={status.label} size="small" variant="outlined" sx={{ borderColor: '#D1D5DB', color: '#4B5563', fontWeight: 600, fontSize: 12 }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{new Date(ad.startDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{new Date(ad.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={ad.showAsPopup ? 'ON' : 'OFF'} size="small" variant="outlined" sx={{ borderColor: '#D1D5DB', color: '#4B5563', fontWeight: 600, fontSize: 11 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      <button onClick={() => handleEdit(ad)} className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(ad._id)} className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ManageAdsScreen;
