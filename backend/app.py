"""
HelioCast Backend API
=====================
Flask REST API for solar power generation forecasting using LSTM model.

Author: HelioCast Team
Date: 2025
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import joblib
import numpy as np
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes to allow frontend access

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the trained LSTM model
MODEL_PATH = os.path.join(BASE_DIR, 'solar_lstm_forecast_model.keras')
X_SCALER_PATH = os.path.join(BASE_DIR, 'X_scaler.save')
Y_SCALER_PATH = os.path.join(BASE_DIR, 'y_scaler.save')

print("Loading model and scalers...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    X_scaler = joblib.load(X_SCALER_PATH)
    y_scaler = joblib.load(Y_SCALER_PATH)
    print("✓ Model and scalers loaded successfully!")
except Exception as e:
    print(f"✗ Error loading model or scalers: {e}")
    model = None
    X_scaler = None
    y_scaler = None


@app.route('/', methods=['GET'])
def home():
    """
    Home endpoint to verify API is running.
    """
    return jsonify({
        'message': 'Welcome to HelioCast Solar Forecasting API',
        'version': '1.0.0',
        'endpoints': {
            'POST /predict': 'Get single prediction from weather inputs',
            'GET /forecast': 'Get 24-hour forecast predictions'
        }
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict solar power generation based on weather inputs.
    
    Expected JSON input (minimum):
    {
        "Temperature": 25.5,
        "wind_speed": 3.2,
        "humidity": 65.0
    }
    
    Optional fields (will use defaults if not provided):
    {
        "Power_lag1": 1500.0,
        "Power_lag24": 1400.0,
        "Power_roll6": 1450.0,
        "Power_roll24": 1420.0,
        "Hour_sin": 0.5,
        "Hour_cos": 0.866,
        "Month_sin": 0.0,
        "Month_cos": 1.0,
        "IsWeekend": 0
    }
    
    Returns:
    {
        "predicted_power": 4523.45,
        "unit": "MW",
        "inputs": {...}
    }
    """
    try:
        # Check if model is loaded
        if model is None or X_scaler is None or y_scaler is None:
            return jsonify({
                'error': 'Model or scalers not loaded properly'
            }), 500
        
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['Temperature', 'wind_speed', 'humidity']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Extract basic features
        temperature = float(data['Temperature'])
        wind_speed = float(data['wind_speed'])
        humidity = float(data['humidity'])
        
        # Extract optional features with defaults
        # Default values represent typical mid-day conditions with average power
        power_lag1 = float(data.get('Power_lag1', 1500.0))
        power_lag24 = float(data.get('Power_lag24', 1400.0))
        power_roll6 = float(data.get('Power_roll6', 1450.0))
        power_roll24 = float(data.get('Power_roll24', 1420.0))
        hour_sin = float(data.get('Hour_sin', 0.5))  # ~10 AM
        hour_cos = float(data.get('Hour_cos', 0.866))
        month_sin = float(data.get('Month_sin', 0.0))  # January
        month_cos = float(data.get('Month_cos', 1.0))
        is_weekend = int(data.get('IsWeekend', 0))
        
        # Create feature array in the exact order the model was trained on:
        # ["Power_lag1", "Power_lag24", "Power_roll6", "Power_roll24",
        #  "Temperature", "wind-speed", "humidity",
        #  "Hour_sin", "Hour_cos", "Month_sin", "Month_cos", "IsWeekend"]
        features = np.array([[
            power_lag1, power_lag24, power_roll6, power_roll24,
            temperature, wind_speed, humidity,
            hour_sin, hour_cos, month_sin, month_cos, is_weekend
        ]])
        
        # Scale the input features
        features_scaled = X_scaler.transform(features)
        
        # Reshape for LSTM input (samples, timesteps, features)
        # Model expects (batch_size, 1, 12)
        features_reshaped = features_scaled.reshape((1, 1, 12))
        
        # Make prediction
        prediction_scaled = model.predict(features_reshaped, verbose=0)
        
        # Inverse transform to get actual power value
        prediction = y_scaler.inverse_transform(prediction_scaled)
        predicted_power = float(prediction[0][0])
        
        # Ensure non-negative power
        predicted_power = max(0, predicted_power)
        
        # Return the prediction
        return jsonify({
            'predicted_power': round(predicted_power, 2),
            'unit': 'MW',
            'inputs': {
                'Temperature': temperature,
                'wind_speed': wind_speed,
                'humidity': humidity,
                'Power_lag1': power_lag1,
                'Power_lag24': power_lag24,
                'Hour_sin': hour_sin,
                'Hour_cos': hour_cos,
                'Month_sin': month_sin,
                'Month_cos': month_cos,
                'IsWeekend': is_weekend
            },
            'status': 'success',
            'note': 'Using default values for historical power and time features if not provided'
        })
    
    except ValueError as e:
        return jsonify({
            'error': f'Invalid input values: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500


@app.route('/forecast', methods=['GET'])
def forecast():
    """
    Generate 24-hour hourly solar power forecast.
    
    Uses simulated weather patterns for demonstration.
    In production, this would integrate with a weather API.
    
    Returns:
    {
        "forecast": [
            {"hour": 0, "predicted_power": 0.0, "temperature": 15, ...},
            {"hour": 1, "predicted_power": 0.0, "temperature": 14, ...},
            ...
        ],
        "total_hours": 24,
        "status": "success"
    }
    """
    try:
        # Check if model is loaded
        if model is None or X_scaler is None or y_scaler is None:
            return jsonify({
                'error': 'Model or scalers not loaded properly'
            }), 500
        
        forecast_data = []
        
        # Simulate previous power for realistic lag features
        previous_power = 1200.0  # Starting value (MW)
        power_history = [previous_power] * 24  # Initialize with typical values
        
        # Generate 24-hour forecast with simulated weather patterns
        # In production, replace this with actual weather API data
        for hour in range(24):
            # Simulate realistic daily weather patterns
            # Temperature: cooler at night (15°C), warmer during day (30°C)
            temperature = 22.5 + 7.5 * np.sin((hour - 6) * np.pi / 12)
            
            # Wind speed: slightly variable (2-5 m/s)
            wind_speed = 3.5 + 1.5 * np.sin(hour * np.pi / 8)
            
            # Humidity: higher at night (80%), lower during day (40%)
            humidity = 60 - 20 * np.sin((hour - 6) * np.pi / 12)
            
            # Time-based cyclical features
            hour_sin = np.sin(2 * np.pi * hour / 24)
            hour_cos = np.cos(2 * np.pi * hour / 24)
            
            # Assume current month (you can make this dynamic)
            from datetime import datetime
            current_month = datetime.now().month
            month_sin = np.sin(2 * np.pi * current_month / 12)
            month_cos = np.cos(2 * np.pi * current_month / 12)
            
            # Weekend flag (you can make this dynamic based on actual date)
            is_weekend = 0
            
            # Lag features (use recent history)
            power_lag1 = power_history[-1] if len(power_history) > 0 else 1200.0
            power_lag24 = power_history[0] if len(power_history) >= 24 else 1200.0
            power_roll6 = np.mean(power_history[-6:]) if len(power_history) >= 6 else 1200.0
            power_roll24 = np.mean(power_history) if len(power_history) > 0 else 1200.0
            
            # Create feature array with all 12 features
            features = np.array([[
                power_lag1, power_lag24, power_roll6, power_roll24,
                temperature, wind_speed, humidity,
                hour_sin, hour_cos, month_sin, month_cos, is_weekend
            ]])
            
            # Scale and reshape
            features_scaled = X_scaler.transform(features)
            features_reshaped = features_scaled.reshape((1, 1, 12))
            
            # Predict
            prediction_scaled = model.predict(features_reshaped, verbose=0)
            prediction = y_scaler.inverse_transform(prediction_scaled)
            predicted_power = float(prediction[0][0])
            
            # Ensure non-negative power (solar panels don't generate at night)
            predicted_power = max(0, predicted_power)
            
            # Update power history for next iteration
            power_history.append(predicted_power)
            if len(power_history) > 24:
                power_history.pop(0)
            
            forecast_data.append({
                'hour': hour,
                'predicted_power': round(predicted_power, 2),
                'temperature': round(temperature, 1),
                'wind_speed': round(wind_speed, 2),
                'humidity': round(humidity, 1),
                'time': f"{hour:02d}:00"
            })
        
        return jsonify({
            'forecast': forecast_data,
            'total_hours': 24,
            'status': 'success',
            'note': 'This forecast uses simulated weather data. Integrate with a weather API for production use.'
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Forecast generation failed: {str(e)}'
        }), 500


@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint to verify service status.
    """
    model_loaded = model is not None
    scalers_loaded = X_scaler is not None and y_scaler is not None
    
    return jsonify({
        'status': 'healthy' if (model_loaded and scalers_loaded) else 'unhealthy',
        'model_loaded': model_loaded,
        'scalers_loaded': scalers_loaded
    })


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🌞 HelioCast Backend Server Starting...")
    print("="*50)
    print(f"Model path: {MODEL_PATH}")
    print(f"X Scaler path: {X_SCALER_PATH}")
    print(f"Y Scaler path: {Y_SCALER_PATH}")
    print("="*50 + "\n")
    
    # Run the Flask app
    # Host: 127.0.0.1 (localhost)
    # Port: 5000
    # Debug: True for development (disable in production)
    app.run(host='127.0.0.1', port=5000, debug=True)
