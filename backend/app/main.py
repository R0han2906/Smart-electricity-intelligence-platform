from fastapi import FastAPI
from app.config.database import engine,Base
from app.models import db_model
from app.routes import user_routes
from app.routes import consumption_routes
from app.routes import prediction_routes
from app.routes import dashboard_routes

app = FastAPI()

Base.metadata.create_all(bind=engine)
app.include_router(user_routes.router)
app.include_router(prediction_routes.router)
app.include_router(consumption_routes.router)
app.include_router(dashboard_routes.router)


@app.get("/health")
def health():
    return {"status": "ok"}