import React, { createContext, useState, useContext, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface AlertContextType {
    showAlert: (message: string, severity: AlertColor) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");

    const showAlert = (message: string, severity: AlertColor) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleClose = () => {
        setAlertOpen(false);
    };

    const getBackgroundColor = (severity: AlertColor) => {
        switch (severity) {
            case 'error':
                return '#f44336';
            case 'warning':
                return '#ffa726';
            case 'info':
                return '#2196f3';
            case 'success':
                return '#4caf50';
            default:
                return '#4caf50';
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={alertSeverity}
                    sx={{ width: "100%", mt: 5, backgroundColor: getBackgroundColor(alertSeverity) ,color:'white'}}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
