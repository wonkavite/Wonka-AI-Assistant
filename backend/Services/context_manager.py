from transformers import AutoTokenizer

from .summarizer import summarize_conversation


# --------------------------------------------------
# Configuration
# --------------------------------------------------

INPUT_TOKEN_BUDGET = 20_000
RECENT_MESSAGES = 10


# --------------------------------------------------
# Tokenizer
# --------------------------------------------------

tokenizer = AutoTokenizer.from_pretrained(
    "deepseek-ai/DeepSeek-V4-Flash-0731"
)


# --------------------------------------------------
# Token Counter
# --------------------------------------------------

def count_tokens(messages: list[dict]) -> int:

    total_tokens = 0

    for message in messages:

        content = message["content"]

        tokens = tokenizer.encode(content)

        total_tokens += len(tokens)

    return total_tokens


# --------------------------------------------------
# Context Manager
# --------------------------------------------------

def context_manager(
    messages: list[dict],
    conversation_summary: str = ""
):

    # ----------------------------------------------
    # Separate system message from conversation
    # ----------------------------------------------

    system_message = messages[0]

    conversation_messages = messages[1:]

    # ----------------------------------------------
    # Keep latest 10 messages
    # ----------------------------------------------

    recent_messages = conversation_messages[
        -RECENT_MESSAGES:
    ]

    # ----------------------------------------------
    # Identify older messages
    # ----------------------------------------------

    older_messages = conversation_messages[
        :-RECENT_MESSAGES
    ]

    # ----------------------------------------------
    # Summarize older messages
    # ----------------------------------------------

    if older_messages:

        conversation_summary = summarize_conversation(
            conversation_summary,
            [
                {
                    "role": message["role"],
                    "content": message["content"]
                }
                for message in older_messages
            ]
        )

    # ----------------------------------------------
    # Build final context
    # ----------------------------------------------

    context_messages = [system_message]

    if conversation_summary:

        context_messages.append(
            {
                "role": "system",
                "content": (
                    "Conversation memory:\n\n"
                    + conversation_summary
                )
            }
        )

    context_messages.extend(recent_messages)

    # ----------------------------------------------
    # Count final context tokens
    # ----------------------------------------------

    total_tokens = count_tokens(
        context_messages
    )

    # ----------------------------------------------
    # Return final context
    # ----------------------------------------------

    return (
        context_messages,
        conversation_summary,
        total_tokens
    )