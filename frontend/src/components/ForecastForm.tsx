import { useState } from 'react';
import { Sun, CloudSun, Wind, Droplets, Zap, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { GlowCard } from './ui/spotlight-card';
import axios from 'axios';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const API_BASE_URL = 'https://heliocast.onrender.com';

interface PredictionResult {
  predicted_power: number;
  unit: string;
  status: string;
  inputs: {
    Temperature: number;
    wind_speed: number;
    humidity: number;
  };
}

interface ForecastHour {
  hour: number;
  predicted_power: number;
  temperature: number;
  wind_speed: number;
  humidity: number;
  time: string;
}

interface ForecastResult {
  forecast: ForecastHour[];
  total_hours: number;
  status: string;
}

export default function ForecastForm() {
  const [temperature, setTemperature] = useState('28');
  const [windSpeed, setWindSpeed] = useState('4');
  const [humidity, setHumidity] = useState('60');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<PredictionResult>(`${API_BASE_URL}/predict`, {
        Temperature: parseFloat(temperature),
        wind_speed: parseFloat(windSpeed),
        humidity: parseFloat(humidity),
      });
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to get prediction. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForecast = async () => {
    setForecastLoading(true);
    setError(null);

    try {
      const response = await axios.get<ForecastResult>(`${API_BASE_URL}/forecast`);
      setForecast(response.data);
    } catch (err) {
      setError('Failed to get forecast. Please try again.');
      console.error(err);
    } finally {
      setForecastLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instant Prediction Card */}
      <div className="relative">
        {/* Background layer for the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-orange-50 rounded-2xl" />
        
        <GlowCard 
          glowColor="orange" 
          customSize 
          className="w-full relative bg-white/95"
        >
          <div className="relative z-20 p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg shadow-lg shadow-orange-500/30">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Instant Power Prediction</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Enter current weather conditions to predict solar power generation
              </p>
            </div>
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center gap-2 text-gray-700">
                  <CloudSun className="h-4 w-4 text-orange-500" />
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="e.g., 28"
                  required
                  className="border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="windSpeed" className="flex items-center gap-2 text-gray-700">
                  <Wind className="h-4 w-4 text-blue-500" />
                  Wind Speed (m/s)
                </Label>
                <Input
                  id="windSpeed"
                  type="number"
                  step="0.1"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(e.target.value)}
                  placeholder="e.g., 4"
                  required
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="humidity" className="flex items-center gap-2 text-gray-700">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  Humidity (%)
                </Label>
                <Input
                  id="humidity"
                  type="number"
                  step="0.1"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  placeholder="e.g., 60"
                  required
                  className="border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Predict Power
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleForecast}
                disabled={forecastLoading}
                variant="outline"
                className="flex-1 border-orange-300 hover:bg-orange-50"
              >
                {forecastLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    24h Forecast
                  </>
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {prediction && (
            <div className="mt-6 p-6 bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 rounded-xl border-2 border-orange-300 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-800 mb-1 font-medium">Predicted Power Output</p>
                  <p className="text-4xl font-bold text-orange-600">
                    {prediction.predicted_power.toLocaleString()}
                    <span className="text-xl ml-2 text-orange-700">{prediction.unit}</span>
                  </p>
                </div>
                <Sun className="h-16 w-16 text-orange-500 opacity-70" />
              </div>
              <div className="mt-4 pt-4 border-t border-orange-300 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-700">Temperature</p>
                  <p className="font-semibold text-gray-900">{prediction.inputs.Temperature}°C</p>
                </div>
                <div>
                  <p className="text-gray-700">Wind Speed</p>
                  <p className="font-semibold text-gray-900">{prediction.inputs.wind_speed} m/s</p>
                </div>
                <div>
                  <p className="text-gray-700">Humidity</p>
                  <p className="font-semibold text-gray-900">{prediction.inputs.humidity}%</p>
                </div>
              </div>
            </div>
          )}
          </div>
        </GlowCard>
      </div>      {/* Forecast Chart */}
      {forecast && (
        <div className="relative">
          {/* Background layer for the card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-orange-50 rounded-2xl" />
          
          <GlowCard 
            glowColor="orange" 
            customSize 
            className="w-full relative bg-white/95"
          >
            <div className="relative z-20 p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg shadow-lg shadow-orange-500/30">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">24-Hour Power Forecast</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Hourly solar power generation predictions powered by LSTM
                </p>
              </div>
            <div className="h-80 w-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast.forecast}>
                  <defs>
                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d97706" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#78350f"
                    fontSize={12}
                    tick={{ fill: '#78350f' }}
                  />
                  <YAxis 
                    stroke="#78350f"
                    fontSize={12}
                    tick={{ fill: '#78350f' }}
                    label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', fill: '#78350f' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '2px solid rgba(249, 115, 22, 0.5)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.2)',
                      color: '#1f2937',
                      padding: '12px',
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)} MW`, 'Power']}
                    labelStyle={{ color: '#ea580c', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted_power"
                    stroke="#f97316"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPower)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl border-2 border-orange-300 shadow-lg">
                <p className="text-xs text-orange-800 mb-1 font-semibold uppercase tracking-wider">Peak Power</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.max(...forecast.forecast.map(f => f.predicted_power)).toFixed(2)}
                </p>
                <p className="text-xs text-orange-700 font-medium">MW</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-xl border-2 border-blue-300 shadow-lg">
                <p className="text-xs text-blue-800 mb-1 font-semibold uppercase tracking-wider">Avg Temperature</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(forecast.forecast.reduce((sum, f) => sum + f.temperature, 0) / forecast.total_hours).toFixed(1)}
                </p>
                <p className="text-xs text-blue-700 font-medium">°C</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-100 to-teal-50 rounded-xl border-2 border-cyan-300 shadow-lg">
                <p className="text-xs text-cyan-800 mb-1 font-semibold uppercase tracking-wider">Avg Humidity</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {(forecast.forecast.reduce((sum, f) => sum + f.humidity, 0) / forecast.total_hours).toFixed(1)}
                </p>
                <p className="text-xs text-cyan-700 font-medium">%</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl border-2 border-green-300 shadow-lg">
                <p className="text-xs text-green-800 mb-1 font-semibold uppercase tracking-wider">Total Energy</p>
                <p className="text-2xl font-bold text-green-600">
                  {(forecast.forecast.reduce((sum, f) => sum + f.predicted_power, 0)).toFixed(0)}
                </p>
                <p className="text-xs text-green-700 font-medium">MWh</p>
              </div>
            </div>
            </div>
          </GlowCard>
        </div>
      )}
    </div>
  );
}
