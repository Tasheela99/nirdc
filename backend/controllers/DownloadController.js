const DownloadSchema = require('../schemas/DownloadSchema');
const { handleFileUploads, deleteFileFromAws, extractFileNameFromUrl, awsFolderNames } = require("../utils/FileUploadAwsUtil");
const cacheService = require("../services/CacheService");
const logger = require("../utils/LoggerUtil");

const CATEGORY_PRESETS = {
    CIRCULAR: {
        en: 'Circular Templates',
        si: 'චක්‍රලේඛ ආකෘති',
        ta: 'சுற்றறிக்கை படிவங்கள்'
    },
    REPORT: {
        en: 'Report Templates',
        si: 'වාර්තා ආකෘති',
        ta: 'அறிக்கை படிவங்கள்'
    },
    ETHICS: {
        en: 'Code of Ethics Templates',
        si: 'ආචාරධර්ම සංග්‍රහ ආකෘති',
        ta: 'நெறிமுறை விதிகள் படிவங்கள்'
    },
    DOCUMENT: {
        en: 'Document Templates',
        si: 'ලේඛන ආකෘති',
        ta: 'ஆவணப் படிவங்கள்'
    },
    APPLICATION: {
        en: 'Job Application Forms',
        si: 'තනතුරු සඳහා අයදුම්පත් ආකෘති',
        ta: 'வேலை விண்ணப்பப் படிவங்கள்'
    },
    OTHER: {
        en: 'General Downloads',
        si: 'සාමාන්‍ය බාගත කිරීම්',
        ta: 'பொது பதிவிறக்கங்கள்'
    }
};

const parseJsonIfNeeded = (val) => {
    if (!val) return val;
    if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (_) { return val; }
    }
    return val;
};

const normalizeMultiLang = (val, fallback = '') => {
    if (!val) return { en: fallback, si: '', ta: '' };
    const parsed = parseJsonIfNeeded(val);
    if (typeof parsed === 'string') {
        return { en: parsed.trim(), si: '', ta: '' };
    }
    return {
        en: typeof parsed.en === 'string' ? parsed.en.trim() : fallback,
        si: typeof parsed.si === 'string' ? parsed.si.trim() : '',
        ta: typeof parsed.ta === 'string' ? parsed.ta.trim() : '',
    };
};

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileType = (fileName) => {
    if (!fileName) return 'PDF';
    const parts = fileName.split('.');
    if (parts.length > 1) {
        return parts.pop().toUpperCase();
    }
    return 'PDF';
};

/**
 * Normalize download item for safe client consumption
 */
const formatDownloadItem = (item) => {
    if (!item) return item;
    const normalizedTitle = typeof item.title === 'string'
        ? { en: item.title, si: '', ta: '' }
        : item.title || { en: '', si: '', ta: '' };

    const catKey = (item.categoryKey || 'CIRCULAR').toUpperCase();
    const presetCat = CATEGORY_PRESETS[catKey] || CATEGORY_PRESETS.CIRCULAR;

    const normalizedCategory = (item.category && (item.category.en || item.category.si || item.category.ta))
        ? item.category
        : presetCat;

    return {
        ...item,
        title: normalizedTitle,
        categoryKey: catKey,
        category: normalizedCategory,
        description: item.description || { en: '', si: '', ta: '' },
    };
};

/**
 * Create Download
 * POST /api/v1/downloads
 * Admin only
 */
