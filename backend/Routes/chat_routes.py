from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from Databases.database import get_db
from Databases.crud import (
    save_message,
    get_recent_messages,
    get_older_messages
)

from Schemas.chat import ChatRequest, ChatResponse

from Services.validation import (
    validate_user_request,
    validate_llm_response
)

from Services.context_manager import context_manager
from Services.llm_service import generate_response
from Services.prompt_architecture import build_system_prompt


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/", response_model=ChatResponse)
def chat(
    chat_data: ChatRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------
    # 1. Validate user ID
    # --------------------------------------------------

    if chat_data.user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID."
        )

    # --------------------------------------------------
    # 2. Validate user request
    # --------------------------------------------------

    try:
        user_message = validate_user_request(
            chat_data.message
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    # --------------------------------------------------
    # 3. Save user's message
    # --------------------------------------------------

    save_message(
        db=db,
        user_id=chat_data.user_id,
        role="user",
        content=user_message
    )

    # --------------------------------------------------
    # 4. Retrieve recent + older messages
    # --------------------------------------------------

    recent_messages = get_recent_messages(
        db=db,
        user_id=chat_data.user_id,
        limit=10
    )

    older_messages = get_older_messages(
        db=db,
        user_id=chat_data.user_id,
        limit=10
    )

    # --------------------------------------------------
    # 5. Combine messages
    # --------------------------------------------------

    all_messages = older_messages + recent_messages

    # --------------------------------------------------
    # 6. Convert DB objects into LLM message format
    # --------------------------------------------------

    conversation_messages = []

    for message in all_messages:

        conversation_messages.append(
            {
                "role": message.role,
                "content": message.content
            }
        )

    # --------------------------------------------------
    # 7. Add system instructions
    # --------------------------------------------------

    messages = [
        {
            "role": "system",
            "content": build_system_prompt()
        }
    ]

    messages.extend(conversation_messages)

    # --------------------------------------------------
    # 8. Build context
    # --------------------------------------------------

    context, summary, total_tokens = context_manager(
        messages=messages,
        conversation_summary=""
    )

    print(
        f"Context tokens: "
        f"{total_tokens}/20000"
    )

    # --------------------------------------------------
    # 9. Generate LLM response
    # --------------------------------------------------

    try:

        model_response = generate_response(
            context
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"LLM error: {str(error)}"
        )

    # --------------------------------------------------
    # 10. Validate LLM response
    # --------------------------------------------------

    try:

        model_response = validate_llm_response(
            model_response
        )

    except ValueError as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    # --------------------------------------------------
    # 11. Save assistant response
    # --------------------------------------------------

    save_message(
        db=db,
        user_id=chat_data.user_id,
        role="assistant",
        content=model_response
    )

    # --------------------------------------------------
    # 12. Return response
    # --------------------------------------------------

    return ChatResponse(
        user_id=chat_data.user_id,
        response=model_response
    )