from datetime import timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.db_model import Prediction, ConsumptionHistory
from app.schema.prediction_schema import PredictNextRequest
from app.models.model_loader import ridge_model
import numpy as np
from app.services.tariff_service import calculate_maharashtra_bill
from app.services.carbon_service import calculate_carbon_data
from app.services.insight_service import generate_ai_insights
from app.services.user_service import validate_user

def predict_next_month(request: PredictNextRequest, db: Session):
    
    user_id = request.user_id
    validate_user(request.user_id, db)

    records = (
        db.query(ConsumptionHistory)
        .filter(ConsumptionHistory.user_id == user_id)
        .order_by(ConsumptionHistory.month.asc())
        .all()
    )

    if len(records) < 12:
        raise HTTPException(status_code=400, detail="At least 12 months of data is required")

    last_12 = records[-12:]
    values = [r.actual_kwh for r in last_12]

    lag_1 = values[-1]
    lag_2 = values[-2]
    lag_3 = values[-3]
    lag_12 = values[-12]
    trend = len(records)

    X_input = np.array([[lag_1, lag_2, lag_3, lag_12, trend]])

    predicted_kwh = float(ridge_model.predict(X_input)[0])
    predicted_kwh = round(predicted_kwh, 2)
    
    # ✅ Tariff
    predicted_bill = float(calculate_maharashtra_bill(predicted_kwh))

    # ✅ Carbon
    carbon_data = calculate_carbon_data(predicted_kwh)

    carbon_kg = float(carbon_data["carbon_kg"])

    # ✅ Insights
    insights = generate_ai_insights(predicted_kwh, lag_1)
    
    next_month = last_12[-1].month + timedelta(days=31)
    next_month = next_month.replace(day=1)
    
    prediction_record = Prediction(
    user_id=user_id,
    month=next_month,
    predicted_kwh=predicted_kwh,
    predicted_bill=predicted_bill,
    carbon_kg=carbon_kg
    )
    db.add(prediction_record)
    db.commit()

    return {
        "predicted_kwh": predicted_kwh,
        "predicted_bill": predicted_bill,
        **carbon_data,
        "insights": insights
    }