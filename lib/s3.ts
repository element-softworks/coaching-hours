import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
	},
});

export const s3Path = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;