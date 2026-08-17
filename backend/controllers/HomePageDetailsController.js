const HomePageDetailsSchema = require('../schemas/HomePageDetailsSchema');
const { uploadFileToAws, awsFolderNames, getFileUrlFromAws, deleteFileFromAws, extractFileNameFromUrl } = require("../utils/FileUploadAwsUtil");

/**
 * Upload banner images
 */
const createDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const imageUrls = [];

        if (req.files && req.files.bannerImages) {
            const files = Array.isArray(req.files.bannerImages)
                ? req.files.bannerImages
                : [req.files.bannerImages];

            for (const file of files) {
                try {
                    const fileName = `${awsFolderNames.resource}/banner_${Date.now()}_${file.name}`;
                    await uploadFileToAws(fileName, file.tempFilePath);
                    const url = getFileUrlFromAws(fileName);
                    imageUrls.push(url);
                } catch (uploadErr) {
                    console.error('Banner image upload error:', uploadErr.message);
                }
            }
        }

        if (imageUrls.length === 0) {
            return res.status(400).json({ status: false, message: 'No images were uploaded successfully' });
        }

        let details = HomePageDetailsSchema.findOne({ activeState: true });

        if (details) {
            details.firstBannerImages = [...details.firstBannerImages, ...imageUrls];
            await details.save();
        } else {
            details = await new HomePageDetailsSchema({
                user: userId, firstBannerImages: imageUrls, activeState: true
            }).save();
        }

        return res.status(201).json({
            status: true,
            message: `${imageUrls.length} banner image(s) uploaded successfully`,
            data: details
        });
    } catch (error) {
        console.error('Error creating banner details:', error.message);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

/**
 * Get all homepage details (banner + about us images)
 */
const getAllDetails = async (req, res) => {
    try {
        const details = HomePageDetailsSchema.findOne({ activeState: true });

        return res.status(200).json({
            status: true,
            message: 'Homepage details retrieved',
            data: {
                bannerImages: details ? details.firstBannerImages : [],
                aboutUsImages: details ? (details.aboutUsSectionImages || []) : []
            }
        });
    } catch (error) {
        console.error('Error fetching homepage details:', error.message);
        return res.status(500).json({ status: false, message: 'Error fetching details', error: error.message });
    }
};

/**
 * Delete a specific banner image by URL
 */
const deleteDetails = async (req, res) => {
    try {
        const decodedUrl = decodeURIComponent(req.params.id);
        const details = HomePageDetailsSchema.findOne({ activeState: true });

        if (!details) {
            return res.status(404).json({ status: false, message: 'No details found' });
        }

        const originalLength = details.firstBannerImages.length;
        details.firstBannerImages = details.firstBannerImages.filter(url => url !== decodedUrl);

        if (details.firstBannerImages.length === originalLength) {
            return res.status(404).json({ status: false, message: 'Image not found' });
        }

        try {
            const fileName = extractFileNameFromUrl(decodedUrl);
            if (fileName) await deleteFileFromAws(fileName);
        } catch (s3Error) {
            console.error('S3 delete error:', s3Error.message);
        }

        await details.save();
        return res.status(200).json({ status: true, message: 'Banner image deleted', data: details.firstBannerImages });
    } catch (error) {
        console.error('Error deleting banner image:', error.message);
        return res.status(500).json({ status: false, message: 'Error deleting image', error: error.message });
    }
};

/**
 * Upload About Us images
 */
const uploadAboutUsImages = async (req, res) => {
    try {
        const userId = req.user.id;
        const imageUrls = [];

        if (req.files && req.files.aboutUsImages) {
            const files = Array.isArray(req.files.aboutUsImages)
                ? req.files.aboutUsImages
                : [req.files.aboutUsImages];

            for (const file of files) {
                try {
                    const fileName = `${awsFolderNames.resource}/aboutus_${Date.now()}_${file.name}`;
                    await uploadFileToAws(fileName, file.tempFilePath);
                    const url = getFileUrlFromAws(fileName);
                    imageUrls.push(url);
                } catch (uploadErr) {
                    console.error('About Us image upload error:', uploadErr.message);
                }
            }
        }

        if (imageUrls.length === 0) {
            return res.status(400).json({ status: false, message: 'No images were uploaded' });
        }

        let details = HomePageDetailsSchema.findOne({ activeState: true });

        if (details) {
            details.aboutUsSectionImages = [...(details.aboutUsSectionImages || []), ...imageUrls];
            await details.save();
        } else {
            details = await new HomePageDetailsSchema({
                user: userId, aboutUsSectionImages: imageUrls, activeState: true
            }).save();
        }

        return res.status(201).json({
            status: true,
            message: `${imageUrls.length} About Us image(s) uploaded`,
            data: details.aboutUsSectionImages
        });
    } catch (error) {
        console.error('Error uploading About Us images:', error.message);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

/**
 * Delete an About Us image
 */
const deleteAboutUsImage = async (req, res) => {
    try {
        const decodedUrl = decodeURIComponent(req.params.id);
        const details = HomePageDetailsSchema.findOne({ activeState: true });

        if (!details || !details.aboutUsSectionImages) {
            return res.status(404).json({ status: false, message: 'No details found' });
        }

        const originalLength = details.aboutUsSectionImages.length;
        details.aboutUsSectionImages = details.aboutUsSectionImages.filter(url => url !== decodedUrl);

        if (details.aboutUsSectionImages.length === originalLength) {
            return res.status(404).json({ status: false, message: 'Image not found' });
        }

        try {
            const fileName = extractFileNameFromUrl(decodedUrl);
            if (fileName) await deleteFileFromAws(fileName);
        } catch (s3Error) {
            console.error('S3 delete error:', s3Error.message);
        }

        await details.save();
        return res.status(200).json({ status: true, message: 'About Us image deleted', data: details.aboutUsSectionImages });
    } catch (error) {
        console.error('Error deleting About Us image:', error.message);
        return res.status(500).json({ status: false, message: 'Error deleting image', error: error.message });
    }
};

module.exports = {
    createDetails,
    getAllDetails,
    deleteDetails,
    uploadAboutUsImages,
    deleteAboutUsImage,
};