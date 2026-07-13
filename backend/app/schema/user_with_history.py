from pydantic import BaseModel, Field
from datetime import date
from typing import List,Annotated

class MonthlyConsumption(BaseModel):
    month:Annotated[date,Field(...,description="entry month")]
    actual_kwh:Annotated[float,Field(...,description="actual kwh used")]
    
class UserWithHistoryCreate(BaseModel):
    name: Annotated[str,Field(...,description="name of the user")]
    email: Annotated[str,Field(...,description="email of the user")]
    history: Annotated[List[MonthlyConsumption],Field(...,description="monthly consumption history")]
