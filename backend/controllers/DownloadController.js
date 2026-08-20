const DownloadSchema = require('../schemas/DownloadSchema');
const { handleFileUploads, deleteFileFromAws, extractFileNameFromUrl, awsFolderNames } = require("../utils/FileUploadAwsUtil");
const cacheService = require("../services/CacheService");

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileType = (fileName) => {
    if (!fileName) return 'FILE';
    const parts = fileName.split('.');
    if (parts.length > 1) {
        return parts.pop().toUpperCase();
    }
    return 'FILE';
};

const createDownload = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user?.id || 'admin';

        if (!req.files || !req.files.file) {
            return res.status(400).json({ status: false, message: 'File is required.' });
        }

        const uploadedFile = req.files.file;
        const fileSize = formatFileSize(uploadedFile.size);
        const fileType = getFileType(uploadedFile.name);

        const urls = await handleFileUploads(uploadedFile, awsFolderNames.downloads, userId, 'file');
        const fileUrl = urls && urls.length > 0 ? urls[0] : null;

        if (!fileUrl) {
            return res.status(500).json({ status: false, message: 'File upload failed.' });
        }

        const newDownload = new DownloadSchema({
            title,
            fileUrl,
            fileType,
            fileSize,
            activeState: true,
        });

        await newDownload.save();
        await cacheService.clearPattern('downloads_*');

        return res.status(201).json({
            status: true,
            message: 'Download created successfully',
            data: newDownload,
        });
    } catch (error) {
        console.error('Error creating download:', error);
        return res.status(500).json({ status: false, message: error.message || 'Internal server error' });
    }
};

const getAllDownloads = async (req, res) => {
    try {
        const downloads = await DownloadSchema.find({ activeState: true })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: 'Downloads retrieved successfully',
            data: downloads
        });
    } catch (error) {
        console.error('Error fetching downloads:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

const deleteDownload = async (req, res) => {
    try {
        const id = req.params.id;
        const download = await DownloadSchema.findById(id);

        if (!download) {
            return res.status(404).json({ status: false, message: 'Download not found' });
        }

        if (download.fileUrl) {
            const fileName = extractFileNameFromUrl(download.fileUrl);
            if (fileName) {
                await deleteFileFromAws(fileName);
            }
        }

        await DownloadSchema.findByIdAndDelete(id);
        await cacheService.clearPattern('downloads_*');

        return res.status(200).json({
            status: true,
            message: 'Download deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting download:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

module.exports = {
    createDownload,
    getAllDownloads,
    deleteDownload
};
