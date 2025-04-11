import path from 'path';
import { exec } from 'child_process';

async function mergeVideosSideBySide() {
  const inputPath1 = path.resolve('final_videos/final_video.mp4');
  const inputPath2 = path.resolve('final_videos/final_video2.mp4');
  const outputPath = path.resolve('final_videos/merged_video.mp4');

  return new Promise((resolve, reject) => {
    const ffmpegCmd = `ffmpeg -i "${inputPath1}" -i "${inputPath2}" -filter_complex "[0:v]scale=1280:1024[v1];[1:v]scale=1280:1024[v2];[v1][v2]hstack=inputs=2" -c:v libx264 -crf 23 -preset veryfast -pix_fmt yuv420p "${outputPath}"`;

    exec(ffmpegCmd, (error, stdout, stderr) => {
      if (error) {
        console.error('FFmpeg error:', stderr);
        reject(new Error('Failed to merge videos: ' + error.message));
      } else {
        resolve(`Videos merged successfully at ${outputPath}`);
      }
    });
  });
}

export default mergeVideosSideBySide;
