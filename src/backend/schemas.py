from pydantic import BaseModel
import uuid
from datetime import datetime , date
from typing import Literal

class CreateCreditCardDetails(BaseModel):
    trans_date_trans_time : datetime 
    category : str
    amt : float
    gender : str
    city_pop : int
    job : str
    dob : date
    dist : float

class Predictions(BaseModel):
    uid : uuid.UUID
    trans_date_trans_time : datetime 
    category : str
    amt : float
    gender : str
    city_pop : int
    job : str
    dob : date
    dist : float
    is_fraud : bool
    fraud_probability : float

    class Config:
        from_attributes = True