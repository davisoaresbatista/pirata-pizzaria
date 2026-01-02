"""
Feature Engineering para previsão de demanda
Combina dados de vendas, clima e feriados
"""
import pandas as pd
import numpy as np
from typing import Optional
from datetime import datetime, timedelta

from database import get_daily_sales_summary, get_weather_data, get_holidays


def create_calendar_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cria features de calendário a partir das datas
    """
    df = df.copy()
    
    # Extrair componentes da data
    df['dayOfWeek'] = df['date'].dt.dayofweek  # 0=Segunda, 6=Domingo
    df['dayOfMonth'] = df['date'].dt.day
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['weekOfYear'] = df['date'].dt.isocalendar().week
    df['quarter'] = df['date'].dt.quarter
    
    # Flags úteis
    df['isWeekend'] = df['dayOfWeek'].isin([5, 6]).astype(int)  # Sáb e Dom
    df['isFriday'] = (df['dayOfWeek'] == 4).astype(int)
    df['isSaturday'] = (df['dayOfWeek'] == 5).astype(int)
    df['isSunday'] = (df['dayOfWeek'] == 6).astype(int)
    
    # Início/fim do mês
    df['isStartOfMonth'] = (df['dayOfMonth'] <= 5).astype(int)
    df['isEndOfMonth'] = (df['dayOfMonth'] >= 25).astype(int)
    
    # Temporadas (para Bertioga - cidade litorânea)
    # Verão: Dez-Fev (alta temporada)
    # Inverno: Jun-Ago (férias escolares)
    df['isSummer'] = df['month'].isin([12, 1, 2]).astype(int)
    df['isWinter'] = df['month'].isin([6, 7, 8]).astype(int)
    df['isHighSeason'] = (df['isSummer'] | df['isWinter']).astype(int)
    
    return df


def add_holiday_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adiciona features de feriados
    """
    df = df.copy()
    
    # Buscar feriados do banco
    holidays_df = get_holidays()
    
    if holidays_df.empty:
        df['isHoliday'] = 0
        df['holidayType'] = None
        df['holidayScope'] = None
        df['holidayImpact'] = 0
        df['daysToHoliday'] = 99
        df['daysFromHoliday'] = 99
        return df
    
    # Normalizar datas
    holidays_df['date'] = pd.to_datetime(holidays_df['date']).dt.normalize()
    df['date'] = pd.to_datetime(df['date']).dt.normalize()
    
    # Merge com feriados
    df = df.merge(
        holidays_df[['date', 'name', 'eventType', 'scope', 'impactExpected']],
        on='date',
        how='left'
    )
    
    df['isHoliday'] = df['name'].notna().astype(int)
    df['holidayType'] = df['eventType']
    df['holidayScope'] = df['scope']
    
    # Converter impacto para numérico
    impact_map = {'HIGH': 3, 'MEDIUM': 2, 'LOW': 1}
    df['holidayImpact'] = df['impactExpected'].map(impact_map).fillna(0)
    
    # Dias até o próximo feriado / desde o último
    holiday_dates = holidays_df['date'].unique()
    
    def days_to_nearest_holiday(row_date, direction='forward'):
        if direction == 'forward':
            future = [h for h in holiday_dates if h > row_date]
            return (min(future) - row_date).days if future else 99
        else:
            past = [h for h in holiday_dates if h < row_date]
            return (row_date - max(past)).days if past else 99
    
    df['daysToHoliday'] = df['date'].apply(lambda x: days_to_nearest_holiday(x, 'forward'))
    df['daysFromHoliday'] = df['date'].apply(lambda x: days_to_nearest_holiday(x, 'backward'))
    
    # Limpar colunas temporárias
    df = df.drop(columns=['name', 'eventType', 'scope', 'impactExpected'], errors='ignore')
    
    return df


