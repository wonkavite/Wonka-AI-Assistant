from .llm_service import client, MODEL_NAME


def summarize_conversation(
    current_summary: str,
    messages_to_summarize: list[dict]
) -> str:

    # ----------------------------------------------
    # Convert messages into readable conversation
    # ----------------------------------------------

    conversation_text = ""

    for message in messages_to_summarize:
        role = message["role"]
        content = message["content"]

        conversation_text += (
            f"{role.upper()}: {content}\n"
        )

    # ----------------------------------------------
    # Summary instructions
    # ----------------------------------------------

    summary_prompt = f"""
You maintain a concise memory of a conversation.

Update the existing conversation summary using the
new conversation messages.

Preserve:

- Important facts about the user
- User goals
- Important decisions
- Preferences
- Ongoing projects
- Important technical context
- Information that may be useful for future responses

Remove:

- Repetition
- Unnecessary details
- Casual conversation that has no future value

Existing summary:

{current_summary}

New conversation messages:

{conversation_text}

Return only the updated summary.
"""

    # ----------------------------------------------
    # Call LLM
    # ----------------------------------------------

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You maintain concise and useful "
                    "conversation memory."
                )
            },
            {
                "role": "user",
                "content": summary_prompt
            }
        ]
    )

    # ----------------------------------------------
    # Extract summary
    # ----------------------------------------------

    summary = response.choices[0].message.content

    if summary is None:
        raise ValueError(
            "The summarizer returned an empty response."
        )

    return summary.strip()