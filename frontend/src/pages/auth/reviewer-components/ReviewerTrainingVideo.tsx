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
        return <div className="flex justify-center p-8"><CircularProgress sx={{ color: '#ec4899' }} /></div>;
    }

    if (!videoUrl) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-white/70">
                <p className="mb-4 text-center">{t('reviewerRegistration.video.unavailable')}</p>
                <button 
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#9d2e6f] hover:to-[#7c2256] text-white rounded-xl shadow-[0_4px_20px_rgba(140,41,99,0.4)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                className="bg-black/80 rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center cursor-pointer group border border-white/15 backdrop-blur-md"
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
                        <div className="w-16 h-16 bg-[#8C2963]/90 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform shadow-[0_0_25px_rgba(236,72,153,0.5)] border border-white/20">
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
                                className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 accent-[#ec4899]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-white">
                        <select 
                            value={playbackRate} 
                            onChange={changePlaybackRate}
                            className="bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-sm text-white outline-none cursor-pointer hover:bg-black/80 transition-colors backdrop-blur-md"
                        >
                            <option value={0.5} className="bg-[#1b0817] text-white">0.5x</option>
                            <option value={1} className="bg-[#1b0817] text-white">1x</option>
                            <option value={1.25} className="bg-[#1b0817] text-white">1.25x</option>
                            <option value={1.5} className="bg-[#1b0817] text-white">1.5x</option>
                            <option value={2} className="bg-[#1b0817] text-white">2x</option>
                        </select>
                        <button onClick={toggleFullscreen} className="hover:text-pink-300 transition-colors">
                            <Maximize size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-sm font-medium">
                    {isVideoEnded ? (
                        <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                            <CheckCircle size={16}/> {t('reviewerRegistration.video.completed')}
                        </span>
                    ) : (
                        <span className="text-white/70">
                            {t('reviewerRegistration.video.required')}
                        </span>
                    )}
                </p>
                <button 
                    onClick={handleComplete} 
                    disabled={!isVideoEnded || isSubmitting}
                    className={`px-8 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        isVideoEnded 
                        ? "bg-gradient-to-r from-[#8C2963] to-[#6B1D4A] hover:from-[#9d2e6f] hover:to-[#7c2256] text-white shadow-[0_4px_20px_rgba(140,41,99,0.4)] cursor-pointer" 
                        : "bg-white/10 text-white/40 border border-white/10 cursor-not-allowed"
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
