import { useState, useEffect } from "react";
import { Typography, IconButton, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Trash2, Plus } from "lucide-react";
import { callAPI } from "../../../config/AxiosInstance";
import { useAlert } from "../../../components/common/AlertContextScreen";

interface Mcq {
    _id: string;
    questionText: string;
    options: string[];
    correctOptionIndex: number;
}

const ReviewerSettingsPage = () => {
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const [mcqs, setMcqs] = useState<Mcq[]>([]);
    const [isMcqModalOpen, setIsMcqModalOpen] = useState(false);
    
    const [newMcq, setNewMcq] = useState({
        questionText: "",
        option0: "", option1: "", option2: "", option3: "",
        correctOptionIndex: 0
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            try {
                const videoRes = await callAPI<any>("GET", "/reviewer-config/video");
                if (videoRes.data?.trainingVideoUrl) {
                    setVideoUrl(videoRes.data.trainingVideoUrl);
                }
            } catch (err) {
                console.warn("Training video not found or error fetching it.");
            }

            try {
                const mcqsRes = await callAPI<any>("GET", "/admin/mcqs");
                if (mcqsRes.data && Array.isArray(mcqsRes.data)) {
                    setMcqs(mcqsRes.data);
                } else if (mcqsRes.data?.data && Array.isArray(mcqsRes.data.data)) {
                    setMcqs(mcqsRes.data.data);
                } else if (Array.isArray(mcqsRes)) {
                    setMcqs(mcqsRes);
                }
            } catch (err) {
                console.error("Error fetching MCQs", err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoUpload = async () => {
        if (!videoFile) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("video", videoFile);
            const res = await callAPI<any>("POST", "/reviewer-config/video", formData, {
                "Content-Type": "multipart/form-data"
            });
            showAlert("Training video updated successfully", "success");
            setVideoUrl(res.data.trainingVideoUrl);
            setVideoFile(null);
        } catch (error) {
            showAlert("Failed to upload video", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMcq = async () => {
        const { questionText, option0, option1, option2, option3, correctOptionIndex } = newMcq;
        if (!questionText || !option0 || !option1 || !option2 || !option3) {
            showAlert("Please fill all MCQ fields", "error");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                questionText,
                options: [option0, option1, option2, option3],
                correctOptionIndex: Number(correctOptionIndex)
            };
            await callAPI("POST", "/admin/mcqs", payload);
            showAlert("MCQ added successfully", "success");
            setIsMcqModalOpen(false);
            setNewMcq({ questionText: "", option0: "", option1: "", option2: "", option3: "", correctOptionIndex: 0 });
            fetchSettings();
        } catch (error) {
            showAlert("Failed to add MCQ", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMcq = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this MCQ?")) return;
        try {
            await callAPI("DELETE", `/admin/mcqs/${id}`);
            showAlert("MCQ deleted successfully", "success");
            fetchSettings();
        } catch (error) {
            showAlert("Failed to delete MCQ", "error");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">Reviewer Settings</h1>
                <p className="text-[#64748B]">Manage reviewer training video and MCQ assessment.</p>
            </div>

            {/* Video Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Typography variant="h6" fontWeight="bold" gutterBottom>Training Video</Typography>
                
                {videoUrl && (
                    <div className="mb-4 aspect-video w-full max-w-lg bg-black rounded-lg overflow-hidden">
                        <video src={videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                    <input 
                        type="file" 
                        accept="video/mp4,video/webm" 
                        onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6B1D4A] file:text-white hover:file:bg-[#8C2963]"
                    />
                    {videoFile && (
                        <Button 
                            variant="contained" 
                            onClick={handleVideoUpload} 
                            disabled={isLoading}
                            sx={{ backgroundColor: '#6B1D4A', '&:hover': { backgroundColor: '#8C2963' } }}
                        >
                            Upload Video
                        </Button>
                    )}
                </div>
            </div>

            {/* MCQ Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h6" fontWeight="bold">MCQ Question Pool ({mcqs.length})</Typography>
                    <Button 
                        variant="outlined" 
                        startIcon={<Plus size={16} />}
                        onClick={() => setIsMcqModalOpen(true)}
                        sx={{ borderColor: '#6B1D4A', color: '#6B1D4A', '&:hover': { borderColor: '#8C2963', backgroundColor: 'rgba(107,29,74,0.04)' } }}
                    >
                        Add Question
                    </Button>
                </div>

                <div className="space-y-4">
                    {mcqs.map((mcq, idx) => (
                        <div key={mcq._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-[#1E293B]">Q{idx + 1}: {mcq.questionText}</h4>
                                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                                    {mcq.options.map((opt, optIdx) => (
                                        <li key={optIdx} className={optIdx === mcq.correctOptionIndex ? "text-green-600 font-medium" : ""}>
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <IconButton onClick={() => handleDeleteMcq(mcq._id)} size="small" color="error">
                                <Trash2 size={18} />
                            </IconButton>
                        </div>
                    ))}
                    {mcqs.length === 0 && <p className="text-gray-500 text-center py-4">No questions added yet.</p>}
                </div>
            </div>

            {/* Add MCQ Dialog */}
            <Dialog open={isMcqModalOpen} onClose={() => setIsMcqModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New MCQ</DialogTitle>
                <DialogContent>
                    <div className="space-y-4 pt-2">
                        <TextField 
                            label="Question Text" fullWidth multiline rows={2}
                            value={newMcq.questionText} onChange={(e) => setNewMcq({...newMcq, questionText: e.target.value})}
                        />
                        <TextField 
                            label="Option 0" fullWidth size="small"
                            value={newMcq.option0} onChange={(e) => setNewMcq({...newMcq, option0: e.target.value})}
                        />
                        <TextField 
                            label="Option 1" fullWidth size="small"
                            value={newMcq.option1} onChange={(e) => setNewMcq({...newMcq, option1: e.target.value})}
                        />
                        <TextField 
                            label="Option 2" fullWidth size="small"
                            value={newMcq.option2} onChange={(e) => setNewMcq({...newMcq, option2: e.target.value})}
                        />
                        <TextField 
                            label="Option 3" fullWidth size="small"
                            value={newMcq.option3} onChange={(e) => setNewMcq({...newMcq, option3: e.target.value})}
                        />
                        <TextField 
                            label="Correct Option Index (0-3)" fullWidth size="small" type="number"
                            inputProps={{ min: 0, max: 3 }}
                            value={newMcq.correctOptionIndex} onChange={(e) => setNewMcq({...newMcq, correctOptionIndex: parseInt(e.target.value) || 0})}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsMcqModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMcq} variant="contained" sx={{ backgroundColor: '#6B1D4A' }}>Save</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default ReviewerSettingsPage;
