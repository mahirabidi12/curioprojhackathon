import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function downloadVideoFromURL(videoUrl) {
  const folderPath = path.resolve('final_videos');
  const filePath = path.join(folderPath, 'final_video2.mp4');

  try {

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const response = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve(`Video saved to ${filePath}`);
      });
      writer.on('error', (err) => {
        reject(`Failed to save video: ${err.message}`);
      });
    });

  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

export default downloadVideoFromURL
