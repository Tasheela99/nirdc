import React, { useEffect, useState } from "react";
import { eventEmitter } from "../../config/EventEmitter.ts";

const Loading: React.FC = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        eventEmitter.on("loading", (isLoading: boolean) => {
            setLoading(isLoading);
        });

        return () => {
            eventEmitter.on("loading", () => {}); // Cleanup
        };
    }, []);

    return loading ? (
        <div className="fixed inset-0 flex items-center justify-center flex-col bg-black bg-opacity-50 z-50">
            <div className="w-14 h-14 border-8 text-main-color border-white border-t-transparent rounded-full animate-spin mb-3"></div>
            <div className="font-bold text-white">Loading...</div>
        </div>
    ) : null;
};

export default Loading;
