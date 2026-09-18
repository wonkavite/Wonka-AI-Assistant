import os

from dotenv import load_dotenv
from groq import Groq
from groq.types.chat import ChatCompletionMessageParam

# --------------------------------------------------
# Configuration
# --------------------------------------------------

load_dotenv()

API_KEY = os.getenv("Groq_API_KEY")

if not API_KEY:
    raise ValueError("Groq_API_KEY is not configured.")


client = Groq(
    api_key=API_KEY
)

MODEL_NAME = os.getenv(
    "MODEL_NAME",
    "openai/gpt-oss-20b"
)


# --------------------------------------------------
# LLM Service
# --------------------------------------------------

def generate_response(messages: list[ChatCompletionMessageParam]) -> str:
    """
    Send the prepared conversation context to Groq
    and return the generated response.
    """

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=1,
        max_completion_tokens=2000,
        top_p=1,
        reasoning_effort="medium",
        stream=False
    )

    model_response = response.choices[0].message.content

    if model_response is None:
        raise ValueError(
            "The LLM returned an empty response."
        )

    return model_response