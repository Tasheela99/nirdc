const { handleFileUploads } = require('../utils/FileUploadAwsUtil');
const { generateApplicationId } = require('../utils/OtpGeneraterUtil');
const logger = require('../utils/LoggerUtil');

class ApplicationService {
    /**
     * Parse JSON fields safely from multipart form-data
     */
    static parseJsonField(fieldValue, fieldName = '') {
        if (!fieldValue) return null;
        if (typeof fieldValue === 'object') return fieldValue;
        try {
            return JSON.parse(fieldValue);
        } catch (error) {
            logger.warn(`Failed to parse JSON field '${fieldName}': ${error.message}`);
            throw new Error(`Invalid JSON format in '${fieldName}'.`);
        }
    }

    /**
     * Upload supporting documents and certifications to AWS S3
     */
    static async uploadApplicationFiles(files, awsFolderName, userId) {
        let supportingDocumentsUrls = [];
        let certificationsUrls = [];

        if (files) {
            if (files.supportingDocuments) {
                supportingDocumentsUrls = await handleFileUploads(
                    files.supportingDocuments,
                    awsFolderName,
                    userId,
                    'supportingDocuments'
                );
            }
            if (files.certifications) {
                certificationsUrls = await handleFileUploads(
                    files.certifications,
                    awsFolderName,
                    userId,
                    'certifications'
                );
            }
        }

        return { supportingDocumentsUrls, certificationsUrls };
    }

    /**
     * Generate unique Application ID with prefix
     */
    static createApplicationId(prefix) {
        return generateApplicationId(prefix);
    }
}

module.exports = ApplicationService;
