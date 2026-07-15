# ⚙️ Smart Electricity Platform Backend APIs

The backend API for the **Smart Electricity Intelligence Platform** is powered by FastAPI, SQLite, and a Ridge Regression forecasting model. It stores user profiles and historical energy data, estimates bills, and runs predictive analytics.

---

## 🛠️ Tech Stack & Services

- **Framework**: FastAPI
- **Database & ORM**: SQLite / SQLAlchemy
- **Machine Learning**: NumPy, Scikit-Learn
- **Server**: Uvicorn

---

## 🧠 Forecasting Model Details

The system runs a **Ridge Regression** forecasting model to predict next month's consumption. 
- **Features Used**:
  - `lag_1` (usage from 1 month ago)
  - `lag_2` (usage from 2 months ago)
  - `lag_3` (usage from 3 months ago)
  - `lag_12` (usage from 12 months ago to capture seasonal cycles)
  - `trend` (index of total historical months entered to capture long-term growth)
- **Model Loader**:
  `app/models/model_loader.py` dynamically loads the trained Ridge Regression model file located under `backend/model_artifacts/`.

---

## 🔌 API Endpoints Reference

### 1. User Profile Management
- `POST /users`: Registers a new user.
  - **Request Body**: `{ "name": "string", "email": "string" }`
  - **Returns**: Database user object (including `id`).
- `GET /users`: Retrieves all registered users.
  - **Returns**: Array of user profiles.
- `POST /users-with-history`: Registers a user and uploads a list of monthly consumption records in a single payload.

### 2. Historical Consumption
- `POST /consumption`: Adds a single monthly consumption entry.
  - **Request Body**: `{ "user_id": int, "month": "YYYY-MM-DD", "actual_kwh": float }`

### 3. Forecasting & Analytics
- `POST /predict-next-month`: Runs model inference using the last 12 months of consumption data to project the next month's usage, estimates the bill, computes carbon statistics, and inserts the result in the `predictions` table.
  - **Request Body**: `{ "user_id": int }`
  - **Returns**: `{ "predicted_kwh": float, "predicted_bill": float, "carbon_kg": float, "trees_required": float, "vehicle_km_equivalent": float, "insights": list }`
- `POST /dashboard?user_id={user_id}`: Retrieves all historical consumption records and predicted values for a given user.
  - **Returns**: `{ "consumption_history": [...], "predictions": [...] }`
- `GET /health`: Health-check endpoint returning `{"status": "ok"}`.

---

## 🗄️ Database Schema & Models

```text
  ┌──────────────┐          ┌───────────────────────┐
  │    users     │          │  consumption_history  │
  ├──────────────┤          ├───────────────────────┤
  │ id (PK)      │◄──┐      │ id (PK)               │
  │ name         │   └─────  │ user_id (FK)          │
  │ email        │          │ month (Date)          │
  │ created_at   │          │ actual_kwh            │
  └──────────────┘          │ created_at            │
                            └───────────────────────┘
                                        ▲
  ┌───────────────────────┐             │
  │      predictions      │             │
  ├───────────────────────┤             │
  │ id (PK)               │             │
  │ user_id (FK)  ────────┴─────────────┘
  │ month (Date)
  │ predicted_kwh
  │ predicted_bill
  │ carbon_kg
  │ created_at
  └───────────────────────┘
```

---

## 🚀 Running Locally

1. Create a Python virtual environment:
   ```bash
   python -m venv backend-env
   ```
2. Activate the virtual environment:
   - **Windows (PowerShell)**: `.\backend-env\Scripts\Activate.ps1`
   - **macOS/Linux**: `source backend-env/bin/activate`
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   Access API documentation at `http://127.0.0.1:8000/docs` (Swagger UI).
