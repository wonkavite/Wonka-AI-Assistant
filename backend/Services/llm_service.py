import os

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

from .prompt_architecture import build_system_prompt


# --------------------------------------------------
# Configuration
# --------------------------------------------------

load_dotenv()

API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise ValueError("API_KEY is not configured.")


client = InferenceClient(
    token=API_KEY,
    provider="auto"
)


MODEL_NAME = "ibm-granite/granite-4.2-30b"


# --------------------------------------------------
# LLM Service
# --------------------------------------------------

def generate_response(messages: list[dict]) -> str:
    """
    Send the prepared conversation context to the LLM
    and return the generated response.
    """

    system_message = {
        "role": "system",
        "content": build_system_prompt()
    }

    request_messages = [
        system_message,
        *messages
    ]

    response = client.chat_completion(
        model=MODEL_NAME,
        messages=request_messages
    )

    model_response = response.choices[0].message.content

    if model_response is None:
        raise ValueError(
            "The LLM returned an empty response."
        )

    return model_response