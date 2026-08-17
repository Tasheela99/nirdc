import React, { useEffect, useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { PlayCircle, Maximize, CheckCircle } from "lucide-react";
import { callAPI } from "../../../config/AxiosInstance";
import { useAlert } from "../../../components/common/AlertContextScreen";
import { useTranslation } from "react-i18next";

interface Props {
    completed: boolean;
    onComplete: () => void;
}

const ReviewerTrainingVideo: React.FC<Props> = ({ completed, onComplete }) => {
    const { showAlert } = useAlert();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVideoEnded, setIsVideoEnded] = useState(completed);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { t } = useTranslation();

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        fetchVideoConfig();
    }, []);

    const fetchVideoConfig = async () => {
        try {
            const response = await callAPI<any>("GET", "/reviewer-config/video");
            if (response.data && response.data.trainingVideoUrl) {
                setVideoUrl(response.data.trainingVideoUrl);
            }
        } catch (error) {
            console.error("Error fetching video config", error);
            // It's okay if it fails, maybe not configured yet
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoEnd = () => {
        setIsVideoEnded(true);
        setIsPlaying(false);
    };

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const handleComplete = () => {
        if (isVideoEnded || completed) {
            onComplete();
        } else {
            showAlert(t('reviewerRegistration.video.warning'), "warning");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><CircularProgress sx={{ color: '#6B1D4A' }} /></div>;
    }

    if (!videoUrl) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <p className="mb-4">{t('reviewerRegistration.video.unavailable')}</p>
                <button 
                    onClick={onComplete}
                    className="px-6 py-2 bg-[#6B1D4A] hover:bg-[#8C2963] text-white rounded-lg"
                >
                    {t('reviewerRegistration.video.proceedBtn')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-2">
            <div 
                className="bg-black rounded-xl overflow-hidden shadow-md relative aspect-video flex items-center justify-center cursor-pointer group"
                onClick={togglePlay}
            >
                <video 
                    ref={videoRef}
                    src={videoUrl} 
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onContextMenu={(e) => e.preventDefault()}
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                />
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors pointer-events-auto" onClick={togglePlay}>
                            <PlayCircle size={40} className="text-white ml-1 opacity-90" />
                        </div>
                    </div>
                )}
                
                {/* Custom Fullscreen Button */}
                <button
                    onClick={toggleFullscreen}
                    className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors backdrop-blur-sm z-10"
                    title="Fullscreen"
                >
                    <Maximize size={20} />
                </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-500 font-medium">
                    {isVideoEnded ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/> {t('reviewerRegistration.video.completed')}</span> : t('reviewerRegistration.video.required')}
                </p>
                <button 
                    onClick={handleComplete} 
                    disabled={!isVideoEnded}
                    className={`px-8 py-2 rounded-lg font-semibold transition-all ${
                        isVideoEnded 
                        ? "bg-[#6B1D4A] hover:bg-[#8C2963] text-white" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {t('reviewerRegistration.video.proceedBtn')}
                </button>
            </div>
        </div>
    );
};

export default ReviewerTrainingVideo;
