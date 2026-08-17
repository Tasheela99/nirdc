const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Security constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES_PER_FIELD = 5;
const ALLOWED_MIME_TYPES = {
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    images: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
};

const uploadConfigs = {
    investmentQuestionnaire: {
        uploadDir: 'investor-questionnaires',
        allowedTypes: /pdf|doc|docx/,
        allowedMimeTypes: ALLOWED_MIME_TYPES.documents,
        maxFileSize: MAX_FILE_SIZE,
        fields: [
            { name: 'documents', maxCount: MAX_FILES_PER_FIELD },
        ]
    },
    researchQuestionnaire: {
        uploadDir: 'research-investment-questionnaires',
        allowedTypes: /pdf|doc|docx/,
        allowedMimeTypes: ALLOWED_MIME_TYPES.documents,
        maxFileSize: MAX_FILE_SIZE,
        fields: [
            { name: 'certificationsDocuments', maxCount: MAX_FILES_PER_FIELD },
            { name: 'extraCertificationsDocuments', maxCount: MAX_FILES_PER_FIELD },
        ]
    },
    researchProposalQuestionnaire: {
        uploadDir: 'research-proposal-questionnaires',
        allowedTypes: /pdf|doc|docx/,
        allowedMimeTypes: ALLOWED_MIME_TYPES.documents,
        maxFileSize: MAX_FILE_SIZE,
        fields: [
            { name: 'supportingDocuments', maxCount: MAX_FILES_PER_FIELD },
            { name: 'certifications', maxCount: MAX_FILES_PER_FIELD },
        ]
    },
    news: {
        uploadDir: 'news',
        allowedTypes: /jpg|jpeg|png|webp/,
        allowedMimeTypes: ALLOWED_MIME_TYPES.images,
        maxFileSize: MAX_FILE_SIZE,
        fields: [
            { name: 'image', maxCount: MAX_FILES_PER_FIELD },
        ]
    },
};

const createStorage = (config) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            try {
                // Security: Validate user authentication
                if (!req.user || !req.user.id) {
                    return cb(new Error('User authentication required'));
                }

                // Get the field configuration
                const fieldConfig = config.fields.find(f => f.name === file.fieldname);

                if (fieldConfig) {
                    // Create user-specific directory for each field
                    const userSpecificDir = path.join(
                        config.uploadDir,
                        req.user.id.toString(),
                        file.fieldname
                    );
                    const fullPath = path.resolve(`./uploads/${userSpecificDir}`);

                    // Security: Prevent directory traversal attacks
                    if (!fullPath.startsWith(path.resolve('./uploads'))) {
                        return cb(new Error('Invalid upload path'));
                    }

                    if (!fs.existsSync(fullPath)) {
                        fs.mkdirSync(fullPath, { recursive: true });
                    }
                    cb(null, fullPath);
                } else {
                    cb(new Error(`Invalid field name: ${file.fieldname}`));
                }
            } catch (error) {
                console.error("Error in storage destination:", error);
                cb(error);
            }
        },
        filename: function (req, file, cb) {
            try {
                const timestamp = Date.now();
                const ext = path.extname(file.originalname).toLowerCase();
                
                // Security: Sanitize filename
                const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `${timestamp}-${sanitizedName}`;
                
                cb(null, filename);
            } catch (error) {
                console.error("Error in filename generation:", error);
                cb(error);
            }
        }
    });
};

const createFileFilter = (config) => {
    return (req, file, cb) => {
        const fieldConfig = config.fields.find(f => f.name === file.fieldname);

        if (fieldConfig) {
            const extname = config.allowedTypes.test(
                path.extname(file.originalname).toLowerCase()
            );
            
            // Security: Check MIME type against allowed types
            const mimetype = config.allowedMimeTypes.includes(file.mimetype);

            if (extname && mimetype) {
                cb(null, true);
            } else {
                cb(new Error(
                    `Only ${config.allowedTypes.source} files are allowed! Received: ${file.mimetype}`
                ));
            }
        } else {
            cb(new Error(`Invalid field name: ${file.fieldname}`));
        }
    };
};

const createUpload = (config) => {
    return multer({
        storage: createStorage(config),
        fileFilter: createFileFilter(config),
        limits: {
            fileSize: config.maxFileSize || MAX_FILE_SIZE,
            files: MAX_FILES_PER_FIELD,
            fieldSize: MAX_FILE_SIZE,
        }
    });
};

module.exports = {
    uploadConfigs,
    createUpload
};