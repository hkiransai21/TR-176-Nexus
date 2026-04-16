// src/services/weatherService.js
import axios from 'axios';
import { MOCK_WEATHER_DATA, MOCK_FORECAST_RAINFALL } from '../data/mockApiData';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
/**
 * Fetch current weather for a given lat/lon
 * Falls back to mock data if API key not configured
 */
export async function fetchCurrentWeather(lat, lon, districtId) {
  if (!API_KEY || API_KEY === 'your_openweathermap_key_here') {
    // Demo mode — return mock data
    const mock = MOCK_WEATHER_DATA[districtId] || MOCK_WEATHER_DATA.salem;
    return {
      rainfall: mock.rainfall,
      humidity: mock.humidity,
      temp: mock.temp,
      windSpeed: mock.windSpeed,
      condition: mock.condition,
      source: 'MOCK',
    };
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric' },
      timeout: 8000,
    });
    const data = response.data;
    return {
      rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
      humidity: data.main.humidity,
      temp: data.main.temp,
      windSpeed: data.wind.speed * 3.6, // m/s to km/h
      condition: data.weather[0]?.description || 'Unknown',
      source: 'LIVE',
    };
  } catch (err) {
    console.warn(`Weather API failed for ${districtId}, using mock data:`, err.message);
    const mock = MOCK_WEATHER_DATA[districtId] || MOCK_WEATHER_DATA.salem;
    return { ...mock, source: 'MOCK_FALLBACK' };
  }
}

/**
 * Fetch 72-hour forecast rainfall data
 * Returns array of 24 values (3-hour intervals)
 */
export async function fetchForecastRainfall(lat, lon, districtId) {
  if (!API_KEY || API_KEY === 'your_openweathermap_key_here') {
    return MOCK_FORECAST_RAINFALL[districtId] || MOCK_FORECAST_RAINFALL.default;
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 24 },
      timeout: 8000,
    });
    return response.data.list.map(item => item.rain?.['3h'] || 0);
  } catch (err) {
    console.warn(`Forecast API failed for ${districtId}, using mock:`, err.message);
    return MOCK_FORECAST_RAINFALL[districtId] || MOCK_FORECAST_RAINFALL.default;
  }
}