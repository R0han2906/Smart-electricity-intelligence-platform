from sqlalchemy.orm import Session
from app.models.db_model import ConsumptionHistory, Prediction
from app.services.user_service import validate_user
def get_dashboard_data(user_id: int, db: Session):
    validate_user(user_id,db)
    # Fetch consumption history
    consumption = (
        db.query(ConsumptionHistory)
        .filter(ConsumptionHistory.user_id == user_id)
        .order_by(ConsumptionHistory.month.asc())
        .all()
    )

    consumption_data = [
        {
            "month": str(record.month),
            "actual_kwh": record.actual_kwh
        }
        for record in consumption
    ]

    # Fetch predictions
    predictions = (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id)
        .order_by(Prediction.month.asc())
        .all()
    )

    prediction_data = [
        {
            "month": str(record.month),
            "predicted_kwh": record.predicted_kwh,
            "predicted_bill": record.predicted_bill,
            "carbon_kg": record.carbon_kg
        }
        for record in predictions
    ]

    return {
        "consumption_history": consumption_data,
        "predictions": prediction_data
    }