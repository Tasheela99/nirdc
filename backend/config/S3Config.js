const { S3Client, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');

// Initialize an S3 client with provided credentials
const s3Client = new S3Client({
    region: process.env.AWS_REGION, // Specify the AWS region from environment variables
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID, // Access key ID from environment variables
        secretAccessKey: process.env.AWS_SECRETACCESSKEY // Secret access key from environment variables
    }
});

// Export folder names for easier reference
exports.awsFolderNames = {
    sub1: 'sub1',
    sub2: 'sub2'
};