from sqlalchemy import Column, Integer, String, Float, Date, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class ConsumptionHistory(Base):
    __tablename__ = "consumption_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month = Column(Date)
    actual_kwh = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    month = Column(Date)
    predicted_kwh = Column(Float)
    predicted_bill = Column(Float)
    carbon_kg = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    