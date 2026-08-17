import React, { useRef } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    file: File | null;
    onFileChange: (file: File | null) => void;
}

const ReviewerCVUpload: React.FC<Props> = ({ file, onFileChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Check file type and size
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert(t('reviewerRegistration.cvUpload.sizeError'));
                return;
            }
            onFileChange(selectedFile);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert(t('reviewerRegistration.cvUpload.sizeError'));
                return;
            }
            onFileChange(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-4 py-2">
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                {t('reviewerRegistration.cvUpload.instructions')}
            </p>

            {!file ? (
                <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,.doc,.docx"
                    />
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-[#1E293B] dark:text-[#F8FAFC] mb-1">{t('reviewerRegistration.cvUpload.uploadTitle')}</h3>
                    <p className="text-sm text-[#64748B]">{t('reviewerRegistration.cvUpload.dragDrop')}</p>
                    <p className="text-xs text-[#94A3B8] mt-2">{t('reviewerRegistration.cvUpload.formats')}</p>
                </div>
            ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between bg-white dark:bg-dark-surface">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 text-[#6B1D4A] rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={24} />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="font-medium text-[#1E293B] dark:text-[#F8FAFC] truncate">{file.name}</h4>
                            <p className="text-xs text-[#64748B]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onFileChange(null)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove file"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewerCVUpload;
