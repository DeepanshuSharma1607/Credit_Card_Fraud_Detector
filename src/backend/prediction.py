import pickle, os
from sqlmodel.ext.asyncio.session import AsyncSession
from src.backend.models import Past_Prediction
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(__file__)   
MODEL_PATH = os.path.join(BASE_DIR, "..", "fraud_model_1.pkl")
with open(MODEL_PATH, "rb") as f:
    package = pickle.load(f)

model = package["model"]
scaler = package["scaler"]
threshold = package["best_threshold"]
cat_map = package["cat_freq_map"]
job_map = package["job_freq_map"]
gender_encoder = package["gender_encoder"]

HIGH_RISK = ['misc_net','grocery_pos','gas_transport','entertainment',
             'grocery_net','shopping_net','shopping_pos','misc_pos']

def prediction(data):

    trans_time = pd.to_datetime(data.trans_date_trans_time)
    dob = pd.to_datetime(data.dob)

    age = (trans_time - dob).days//365
    hour = trans_time.hour

    day_of_week = trans_time.dayofweek
    month = trans_time.month
    is_weekend = int(day_of_week in [5,6])

    cat_freq = cat_map.get(data.category , 0)
    job_freq = job_map.get(data.job ,0)

    gender_enc = gender_encoder.transform([data.gender])[0]
    high_risk_cat = int(data.category in HIGH_RISK)

    amt_log = np.log1p(data.amt)
    city_pop_log = np.log1p(data.city_pop)

    df = pd.DataFrame([{
        "amt": amt_log, "gender": gender_enc, "city_pop": city_pop_log,
        "job": job_freq, "age": age, "hour": hour,
        "day_of_week": day_of_week, "month": month,
        "is_weekend": is_weekend, "cat_freq": cat_freq,
        "dist": data.dist, "high_risk_cat": high_risk_cat
    }])

    df_scaled = scaler.transform(df)

    proba = model.predict_proba(df_scaled)[0][1]

    is_fraud = bool(proba >= threshold)

    record = Past_Prediction(
            trans_date_trans_time=trans_time,
            category=data.category,
            amt=data.amt,
            gender=data.gender,
            city_pop=data.city_pop,
            job=data.job,
            dob=data.dob,
            dist=data.dist,
            is_fraud = is_fraud,
            fraud_probability= float(proba)
        )

    return record
