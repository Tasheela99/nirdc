import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import blogApi from "../../../api/BlogApi.ts";
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

const ManageBlogScreen = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [blogList, setBlogList] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlog = useMemo(() => {
        if (!searchQuery.trim()) return blogList;
        const q = searchQuery.toLowerCase();
        return blogList.filter((blog: any) =>
            blog?.titleEn?.toLowerCase().includes(q) ||
            blog?.descriptionEn?.toLowerCase().includes(q)
        );
    }, [blogList, searchQuery]);

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true);
            const response = (await blogApi.deleteBlog(id)) as any;

            if (response.status === true) {
                setBlogList((prevList: any) => prevList.filter((blog: any) => blog._id !== id));
                showAlert("Blog deleted successfully.","success");
            } else {
                setError(response.message || "Failed to delete blog. Please try again.");
                showAlert(response.message || "Failed to delete blog. Please try again.", "error");
            }
        } catch {
            setError("Network error occurred. Please try again.");
            showAlert("Network error occurred. Please try again.","error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (blog: any) => {
        navigate("/admin/create-blog", { state: { blog } });
    };

    useEffect(() => {
        const fetchData = async () => {
            setError("");
            setIsLoading(true);

            try {
                const response = (await blogApi.getAllBlogs()) as any;

                if (response.status === true) {
                    setBlogList(response.data);
                } else {
                    setError(response.message || "Failed to fetch blog. Please try again.");
                    showAlert(response.message || "Failed to fetch blog. Please try again.", "error");
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
                    Manage Blog
                </Typography>
                <Button
                    variant="contained"
                    sx={{backgroundColor:'#003893'}}
                    onClick={() => navigate("/admin/create-blog")}
                >
                    Create Blog
                </Button>
            </Box>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by title or description..."
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
                emptyMessage="No blogs found."
                columns={[
                    { key: '#', label: '#', width: 50 },
                    { key: 'image', label: 'Image', width: 100 },
                    { key: 'title', label: 'Title' },
                    { key: 'content', label: 'Content' },
                    { key: 'date', label: 'Date Published' },
                    { key: 'actions', label: 'Actions', align: 'center', width: 130 },
                ]}
                rows={filteredBlog.map((blog: any, index: number) => (
                    <TableRow key={blog._id} sx={{ '&:last-child td': { borderBottom: 0 }, bgcolor: 'white' }}>
                        <TableCell sx={{ color: '#6B7280', fontSize: '0.85rem' }}>{index + 1}</TableCell>
                        <TableCell>
                            {blog?.commonImage ? (
                                <img src={blog.commonImage} alt="Thumbnail" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 6 }} />
                            ) : (
                                <span className="text-xs text-gray-400">No Image</span>
                            )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, maxWidth: 200 }}>{blog?.titleEn}</TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                            <div style={{ maxHeight: 52, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog?.descriptionEn || '') }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{blog?.date}</TableCell>
                        <TableCell align="center">
                            <Box display="flex" justifyContent="center" gap={0.5}>
                                <button onClick={() => handleEdit(blog)} className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" title="Edit"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(blog._id)} className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" title="Delete"><Trash2 size={16} /></button>
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
            />
        </Box>
    );
};

export default ManageBlogScreen;
