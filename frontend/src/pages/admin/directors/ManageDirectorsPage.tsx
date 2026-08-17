import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { Plus, Search, Trash2 } from "lucide-react";
import adminApi from "../../../api/AdminApi.ts";
import { useAlert } from "../../../components/common/AlertContextScreen.tsx";
import UserContext from '../../../store/UserContext';
import AdminTable from "../../../components/admin/AdminTable";

const ManageDirectorsScreen = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [directors, setDirectors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { showAlert } = useAlert();
    const { userInfo } = useContext(UserContext);

    const filteredDirectors = useMemo(() => {
        if (!searchQuery.trim()) return directors;
        const q = searchQuery.toLowerCase();
        return directors.filter((d: any) =>
            d?.userName?.toLowerCase().includes(q) ||
            d?.institution?.toLowerCase().includes(q) ||
            d?.email?.toLowerCase().includes(q)
        );
    }, [directors, searchQuery]);

    const fetchDirectors = async () => {
        setIsLoading(true);
        try {
            const response = (await adminApi.getAllDirectors()) as any;
            if (response.status === true) {
                setDirectors(response.data);
            } else {
                showAlert("Failed to fetch directors. Please try again.", "error");
            }
        } catch (error) {
            console.log(error);
            showAlert("Failed to fetch directors. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDirector = async (director: any) => {
        if (!window.confirm(`Are you sure you want to delete director ${director.userName}?`)) return;
        try {
            setIsLoading(true);
            const adminPassword = prompt('Enter your password to confirm:');
            if (!adminPassword) {
                setIsLoading(false);
                showAlert('Password is required to delete director.', 'error');
                return;
            }
            const response = await adminApi.deleteUser(director._id, adminPassword);
            if (typeof response === 'object' && response !== null && 'status' in response) {
                if ((response as any).status) {
                    setDirectors(directors.filter((d: any) => d._id !== director._id));
                    showAlert('Director deleted successfully.', 'success');
                } else {
                    showAlert((response as any).message || 'Failed to delete director.', 'error');
                }
            } else {
                showAlert('Unexpected error occurred while deleting director.', 'error');
            }
        } catch (error) {
            console.log(error);
            showAlert('Failed to delete director. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDirectors();
    }, []);

    const canManage = userInfo?.role === 'SUPER_ADMIN' || userInfo?.role === 'ADMIN';

    return (
        <Box sx={{ padding: 4 }}>
            {/* Header — matches News/Blog/Announcements pages */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ color: '#003893' }} fontWeight="bold">
                    Manage Directors
                </Typography>
                {canManage && (
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#003893' }}
                        startIcon={<Plus size={18} />}
                        onClick={() => navigate("/admin/add-director")}
                    >
                        Add New Director
                    </Button>
                )}
            </Box>

            {/* Search Bar — matches News/Blog/Announcements pages */}
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, institution or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all max-w-md"
                />
            </div>

            <AdminTable
                isLoading={isLoading}
                emptyMessage="No directors found."
                columns={[
                    { key: '#', label: '#', width: 50 },
                    { key: 'name', label: 'Director Name' },
                    { key: 'institution', label: 'Institution' },
                    { key: 'email', label: 'Email' },
                    { key: 'mobile', label: 'Mobile' },
                    ...(canManage ? [{ key: 'actions', label: 'Actions', align: 'center' as const, width: 80 }] : []),
                ]}
                rows={filteredDirectors.map((director: any, index: number) => (
                    <TableRow key={director._id ?? index} sx={{ '&:last-child td': { borderBottom: 0 }, bgcolor: 'white' }}>
                        <TableCell sx={{ color: '#6B7280', fontSize: '0.85rem' }}>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{director?.userName}</TableCell>
                        <TableCell sx={{ color: '#4B5563', fontSize: '0.85rem' }}>{director?.institution}</TableCell>
                        <TableCell sx={{ color: '#4B5563', fontSize: '0.85rem' }}>{director?.email}</TableCell>
                        <TableCell sx={{ color: '#4B5563', fontSize: '0.85rem' }}>{director?.mobile}</TableCell>
                        {canManage && (
                            <TableCell align="center">
                                <button
                                    onClick={() => handleDeleteDirector(director)}
                                    className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            />
        </Box>
    );
};

export default ManageDirectorsScreen;
