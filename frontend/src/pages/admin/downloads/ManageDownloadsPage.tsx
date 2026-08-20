import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import downloadApi from "../../../api/DownloadApi.ts";
import {
    Box,
    Button,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import { Search, Trash2, DownloadCloud } from "lucide-react";
import AdminTable from "../../../components/admin/AdminTable";
import { useAlert } from "@/components/common/AlertContextScreen.tsx";

const ManageDownloadsPage = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [downloadList, setDownloadList] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDownloads = useMemo(() => {
        if (!searchQuery.trim()) return downloadList;
        const q = searchQuery.toLowerCase();
        return downloadList.filter((download: any) =>
            download?.title?.toLowerCase().includes(q) ||
            download?.fileType?.toLowerCase().includes(q)
        );
    }, [downloadList, searchQuery]);

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true);
            const response = (await downloadApi.deleteDownload(id)) as any;

            if (response.status === true) {
                setDownloadList((prevList: any) => prevList.filter((d: any) => d._id !== id));
                showAlert("Download deleted successfully.", "success");
            } else {
                setError(response.message || "Failed to delete download. Please try again.");
                showAlert(response.message || "Failed to delete download. Please try again.", "error");
            }
        } catch {
            setError("Network error occurred. Please try again.");
            showAlert("Network error occurred. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setError("");
            setIsLoading(true);

            try {
                const response = (await downloadApi.getAllDownloads()) as any;

                if (response.status === true) {
                    setDownloadList(response.data);
                } else {
                    setError(response.message || "Failed to fetch downloads. Please try again.");
                    showAlert(response.message || "Failed to fetch downloads. Please try again.", "error");
                }
            } catch {
                setError("Network error occurred. Please check your connection and try again.");
                showAlert("Network error occurred. Please check your connection and try again.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [showAlert]);

    return (
        <Box sx={{ padding: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ color: '#003893' }} fontWeight="bold">
                    Manage Downloads
                </Typography>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#003893' }}
                    onClick={() => navigate("/admin/create-download")}
                    startIcon={<DownloadCloud size={18} />}
                >
                    Create Download
                </Button>
            </Box>

            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by title or file type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all max-w-md"
                />
            </div>

            {error && (
                <Typography color="error" textAlign="center" mb={2}>
                    {error}
                </Typography>
            )}

            <AdminTable
                isLoading={isLoading}
                emptyMessage="No downloads found."
                columns={[
                    { key: '#', label: '#', width: 50 },
                    { key: 'title', label: 'Title' },
                    { key: 'fileType', label: 'File Type', width: 100 },
                    { key: 'fileSize', label: 'Size', width: 100 },
                    { key: 'link', label: 'File URL', width: 150 },
                    { key: 'actions', label: 'Actions', align: 'center', width: 100 },
                ]}
                rows={filteredDownloads.map((download: any, index: number) => (
                    <TableRow key={download._id} sx={{ '&:last-child td': { borderBottom: 0 }, bgcolor: 'white' }}>
                        <TableCell sx={{ color: '#6B7280', fontSize: '0.85rem' }}>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{download?.title}</TableCell>
                        <TableCell>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">{download?.fileType}</span>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>{download?.fileSize}</TableCell>
                        <TableCell>
                            <a href={download?.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#003893] hover:underline text-sm font-medium">
                                View File
                            </a>
                        </TableCell>
                        <TableCell align="center">
                            <Box display="flex" justifyContent="center" gap={0.5}>
                                <button onClick={() => handleDelete(download._id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
            />
        </Box>
    );
};

export default ManageDownloadsPage;
