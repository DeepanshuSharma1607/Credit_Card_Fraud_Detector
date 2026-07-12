import { apiClient } from './client'

/**
 * GET /api/v1/prediction/
 * Returns every past prediction row, response_model = List[Predictions].
 * The backend does not sort or paginate this - it's a raw table scan -
 * so ordering/filtering happens client-side.
 */
export async function fetchPredictions() {
  const { data } = await apiClient.get('/')
  return data
}

/**
 * POST /api/v1/prediction/predict
 * Body must match CreateCreditCardDetails exactly:
 *   trans_date_trans_time: datetime (ISO 8601 string)
 *   category: string
 *   amt: number (float)
 *   gender: string  -> backend's LabelEncoder was fit on ["F", "M"] only;
 *                       anything else throws inside prediction.py.
 *   city_pop: integer
 *   job: string
 *   dob: date (ISO date string, YYYY-MM-DD)
 *   dist: number (float)
 *
 * Returns response_model = Predictions (the created row, including
 * uid, is_fraud, fraud_probability).
 */
export async function createPrediction(payload) {
  const { data } = await apiClient.post('/predict', payload)
  return data
}
