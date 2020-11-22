import { S3 } from 'aws-sdk';

const s3client = new S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    params: {
        Bucket: process.env.S3_BUCKET 
    }
});

export default s3client;