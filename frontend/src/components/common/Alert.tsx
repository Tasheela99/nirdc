import React from "react";
import DOMPurify from "dompurify";

interface AlertComponentProps {
    message: string;
    onConfirm: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ message, onConfirm }) => {
    const isSuccess = message.toLowerCase().includes('success');
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 relative overflow-hidden flex flex-col items-center text-center">
                
                {/* Close Button */}
                <button 
                    onClick={onConfirm}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* SVG Icon */}
                <div className="mb-6 mt-4 flex items-center justify-center">
                    {isSuccess ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    )}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {isSuccess ? 'Success!' : 'Action Required'}
                </h2>

                {/* Message Content */}
                <div
                    className="text-gray-500 text-sm mb-8 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }}
                ></div>

                {/* Primary Button */}
                <button
                    onClick={onConfirm}
                    className="w-full py-3.5 px-4 bg-[#3B4A6B] hover:bg-[#2D3A56] text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                    {isSuccess ? 'Continue' : 'Got it'}
                </button>

                {/* Decorative Bottom Pattern (simulating the mountains from the image) */}
                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-10">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#000000" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default AlertComponent;
