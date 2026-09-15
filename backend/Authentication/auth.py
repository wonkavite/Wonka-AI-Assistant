from sqlalchemy.orm import Session

from Databases.crud import create_user, get_user_by_email
from Schemas.auth import UserRegister, UserLogin

from .password import hash_password, verify_password


def register_user(
    db: Session,
    user_data: UserRegister
):
    hashed_password = hash_password(user_data.password)

    user = create_user(
        db=db,
        username=user_data.username,
        email=user_data.email,
        password=hashed_password
    )

    return user


def login_user(
    db: Session,
    user_data: UserLogin
):
    user = get_user_by_email(
        db=db,
        email=user_data.email
    )

    if user is None:
        return None

    password_valid = verify_password(
        user_data.password,
        user.password
    )

    if not password_valid:
        return None

    return user