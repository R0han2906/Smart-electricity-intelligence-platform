from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "ridge_model.pkl"

ridge_model = joblib.load(MODEL_PATH)