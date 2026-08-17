const NewsSchema = require('../schemas/NewsSchema');
const {createUpload, uploadConfigs} = require("../utils/FileUploadUtil");
const UserSchema = require("../schemas/UserSchema");
const { handleFileUploads, deleteFileFromAws, extractFileNameFromUrl, awsFolderNames } = require("../utils/FileUploadAwsUtil");
const cacheService = require("../services/CacheService");
const path = require('path');

const deleteImageFromAwsIfExist = async (imageUrl) => {
    if (!imageUrl) return;
    const fileName = extractFileNameFromUrl(imageUrl);
    if (fileName) {
        await deleteFileFromAws(fileName);
    }
};

const createNews = async (req, res) => {
    try {
        const {titleEn, titleSi, titleTa, contentEn, contentSi, contentTa, date} = req.body;
        const userId = req.user?.id || 'mockUserId'; // Mock user ID for testing
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found.',
            });
        }

        if (!req.files || !req.files.commonImage) {
            return res.status(400).json({
                status: false,
                message: 'Common image file is required.',
            });
        }

        // Use the proven handleFileUploads function which sanitizes filenames and cleans up temp files
        const uploadSingle = async (fileKey) => {
            if (!req.files || !req.files[fileKey]) return null;
            const urls = await handleFileUploads(req.files[fileKey], awsFolderNames.news, userId, fileKey);
            return urls && urls.length > 0 ? urls[0] : null;
        };

        const commonImage = await uploadSingle('commonImage');
        const imageEn = await uploadSingle('imageEn');
        const imageSi = await uploadSingle('imageSi');
        const imageTa = await uploadSingle('imageTa');

        const newNews = new NewsSchema({
            user: userId,
            titleEn, titleSi, titleTa,
            contentEn, contentSi, contentTa,
            date,
            commonImage,
            imageEn,
            imageSi,
            imageTa,
            activeState: true,
        });

        await newNews.save();
        await cacheService.clearPattern('news_*');

        return res.status(201).json({
            status: true,
            message: 'News created successfully',
            data: newNews,
        });
    } catch (error) {
        console.error('Error creating news:', error);
        return res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
};

const getAllNews = async (req, res) => {
    try {
        const news = NewsSchema.find({activeState: true})
            .sort({createdAt: -1})
            .limit(6);

        return res.status(200).json({
            status: true,
            message: 'News retrieved successfully',
            data: news
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};

const getNewsById = async (req, res) => {
    const {id} = req.params;

    NewsSchema.findById({_id: id}).then(result => {
        if (result == null) {
            res.status(200).json({
                success: false,
                message: 'News Not Found',
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'News',
                data: result
            });
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
};

const deleteNews = async (req, res) => {
    try {
        const id = req.params.id;

        const news = await NewsSchema.findById(id);
        if (!news) {
            return res.status(404).json({
                status: false,
                message: 'News not found',
            });
        }

        await deleteImageFromAwsIfExist(news.commonImage);
        await deleteImageFromAwsIfExist(news.imageEn);
        await deleteImageFromAwsIfExist(news.imageSi);
        await deleteImageFromAwsIfExist(news.imageTa);

        await NewsSchema.findByIdAndDelete(id);

        return res.status(200).json({
            status: true,
            message: 'News and associated images deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting news:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const updateNews = async (req, res) => {
    const id = req.params.id;
    const { titleEn, titleSi, titleTa, contentEn, contentSi, contentTa, date } = req.body;
    const userId = req.user?.id || 'mockUserId';

    try {
        const news = await NewsSchema.findById(id);
        if (!news) {
            return res.status(404).json({ status: false, message: 'News not found' });
        }

        const uploadSingle = async (fileKey) => {
            if (!req.files || !req.files[fileKey]) return null;
            const urls = await handleFileUploads(req.files[fileKey], awsFolderNames.news, userId, fileKey);
            return urls && urls.length > 0 ? urls[0] : null;
        };

        // Handle image update
        if (req.files) {
            if (req.files.commonImage) {
                await deleteImageFromAwsIfExist(news.commonImage);
                news.commonImage = await uploadSingle('commonImage');
            }
            if (req.files.imageEn) {
                await deleteImageFromAwsIfExist(news.imageEn);
                news.imageEn = await uploadSingle('imageEn');
            }
            if (req.files.imageSi) {
                await deleteImageFromAwsIfExist(news.imageSi);
                news.imageSi = await uploadSingle('imageSi');
            }
            if (req.files.imageTa) {
                await deleteImageFromAwsIfExist(news.imageTa);
                news.imageTa = await uploadSingle('imageTa');
            }
        }

        // Update fields
        news.titleEn = titleEn || news.titleEn;
        news.titleSi = titleSi || news.titleSi;
        news.titleTa = titleTa || news.titleTa;
        news.contentEn = contentEn || news.contentEn;
        news.contentSi = contentSi || news.contentSi;
        news.contentTa = contentTa || news.contentTa;
        news.date = date || news.date;

        await news.save();
        await cacheService.clearPattern('news_*');

        return res.status(200).json({
            status: true,
            message: 'News Updated Successfully',
            data: news,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    deleteNews,
    updateNews
};