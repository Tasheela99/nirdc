import React, { useEffect, useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { PlayCircle, Maximize, CheckCircle, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { callAPI } from "../../../config/AxiosInstance";
import { useAlert } from "../../../components/common/AlertContextScreen";
import { useTranslation } from "react-i18next";

interface Props {
    completed: boolean;
    onComplete: () => void | Promise<void>;
}

const ReviewerTrainingVideo: React.FC<Props> = ({ completed, onComplete }) => {
    const { showAlert } = useAlert();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVideoEnded, setIsVideoEnded] = useState(completed);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { t } = useTranslation();

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const controlsTimeoutRef = useRef<number | null>(null);

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

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (newMuted) {
                setVolume(0);
            } else {
                setVolume(1);
                videoRef.current.volume = 1;
            }
        }
    };

    const changePlaybackRate = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRate = parseFloat(e.target.value);
        setPlaybackRate(newRate);
        if (videoRef.current) {
            videoRef.current.playbackRate = newRate;
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 2000);
    };

    const handleMouseLeave = () => {
        if (isPlaying) setShowControls(false);
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

    const handleComplete = async () => {
        if (isVideoEnded || completed) {
            setIsSubmitting(true);
            try {
                await onComplete();
            } finally {
                setIsSubmitting(false);
            }
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
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#6B1D4A] hover:bg-[#8C2963] text-white rounded-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting && <CircularProgress size={18} color="inherit" />}
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
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
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
                
                {/* Big play button in center when paused */}
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-[#6B1D4A]/90 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
                            <PlayCircle size={32} className="ml-1" />
                        </div>
                    </div>
                )}
                
                {/* Custom Control Bar */}
                <div 
                    className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between gap-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-4 text-white">
                        <button onClick={togglePlay} className="hover:text-pink-300 transition-colors">
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        
                        <div className="flex items-center gap-2 group/volume">
                            <button onClick={toggleMute} className="hover:text-pink-300 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05" 
                                value={volume} 
                                onChange={handleVolumeChange} 
                                className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 accent-[#6B1D4A]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-white">
                        <select 
                            value={playbackRate} 
                            onChange={changePlaybackRate}
                            className="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm outline-none cursor-pointer hover:bg-black/70 transition-colors"
                        >
                            <option value={0.5}>0.5x</option>
                            <option value={1}>1x</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                        </select>
                        <button onClick={toggleFullscreen} className="hover:text-pink-300 transition-colors">
                            <Maximize size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-500 font-medium">
                    {isVideoEnded ? <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/> {t('reviewerRegistration.video.completed')}</span> : t('reviewerRegistration.video.required')}
                </p>
                <button 
                    onClick={handleComplete} 
                    disabled={!isVideoEnded || isSubmitting}
                    className={`px-8 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        isVideoEnded 
                        ? "bg-[#6B1D4A] hover:bg-[#8C2963] text-white disabled:opacity-70 disabled:cursor-not-allowed" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {isSubmitting && <CircularProgress size={18} color="inherit" />}
                    {t('reviewerRegistration.video.proceedBtn')}
                </button>
            </div>
        </div>
    );
};

export default ReviewerTrainingVideo;
