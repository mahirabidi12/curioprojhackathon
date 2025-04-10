import getGeminiTranscript from "./askGemini.js";
import { finalPrompt, firstPrompt } from "./generatePrompts.js";

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
    res.send(response)
  } catch (error) {
    console.log(`Failed in generateFirstTranscript`, error);
  }
}

export async function generateFinalTranscript(req, res) {
  try {
    const { checkedPrompt } = req.body;
    const prompt = finalPrompt(checkedPrompt);
    const response = await getGeminiTranscript(prompt);
    res.send(response)
  } catch (error) {
    console.log(`Failed in generateFinalTranscript`, error);
  }
}
