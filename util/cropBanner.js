const sharp = require("sharp");
const { s3Client } = require("./upload");
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
require("dotenv").config()
// Function to convert stream to buffer
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
const getContentType = (fileKey) => {
  const ext = fileKey.split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
};
async function cropBanner(files) {
  for (const fileKey of files) {
    const fullKey = fileKey;

    // Step 1: Download the image from S3
    const getParams = { Bucket: String(process.env.S3_BUCKET), Key: fullKey };
  
    const imageData = await s3Client.send(new GetObjectCommand(getParams));
    
    const imageBuffer = await streamToBuffer(imageData.Body);

    // Step 2: Crop the image using sharp
    let quality = 80; // Starting quality
    let croppedImageBuffer;

    // Loop until the size is less than 2 MB
    do {
      croppedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: 1600, // Set width to a suitable value
        height: 700,  // Set height according to the 16:7 ratio
        fit: "cover",
        withoutEnlargement: true,
      })
      .toBuffer();

      // Check the size of the cropped image
      if (Buffer.byteLength(croppedImageBuffer) > 5 * 1024 * 1024) { // 2 MB
        quality -= 5; // Decrease quality by 5
      }
    } while (Buffer.byteLength(croppedImageBuffer) > 5 * 1024 * 1024  && quality > 0); // Ensure quality doesn't go below 0

    // Step 3: Upload the cropped image back to S3, replacing the original
    const contentType = getContentType(fileKey); // Determine content type

    const uploadParams = {
      Bucket: String(process.env.S3_BUCKET),
      Key: fullKey, // Use the original key to overwrite the image
      Body: croppedImageBuffer,
      ContentType: contentType, // Assuming you're converting to JPEG
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`Cropped and replaced original image: ${fullKey}`);
  }
}
module.exports = { cropBanner }