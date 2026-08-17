import React from "react";

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 w-full max-w-md">
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-800 float-right"
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
