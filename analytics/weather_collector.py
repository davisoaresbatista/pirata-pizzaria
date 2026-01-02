"""
Coletor de dados meteorológicos para Bertioga usando Open-Meteo API (gratuita)
https://open-meteo.com/
"""
import requests
from datetime import datetime, timedelta
from typing import Optional
import pandas as pd

from config import (
    BERTIOGA_LAT, BERTIOGA_LON, 
    OPEN_METEO_BASE_URL, OPEN_METEO_FORECAST_URL
)
from database import save_weather_data


# Mapeamento de códigos WMO para condições
WMO_CODES = {
    0: "Céu limpo",
    1: "Predominantemente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina com geada",
    51: "Garoa leve",
    53: "Garoa moderada",
    55: "Garoa forte",
    56: "Garoa congelante leve",
    57: "Garoa congelante forte",
    61: "Chuva leve",
    63: "Chuva moderada",
    65: "Chuva forte",
    66: "Chuva congelante leve",
    67: "Chuva congelante forte",
    71: "Neve leve",
    73: "Neve moderada",
    75: "Neve forte",
    77: "Grãos de neve",
    80: "Pancadas leves",
    81: "Pancadas moderadas",
    82: "Pancadas fortes",
    85: "Pancadas de neve leves",
    86: "Pancadas de neve fortes",
    95: "Tempestade",
    96: "Tempestade com granizo leve",
    99: "Tempestade com granizo forte",
}


def get_condition_from_code(code: int) -> str:
    """Converte código WMO para descrição"""
    return WMO_CODES.get(code, "Desconhecido")


def fetch_historical_weather(
    start_date: str,
    end_date: str,
    lat: float = BERTIOGA_LAT,
    lon: float = BERTIOGA_LON
) -> pd.DataFrame:
    """
    Busca dados históricos de clima da API Open-Meteo
    
    Args:
        start_date: Data inicial (YYYY-MM-DD)
        end_date: Data final (YYYY-MM-DD)
        lat: Latitude
        lon: Longitude
    
    Returns:
        DataFrame com dados diários de clima
    """
    print(f"🌤️  Buscando clima de {start_date} a {end_date}...")
    
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "temperature_2m_mean",
            "apparent_temperature_mean",
            "precipitation_sum",
            "rain_sum",
            "weathercode",
            "windspeed_10m_max",
            "winddirection_10m_dominant",
            "uv_index_max",
        ],
        "timezone": "America/Sao_Paulo"
    }
    
    try:
        response = requests.get(OPEN_METEO_BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        daily = data.get("daily", {})
        
        df = pd.DataFrame({
            "date": pd.to_datetime(daily.get("time", [])),
            "tempMax": daily.get("temperature_2m_max", []),
            "tempMin": daily.get("temperature_2m_min", []),
            "tempAvg": daily.get("temperature_2m_mean", []),
            "feelsLikeAvg": daily.get("apparent_temperature_mean", []),
            "precipitation": daily.get("precipitation_sum", []),
            "conditionCode": daily.get("weathercode", []),
            "windSpeed": daily.get("windspeed_10m_max", []),
            "windDirection": daily.get("winddirection_10m_dominant", []),
            "uvIndex": daily.get("uv_index_max", []),
        })
        
        # Adicionar descrição da condição
        df["condition"] = df["conditionCode"].apply(
            lambda x: get_condition_from_code(int(x)) if pd.notna(x) else None
        )
        
        print(f"   ✅ {len(df)} dias de dados obtidos")
        return df
        
    except requests.RequestException as e:
        print(f"   ❌ Erro ao buscar clima: {e}")
        return pd.DataFrame()


def fetch_forecast_weather(
    days: int = 14,
    lat: float = BERTIOGA_LAT,
    lon: float = BERTIOGA_LON
) -> pd.DataFrame:
    """
    Busca previsão do tempo para os próximos dias
    
    Args:
        days: Número de dias para prever (máx 16)
        lat: Latitude
        lon: Longitude
    
    Returns:
        DataFrame com previsão diária
    """
    print(f"🔮 Buscando previsão para os próximos {days} dias...")
    
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "apparent_temperature_mean",
            "precipitation_sum",
            "precipitation_probability_max",
            "weathercode",
            "windspeed_10m_max",
            "uv_index_max",
        ],
        "timezone": "America/Sao_Paulo",
        "forecast_days": min(days, 16)
    }
    
    try:
        response = requests.get(OPEN_METEO_FORECAST_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        daily = data.get("daily", {})
        
        df = pd.DataFrame({
            "date": pd.to_datetime(daily.get("time", [])),
            "tempMax": daily.get("temperature_2m_max", []),
            "tempMin": daily.get("temperature_2m_min", []),
            "feelsLikeAvg": daily.get("apparent_temperature_mean", []),
            "precipitation": daily.get("precipitation_sum", []),
            "precipProbability": daily.get("precipitation_probability_max", []),
            "conditionCode": daily.get("weathercode", []),
            "windSpeed": daily.get("windspeed_10m_max", []),
            "uvIndex": daily.get("uv_index_max", []),
        })
        
        # Calcular temperatura média
        df["tempAvg"] = (df["tempMax"] + df["tempMin"]) / 2
        
        # Adicionar descrição da condição
        df["condition"] = df["conditionCode"].apply(
            lambda x: get_condition_from_code(int(x)) if pd.notna(x) else None
        )
        
        print(f"   ✅ Previsão para {len(df)} dias obtida")
        return df
        
    except requests.RequestException as e:
        print(f"   ❌ Erro ao buscar previsão: {e}")
        return pd.DataFrame()


def collect_and_save_historical(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int:
    """
    Coleta dados históricos e salva no banco
    
    Args:
        start_date: Data inicial (padrão: 4 meses atrás)
        end_date: Data final (padrão: ontem)
    
    Returns:
        Número de registros salvos
    """
    if not end_date:
        end_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    if not start_date:
        start_date = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
    
    df = fetch_historical_weather(start_date, end_date)
    
    if df.empty:
        return 0
    
    count = save_weather_data(df)
    print(f"💾 {count} registros de clima salvos no banco")
    
    return count


if __name__ == "__main__":
    print("🌤️  Coletor de Dados Meteorológicos - Bertioga/SP")
    print("=" * 50)
    
    # Coletar dados históricos dos últimos 4 meses
    count = collect_and_save_historical()
    
    print("\n" + "=" * 50)
    print("📊 Amostra da previsão:")
    forecast = fetch_forecast_weather(7)
    if not forecast.empty:
        print(forecast[["date", "tempMin", "tempMax", "condition", "precipitation"]].to_string())

