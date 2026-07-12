# 💳 The Fraud Gazette — Credit Card Fraud Detection

A full-stack, real-time credit card fraud detection system. A trained XGBoost model — compared against Logistic Regression and Random Forest on a heavily imbalanced, real-world transaction dataset — is served through an async FastAPI backend with PostgreSQL persistence and a React frontend.

> *"Every transaction, scrutinized. Filed against a model trained on millions of prior cases."*

---

## 📌 Overview

This project trains and compares three classifiers — Logistic Regression, Random Forest, and XGBoost — on a real-world, heavily imbalanced transaction dataset (~0.58% fraud rate). The best-performing model (XGBoost) is packaged and exposed through a FastAPI service with a React frontend, so a user can submit a transaction and get an instant, permanently-logged fraud verdict.

---

## 📂 Project Structure

```
credit_card_fraud/
├── src/                          # Backend (FastAPI)
│   ├── __init__.py               # FastAPI app instance, lifespan, router mounting
│   ├── config.py                 # Pydantic Settings (.env loader)
│   ├── fraud_model_1.pkl         # Saved model package (XGBoost + scaler + encoders)
│   ├── backend/
│   │   ├── models.py             # SQLModel table (Past_Prediction)
│   │   ├── schemas.py            # Pydantic request/response schemas
│   │   ├── prediction.py         # Feature engineering + model inference
│   │   ├── service.py            # Business logic layer
│   │   └── routes.py             # API routes
│   └── db/
│       └── main.py               # Async engine, session factory, init_db()
│
├── frontend/                     # React app (Vite + Tailwind)
│   └── src/
│       ├── data/
│       │   ├── options.js        # Dropdown options derived from the model's pkl
│       │   └── jobs_raw.json     # All 494 job titles the model recognizes
│       ├── components/           # PredictionForm, JobAutocomplete, PredictionsTable, etc.
│       ├── api/                  # Axios client + prediction API calls
│       └── pages/                # NewCasePage, LedgerPage
│
└── notebook/
    ├── CreditCard.ipynb          # EDA, feature engineering, model training
    ├── section1_eda.png          # EDA visualizations
    ├── section2_features.png     # Feature engineering plots
    └── section3_models.png       # Model comparison charts
```

---

## 📊 Dataset

