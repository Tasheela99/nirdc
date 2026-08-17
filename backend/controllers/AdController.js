const AdSchema = require('../schemas/AdSchema');
const { uploadFileToAws, awsFolderNames, getFileUrlFromAws, deleteFileFromAws, extractFileNameFromUrl, handleFileUploads } = require('../utils/FileUploadAwsUtil');

const createAd = async (req, res) => {
    try {
        const { title, description, category, startDate, endDate, showAsPopup, status } = req.body;
        const image = req.files?.image;

        if (!title || !description || !category || !startDate || !endDate) {
            return res.status(400).json({
                status: false,
                message: 'Title, description, category, start date, and end date are required.',
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) {
            return res.status(400).json({
                status: false,
                message: 'End date must be after start date.',
            });
        }

        let imageUrl = null;
        if (image) {
            try {
                const userId = req.user?.id || 'mockUserId';
                const urls = await handleFileUploads(image, awsFolderNames.ads, userId, 'image');
                if (urls && urls.length > 0) {
                    imageUrl = urls[0];
                } else {
                    console.warn('Image upload to S3 failed, creating ad without image');
                }
            } catch (uploadError) {
                console.warn('Image upload error, creating ad without image:', uploadError.message);
            }
        }

        const newAd = new AdSchema({
            title,
            description,
            category,
            imageUrl,
            startDate: start,
            endDate: end,
            showAsPopup: showAsPopup === 'true' || showAsPopup === true,
            status: status || 'Active',
            createdBy: req.user?.id,
        });

        const savedAd = await newAd.save();

        res.status(201).json({
            status: true,
            message: 'Ad created successfully',
            data: savedAd,
        });

    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const getAllAds = async (req, res) => {
    try {
        const ads = await AdSchema.find().sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: 'Ads retrieved successfully',
            data: ads,
        });
    } catch (error) {
        console.error('Error getting ads:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const getActiveAds = async (req, res) => {
    try {
        const now = new Date();
        const ads = await AdSchema.find({
            status: 'Active',
            startDate: { $lte: now },
            endDate: { $gte: now },
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: 'Active ads retrieved successfully',
            data: ads,
        });
    } catch (error) {
        console.error('Error getting active ads:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const getPopupAd = async (req, res) => {
    try {
        const now = new Date();
        const popupAd = await AdSchema.findOne({
            status: 'Active',
            showAsPopup: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            message: popupAd ? 'Popup ad found' : 'No popup ad available',
            data: popupAd,
        });
    } catch (error) {
        console.error('Error getting popup ad:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const getAdById = async (req, res) => {
    try {
        const { id } = req.params;
        const ad = await AdSchema.findById(id);

        if (!ad) {
            return res.status(404).json({
                status: false,
                message: 'Ad not found',
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Ad retrieved successfully',
            data: ad,
        });
    } catch (error) {
        console.error('Error getting ad:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const updateAd = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, startDate, endDate, showAsPopup, status } = req.body;

        const ad = await AdSchema.findById(id);
        if (!ad) {
            return res.status(404).json({ status: false, message: 'Ad not found' });
        }

        // Handle image update
        let newImageUrl = ad.imageUrl;
        if (req.files && req.files.image) {
            try {
                const image = req.files.image;
                const userId = req.user?.id || 'mockUserId';
                const urls = await handleFileUploads(image, awsFolderNames.ads, userId, 'image');
                if (urls && urls.length > 0) {
                    newImageUrl = urls[0];
                    // Delete old image
                    if (ad.imageUrl) {
                        const oldFileName = extractFileNameFromUrl(ad.imageUrl);
                        if (oldFileName) {
                            await deleteFileFromAws(oldFileName);
                        }
                    }
                } else {
                    console.warn('Image upload to S3 failed during update, keeping old image');
                }
            } catch (uploadError) {
                console.warn('Image upload error during update:', uploadError.message);
            }
        }

        // Update fields
        ad.title = title !== undefined ? title : ad.title;
        ad.description = description !== undefined ? description : ad.description;
        ad.category = category !== undefined ? category : ad.category;
        ad.startDate = startDate ? new Date(startDate) : ad.startDate;
        ad.endDate = endDate ? new Date(endDate) : ad.endDate;
        ad.showAsPopup = showAsPopup !== undefined ? (showAsPopup === 'true' || showAsPopup === true) : ad.showAsPopup;
        ad.status = status !== undefined ? status : ad.status;
        ad.imageUrl = newImageUrl;

        await ad.save();

        return res.status(200).json({
            status: true,
            message: 'Ad updated successfully',
            data: ad,
        });
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

const deleteAd = async (req, res) => {
    try {
        const { id } = req.params;
        const ad = await AdSchema.findById(id);

        if (!ad) {
            return res.status(404).json({
                status: false,
                message: 'Ad not found',
            });
        }

        // Delete image from S3
        if (ad.imageUrl) {
            const imageFileName = extractFileNameFromUrl(ad.imageUrl);
            if (imageFileName) {
                await deleteFileFromAws(imageFileName);
            }
        }

        await AdSchema.findByIdAndDelete(id);

        return res.status(200).json({
            status: true,
            message: 'Ad deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting ad:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

module.exports = {
    createAd,
    getAllAds,
    getActiveAds,
    getPopupAd,
    getAdById,
    updateAd,
    deleteAd,
};
