from fastapi import APIRouter , status , Depends
from src.backend.models import Past_Prediction
from typing import List
from src.backend.service import PredictionService
from sqlmodel.ext.asyncio.session import AsyncSession
from src.backend.schemas import CreateCreditCardDetails , Predictions
from src.db.main import get_session


router = APIRouter()
service = PredictionService()


@router.get("/",response_model = List[Predictions])
async def get_predictions(session : AsyncSession = Depends(get_session)):
    prediction = await service.get_prediction(session)
    return prediction


@router.post("/predict",status_code = status.HTTP_201_CREATED
             ,response_model = Predictions)
async def credit_card_details(data : CreateCreditCardDetails , session : AsyncSession = Depends(get_session)) -> dict:

    prediction = await service.create_prediction(data,session)

    return prediction