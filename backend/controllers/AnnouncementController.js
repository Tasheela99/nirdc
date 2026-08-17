const AnnouncementSchema = require('../schemas/AnnouncementSchema');
const {uploadFileToAws, awsFolderNames, getFileUrlFromAws, deleteFileFromAws, extractFileNameFromUrl} = require("../utils/FileUploadAwsUtil");
const path = require('path');

const uploadAnnouncementFile = async (file, isPdf = false) => {
    if (!file) return null;
    const folder = isPdf ? awsFolderNames.announcementPdfs : awsFolderNames.announcement;
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    const uploadResult = await uploadFileToAws(fileName, file.tempFilePath);
    if (!uploadResult) throw new Error('Failed to upload file to AWS S3.');
    const url = getFileUrlFromAws(fileName);
    if (!url) throw new Error('Failed to retrieve file URL from AWS S3.');
    return url;
};

const deleteFileFromAwsIfExist = async (url) => {
    if (!url) return;
    const fileName = extractFileNameFromUrl(url);
    if (fileName) {
        await deleteFileFromAws(fileName);
    }
};

const createAnnouncement = async (req, res) => {
    try {
        const {titleEn, titleSi, titleTa, descriptionEn, descriptionSi, descriptionTa, date} = req.body;

        if (!req.files || !req.files.commonImage) {
            return res.status(400).json({
                status: false,
                message: 'Common image is required.',
            });
        }

        const commonImage = await uploadAnnouncementFile(req.files?.commonImage);
        const imageEn = await uploadAnnouncementFile(req.files?.imageEn);
        const imageSi = await uploadAnnouncementFile(req.files?.imageSi);
        const imageTa = await uploadAnnouncementFile(req.files?.imageTa);

        const pdfEn = await uploadAnnouncementFile(req.files?.pdfEn, true);
        const pdfSi = await uploadAnnouncementFile(req.files?.pdfSi, true);
        const pdfTa = await uploadAnnouncementFile(req.files?.pdfTa, true);

        const newAnnouncementData = {
            titleEn, titleSi, titleTa,
            descriptionEn, descriptionSi, descriptionTa,
            date,
            commonImage,
            imageEn, imageSi, imageTa,
            pdfEn, pdfSi, pdfTa
        };

        const newAnnouncement = new AnnouncementSchema(newAnnouncementData);
        const savedAnnouncement = await newAnnouncement.save();

        res.status(201).json({
            status: true,
            message: 'Announcement created successfully',
            data: savedAnnouncement,
        });

    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
};

const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = AnnouncementSchema.find();

        // Ensure PDF URLs are always present
        const formatted = announcements.map(a => ({
            ...a.toObject(),
            pdfEn: a.pdfEn || null,
            pdfSi: a.pdfSi || null,
            pdfTa: a.pdfTa || null,
        }));

        return res.status(200).json({
            status: true,
            message: 'Announcement retrieved successfully',
            data: formatted
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};

const getAnnouncementById = async (req, res) => {
    const {id} = req.params;

    AnnouncementSchema.findById({_id: id}).then(result => {
        if (result == null) {
            res.status(200).json({
                success: false,
                message: 'Announcement Not Found',
            });
        } else {
            // Always include PDF URLs, even if null
            const data = {
                ...result.toObject(),
                pdfEn: result.pdfEn || null,
                pdfSi: result.pdfSi || null,
                pdfTa: result.pdfTa || null,
            };
            res.status(200).json({
                success: true,
                message: 'Announcement',
                data
            });
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
};

const deleteAnnouncement = async (req, res) => {
    try {
        const id = req.params.id;
        const announcement = await AnnouncementSchema.findById(id);
        if (!announcement) {
            return res.status(404).json({
                status: false,
                message: 'Announcement not found',
            });
        }

        await deleteFileFromAwsIfExist(announcement.commonImage);
        await deleteFileFromAwsIfExist(announcement.imageEn);
        await deleteFileFromAwsIfExist(announcement.imageSi);
        await deleteFileFromAwsIfExist(announcement.imageTa);

        await deleteFileFromAwsIfExist(announcement.pdfEn);
        await deleteFileFromAwsIfExist(announcement.pdfSi);
        await deleteFileFromAwsIfExist(announcement.pdfTa);

        await AnnouncementSchema.findByIdAndDelete(id);

        return res.status(200).json({
            status: true,
            message: 'Announcement deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting announcement:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};

const updateAnnouncement = async (req, res) => {
    const id = req.params.id;
    const { titleEn, titleSi, titleTa, descriptionEn, descriptionSi, descriptionTa, date } = req.body;

    try {
        const announcement = await AnnouncementSchema.findById(id);
        if (!announcement) {
            return res.status(404).json({ status: false, message: 'Announcement not found' });
        }

        if (req.files) {
            // Update images
            if (req.files.commonImage) {
                await deleteFileFromAwsIfExist(announcement.commonImage);
                announcement.commonImage = await uploadAnnouncementFile(req.files.commonImage);
            }
            if (req.files.imageEn) {
                await deleteFileFromAwsIfExist(announcement.imageEn);
                announcement.imageEn = await uploadAnnouncementFile(req.files.imageEn);
            }
            if (req.files.imageSi) {
                await deleteFileFromAwsIfExist(announcement.imageSi);
                announcement.imageSi = await uploadAnnouncementFile(req.files.imageSi);
            }
            if (req.files.imageTa) {
                await deleteFileFromAwsIfExist(announcement.imageTa);
                announcement.imageTa = await uploadAnnouncementFile(req.files.imageTa);
            }

            // Update PDFs
            if (req.files.pdfEn) {
                await deleteFileFromAwsIfExist(announcement.pdfEn);
                announcement.pdfEn = await uploadAnnouncementFile(req.files.pdfEn, true);
            }
            if (req.files.pdfSi) {
                await deleteFileFromAwsIfExist(announcement.pdfSi);
                announcement.pdfSi = await uploadAnnouncementFile(req.files.pdfSi, true);
            }
            if (req.files.pdfTa) {
                await deleteFileFromAwsIfExist(announcement.pdfTa);
                announcement.pdfTa = await uploadAnnouncementFile(req.files.pdfTa, true);
            }
        }

        // Update fields
        announcement.titleEn = titleEn || announcement.titleEn;
        announcement.titleSi = titleSi || announcement.titleSi;
        announcement.titleTa = titleTa || announcement.titleTa;
        announcement.descriptionEn = descriptionEn || announcement.descriptionEn;
        announcement.descriptionSi = descriptionSi || announcement.descriptionSi;
        announcement.descriptionTa = descriptionTa || announcement.descriptionTa;
        announcement.date = date || announcement.date;

        await announcement.save();

        return res.status(200).json({
            status: true,
            message: 'Announcement Updated Successfully',
            data: announcement,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    deleteAnnouncement,
    updateAnnouncement
};