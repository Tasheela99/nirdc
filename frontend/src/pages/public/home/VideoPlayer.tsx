import React, { useRef, useState } from "react";

interface VideoPlayerProps {
    src: string; // Video source URL or local file path
    poster?: string; // Optional poster image for the video
    width?: string | number; // Optional width of the video player
    height?: string | number; // Optional height of the video player
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
                                                     src,
                                                     poster,
                                                     width = "100%",
                                                     height = "auto",
                                                 }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1); // Default volume is 100%

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    return (
        <div className="video-player" style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                width={width}
                height={height}
                controls
                className="rounded-lg shadow-md"
            >
                Your browser does not support the video tag.
            </video>

            <div className="controls mt-4 flex items-center justify-center space-x-4">
                <button
                    onClick={togglePlay}
                    className="bg-main-color text-white px-4 py-2 rounded hover:bg-second-color"
                >
                    {isPlaying ? "Pause" : "Play"}
                </button>

                <label className="flex items-center">
                    <span className="mr-2">Volume</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24"
                    />
                </label>
            </div>
        </div>
    );
};

export default VideoPlayer;
