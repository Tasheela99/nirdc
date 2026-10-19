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
            <p className="text-sm text-white/80">
                {t('reviewerRegistration.cvUpload.instructions')}
            </p>

            {!file ? (
                <div 
                    className="border-2 border-dashed border-white/25 rounded-2xl p-8 text-center bg-white/[0.03] hover:bg-white/[0.08] hover:border-pink-400/50 transition-all cursor-pointer group backdrop-blur-sm"
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
                    <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-pink-400/50 transition-all shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                        <UploadCloud size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{t('reviewerRegistration.cvUpload.uploadTitle')}</h3>
                    <p className="text-sm text-white/70">{t('reviewerRegistration.cvUpload.dragDrop')}</p>
                    <p className="text-xs text-white/50 mt-2">{t('reviewerRegistration.cvUpload.formats')}</p>
                </div>
            ) : (
                <div className="border border-white/15 rounded-2xl p-4 flex items-center justify-between bg-white/[0.06] backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-pink-500/15 border border-pink-500/30 text-pink-300 rounded-xl flex items-center justify-center shrink-0">
                            <FileText size={24} />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="font-medium text-white truncate">{file.name}</h4>
                            <p className="text-xs text-white/60">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onFileChange(null)}
                        className="p-2 text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
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
