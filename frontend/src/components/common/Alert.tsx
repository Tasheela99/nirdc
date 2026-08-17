import React from "react";
import DOMPurify from "dompurify";

interface AlertComponentProps {
    message: string;
    onConfirm: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ message, onConfirm }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                {/* Use dangerouslySetInnerHTML to render HTML content */}
                <div
                    className="text-gray-800 text-lg font-medium mb-4"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }}
                ></div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 w-1/3 py-2 bg-main-color text-white rounded-lg hover:bg-main-color-light transition"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertComponent;
