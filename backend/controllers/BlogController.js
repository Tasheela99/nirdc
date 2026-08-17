const BlogSchema = require('../schemas/BlogSchema');
const {uploadFileToAws, awsFolderNames, getFileUrlFromAws, deleteFileFromAws, extractFileNameFromUrl} = require("../utils/FileUploadAwsUtil");
const path = require('path');

const uploadBlogImage = async (imageFile) => {
    if (!imageFile) return null;
    const fileName = `${awsFolderNames.blog}/${Date.now()}-${imageFile.name}`;
    const uploadResult = await uploadFileToAws(fileName, imageFile.tempFilePath);
    if (!uploadResult) throw new Error('Failed to upload image to AWS S3.');
    const url = getFileUrlFromAws(fileName);
    if (!url) throw new Error('Failed to retrieve image URL from AWS S3.');
    return url;
};

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

        if (!req.files || !req.files.commonImage) {
            return res.status(400).json({
                status: false,
                message: 'Common image file is required.',
            });
        }

        const commonImage = await uploadBlogImage(req.files?.commonImage);
        const imageEn = await uploadBlogImage(req.files?.imageEn);
        const imageSi = await uploadBlogImage(req.files?.imageSi);
        const imageTa = await uploadBlogImage(req.files?.imageTa);

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
        const blog = BlogSchema.find();

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

    try {
        const blog = await BlogSchema.findById(id);
        if (!blog) {
            return res.status(404).json({ status: false, message: 'Blog not found' });
        }

        // Handle image update
        if (req.files) {
            if (req.files.commonImage) {
                await deleteImageFromAwsIfExist(blog.commonImage);
                blog.commonImage = await uploadBlogImage(req.files.commonImage);
            }
            if (req.files.imageEn) {
                await deleteImageFromAwsIfExist(blog.imageEn);
                blog.imageEn = await uploadBlogImage(req.files.imageEn);
            }
            if (req.files.imageSi) {
                await deleteImageFromAwsIfExist(blog.imageSi);
                blog.imageSi = await uploadBlogImage(req.files.imageSi);
            }
            if (req.files.imageTa) {
                await deleteImageFromAwsIfExist(blog.imageTa);
                blog.imageTa = await uploadBlogImage(req.files.imageTa);
            }
        }

        // Update fields
        blog.titleEn = titleEn || blog.titleEn;
        blog.titleSi = titleSi || blog.titleSi;
        blog.titleTa = titleTa || blog.titleTa;
        blog.descriptionEn = descriptionEn || blog.descriptionEn;
        blog.descriptionSi = descriptionSi || blog.descriptionSi;
        blog.descriptionTa = descriptionTa || blog.descriptionTa;
        blog.date = date || blog.date;

        await blog.save();

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