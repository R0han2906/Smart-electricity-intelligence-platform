from datetime import date
from pydantic import BaseModel, Field
from typing import Annotated

class ConsumptionCreate(BaseModel):
    user_id:Annotated[int,Field(...,description="id of user")]
    month:Annotated[date,Field(...,description="month of consumption")]
    actual_kwh:Annotated[float,Field(...,description="actual kwh")]
