from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int]=mapped_column(primary_key=True, index=True)
    
    username: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True
    )

    email: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True
    )

    password: Mapped[str] = mapped_column(
        String,
        nullable=False
    )