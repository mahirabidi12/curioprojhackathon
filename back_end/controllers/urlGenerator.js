// uploadAudio.js
import cloudinary from '../config/cloudinaryCon.js';
import path from 'path';



const uploadAudio = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video', // For audio/video files
      folder: 'audio_files',
      public_id: path.basename(filePath, path.extname(filePath)),
    });

    return result.secure_url; 
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export default uploadAudio
 
// const url = await uploadAudio(filePath)
// console.log(url) 