const fs = require('fs').promises; // Use promise-based fs
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
    requestHandler: new (require('@smithy/node-http-handler').NodeHttpHandler)({
        connectionTimeout: 30000,
        socketTimeout: 30000,
    }),
});

const awsFolderNames = {
    news: 'news-images',
    resource: 'investor-application-resource',
    researchProposalResource: 'research-proposal-application-resource',
    researchInvestmentResource: 'research-investment-application-resource',
    announcement: 'announcements',
    announcementPdfs: 'announcements-pdfs',
    blog: 'blogs',
    ads: 'ads-images',
    reviewerCv: 'reviewer-cvs',
    reviewerVideo: 'reviewer-videos',
    downloads: 'downloads',
};

const uploadFileToAws = async (fileName, filePath) => {
    try {
        const fileContent = await fs.readFile(filePath);
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
        });

        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

const getFileUrlFromAws = (fileName) => {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
};

const extractFileNameFromUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    try {
        // Handle different S3 URL formats
        const patterns = [
            /\.s3\.[\w-]+\.amazonaws\.com\/(.+)$/,  // https://bucket.s3.region.amazonaws.com/key
            /\.s3\.amazonaws\.com\/(.+)$/,          // https://bucket.s3.amazonaws.com/key
            /s3\.amazonaws\.com\/[^\/]+\/(.+)$/,    // https://s3.amazonaws.com/bucket/key
            /s3-[\w-]+\.amazonaws\.com\/[^\/]+\/(.+)$/,  // https://s3-region.amazonaws.com/bucket/key
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return decodeURIComponent(match[1]);
            }
        }

        // If no patterns match, try to extract from the last part after the last slash
        const lastSlashIndex = url.lastIndexOf('/');
        if (lastSlashIndex !== -1 && lastSlashIndex < url.length - 1) {
            return decodeURIComponent(url.substring(lastSlashIndex + 1));
        }

        return null;
    } catch (error) {
        console.error('Error extracting filename from URL:', error);
        return null;
    }
};

const handleFileUploads = async (files, folder, userId, internalFolder) => {
    const uploadedUrls = [];

    if (!files) return uploadedUrls;

    const fileArray = Array.isArray(files) ? files : [files];

    for (const file of fileArray) {
        try {
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const fileName = `${folder}/${userId}/${internalFolder}/${Date.now()}-${sanitizedFileName}`;

            const uploadSuccess = await uploadFileToAws(fileName, file.tempFilePath);
            if (!uploadSuccess) {
                console.error(`Upload failed for file: ${sanitizedFileName}`);
                throw new Error(`Failed to upload document: ${sanitizedFileName}`);
            }

            const fileUrl = getFileUrlFromAws(fileName);
            uploadedUrls.push(fileUrl);

            await fs.unlink(file.tempFilePath);
        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
    }

    return uploadedUrls;
};

const deleteFileFromAws = async (fileName) => {
    try {
        // Validate that fileName is provided and not empty
        if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
            console.error('Error deleting file: fileName is required and cannot be empty');
            return false;
        }

        const sanitizedFileName = fileName.trim();

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: sanitizedFileName,
        });

        await s3Client.send(command);
        console.log(`Successfully deleted file: ${sanitizedFileName}`);
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};


module.exports = { uploadFileToAws, getFileUrlFromAws, awsFolderNames, handleFileUploads, deleteFileFromAws, extractFileNameFromUrl };