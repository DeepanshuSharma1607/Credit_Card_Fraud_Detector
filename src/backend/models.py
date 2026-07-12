from sqlmodel import SQLModel , Field , Column
from datetime import datetime , date
import sqlalchemy.dialects.postgresql as pg
from typing import Literal
import uuid

class Past_Prediction(SQLModel , table = True):
    __tablename__ = "predictions"

    uid : uuid.UUID = Field(
        sa_column = Column(
            pg.UUID,
            nullable = False,
            primary_key = True,
            default = uuid.uuid4
        )
    )

    trans_date_trans_time : datetime = Field(sa_column = Column(pg.TIMESTAMP,default = datetime.now))
    category : str
    amt : float
    gender : str
    city_pop : int
    job : str
    dob : date = Field(sa_column = Column(pg.DATE))
    dist : float
    is_fraud: bool
    fraud_probability: float


    def __repr__(self):
        return f"<Past_Prediction {self.uid}>"
