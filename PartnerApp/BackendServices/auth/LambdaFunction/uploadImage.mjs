import { S3 } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3 = new S3({  }); 

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const base64String = body.image;
  const buffer = Buffer.from(base64String, 'base64');
  const filename = body.filename || 'default-filename';
  const contentType = body.contentType || 'image/jpeg';

  // Define the S3 upload parameters
  const uploadParams = {
    Bucket: "restaurantimagesb00943241", 
    Key: `uploads/${filename}`, // File path in S3
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read', // Make the file publicly readable 
  };

  try {
    console.log("uploadParams: "+uploadParams)
    // Upload the image to S3
    const uploadResult = await s3.putObject(uploadParams);
    console.log("uploadResult: "+uploadResult)
    // Construct the URL of the uploaded image
    const imageUrl = `https://restaurantimagesb00943241.s3.amazonaws.com/uploads/${filename}`;

    // Return the URL of the uploaded image
    return {
       headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Allow all domains 
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST" // Methods allowed for CORS
    },
      statusCode: 200,
      body: JSON.stringify({
        imageUrl: imageUrl // Constructed URL of the uploaded S3 object
      }),
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);

    // Return a 500 error response
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading image' })
    };
  }
};

