"""
Configurações do módulo de Analytics
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Carregar variáveis de ambiente
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Localização de Bertioga, SP
BERTIOGA_LAT = -23.8544
BERTIOGA_LON = -46.1389
CITY = "Bertioga"
STATE = "SP"

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Se for SQLite local (desenvolvimento)
SQLITE_PATH = Path(__file__).parent.parent / "prisma" / "dev.db"

# APIs
OPEN_METEO_BASE_URL = "https://archive-api.open-meteo.com/v1/archive"
OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

# Diretórios
ANALYTICS_DIR = Path(__file__).parent
MODELS_DIR = ANALYTICS_DIR / "models"
DATA_DIR = ANALYTICS_DIR / "data"

# Criar diretórios se não existirem
MODELS_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

# Configurações do modelo
MODEL_VERSION = "v1.0.0"
FORECAST_DAYS = 14  # Dias para prever

