import dotenv from 'dotenv';
import fs from 'fs/promises';
import fetch from 'node-fetch'; // If using Node < 18, install: `npm i node-fetch`

dotenv.config();



const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}";

const VOICE_IDS = {
  male: "pNInz6obpgDQGcFmaJgB",
  female: "EXAVITQu4vr4xnSDxMaL",
};

export const generateAudio = async (text, voiceGender = "male", outputPath = "output.mp3") => {
  try {
    console.log()
    const voiceId = VOICE_IDS[voiceGender.toLowerCase()] || VOICE_IDS["male"];
    const url = ELEVENLABS_API_URL.replace("{voice_id}", voiceId);

    const payload = {
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error ${response.status}: ${errorBody}`);
    }

    const buffer = await response.arrayBuffer();
    await fs.writeFile(outputPath, Buffer.from(buffer));

    console.log(`✅ Audio saved to ${outputPath}`);
  } catch (err) {
    console.error("❌ Failed to generate audio:", err.message);
  }
};