const createDownload = async (req, res) => {
    try {
        let {
            title,
            categoryKey,
            category,
            description,
            documentNumber,
            publishDate,
            order,
            activeState,
            fileUrl: directFileUrl
        } = req.body;

        const userId = req.user?.id || 'admin';

        let fileUrl = directFileUrl || null;
        let fileSize = '0 MB';
        let fileType = 'PDF';
        let fileName = '';

        if (req.files && req.files.file) {
            const uploadedFile = req.files.file;
            fileSize = formatFileSize(uploadedFile.size);
            fileType = getFileType(uploadedFile.name);
            fileName = uploadedFile.name;

            const urls = await handleFileUploads(uploadedFile, awsFolderNames.downloads, userId, 'file');
            fileUrl = urls && urls.length > 0 ? urls[0] : null;
        }

        if (!fileUrl) {
            return res.status(400).json({
                status: false,
                message: 'A file attachment or file URL is required.'
            });
        }

        const validCatKey = (categoryKey && CATEGORY_PRESETS[categoryKey.toUpperCase()])
            ? categoryKey.toUpperCase()
            : 'CIRCULAR';

        const finalCategory = category
            ? normalizeMultiLang(category)
            : CATEGORY_PRESETS[validCatKey];

        const newDownload = new DownloadSchema({
            title: normalizeMultiLang(title, fileName || 'Download Document'),
            categoryKey: validCatKey,
            category: finalCategory,
            description: normalizeMultiLang(description),
            documentNumber: documentNumber ? String(documentNumber).trim() : '',
            publishDate: publishDate ? new Date(publishDate) : new Date(),
            order: order !== undefined ? Number(order) : 0,
            fileUrl,
            fileName,
            fileType,
            fileSize,
            downloadCount: 0,
            activeState: activeState !== undefined ? Boolean(activeState) : true,
        });

        await newDownload.save();
        await cacheService.clearPattern('downloads_*');

        return res.status(201).json({
            status: true,
            message: 'Download item created successfully',
            data: formatDownloadItem(newDownload.toObject()),
        });
    } catch (error) {
        logger.error('Error creating download:', { error: error.message });
        return res.status(500).json({
            status: false,
            message: error.message || 'Failed to create download'
        });
    }
};

/**
 * Get all active downloads (Public)
 * GET /api/v1/downloads
 */
const getAllDownloads = async (req, res) => {
    try {
        const { categoryKey, search } = req.query;
        const filter = { activeState: true };

        if (categoryKey && categoryKey !== 'ALL') {
            filter.categoryKey = categoryKey.toUpperCase();
        }

        if (search && String(search).trim()) {
            const regex = new RegExp(String(search).trim(), 'i');
            filter.$or = [
                { 'title.en': regex },
                { 'title.si': regex },
                { 'title.ta': regex },
                { 'description.en': regex },
                { 'description.si': regex },
                { 'documentNumber': regex },
            ];
        }

        const downloads = await DownloadSchema.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .lean();

        const formatted = downloads.map(formatDownloadItem);

        return res.status(200).json({
            status: true,
            message: 'Downloads retrieved successfully',
            count: formatted.length,
            categories: CATEGORY_PRESETS,
            data: formatted
        });
    } catch (error) {
        logger.error('Error fetching downloads:', { error: error.message });
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch downloads',
            error: error.message
        });
    }
};

/**
 * Get all downloads including inactive (Admin)
 * GET /api/v1/downloads/admin/all
 */
const getAllDownloadsAdmin = async (req, res) => {
    try {
        const { categoryKey } = req.query;
        const filter = {};

        if (categoryKey && categoryKey !== 'ALL') {
            filter.categoryKey = categoryKey.toUpperCase();
        }

        const downloads = await DownloadSchema.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .lean();

        const formatted = downloads.map(formatDownloadItem);

        return res.status(200).json({
            status: true,
            message: 'All downloads retrieved for admin',
            totalCount: formatted.length,
            activeCount: formatted.filter(d => d.activeState).length,
            categories: CATEGORY_PRESETS,
            data: formatted
        });
    } catch (error) {
        logger.error('Error fetching admin downloads:', { error: error.message });
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch all downloads',
            error: error.message
        });
    }
};

/**
 * Get single download by ID
 * GET /api/v1/downloads/:id
 */
const getDownloadById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await DownloadSchema.findById(id).lean();

        if (!item) {
            return res.status(404).json({
                status: false,
                message: 'Download item not found'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Download retrieved successfully',
            data: formatDownloadItem(item)
        });
    } catch (error) {
        logger.error('Error fetching download by ID:', { error: error.message });
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch download',
            error: error.message
        });
    }
};

/**
 * Update Download
 * PUT /api/v1/downloads/:id
 * Admin only
 */
