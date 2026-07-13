from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.services.dashboard_service import get_dashboard_data

router = APIRouter()

@router.post("/dashboard")
def dashboard(user_id:int,db : Session=Depends(get_db)):
    return get_dashboard_data(user_id, db)
