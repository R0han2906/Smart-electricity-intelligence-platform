from fastapi import HTTPException
from app.models.db_model import User

def validate_user(user_id: int, db):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user