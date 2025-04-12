import os
import mimetypes
import time
from google import genai
from google.genai import types
from gtts import gTTS
import pyttsx3
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import wave
import contextlib
import requests
import json
import shutil


OUTPUT_DIR_IMAGES = "/images"
OUTPUT_DIR_AUDIOS = "/audios"


def generate_audios(texts, voice_gender="male"):
    print(f"\nGenerating audio files with {voice_gender} voice...")

    # ElevenLabs API settings
    ELEVENLABS_API_KEY = "sk_40862de708ef0b8b8a94de62380a7cc68832a9a2ae6668e1"
    ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    # Default to a male voice ID if male is selected, otherwise use female voice ID
    # These are example voice IDs - you can replace with your preferred voices
    voice_id = "pNInz6obpgDQGcFmaJgB"  # Default male voice
    if voice_gender.lower() == "female":
        voice_id = "EXAVITQu4vr4xnSDxMaL"  # Example female voice ID

    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

    for index, text in enumerate(texts):
        try:
            output_file = os.path.join(OUTPUT_DIR_AUDIOS, f"audio_{index + 1}.mp3")
            print(f"Generating audio {index + 1}/{len(texts)}...")

            url = ELEVENLABS_API_URL.format(voice_id=voice_id)
            payload = {
                "text": text, 
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.5},
            }

            response = requests.post(url, headers=headers, json=payload)

            if response.status_code == 200:
                with open(output_file, "wb") as f:
                    f.write(response.content)
                print(f"Audio saved to: {output_file}")
            else:
                print(f"Error generating audio for text {index + 1}: {response.text}")

        except Exception as e:
            print(f"Error generating audio for text {index + 1}: {str(e)}")


def generate_images(prompts):
    # Get API key from environment variable
    api_key = "AIzaSyD2fhsv217RlolFP_4UCyVJhcoVohguHfM"
    if not api_key:
        raise ValueError("Please set the GEMINI_API_KEY environment variable")

    client = genai.Client(api_key=api_key)
    model = "gemini-2.0-flash-exp-image-generation"

    for index, prompt in enumerate(prompts):
        try:
            print(f"\nGenerating image {index + 1}/{len(prompts)}: {prompt[:50]}...")

            contents = [
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt),
                    ],
                ),
            ]
            generate_content_config = types.GenerateContentConfig(
                response_modalities=["image", "text"],
                response_mime_type="text/plain",
            )

            # Add retry mechanism
            max_retries = 3
            retry_count = 0
            while retry_count < max_retries:
                try:
                    for chunk in client.models.generate_content_stream(
                        model=model,
                        contents=contents,
                        config=generate_content_config,
                    ):
                        if (
                            not chunk.candidates
                            or not chunk.candidates[0].content
                            or not chunk.candidates[0].content.parts
                        ):
                            continue

                        if chunk.candidates[0].content.parts[0].inline_data:
                            file_name = f"output_{index + 1}"
                            inline_data = (
                                chunk.candidates[0].content.parts[0].inline_data
                            )
                            file_extension = mimetypes.guess_extension(
                                inline_data.mime_type
                            )
                            full_path = save_binary_file(
                                f"{file_name}{file_extension}", inline_data.data
                            )
                            print(f"File saved to: {full_path}")
                        else:
                            print(chunk.text)

                    # If we get here, the generation was successful
                    break

                except Exception as e:
                    retry_count += 1
                    if retry_count == max_retries:
                        print(
                            f"Failed to generate image for prompt {index + 1} after {max_retries} attempts: {str(e)}"
                        )
                    else:
                        print(f"Attempt {retry_count} failed, retrying in 5 seconds...")
                        time.sleep(5)

            # Add a small delay between prompts to avoid rate limiting
            time.sleep(2)

        except Exception as e:
            print(f"Error processing prompt {index + 1}: {str(e)}")
            continue


def save_binary_file(file_name, data):
    full_path = os.path.join(OUTPUT_DIR_IMAGES, file_name)
    with open(full_path, "wb") as f:
        f.write(data)
    return full_path


def get_audio_duration(audio_path):
    """Get the duration of an audio file"""
    try:
        import librosa

        duration = librosa.get_duration(path=audio_path)
        return duration
    except:
        # Fallback method if librosa is not installed
        with contextlib.closing(wave.open(audio_path, "r")) as f:
            frames = f.getnframes()
            rate = f.getframerate()
            duration = frames / float(rate)
            return duration


