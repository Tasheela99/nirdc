import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
} from "@mui/material";

interface Column {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    width?: number | string;
}

interface AdminTableProps {
    columns: Column[];
    rows: React.ReactNode[];        // Each element is a <TableRow>
    isLoading?: boolean;
    emptyMessage?: string;
    stickyHeader?: boolean;
}

/**
 * Shared AdminTable component.
 * Provides a consistent look for all admin data tables:
 *  - Light gray header row with bold labels
 *  - Subtle row hover effect
 *  - Standard border / elevation / border-radius
 *  - Centered spinner when loading
 *  - Centered empty-state message when no rows
 */
const AdminTable: React.FC<AdminTableProps> = ({
    columns,
    rows,
    isLoading = false,
    emptyMessage = "No records found.",
    stickyHeader = false,
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <CircularProgress />
            </div>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <Table stickyHeader={stickyHeader} size="small">
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                align={col.align ?? "left"}
                                width={col.width}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "0.8rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                    color: "#4B5563",
                                    backgroundColor: "#F9FAFB",
                                    borderBottom: "2px solid #E5E7EB",
                                    py: 1,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow sx={{ bgcolor: 'white' }}>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {emptyMessage}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AdminTable;
