from pydantic import BaseModel,Field
from typing import Annotated

class PredictNextRequest(BaseModel):
    user_id:Annotated[int,Field(...,description="id of user")]