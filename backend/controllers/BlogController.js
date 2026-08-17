const BlogSchema = require('../schemas/BlogSchema');
const {uploadFileToAws, awsFolderNames, getFileUrlFromAws, deleteFileFromAws, extractFileNameFromUrl, handleFileUploads} = require("../utils/FileUploadAwsUtil");
const path = require('path');

const cacheService = require("../services/CacheService");

const deleteImageFromAwsIfExist = async (imageUrl) => {
    if (!imageUrl) return;
    const fileName = extractFileNameFromUrl(imageUrl);
    if (fileName) {
        await deleteFileFromAws(fileName);
    }
};

const createBlog = async (req, res) => {
    try {
        const {titleEn, titleSi, titleTa, descriptionEn, descriptionSi, descriptionTa, date} = req.body;
        const userId = req.user?.id || 'mockUserId';

        if (!req.files || !req.files.commonImage) {
            return res.status(400).json({
                status: false,
                message: 'Common image file is required.',
            });
        }

        const uploadSingle = async (fileKey) => {
            if (!req.files || !req.files[fileKey]) return null;
            const urls = await handleFileUploads(req.files[fileKey], awsFolderNames.blog, userId, fileKey);
            return urls && urls.length > 0 ? urls[0] : null;
        };

        const commonImage = await uploadSingle('commonImage');
        const imageEn = await uploadSingle('imageEn');
        const imageSi = await uploadSingle('imageSi');
        const imageTa = await uploadSingle('imageTa');

        const newBlog = new BlogSchema({
            titleEn, titleSi, titleTa,
            descriptionEn, descriptionSi, descriptionTa,
            date,
            commonImage,
            imageEn,
            imageSi,
            imageTa
        });

        await newBlog.save();
        await cacheService.clearPattern('blogs_*');

        return res.status(201).json({
            status: true,
            message: 'Blog created successfully',
            data: newBlog,
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        return res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blog = await BlogSchema.find();

        return res.status(200).json({
            status: true,
            message: 'Blogs retrieved successfully',
            data: blog
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};

const getBlogById = async (req, res) => {
    const {id} = req.params;

    BlogSchema.findById({_id: id}).then(result => {
        if (result == null) {
            res.status(200).json({
                success: false,
                message: 'Blog Not Found',
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Blog',
                data: result
            });
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
};

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;

        const blog = await BlogSchema.findById(id);
        if (!blog) {
            return res.status(404).json({
                status: false,
                message: 'Blog not found',
            });
        }

        await deleteImageFromAwsIfExist(blog.commonImage);
        await deleteImageFromAwsIfExist(blog.imageEn);
        await deleteImageFromAwsIfExist(blog.imageSi);
        await deleteImageFromAwsIfExist(blog.imageTa);

        await BlogSchema.findByIdAndDelete(id);
        await cacheService.clearPattern('blogs_*');

        return res.status(200).json({
            status: true,
            message: 'Blog and associated images deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting blog:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const updateBlog = async (req, res) => {
    const id = req.params.id;
    const { titleEn, titleSi, titleTa, descriptionEn, descriptionSi, descriptionTa, date } = req.body;
    const userId = req.user?.id || 'mockUserId';

    try {
        const blog = await BlogSchema.findById(id);
        if (!blog) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }

        const uploadSingle = async (fileKey) => {
            if (!req.files || !req.files[fileKey]) return null;
            const urls = await handleFileUploads(req.files[fileKey], awsFolderNames.blog, userId, fileKey);
            return urls && urls.length > 0 ? urls[0] : null;
        };

        // Handle image update
        if (req.files) {
            if (req.files.commonImage) {
                await deleteImageFromAwsIfExist(blog.commonImage);
                blog.commonImage = await uploadSingle('commonImage');
            }
            if (req.files.imageEn) {
                await deleteImageFromAwsIfExist(blog.imageEn);
                blog.imageEn = await uploadSingle('imageEn');
            }
            if (req.files.imageSi) {
                await deleteImageFromAwsIfExist(blog.imageSi);
                blog.imageSi = await uploadSingle('imageSi');
            }
            if (req.files.imageTa) {
                await deleteImageFromAwsIfExist(blog.imageTa);
                blog.imageTa = await uploadSingle('imageTa');
            }
        }

        // Update fields
        blog.titleEn = titleEn !== undefined ? titleEn : blog.titleEn;
        blog.titleSi = titleSi !== undefined ? titleSi : blog.titleSi;
        blog.titleTa = titleTa !== undefined ? titleTa : blog.titleTa;
        blog.descriptionEn = descriptionEn !== undefined ? descriptionEn : blog.descriptionEn;
        blog.descriptionSi = descriptionSi !== undefined ? descriptionSi : blog.descriptionSi;
        blog.descriptionTa = descriptionTa !== undefined ? descriptionTa : blog.descriptionTa;
        blog.date = date !== undefined ? date : blog.date;

        await blog.save();
        await cacheService.clearPattern('blogs_*');

        return res.status(200).json({
            status: true,
            message: 'Blog Updated Successfully',
            data: blog,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    deleteBlog,
    updateBlog
};