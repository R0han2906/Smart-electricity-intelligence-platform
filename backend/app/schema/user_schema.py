from pydantic import BaseModel, Field,field_validator
from typing import Annotated


class UserCreate(BaseModel):
    
    name:Annotated[str,Field(...,description="name of the user")]
    email:Annotated[str,Field(...,description="email of the user")]
    
    
    @field_validator("email")
    def email_validator(cls,v:str):
        if not v.endswith("@gmail.com"):
            raise ValueError("email must end with @gmail.com")
        return v
    
    
    
    
