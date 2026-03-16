from typing import Annotated

from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,Field
from typing import Optional,Annotated,Literal
app = FastAPI()
'''

orig Index(['Unnamed: 0', 'trans_date_trans_time', 'cc_num', 'merchant', 'category',
       'amt', 'first', 'last', 'gender', 'street', 'city', 'state', 'zip',
       'lat', 'long', 'city_pop', 'job', 'dob', 'trans_num', 'unix_time',
       'merch_lat', 'merch_long', 'is_fraud'],
      dtype='object')
      
      
Index(['amt', 'gender', 'city_pop', 'job', 'age', 'hour', 'day_of_week',
       'month', 'is_weekend', 'cc_num_freq', 'cat_freq', 'dist',
       'high_risk_cat'],
      dtype='object')
      
'''
class CreditCard(BaseModel):
    trans_date_trans_time: str    # "2024-01-15 14:30:00" 5
    dob: str                      # "1990-05-20" 1
    category: str                 # "grocery_pos"--high risk 2
    amt: float                    # 150.75 1
    gender: str                   # "Male" / "Female" 1
    city_pop: int                 # actual number 1
    job: str                      # "Engineer"1
    dist: float 1




@app.get("/")
def home():
    return {"message":"Hello World"}

@app.get("/about")
def about():
    return {'message':'This is Credit Card Fraud Detector'}