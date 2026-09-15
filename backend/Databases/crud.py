from sqlalchemy.orm import Session

from .user_model import User
from .message_model import Message


# --------------------------------------------------
# User Operations
# --------------------------------------------------

def create_user(
    db: Session,
    username: str,
    email: str,
    password: str
):
    user = User(
        username=username,
        email=email,
        password=password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_email(
    db: Session,
    email: str
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


# --------------------------------------------------
# Message Operations
# --------------------------------------------------

def save_message(
    db: Session,
    user_id: int,
    role: str,
    content: str
):
    message = Message(
        user_id=user_id,
        role=role,
        content=content
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_recent_messages(
    db: Session,
    user_id: int,
    limit: int = 10
):
    messages = (
        db.query(Message)
        .filter(Message.user_id == user_id)
        .order_by(Message.id.desc())
        .limit(limit)
        .all()
    )

    # Database returns newest → oldest.
    # Reverse so the LLM receives oldest → newest.
    return messages[::-1]


def get_older_messages(
    db: Session,
    user_id: int,
    limit: int = 10
):
    recent_messages = (
        db.query(Message.id)
        .filter(Message.user_id == user_id)
        .order_by(Message.id.desc())
        .limit(limit)
        .all()
    )

    if not recent_messages:
        return []

    oldest_recent_id = recent_messages[-1][0]

    return (
        db.query(Message)
        .filter(
            Message.user_id == user_id,
            Message.id < oldest_recent_id
        )
        .order_by(Message.id.asc())
        .all()
    )


def get_user_by_username(
    db: Session,
    username: str
):
    return (
        db.query(User)
        .filter(User.username == username)
        .first()
    )