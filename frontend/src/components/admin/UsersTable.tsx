import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination
} from "@mui/material";
import { User, Trash2, Eye } from "lucide-react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../store/UserContext";

interface UsersTableProps {
    users: any[];
    page: number;
    rowsPerPage: number;
    handleOpenDialog: (user: any) => void;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
    users,
    page,
    rowsPerPage,
    handleOpenDialog,
    handleChangePage,
    handleChangeRowsPerPage
}) => {
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const handleRowClick = (user: any) => {
        navigate(`/admin/user-profile/${user._id}`, { state: { user } });
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                background: 'linear-gradient(135deg, #001d4a 0%, #003893 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #001d4a 0%, #003893 100%) !important'
                                }
                            }}
                        >
                            <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5 }}>Avatar</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5 }}>User Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5 }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5 }}>Mobile</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5 }}>Designation</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5 }}>Institution</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', py: 1.5 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user, idx) => (
                                <TableRow
                                    key={user._id}
                                    onClick={() => handleRowClick(user)}
                                    sx={{
                                        backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white',
                                        '&:hover': { backgroundColor: '#eef2ff', cursor: 'pointer' },
                                        transition: 'background-color 0.15s ease',
                                    }}
                                >
                                    <TableCell sx={{ py: 1.5 }}>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User size={16} className="text-gray-500" />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.5, fontWeight: 500, color: '#1f2937' }}>{user.userName}</TableCell>
                                    <TableCell sx={{ py: 1.5, color: '#4b5563', fontSize: '0.85rem' }}>{user.email}</TableCell>
                                    <TableCell sx={{ py: 1.5, color: '#4b5563', fontSize: '0.85rem' }}>{user.mobile}</TableCell>
                                    <TableCell sx={{ py: 1.5, color: '#4b5563', fontSize: '0.85rem' }}>{user.designation}</TableCell>
                                    <TableCell sx={{ py: 1.5, color: '#4b5563', fontSize: '0.85rem' }}>{user.institution}</TableCell>
                                    <TableCell sx={{ py: 1.5 }}>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRowClick(user); }}
                                                className="p-1.5 rounded-lg text-[#003893] hover:bg-blue-50 transition-colors"
                                                title="View Profile"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {userInfo?.role === 'SUPER_ADMIN' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenDialog(user); }}
                                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default UsersTable;