def add_weather_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adiciona features meteorológicas
    """
    df = df.copy()
    
    # Buscar dados de clima
    weather_df = get_weather_data()
    
    if weather_df.empty:
        df['tempMin'] = None
        df['tempMax'] = None
        df['tempAvg'] = None
        df['precipitation'] = 0
        df['isRainy'] = 0
        df['isHot'] = 0
        df['isCold'] = 0
        return df
    
    # Normalizar datas
    weather_df['date'] = pd.to_datetime(weather_df['date']).dt.normalize()
    df['date'] = pd.to_datetime(df['date']).dt.normalize()
    
    # Merge com clima
    df = df.merge(
        weather_df[['date', 'tempMin', 'tempMax', 'tempAvg', 'precipitation', 'condition']],
        on='date',
        how='left'
    )
    
    # Features derivadas
    df['isRainy'] = (df['precipitation'] > 5).astype(int)  # Chuva significativa
    df['isHot'] = (df['tempMax'] > 30).astype(int)
    df['isCold'] = (df['tempMin'] < 18).astype(int)
    df['tempRange'] = df['tempMax'] - df['tempMin']
    
    # Condições boas para praia
    df['isBeachWeather'] = (
        (df['tempMax'] > 25) & 
        (df['precipitation'] < 2) & 
        df['isWeekend']
    ).astype(int)
    
    return df


def add_lag_features(df: pd.DataFrame, target_col: str = 'orders') -> pd.DataFrame:
    """
    Adiciona features de lag (valores passados)
    """
    df = df.copy()
    df = df.sort_values('date')
    
    # Lags do target
    for lag in [1, 7, 14, 28]:
        df[f'{target_col}_lag_{lag}'] = df[target_col].shift(lag)
    
    # Médias móveis
    for window in [7, 14, 28]:
        df[f'{target_col}_ma_{window}'] = df[target_col].rolling(window=window, min_periods=1).mean()
        df[f'{target_col}_std_{window}'] = df[target_col].rolling(window=window, min_periods=1).std()
    
    # Mesmo dia da semana na semana anterior
    df[f'{target_col}_same_dow_last_week'] = df[target_col].shift(7)
    
    # Tendência (variação vs semana anterior)
    df[f'{target_col}_trend_7d'] = df[target_col] - df[target_col].shift(7)
    
    return df


def add_revenue_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adiciona features de receita
    """
    df = df.copy()
    df = df.sort_values('date')
    
    # Lags de receita
    for lag in [1, 7]:
        df[f'revenue_lag_{lag}'] = df['revenue'].shift(lag)
    
    # Médias móveis de receita
    for window in [7, 14]:
        df[f'revenue_ma_{window}'] = df['revenue'].rolling(window=window, min_periods=1).mean()
    
    # Ticket médio
    df['ticket_lag_1'] = df['avg_ticket'].shift(1)
    df['ticket_ma_7'] = df['avg_ticket'].rolling(window=7, min_periods=1).mean()
    
    return df


def create_feature_dataset(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    include_target_lags: bool = True
) -> pd.DataFrame:
    """
    Cria dataset completo com todas as features
    
    Returns:
        DataFrame com features prontas para ML
    """
    print("🔧 Criando dataset de features...")
    
    # 1. Buscar dados de vendas
    print("   📊 Carregando vendas...")
    df = get_daily_sales_summary()
    
    if df.empty:
        print("   ❌ Nenhum dado de vendas encontrado")
        return pd.DataFrame()
    
    print(f"   ✅ {len(df)} dias de vendas")
    
    # 2. Filtrar por datas se especificado
    if start_date:
        df = df[df['date'] >= start_date]
    if end_date:
        df = df[df['date'] <= end_date]
    
    # 3. Adicionar features de calendário
    print("   📅 Adicionando features de calendário...")
    df = create_calendar_features(df)
    
    # 4. Adicionar features de feriados
    print("   🎉 Adicionando features de feriados...")
    df = add_holiday_features(df)
    
    # 5. Adicionar features meteorológicas
    print("   🌤️  Adicionando features meteorológicas...")
    df = add_weather_features(df)
    
    # 6. Adicionar features de lag
    if include_target_lags:
        print("   ⏮️  Adicionando features de lag...")
        df = add_lag_features(df, 'orders')
        df = add_revenue_features(df)
    
    # 7. Criar target para próximo dia (para treino)
    df['next_day_orders'] = df['orders'].shift(-1)
    df['next_day_revenue'] = df['revenue'].shift(-1)
    
    print(f"   ✅ Dataset criado com {len(df)} linhas e {len(df.columns)} colunas")
    
    return df


def get_feature_columns() -> dict:
    """
    Retorna lista de colunas de features por categoria
    """
    return {
        'calendar': [
            'dayOfWeek', 'dayOfMonth', 'month', 'year', 'weekOfYear', 'quarter',
            'isWeekend', 'isFriday', 'isSaturday', 'isSunday',
            'isStartOfMonth', 'isEndOfMonth',
            'isSummer', 'isWinter', 'isHighSeason'
        ],
        'holiday': [
            'isHoliday', 'holidayImpact', 'daysToHoliday', 'daysFromHoliday'
        ],
        'weather': [
            'tempMin', 'tempMax', 'tempAvg', 'precipitation',
            'isRainy', 'isHot', 'isCold', 'tempRange', 'isBeachWeather'
        ],
        'lag_orders': [
            'orders_lag_1', 'orders_lag_7', 'orders_lag_14', 'orders_lag_28',
            'orders_ma_7', 'orders_ma_14', 'orders_ma_28',
            'orders_std_7', 'orders_std_14',
            'orders_same_dow_last_week', 'orders_trend_7d'
        ],
        'lag_revenue': [
            'revenue_lag_1', 'revenue_lag_7',
            'revenue_ma_7', 'revenue_ma_14',
            'ticket_lag_1', 'ticket_ma_7'
        ],
        'target': [
            'orders', 'revenue', 'next_day_orders', 'next_day_revenue'
        ]
    }


if __name__ == "__main__":
    print("🔧 Feature Engineering - Pirata Pizzaria")
    print("=" * 50)
    
    # Criar dataset
    df = create_feature_dataset()
    
    if not df.empty:
        print("\n📊 Amostra do dataset:")
        print(df[['date', 'orders', 'revenue', 'isWeekend', 'isHoliday', 'tempAvg']].tail(10))
        
        print("\n📈 Estatísticas:")
        print(df[['orders', 'revenue', 'avg_ticket']].describe())
        
        # Salvar para análise
        output_path = "data/features_dataset.csv"
        df.to_csv(output_path, index=False)
        print(f"\n💾 Dataset salvo em: {output_path}")

