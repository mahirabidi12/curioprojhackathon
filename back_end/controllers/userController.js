import { fileURLToPath } from "url";
import getGeminiTranscript from "./askGemini.js";
import { generateAudio } from "./elevenLabHandling.js";
import { finalPrompt, firstPrompt } from "./generatePrompts.js";
import generateSyncVideo from "./syncLogic.js";
import uploadAudio from "./urlGenerator.js";
import path, { dirname } from 'path'
import fs from 'fs'
import downloadVideoFromURL from "./downloadVideo.js";
import mergeVideosSideBySide from "./mergeVideos.js";
const __dirname = dirname(fileURLToPath(import.meta.url))

export async function generateFirstTranscript(req, res) {
  try {
    const { topic, objective, duration, targetAudience, ageGroup } = req.body;

    const prompt = firstPrompt({
      topic,
      objective,
      duration,
      targetAudience, 
      ageGroup,
    });
    const response = await getGeminiTranscript(prompt);
    res.json(response)
  } catch (error) {
    console.log(`Failed in generateFirstTranscript`, error);
  }
}

export async function generateFinalTranscript(req, res) {
  try {
    const { prompt , personaId } = req.body;
    const finalGeneratedPrompt = finalPrompt(prompt);
    const response = await getGeminiTranscript(finalGeneratedPrompt);
    const finalResult = JSON.parse(response.replace(/```json|```/g, '').trim());

    const abdurRes = await fetch("http://localhost:8000/generate-left-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalResult)
    })

    const abdurJson = await abdurRes.json();
    console.log("Abdur Response JSON:", abdurJson);

    const abdurVidPath = abdurJson.output_path;

    const finalVideosFolder = path.join(__dirname, '../final_videos');
    // Function to empty the folder

    function emptyFolder(folderPath) { 
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          emptyFolder(filePath); // Recursively empty subdirectories
          fs.rmdirSync(filePath); // Remove the empty directory
        } else {
          fs.unlinkSync(filePath); // Delete the file
        }
      }
    }

    if (!fs.existsSync(finalVideosFolder)) {
      fs.mkdirSync(finalVideosFolder); // Create the folder if it doesn't exist
    } else {
      emptyFolder(finalVideosFolder); // Empty the folder
    }
 
    const videoFileName = path.basename(abdurVidPath); // Extract the file name from the path
    const destinationPath = path.join(finalVideosFolder, videoFileName);
    fs.renameSync(abdurVidPath, destinationPath); // Move the file

    console.log(`Video moved to: ${destinationPath}`);
    // res.json({ message: "Video processed and moved successfully", videoPath: destinationPath });
    // res.send(finalResult)

    //FINALRESULT TO ABDUR PYTHON


    // console.log(personaId)
    // console.log(response.data)


    let videoUrl;
    if (personaId==1) {
      videoUrl = `https://ik.imagekit.io/bmy1xqjxe/WhatsApp%20Video%202025-04-11%20at%2004.02.10.mp4?updatedAt=1744324367951`
    }
    else{
      videoUrl = `https://ik.imagekit.io/bmy1xqjxe/WhatsApp%20Video%202025-04-11%20at%2003.46.37.mp4?updatedAt=1744324310699`
    }

    //generate mp3 audio from eleven labs

    // const uniqueFileName = `output.mp3`;
    const uniqueFileName = `audio_${Date.now()}_${Math.floor(Math.random() * 10000)}.mp3`;
    const outputPath = path.join(__dirname, '../elevenLabsAudio', uniqueFileName);
    // const uniqueFileName = `./elevenLabsAudio/audio_${Date.now()}_${Math.floor(Math.random() * 10000)}.mp3`;
    await generateAudio(prompt, 'male', outputPath);





    let audioUrl = await uploadAudio(outputPath);//filepath of the mp3 audio
    console.log(audioUrl)

 


    const syncVideoUrl = await generateSyncVideo(videoUrl , audioUrl)
    console.log(`Sync Url ` , syncVideoUrl)

    await downloadVideoFromURL(syncVideoUrl)
  
    await mergeVideosSideBySide()
 
    res.send({message : 'Sucess'})
    //WE NEED TO SEND THE FINAL VIDEO TO THE FRONTEND
  } catch (error) {
    console.log(`Failed in generateFinalTranscript`, error);
  }
}
