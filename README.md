# ☀️ HelioCast - Solar Power Forecasting Platform

<div align="center">

![HelioCast Banner](https://img.shields.io/badge/HelioCast-Solar%20Forecasting-orange?style=for-the-badge&logo=solar-panel)
[![Python](https://img.shields.io/badge/Python-3.13-blue?style=flat-square&logo=python)](https://python.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-orange?style=flat-square&logo=tensorflow)](https://tensorflow.org)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)

**Deep Learning-Powered Solar Energy Forecasting System**

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Model](#-model-details)

</div>

---

## 📋 Overview

HelioCast is a modern, full-stack web application that leverages **Bidirectional LSTM Neural Networks** to predict solar power generation. Built with TensorFlow and React, it provides real-time predictions and 24-hour forecasts based on weather conditions.

### 🎯 Key Highlights

- 🧠 **Advanced ML Model**: Bidirectional LSTM with 12 temporal & weather features
- ⚡ **Real-Time Predictions**: Instant power output estimates based on current conditions
- 📊 **24-Hour Forecasting**: Comprehensive hourly predictions with visualizations
- 🎨 **Modern UI**: Stunning interface with WebGL shader backgrounds and interactive cards
- 🚀 **Production-Ready**: RESTful API with CORS support and error handling

---

## ✨ Features

### Backend (Flask API)
- **Deep Learning Inference**: Pre-trained LSTM model for accurate predictions
- **RESTful API**: Clean endpoints for predictions and forecasts
- **Smart Defaults**: Intelligent feature engineering for missing parameters
- **Data Scaling**: MinMaxScaler for normalized inputs/outputs
- **Health Checks**: Built-in health monitoring endpoint

### Frontend (React + TypeScript)
- **Interactive Dashboard**: Real-time weather input with instant feedback
- **GlowCard Components**: Mouse-following spotlight effects on prediction cards
- **WebGL Backgrounds**: 
  - Fractal Mountains shader in hero section
  - Animated GLSL Hills in forecast area
- **Responsive Charts**: Recharts-powered 24-hour forecast visualization
- **Modern Design**: Tailwind CSS with shadcn/ui components
- **Type Safety**: Full TypeScript implementation

---

## 🏗️ Architecture

```
HelioCast/
├── backend/
│   ├── app.py                          # Flask REST API server
│   ├── requirements.txt                # Python dependencies
│   ├── solar_lstm_forecast_model.keras # Trained LSTM model
│   ├── X_scaler.save                   # Input feature scaler
│   └── y_scaler.save                   # Output scaler
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── HeroSection.tsx         # Hero with fractal mountains
    │   │   ├── ForecastForm.tsx        # Main prediction interface
    │   │   └── ui/
    │   │       ├── glsl-hills.tsx      # Animated 3D background
    │   │       ├── spotlight-card.tsx   # Interactive glow cards
    │   │       └── mountainous-shader.tsx # WebGL fractal shader
    │   ├── App.tsx                     # Main application
    │   └── main.tsx                    # Entry point
    ├── package.json
    └── vite.config.ts
```

### Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Flask 3.0.0, TensorFlow 2.20.0, NumPy 2.1+, scikit-learn 1.7.2 |
| **Frontend** | React 18.2, TypeScript 5.2, Vite 5.0, Tailwind CSS 3.3 |
| **ML Model** | Bidirectional LSTM Neural Network |
| **UI Components** | shadcn/ui, Recharts 2.10, Lucide Icons |
| **3D Graphics** | Three.js, WebGL Shaders |
| **State Management** | React Hooks |

---

## 🚀 Installation

### Prerequisites

- **Python**: 3.13+ (with pip)
- **Node.js**: 18+ (with npm)
- **Git**: For cloning the repository

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The backend will be available at `http://127.0.0.1:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 💻 Usage

### Making Predictions

1. **Navigate** to the application in your browser
2. **Enter Weather Conditions**:
   - Temperature (°C)
   - Wind Speed (m/s)
   - Humidity (%)
3. **Click "Predict Power"** for instant results
4. **Click "24h Forecast"** for hourly predictions

### Sample Request

```bash
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Temperature": 28,
    "wind_speed": 4,
    "humidity": 60
  }'
```

---

## 📡 API Documentation

### Base URL
```
http://127.0.0.1:5000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2025-11-08T13:00:00"
}
```

#### 2. Predict Power
```http
POST /predict
```

**Request Body:**
```json
{
  "Temperature": 28,
  "wind_speed": 4,
  "humidity": 60
}
```

**Response:**
```json
{
  "predicted_power": 6551.56,
  "unit": "MW",
  "inputs": {
    "Temperature": 28,
    "wind_speed": 4,
    "humidity": 60
  },
  "timestamp": "2025-11-08T13:00:00"
}
```

#### 3. Get 24-Hour Forecast
```http
GET /forecast
```

**Query Parameters:**
- `temperature` (optional): Base temperature in °C
- `wind_speed` (optional): Base wind speed in m/s
- `humidity` (optional): Base humidity in %

**Response:**
```json
{
  "forecast": [
    {
      "hour": 0,
      "predicted_power": 5234.12,
      "temperature": 28,
      "wind_speed": 4.2,
      "humidity": 58
    },
    // ... 23 more hours
  ],
  "total_hours": 24,
  "unit": "MW"
}
```

---

## 🤖 Model Details

### Architecture
- **Type**: Bidirectional LSTM (Long Short-Term Memory)
- **Framework**: TensorFlow/Keras
- **Input Features**: 12 parameters
- **Output**: Solar power in Megawatts (MW)

### Input Features

| Feature | Description | Type |
|---------|-------------|------|
| `Power_lag1` | Power output from 1 hour ago | Temporal |
| `Power_lag24` | Power output from 24 hours ago | Temporal |
| `Power_roll6` | 6-hour rolling average | Temporal |
| `Power_roll24` | 24-hour rolling average | Temporal |
| `Temperature` | Ambient temperature | Weather |
| `wind-speed` | Wind speed | Weather |
| `humidity` | Relative humidity | Weather |
| `Hour_sin` | Sine-encoded hour | Temporal |
| `Hour_cos` | Cosine-encoded hour | Temporal |
| `Month_sin` | Sine-encoded month | Temporal |
| `Month_cos` | Cosine-encoded month | Temporal |
| `IsWeekend` | Binary weekend indicator | Temporal |

### Preprocessing
- **Scaling**: MinMaxScaler for all features
- **Normalization**: Input features scaled to [0, 1]
- **Smart Defaults**: Automatic calculation of lag and rolling features

---

## 🎨 UI Components

### 1. Hero Section
- **Fractal Mountains**: WebGL procedural terrain with FBM noise
- **Feature Pills**: Weather Analysis, 24h Forecasting, Real-Time Predictions
- **Smooth Animations**: Gradient backgrounds and floating elements

### 2. Prediction Card
- **GlowCard**: Interactive spotlight effect following mouse
- **Real-Time Input**: Temperature, wind speed, humidity
- **Instant Results**: Predicted power with weather summary

### 3. Forecast Visualization
- **AreaChart**: 24-hour power generation timeline
- **Stat Cards**: Peak power, average temperature, humidity, total energy
- **Responsive Design**: Mobile-friendly layouts

### 4. Animated Background
- **GLSL Hills**: Procedural 3D terrain with Perlin noise
- **Performance Optimized**: 60 FPS smooth animations
- **Light Theme**: Subtle gray waves on white background

---

## 🛠️ Development

### Project Structure

```
Backend:
- Flask REST API with CORS
- TensorFlow model inference
- MinMaxScaler for normalization
- Health monitoring

Frontend:
- Vite build tool for fast HMR
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Three.js for 3D graphics
```

### Available Scripts

**Backend:**
```bash
python app.py          # Start Flask server
pip freeze > requirements.txt  # Update dependencies
```

**Frontend:**
```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

---

## 🔮 Future Enhancements

- [ ] Historical data visualization
- [ ] Multi-location support
- [ ] Weather API integration
- [ ] Model retraining pipeline
- [ ] User authentication
- [ ] Export reports (PDF/CSV)
- [ ] Mobile app (React Native)
- [ ] Real-time weather data streaming
- [ ] Advanced analytics dashboard
- [ ] Model performance monitoring

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Piyush Raj Yadav**

[![GitHub](https://img.shields.io/badge/GitHub-piyushrajyadav-181717?style=flat-square&logo=github)](https://github.com/piyushrajyadav)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/piyushrajyadav)

---

## 🙏 Acknowledgments

- **TensorFlow Team** for the ML framework
- **React Team** for the UI library
- **shadcn** for the component library
- **Three.js Community** for 3D graphics support

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ and ☀️

</div>
