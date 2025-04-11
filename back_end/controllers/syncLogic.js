import dotenv from "dotenv";
dotenv.config();

async function generateSyncVideo(videoUrl, audioUrl) {
  const apiKey = `${process.env.SYNC_API}`;

  const apiUrl = "https://api.sync.so/v2/generate";
  const headers = {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };

  async function submitGeneration() {
    const payload = {
      model: "lipsync-1.9.0-beta",
      options: {
        output_format: "mp4",
      },
      input: [
        { type: "video", url: videoUrl },
        { type: "audio", url: audioUrl },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log("Generation submitted successfully, job id:", data.id);
        return data.id;
      } else {
        const errorText = await response.text();
        console.log(errorText);
        throw new Error(`Failed to submit generation: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      throw error;
    }
  }

  async function pollJob(jobId) {
    const pollUrl = `${apiUrl}/${jobId}`;

    while (true) {
      try {
        const response = await fetch(pollUrl, { headers });
        const result = await response.json();
        const status = result.status;

        const terminalStatuses = [
          "COMPLETED",
          "FAILED",
          "REJECTED",
          "CANCELLED",
        ];

        if (terminalStatuses.includes(status)) {
          if (status === "COMPLETED") {
            const generatedVideoUrl = result.outputUrl;
            console.log(`Job ${jobId} completed!`);
            console.log(`Generated video URL: ${generatedVideoUrl}`);
            return generatedVideoUrl
            break;
          } else {
            console.log(`Job ${jobId} failed with status: ${status}`);
            console.log(JSON.stringify(result, null, 2));
            break;
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      } catch (error) {
        console.error("Error polling job:", error);
        throw error;
      }
    }
  }

  async function main() {
    console.log("Starting lip sync generation job...");
    try {
      const jobId = await submitGeneration();
      const syncUrlFromPollJob = await pollJob(jobId);
      return syncUrlFromPollJob
    } catch (error) {
      console.error("Error in main process:", error);
    }
  }

  return await main();
}

export default generateSyncVideo

// // ----------[OPTIONAL] UPDATE VIDEO AND AUDIO URL ----------
// const videoUrl =
//   "https://synchlabs-public.s3.us-west-2.amazonaws.com/david_demo_shortvid-03a10044-7741-4cfc-816a-5bccd392d1ee.mp4"; // URL to your source video
// const audioUrl =
//   "https://synchlabs-public.s3.us-west-2.amazonaws.com/david_demo_shortaud-27623a4f-edab-4c6a-8383-871b18961a4a.wav"; // URL to your audio file
// // ----------------------------------------
