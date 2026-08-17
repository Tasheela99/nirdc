import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import React from "react";

interface DeleteUserDialogProps {
    open: boolean;
    selectedUser: any;
    password: string;
    onClose: () => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
    open,
    selectedUser,
    password,
    onClose,
    onPasswordChange,
    onDelete
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
                <p>To delete {selectedUser?.userName}, please enter your password:</p>
                <TextField
                    label="Enter The Password"
                    autoFocus
                    margin="dense"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={onPasswordChange}
                    autoComplete="current-password"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onDelete} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;