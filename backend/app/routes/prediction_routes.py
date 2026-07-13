from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session 
from app.config.database import get_db
from app.models.db_model import Prediction,ConsumptionHistory
from app.schema.prediction_schema import PredictNextRequest
from pathlib import Path
from app.services.forecast_service import predict_next_month
import numpy as np
from datetime import datetime

router = APIRouter()

@router.post("/predict-next-month")
def predict(request:PredictNextRequest, db: Session = Depends(get_db)):
    result = predict_next_month(request,db)
    return result
    