def generate_video(audio=True):
    """Generate video from images and audio files with no subtitles

    Parameters:
    audio (bool): Whether to include audio in the generated video. Default is True.
                  When False, the video will maintain the same timing as with audio.
    """
    try:
        print("\nGenerating video from images...")
        print(f"Audio enabled: {audio}")

        # Get sorted lists of files
        image_files = sorted(
            [
                f
                for f in os.listdir(OUTPUT_DIR_IMAGES)
                if f.endswith((".png", ".jpg", ".jpeg"))
            ]
        )

        # Always get audio files and durations for timing, even if audio is disabled
        audio_files = sorted(
            [f for f in os.listdir(OUTPUT_DIR_AUDIOS) if f.endswith(".mp3")]
        )

        if not image_files:
            raise Exception("No image files found in the output directory")

        if not audio_files:
            print(
                "Warning: No audio files found. Using default durations of 5 seconds per image."
            )
            audio_durations = [5.0] * len(image_files)
        else:
            # Get audio durations
            audio_durations = []
            for audio_file in audio_files:
                audio_path = os.path.join(OUTPUT_DIR_AUDIOS, audio_file)
                try:
                    duration = get_audio_duration(audio_path)
                    audio_durations.append(duration)
                except Exception as e:
                    print(f"Error getting duration for {audio_file}: {str(e)}")
                    # Fallback to default duration
                    audio_durations.append(5.0)

        # Make sure we have durations for each image
        if len(audio_durations) < len(image_files):
            # Add default durations if we have fewer audio files than images
            audio_durations.extend([5.0] * (len(image_files) - len(audio_durations)))
        elif len(audio_durations) > len(image_files):
            # Trim if we have more audio files than images
            audio_durations = audio_durations[: len(image_files)]

        # Create output directory
        output_dir = "generated_data/videos"
        os.makedirs(output_dir, exist_ok=True)
        temp_video_path = os.path.join(output_dir, "temp_video.mp4")
        final_output_path = os.path.join(output_dir, "final_video.mp4")

        # Get first image dimensions
        first_img = cv2.imread(os.path.join(OUTPUT_DIR_IMAGES, image_files[0]))
        height, width = first_img.shape[:2]

        # Initialize video writer
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(temp_video_path, fourcc, 24.0, (width, height))

        # Process each image
        for i, img_file in enumerate(image_files):
            img_path = os.path.join(OUTPUT_DIR_IMAGES, img_file)
            img = cv2.imread(img_path)

            if img is None:
                print(f"Error: Could not read image {img_path}")
                continue

            # Resize image if needed
            img = cv2.resize(img, (width, height))

            # Get duration for this image
            duration = audio_durations[i]
            frames_needed = int(duration * 24)  # 24 fps

            print(f"Image {i+1}: Duration = {duration:.2f}s, Frames = {frames_needed}")

            # Add frames to video
            for _ in range(frames_needed):
                out.write(img)

        # Release video writer
        out.release()

        # Now add audio if enabled
        if audio and audio_files:
            try:
                # First concatenate all audio files
                temp_audio_path = os.path.join(output_dir, "temp_audio.mp3")

                # Create the audio concatenation command
                audio_paths = [
                    os.path.join(OUTPUT_DIR_AUDIOS, f)
                    for f in audio_files[: len(image_files)]
                ]
                audio_inputs = " ".join([f'-i "{path}"' for path in audio_paths])
                filter_complex = f'-filter_complex "'
                for i in range(len(audio_paths)):
                    filter_complex += f"[{i}:0]"
                filter_complex += (
                    f'concat=n={len(audio_paths)}:v=0:a=1[out]" -map "[out]"'
                )

                # Concatenate audio files
                concat_cmd = (
                    f'ffmpeg -y {audio_inputs} {filter_complex} "{temp_audio_path}"'
                )
                print("\nConcatenating audio files...")
                os.system(concat_cmd)

                # Now combine video with concatenated audio
                if os.path.exists(final_output_path):
                    os.remove(final_output_path)

                combine_cmd = f'ffmpeg -y -i "{temp_video_path}" -i "{temp_audio_path}" -c:v copy -c:a aac "{final_output_path}"'
                print("\nCombining video and audio...")
                os.system(combine_cmd)

                # Clean up temporary files
                os.remove(temp_video_path)
                os.remove(temp_audio_path)

                print(f"\nVideo with audio generated successfully: {final_output_path}")

            except Exception as e:
                print(f"Error adding audio: {str(e)}")
                print(
                    "Video saved without audio. You can manually combine them using ffmpeg."
                )
                # If audio merging fails, at least keep the video
                if os.path.exists(temp_video_path):
                    if os.path.exists(final_output_path):
                        os.remove(final_output_path)
                    os.rename(temp_video_path, final_output_path)
        else:
            # If audio is disabled, just rename the temp video to final
            if os.path.exists(final_output_path):
                os.remove(final_output_path)
            os.rename(temp_video_path, final_output_path)
            print(f"\nSilent video generated successfully: {final_output_path}")

    except Exception as e:
        print(f"Error generating video: {str(e)}")


def generate_complete_video(data, dir_name="generated_data"):
    global OUTPUT_DIR_AUDIOS
    global OUTPUT_DIR_IMAGES

    prompts = [item["imagePrompt"] for item in data]
    texts = [item["text"] for item in data]
    OUTPUT_DIR_AUDIOS = dir_name + OUTPUT_DIR_AUDIOS
    OUTPUT_DIR_IMAGES = dir_name + OUTPUT_DIR_IMAGES

    shutil.rmtree(dir_name, ignore_errors=True)  # Clean up previous data
    os.makedirs(dir_name, exist_ok=True)
    os.makedirs(OUTPUT_DIR_IMAGES, exist_ok=True)
    os.makedirs(OUTPUT_DIR_AUDIOS, exist_ok=True)

    generate_images(prompts=prompts)
    generate_audios(texts=texts)  # Change to "female" for female voice
    generate_video(
        audio=False
    )  # Set audio=False for a silent video with the same timing
    """returns the path of the generated_data folder"""
    return os.path.abspath(dir_name)


# if __name__ == "__main__":
#     generate_complete_video(data)
