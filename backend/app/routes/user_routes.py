from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session 
from sqlalchemy.exc import IntegrityError
from app.config.database import get_db
from app.models.db_model import ConsumptionHistory, User
from app.schema.user_schema import UserCreate
from app.schema.user_with_history import UserWithHistoryCreate


router = APIRouter()

@router.post("/users")
def create_user(user:UserCreate,db:Session=Depends(get_db)):

    db_user = User(name=user.name, email=user.email)
    db.add(db_user)

    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists.")

    return db_user

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.post("/users-with-history")
def create_user_with_history(data: UserWithHistoryCreate, db: Session = Depends(get_db)):

    # Create user
    user = User(name=data.name, email=data.email)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Insert consumption history
    for record in data.history:
        consumption = ConsumptionHistory(
            user_id=user.id,
            month=record.month,
            actual_kwh=record.actual_kwh
        )
        db.add(consumption)

    db.commit()

    return {
        "user_id": user.id,
        "message": "User and history created successfully"
    }