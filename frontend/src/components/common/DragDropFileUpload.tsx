import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';

interface DragDropFileUploadProps {
    fileList: FileList | null;
    onChange: (files: FileList | null) => void;
    accept?: string;
    maxSizeMB?: number;
    maxFiles?: number;
    label?: string;
}

const DragDropFileUpload: React.FC<DragDropFileUploadProps> = ({
    fileList,
    onChange,
    accept = ".pdf,.doc,.docx",
    maxSizeMB = 50,
    maxFiles = 5,
    label = "Create or import a file"
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileErrors, setFileErrors] = useState<{ name: string; error: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFiles = (newFiles: File[]) => {
        const errors: { name: string; error: string }[] = [];
        const validFiles: File[] = [];
        const currentFiles = fileList ? Array.from(fileList) : [];

        newFiles.forEach(file => {
            // Check size
            if (file.size > maxSizeMB * 1024 * 1024) {
                errors.push({ name: file.name, error: `File exceeds maximum size of ${maxSizeMB} MB` });
                return;
            }
            // Check type based on extension
            const extension = '.' + file.name.split('.').pop()?.toLowerCase();
            const acceptArray = accept.split(',').map(a => a.trim().toLowerCase());
            if (accept !== '*' && !acceptArray.includes(extension) && !acceptArray.includes(file.type)) {
                errors.push({ name: file.name, error: `File format not supported` });
                return;
            }
            
            // Check duplicates
            if (currentFiles.some(f => f.name === file.name && f.size === file.size)) {
                errors.push({ name: file.name, error: `File already added` });
                return;
            }

            validFiles.push(file);
        });

        if (currentFiles.length + validFiles.length > maxFiles) {
            errors.push({ name: 'Limit Exceeded', error: `Maximum of ${maxFiles} files allowed` });
            const availableSlots = maxFiles - currentFiles.length;
            validFiles.splice(availableSlots);
        }

        setFileErrors(prev => [...prev, ...errors]);

        if (validFiles.length > 0) {
            const dt = new DataTransfer();
            currentFiles.forEach(f => dt.items.add(f));
            validFiles.forEach(f => dt.items.add(f));
            onChange(dt.files);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (indexToRemove: number) => {
        if (!fileList) return;
        const dt = new DataTransfer();
        Array.from(fileList).forEach((file, index) => {
            if (index !== indexToRemove) dt.items.add(file);
        });
        onChange(dt.files.length > 0 ? dt.files : null);
    };

    const removeError = (index: number) => {
        setFileErrors(prev => prev.filter((_, i) => i !== index));
    };

    const formatSize = (bytes: number) => {
        if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / 1024).toFixed(1)} KB`;
    };

    return (
        <div className="w-full">
            {/* Dropzone */}
            <div 
                className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
                    ${isDragging ? 'border-[#2563EB] bg-[#2563EB]/5' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="relative mb-4 mt-2">
                    <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#2563EB] rounded-full p-1.5 text-white shadow-md border-2 border-white">
                        <UploadCloud className="w-4 h-4" />
                    </div>
                </div>
                
                <h3 className="text-gray-900 font-semibold text-base mb-2 mt-2">{label}</h3>
                <p className="text-gray-400 text-xs mb-1 font-medium">Maximum file size: {maxSizeMB} MB</p>
                <p className="text-gray-400 text-xs font-medium">Supported format: {accept.toUpperCase().replace(/\./g, '').replace(/,/g, ', ')}</p>
                
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept={accept}
                    multiple={maxFiles > 1}
                    className="hidden"
                />
            </div>

            {/* Error List */}
            {fileErrors.length > 0 && (
                <div className="mt-4 space-y-2">
                    {fileErrors.map((err, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">{err.name}</p>
                                    <p className="text-xs text-red-600">{err.error}</p>
                                </div>
                            </div>
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeError(idx); }} className="p-1 rounded-full hover:bg-red-100 text-red-500">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Uploaded Files List */}
            {fileList && fileList.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Template file to upload</h4>
                    <div className="space-y-3">
                        {Array.from(fileList).map((file, idx) => {
                            const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                            return (
                                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 bg-white rounded-xl shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[#E8F5E9] p-2.5 rounded-lg border border-[#C8E6C9] flex-shrink-0 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[#4CAF50]"></div>
                                            <FileText className="w-5 h-5 text-[#2E7D32]" />
                                            <div className="absolute bottom-1 right-1 bg-[#4CAF50] text-white text-[8px] font-bold px-1 rounded-sm">
                                                {ext.substring(0, 3)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[400px]">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {ext} • {formatSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                        className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DragDropFileUpload;
