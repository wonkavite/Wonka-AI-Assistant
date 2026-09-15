from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )



    user_id: Mapped[int] = mapped_column(
            ForeignKey("users.id"), nullable=False,
            index=True)

    

    role: Mapped[str]=mapped_column( nullable=False)

    content:Mapped[str] = mapped_column(String, nullable=False)

   