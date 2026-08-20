import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, CircularProgress, Paper } from "@mui/material";
import { UploadCloud, ArrowLeft, File as FileIcon } from "lucide-react";
import downloadApi from "../../../api/DownloadApi.ts";
import { useAlert } from "@/components/common/AlertContextScreen.tsx";

const CreateDownloadPage = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            showAlert("Please enter a title for the download.", "warning");
            return;
        }

        if (!file) {
            showAlert("Please upload a file.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        try {
            setIsLoading(true);
            const response = await downloadApi.createDownload(formData) as any;

            if (response.status === true || response.success) {
                showAlert("Download created successfully!", "success");
                navigate("/admin/manage-downloads");
            } else {
                showAlert(response.message || "Failed to create download.", "error");
            }
        } catch (error: any) {
            showAlert(error.response?.data?.message || "Failed to create download. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 4, maxWidth: '800px', margin: '0 auto' }}>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
                <button
                    onClick={() => navigate("/admin/manage-downloads")}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <Typography variant="h5" sx={{ color: '#003893' }} fontWeight="bold">
                    Create New Download
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ padding: 4, border: '1px solid #e5e7eb', borderRadius: 3 }}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Typography variant="subtitle2" fontWeight={600} mb={1} color="textSecondary">
                            Document Title <span className="text-red-500">*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="e.g. Annual Report 2025"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Typography variant="subtitle2" fontWeight={600} mb={1} color="textSecondary">
                            Upload File <span className="text-red-500">*</span>
                        </Typography>
                        <div className="mt-1">
                            {file ? (
                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                            <FileIcon className="text-green-600" size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        <button 
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group w-full">
                                    <div className="space-y-1 text-center">
                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#003893] transition-colors" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="font-medium text-[#003893] group-hover:text-[#002a6f]">
                                                Click to upload a file
                                            </span>
                                            <input name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                                        </div>
                                        <p className="text-xs text-gray-500">PDF, DOCX, XLSX, etc up to 50MB</p>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/admin/manage-downloads")}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{ backgroundColor: '#003893', minWidth: '120px' }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save Download"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateDownloadPage;