const updateDownload = async (req, res) => {
    try {
        const { id } = req.params;
        const download = await DownloadSchema.findById(id);

        if (!download) {
            return res.status(404).json({
                status: false,
                message: 'Download item not found'
            });
        }

        let {
            title,
            categoryKey,
            category,
            description,
            documentNumber,
            publishDate,
            order,
            activeState,
            fileUrl
        } = req.body;

        if (title !== undefined) {
            download.title = normalizeMultiLang(title, download.title?.en || '');
        }

        if (categoryKey !== undefined) {
            const validKey = CATEGORY_PRESETS[categoryKey.toUpperCase()]
                ? categoryKey.toUpperCase()
                : download.categoryKey;
            download.categoryKey = validKey;
            download.category = category
                ? normalizeMultiLang(category)
                : CATEGORY_PRESETS[validKey];
        } else if (category !== undefined) {
            download.category = normalizeMultiLang(category);
        }

        if (description !== undefined) {
            download.description = normalizeMultiLang(description);
        }

        if (documentNumber !== undefined) {
            download.documentNumber = String(documentNumber).trim();
        }

        if (publishDate !== undefined) {
            download.publishDate = new Date(publishDate);
        }

        if (order !== undefined) {
            download.order = Number(order);
        }

        if (activeState !== undefined) {
            download.activeState = Boolean(activeState);
        }

        if (fileUrl !== undefined) {
            download.fileUrl = String(fileUrl).trim();
        }

        // If new file attached, replace old file
        if (req.files && req.files.file) {
            const userId = req.user?.id || 'admin';
            const uploadedFile = req.files.file;
            const newSize = formatFileSize(uploadedFile.size);
            const newType = getFileType(uploadedFile.name);

            const urls = await handleFileUploads(uploadedFile, awsFolderNames.downloads, userId, 'file');
            if (urls && urls.length > 0) {
                // Delete previous file from S3 if existed
                if (download.fileUrl) {
                    const oldKey = extractFileNameFromUrl(download.fileUrl);
                    if (oldKey) {
                        await deleteFileFromAws(oldKey).catch(() => {});
                    }
                }
                download.fileUrl = urls[0];
                download.fileName = uploadedFile.name;
                download.fileSize = newSize;
                download.fileType = newType;
            }
        }

        await download.save();
        await cacheService.clearPattern('downloads_*');

        return res.status(200).json({
            status: true,
            message: 'Download updated successfully',
            data: formatDownloadItem(download.toObject())
        });
    } catch (error) {
        logger.error('Error updating download:', { error: error.message });
        return res.status(500).json({
            status: false,
            message: error.message || 'Failed to update download'
        });
    }
};

/**
 * Increment Download Count
 * PATCH /api/v1/downloads/:id/download
 * Public
 */
const incrementDownloadCount = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await DownloadSchema.findByIdAndUpdate(
            id,
            { $inc: { downloadCount: 1 } },
            { new: true, select: '_id downloadCount' }
        ).lean();

        if (!updated) {
            return res.status(404).json({ status: false, message: 'Download item not found' });
        }

        return res.status(200).json({
            status: true,
            downloadCount: updated.downloadCount
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

/**
 * Delete Download
 * DELETE /api/v1/downloads/:id
 * Admin only
 */
const deleteDownload = async (req, res) => {
    try {
        const { id } = req.params;
        const download = await DownloadSchema.findById(id);

        if (!download) {
            return res.status(404).json({ status: false, message: 'Download not found' });
        }

        if (download.fileUrl) {
            const fileName = extractFileNameFromUrl(download.fileUrl);
            if (fileName) {
                await deleteFileFromAws(fileName).catch(() => {});
            }
        }

        await DownloadSchema.findByIdAndDelete(id);
        await cacheService.clearPattern('downloads_*');

        return res.status(200).json({
            status: true,
            message: 'Download deleted successfully',
        });
    } catch (error) {
        logger.error('Error deleting download:', { error: error.message });
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

module.exports = {
    CATEGORY_PRESETS,
    createDownload,
    getAllDownloads,
    getAllDownloadsAdmin,
    getDownloadById,
    updateDownload,
    incrementDownloadCount,
    deleteDownload
};
