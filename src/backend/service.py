from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import CreateCreditCardDetails , Predictions
from sqlmodel import select , desc
from src.backend.models import Past_Prediction
from datetime import datetime
from src.backend.prediction import prediction

class PredictionService:
    async def get_prediction(self , session : AsyncSession):
        statement = select(Past_Prediction)
        result = await session.exec(statement)
        return result.all()
    
    async def create_prediction(self , data : CreateCreditCardDetails , session : AsyncSession):
        
        record = prediction(data)

        session.add(record)
        await session.commit()
        await session.refresh(record)

        return record