const ReviewerConfig = require('../schemas/ReviewerConfigSchema');
const awsUpload = require('../utils/FileUploadAwsUtil');
const fs = require('fs').promises;

const uploadTrainingVideo = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.video) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const videoFile = req.files.video;
        const uploadedUrls = await awsUpload.handleFileUploads(videoFile, 'reviewerVideo', 'admin', 'training');

        if (!uploadedUrls || uploadedUrls.length === 0) {
            return res.status(500).json({ message: 'Failed to upload video to S3' });
        }

        const videoUrl = uploadedUrls[0];

        // Update or create the config
        let config = await ReviewerConfig.findOne({ singletonKey: 'CONFIG' });
        if (config) {
            // Delete old video if necessary (optional improvement)
            if (config.trainingVideoUrl) {
                const oldFileName = awsUpload.extractFileNameFromUrl(config.trainingVideoUrl);
                if (oldFileName) {
                    await awsUpload.deleteFileFromAws(oldFileName);
                }
            }
            config.trainingVideoUrl = videoUrl;
            await config.save();
        } else {
            config = new ReviewerConfig({
                singletonKey: 'CONFIG',
                trainingVideoUrl: videoUrl
            });
            await config.save();
        }

        return res.status(200).json({ message: 'Training video uploaded successfully', data: config });
    } catch (error) {
        console.error('Error in uploadTrainingVideo:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getTrainingVideo = async (req, res) => {
    try {
        const config = await ReviewerConfig.findOne({ singletonKey: 'CONFIG' });
        if (!config || !config.trainingVideoUrl) {
            return res.status(404).json({ message: 'Training video not found' });
        }
        return res.status(200).json({ data: { trainingVideoUrl: config.trainingVideoUrl } });
    } catch (error) {
        console.error('Error in getTrainingVideo:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    uploadTrainingVideo,
    getTrainingVideo
};
