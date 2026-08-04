/**
 * @module cloudinary
 *
 * Media storage integration module for Cloudinary image and file uploads.
 * Wraps Cloudinary SDK with stream-based buffer uploading utilities for profile pictures,
 * post media, and documents.
 */

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

/**
 * Uploads an in-memory binary file buffer to Cloudinary using readable streams.
 *
 * Configures Cloudinary credentials lazily upon upload invocation, converts the buffer
 * into a stream, and pipes it directly to Cloudinary's `upload_stream`.
 *
 * @param  {Buffer}          buffer  In-memory binary data buffer to upload.
 * @param  {string}          folder  Target folder path in Cloudinary media library.
 * @returns {Promise<string>}  Resolves with the public secure HTTPS URL of the uploaded asset.
 * @throws  {Error}  If upload fails or Cloudinary fails to return a secure URL.
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<string> => {
  // Initialize Cloudinary credentials dynamically from environment configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    // Construct Cloudinary upload stream with automatic asset type detection
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error: unknown, result: any) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result.secure_url);
      }
    );

    // Pipe in-memory buffer via Readable stream to avoid writing files to local disk
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/** Default Cloudinary v2 SDK instance export for direct API usage. */
export default cloudinary;