from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session 
from app.config.database import get_db
from app.models.db_model import ConsumptionHistory
from app.schema.consumption_schema import ConsumptionCreate

router = APIRouter()

@router.post("/consumption")
def add_consumption(consumption:ConsumptionCreate,db:Session=Depends(get_db)):
    record = ConsumptionHistory(
        user_id=consumption.user_id,
        month=consumption.month,
        actual_kwh=consumption.actual_kwh
    )
    
    db.add(record)
    
    try:
        db.commit()
        db.refresh(record)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Consumption for this month already exists for this user."
        )
        
        
    db.commit()
    db.refresh(record)
    
    return record
