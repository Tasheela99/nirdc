import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import newsApi from "../../../api/NewsApi.ts";
import {
    Box,
    Button,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import { Pencil, Search, Trash2 } from "lucide-react";
import AdminTable from "../../../components/admin/AdminTable";
import { useAlert } from "@/components/common/AlertContextScreen.tsx";

const ManageNewsScreen = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [newsList, setNewsList] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNews = useMemo(() => {
        if (!searchQuery.trim()) return newsList;
        const q = searchQuery.toLowerCase();
        return newsList.filter((news: any) =>
            news?.titleEn?.toLowerCase().includes(q) ||
            news?.contentEn?.toLowerCase().includes(q)
        );
    }, [newsList, searchQuery]);

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            const response = (await newsApi.deleteNews(id)) as any;

            if (response.status === true) {
                setNewsList((prevList: any) => prevList.filter((news: any) => news._id !== id));
                showAlert("News deleted successfully.","success");
            } else {
                setError(response.message || "Failed to delete news. Please try again.");
                showAlert(response.message || "Failed to delete news. Please try again.", "error");
            }
        } catch {
            setError("Network error occurred. Please try again.");
            showAlert("Network error occurred. Please try again.","error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (news: any) => {
        navigate("/admin/create-news", { state: { news } });
    };

    useEffect(() => {
        const fetchData = async () => {
            setError("");
            setIsLoading(true);

            try {
                const response = (await newsApi.getAllNews()) as any;

                if (response.status === true) {
                    setNewsList(response.data);
                } else {
                    setError(response.message || "Failed to fetch news. Please try again.");
                    showAlert(response.message || "Failed to fetch news. Please try again.", "error");
                }
            } catch {
                setError("Network error occurred. Please check your connection and try again.");
                showAlert("Network error occurred. Please check your connection and try again.","error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [showAlert]);

    return (
        <Box sx={{ padding: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{color:'#003893'}} fontWeight="bold">
                    Manage News
                </Typography>
                <Button
                    variant="contained"
                    sx={{backgroundColor:'#003893'}}
                    onClick={() => navigate("/admin/create-news")}
                >
                    Create News
                </Button>
            </Box>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by title or content..."
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
                emptyMessage="No news found."
                columns={[
                    { key: '#', label: '#', width: 50 },
                    { key: 'image', label: 'Image', width: 100 },
                    { key: 'title', label: 'Title' },
                    { key: 'content', label: 'Content' },
                    { key: 'date', label: 'Date Published' },
                    { key: 'actions', label: 'Actions', align: 'center', width: 130 },
                ]}
                rows={filteredNews.map((news: any, index: number) => (
                    <TableRow key={news._id} sx={{ '&:last-child td': { borderBottom: 0 }, bgcolor: 'white' }}>
                        <TableCell sx={{ color: '#6B7280', fontSize: '0.85rem' }}>{index + 1}</TableCell>
                        <TableCell>
                            {news?.commonImage ? (
                                <img src={news.commonImage} alt="Thumbnail" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 6 }} />
                            ) : (
                                <span className="text-xs text-gray-400">No Image</span>
                            )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, maxWidth: 200 }}>{news?.titleEn}</TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                            <div style={{ maxHeight: 52, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news?.contentEn || '') }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{news?.date}</TableCell>
                        <TableCell align="center">
                            <Box display="flex" justifyContent="center" gap={0.5}>
                                <button onClick={() => handleEdit(news)} className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" title="Edit"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(news._id)} className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" title="Delete"><Trash2 size={16} /></button>
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
            />
        </Box>
    );
};

export default ManageNewsScreen;
