from fastapi import FastAPI
from utils import generate_complete_video  # Import your function
from fastapi.responses import FileResponse
from fastapi.exceptions import HTTPException

app = FastAPI()

data = [
    {
        "text": "Hello students! 👋 Today, we're going to learn about something super cool — The Water Cycle 🌍💧. Have you ever wondered where rain comes from or how puddles disappear after it rains? Well, you're about to find out!",
        "imagePrompt": "A brightly colored, cartoon-style Earth with raindrops and a sun, with friendly students looking up in wonder.",
    },
    {
        "text": "Let's start with the big picture. The water cycle is the journey water takes as it moves around our planet — from oceans to the sky, to the land, and back again. It's nature's way of recycling water, and it never stops!",
        "imagePrompt": "A simplified diagram of the water cycle showing arrows indicating the continuous movement of water between oceans, sky, and land.",
    },
    {
        "text": "The first stage is called evaporation. This happens when the sun heats up water in rivers, lakes, or oceans, and turns it into vapor — a kind of gas — that rises into the air. It's like when you see steam rising from a hot cup of tea ☕!",
        "imagePrompt": "The sun shining down on a blue lake, with water evaporating and rising as steam. A small inset image shows steam rising from a teacup.",
    },
    {
        "text": "Once that water vapor reaches the sky and starts to cool down, it turns into tiny droplets and forms clouds. This is called condensation. You can think of it like how water forms on the outside of a cold glass on a hot day.",
        "imagePrompt": "Water vapor rising to the sky and condensing into fluffy white clouds. An inset image shows water droplets forming on the outside of a cold glass.",
    },
    {
        "text": "When those clouds get heavy with too many water droplets, it starts to rain — or sometimes snow or hail! This step is called precipitation ☔❄. It's how water comes back down to the ground.",
        "imagePrompt": "Dark gray clouds releasing rain, snow, and hail towards the ground. The scene should include both raindrops and snowflakes falling.",
    },
    {
        "text": "After that, the water gathers again in places like rivers, lakes, and oceans. This is called collection, and it's where the whole cycle gets ready to begin all over again.\n\nSo just to recap:\n\nWater evaporates from the Earth.\n\nIt condenses into clouds.\n\nIt falls as precipitation.\n\nAnd it collects to start the cycle again!\n\nIsn't that amazing? Water just keeps moving, cleaning, and helping life grow everywhere. 🌱🌧\n\nAlright, now here's your challenge: The next time it rains, look outside and try to spot which part of the water cycle is happening. Stay curious and keep learning! See you next time! 👋😄",
        "imagePrompt": "A diverse landscape showing rivers flowing into an ocean, with green plants growing and the sun shining. Arrows show water collecting and restarting the water cycle. A small child observing rain from a window.",
    },
]


@app.get("/generate-left-video")
async def generate_video():
    """Generate a video using the provided data"""
    try:
        output_path = generate_complete_video(data, "generated_data")
        return {
            "status": "success",
            "message": "Video generated successfully",
            "output_path": output_path,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating video: {str(e)}")
