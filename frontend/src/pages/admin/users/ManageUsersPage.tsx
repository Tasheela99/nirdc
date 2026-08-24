import { useState, useEffect, useContext, useMemo } from "react";
import {
    Box,
    TableCell,
    TableRow,
    Typography,
    Switch,
    Chip,
    TablePagination
} from "@mui/material";
import { Search, Trash2 } from "lucide-react";
import adminApi from "../../../api/AdminApi";
import { useAlert } from "../../../components/common/AlertContextScreen";
import UserContext from '../../../store/UserContext';
import AdminTable from "../../../components/admin/AdminTable";
import EditUserModal from "./EditUserModal";

const ManageUsersPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const { showAlert } = useAlert();
    const { userInfo } = useContext(UserContext);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        const q = searchQuery.toLowerCase();
        return users.filter((u: any) =>
            u?.userName?.toLowerCase().includes(q) ||
            u?.email?.toLowerCase().includes(q) ||
            u?.role?.toLowerCase().includes(q)
        );
    }, [users, searchQuery]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = (await adminApi.getAllUsers(page + 1, rowsPerPage)) as any;
            if (response.status === true) {
                setUsers(response.data);
                setTotalUsers(response.totalUsers || response.data.length);
            } else {
                showAlert("Failed to fetch users. Please try again.", "error");
            }
        } catch (error) {
            console.log(error);
            showAlert("Failed to fetch users. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (user: any) => {
        if (!window.confirm(`Are you sure you want to delete user ${user.userName}?`)) return;
        try {
            setIsLoading(true);
            const adminPassword = prompt('Enter your password to confirm deletion:');
            if (!adminPassword) {
                setIsLoading(false);
                showAlert('Password is required to delete a user.', 'error');
                return;
            }
            const response = await adminApi.deleteUser(user._id, adminPassword);
            if (typeof response === 'object' && response !== null && 'status' in response) {
                if ((response as any).status) {
                    setUsers(users.filter((u: any) => u._id !== user._id));
                    showAlert('User deleted successfully.', 'success');
                } else {
                    showAlert((response as any).message || 'Failed to delete user.', 'error');
                }
            } else {
                showAlert('Unexpected error occurred while deleting user.', 'error');
            }
        } catch (error) {
            console.log(error);
            showAlert('Failed to delete user. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async (user: any) => {
        try {
            const newStatus = !user.activeState;
            const response = await adminApi.updateUser(user._id, { activeState: newStatus });
            if (typeof response === 'object' && response !== null && 'status' in response && (response as any).status) {
                setUsers(users.map((u: any) => 
                    u._id === user._id ? { ...u, activeState: newStatus } : u
                ));
                showAlert(`User status updated to ${newStatus ? 'Active' : 'Inactive'}.`, 'success');
            } else {
                showAlert('Failed to update status.', 'error');
            }
        } catch (error) {
            console.log(error);
            showAlert('Failed to update status.', 'error');
        }
    };

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setEditModalOpen(false);
        fetchUsers();
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage]);

    const canManage = userInfo?.role === 'SUPER_ADMIN' || userInfo?.role === 'ADMIN';

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'error';
            case 'DIRECTOR': return 'warning';
            case 'REVIEWER': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ color: '#003893' }} fontWeight="bold">
                    Manage Users
                </Typography>
            </Box>

            <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, email or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all max-w-md"
                />
            </div>

            <AdminTable
                isLoading={isLoading}
                emptyMessage="No users found."
                columns={[
                    { key: '#', label: '#', width: 50 },
                    { key: 'name', label: 'User Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'role', label: 'Role' },
                    { key: 'status', label: 'Status', align: 'center' as const },
                    ...(canManage ? [{ key: 'actions', label: 'Actions', align: 'center' as const, width: 100 }] : []),
                ]}
                rows={filteredUsers.map((user: any, index: number) => (
                    <TableRow key={user._id ?? index} sx={{ '&:last-child td': { borderBottom: 0 }, bgcolor: 'white' }}>
                        <TableCell sx={{ color: '#6B7280', fontSize: '0.85rem' }}>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{user?.userName}</TableCell>
                        <TableCell sx={{ color: '#4B5563', fontSize: '0.85rem' }}>{user?.email}</TableCell>
                        <TableCell>
                            <Chip label={user?.role} color={getRoleColor(user?.role)} size="small" />
                        </TableCell>
                        <TableCell align="center">
                            <Switch 
                                checked={user?.activeState !== false} 
                                onChange={() => handleToggleStatus(user)} 
                                disabled={!canManage}
                                color="primary" 
                            />
                        </TableCell>
                        {canManage && (
                            <TableCell align="center">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            />
            
            <TablePagination
                component="div"
                count={totalUsers}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <EditUserModal 
                open={editModalOpen} 
                onClose={() => setEditModalOpen(false)} 
                onSuccess={handleEditSuccess} 
                user={selectedUser} 
            />
        </Box>
    );
};

export default ManageUsersPage;