- **Source:** [Kaggle — Credit Card Fraud Detection (kartik2112)](https://www.kaggle.com/datasets/kartik2112/fraud-detection)
- **Train set:** 1,296,675 transactions
- **Test set:** 555,719 transactions
- **Unique cardholders:** 999
- **Fraud rate:** ~0.58% (severe class imbalance)
- **Raw features:** 23 columns including transaction time, merchant, amount, cardholder demographics, and geo-coordinates

---

## ⚙️ Feature Engineering

Raw columns are transformed into 12 model features. The user only provides the columns in **bold**; everything else is derived server-side at request time (`src/backend/prediction.py`) to exactly match what the notebook computed at training time.

| Feature | Description |
|---|---|
| **`amt`** | Transaction amount (log-scaled) |
| **`gender`** | Label-encoded (`M`/`F` only) |
| **`city_pop`** | Cardholder's city population (log-scaled) |
| **`job`** | Frequency-encoded job title (494 known titles) |
| `age` | Derived from `dob` + transaction time |
| `hour` | Hour of transaction (0–23), derived |
| `day_of_week` | Day of week (0=Mon … 6=Sun), derived |
| `month` | Month of transaction, derived |
| `is_weekend` | 1 if Saturday or Sunday, derived |
| `cat_freq` | Frequency encoding of **`category`** |
| **`dist`** | Haversine distance: cardholder ↔ merchant (km) |
| `high_risk_cat` | 1 if **`category`** is in the high-risk list |

**High-risk categories:** `misc_net`, `grocery_pos`, `gas_transport`, `entertainment`, `grocery_net`, `shopping_net`, `shopping_pos`, `misc_pos`

All features are scaled using `RobustScaler` (fit on training data, saved in the model package) before inference.

---

## 🤖 Models & Results

| Model | Precision (Fraud) | Recall (Fraud) | F1 (Fraud) | ROC-AUC |
|---|---|---|---|---|
| Logistic Regression | 0.02 | 0.74 | 0.04 | — |
| Random Forest | 0.27 | 0.91 | 0.41 | — |
| **XGBoost** ✅ | **0.90** | **0.77** | **0.83** | **~0.98** |

XGBoost uses `scale_pos_weight=99` to counter the class imbalance. The decision threshold is swept from 0.1–0.9 to maximize F1 on the fraud class; the best threshold found is **0.86** (rather than the default 0.5).

---

## 🔑 Key Findings from EDA

- Fraud peaks sharply between **midnight and 3 AM**
- High-risk categories (`misc_net`, `shopping_net`) have disproportionately high fraud rates
- Fraudulent transactions tend to be **well above the cardholder's average historical spend**
- `dist`, `amt`, and `high_risk_cat` are the strongest predictors of fraud

---

## 📦 Model Package

The saved file `fraud_model_1.pkl` contains:

```python
{
  'model':          <XGBClassifier>,
  'scaler':         <RobustScaler>,
  'best_threshold': 0.86,
  'cat_freq_map':   <dict>,
  'job_freq_map':   <dict>,
  'gender_encoder': <LabelEncoder>
}
```

The frontend's dropdown options (`frontend/src/data/options.js`) are generated directly from these same lookup tables (`cat_freq_map`, `job_freq_map`, `gender_encoder.classes_`), so a submission can never contain a category, job, or gender the model has never seen.

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- [`uv`](https://docs.astral.sh/uv/) (recommended) or `pip`

### Backend Setup

1. **Create the database**
   ```sql
   CREATE DATABASE credit_card_db;
   ```

2. **Create and activate a virtual environment**
   ```bash
   cd credit_card_fraud
   uv venv
   .venv\Scripts\activate      # Windows
   source .venv/bin/activate   # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   uv pip install -r requirements.txt
   ```

4. **Configure environment variables** — create a `.env` file in the project root:
   ```env
   DATABASE_URL=postgresql+asyncpg://<user>:<password>@localhost:5432/credit_card_db
   ```

5. **Run the server**
   ```bash
   uv run uvicorn src:app --reload
   ```
   The `predictions` table is created automatically on startup. Interactive API docs: `http://127.0.0.1:8000/docs`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Configure `frontend/.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 🔌 API Reference

Base path: `/api/v1/prediction`

### `POST /predict` — score a transaction and log it

**Request body:**
```json
{
  "trans_date_trans_time": "2020-09-07T23:30:44",
  "category": "shopping_net",
  "amt": 974.10,
  "gender": "M",
  "city_pop": 695,
  "job": "Administrator",
  "dob": "1954-07-15",
  "dist": 80.34
}
```

**Response `201 Created`:**
```json
{
  "uid": "8a8968c1-ce11-4f9d-bb6a-fa27c1bb7012",
  "trans_date_trans_time": "2020-09-07T23:30:44",
  "category": "shopping_net",
  "amt": 974.1,
  "gender": "M",
  "city_pop": 695,
  "job": "Administrator",
  "dob": "1954-07-15",
  "dist": 80.34,
  "is_fraud": true,
  "fraud_probability": 0.9999697208404541
}
```

### `GET /` — full prediction ledger

Returns every past prediction (`List[Predictions]`), permanently stored in Postgres — nothing is deleted or anonymized after submission.

---

## 🛠️ Requirements

**Backend**
```
fastapi
uvicorn
pydantic
pydantic-settings
sqlmodel
asyncpg
pandas
numpy
scikit-learn
xgboost
```

**Notebook / training only** (not needed in production)
```
kagglehub
matplotlib
psutil
```

**Frontend**
```
react
react-dom
react-router-dom
axios
vite
tailwindcss
```

---

## ⚠️ Known Limitations

- `gender` is strictly binary (`F`/`M`) — the model was only trained on these labels; anything else throws a server-side error rather than degrading gracefully.
- Unrecognized `category` or `job` values fall back to a frequency of `0` rather than erroring (mitigated on the frontend by restricting inputs to known values via dropdowns/autocomplete).
- Trained on U.S. transaction data from a specific time window — performance on significantly different distributions (region, era, spending patterns) is not guaranteed.
- No authentication layer — the ledger is currently open to anyone with API access.

## 🗺️ Roadmap

- [ ] Authentication for the ledger view
- [ ] Model versioning (track which `model_version` scored each prediction)
- [ ] Retraining pipeline / drift monitoring
- [ ] Dockerize backend + frontend for deployment
- [ ] Pagination and filtering on the ledger endpoint

---

## 📄 License

MIT