from typing import Annotated

from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,Field
from typing import Optional,Annotated,Literal
app = FastAPI()
'''
Index(['Unnamed: 0', 'trans_date_trans_time', 'cc_num', 'merchant', 'category',
       'amt', 'first', 'last', 'gender', 'street', 'city', 'state', 'zip',
       'lat', 'long', 'city_pop', 'job', 'dob', 'trans_num', 'unix_time',
       'merch_lat', 'merch_long', 'is_fraud'],
      dtype='object')


Index(['amt', 'gender', 'city_pop', 'job', 'age', 'hour', 'day_of_week',
       'month', 'is_weekend', 'cc_num_freq', 'cat_freq', 'merc_freq', 'dist',
       'amt_vs_avg', 'high_risk_cat'],
      dtype='object')
      
'''
class CreditCard(BaseModel):
    trans_date_trans_time: str    # "2024-01-15 14:30:00"
    dob: str                      # "1990-05-20"
    category: str                 # "grocery_pos"
    amt: float                    # 150.75
    gender: str                   # "Male" / "Female"
    city_pop: int                 # actual number
    job: str                      # "Engineer"
    dist: float




@app.get("/")
def home():
    return {"message":"Hello World"}

@app.get("/about")
def about():
    return {'message':'This is Credit Card Fraud Detector'}