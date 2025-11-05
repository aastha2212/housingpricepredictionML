import json
import pickle
import numpy as np
import os

__locations = None
__data_columns = None
__model = None

def load_saved_artifacts():
    global __data_columns, __locations, __model
    print("Loading saved artifacts...")

    # ✅ Use absolute paths (inside Docker)
    base_path = os.path.dirname(os.path.abspath(__file__))
    artifacts_path = os.path.join(base_path, 'artifacts')

    columns_path = os.path.join(artifacts_path, 'columns.json')
    model_path = os.path.join(artifacts_path, 'banglore_home_prices_model.pickle')

    if not os.path.exists(columns_path) or not os.path.exists(model_path):
        raise FileNotFoundError(f"Missing model or columns in {artifacts_path}")

    with open(columns_path, 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]

    with open(model_path, 'rb') as f:
        __model = pickle.load(f)

    print("Artifacts loaded successfully.")

def get_estimated_price(location, sqft, bhk, bath):
    global __data_columns
    global __model

    if __model is None:
        raise Exception("Model not loaded. Call load_saved_artifacts() first.")

    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)

 


def get_location_names():
    return __locations


def get_data_columns():
    return __data_columns
