"""
Modelo de Previsão de Demanda usando Prophet e Ensemble
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Optional, Tuple, Dict, Any
import pickle
from pathlib import Path

# ML
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from config import MODELS_DIR, MODEL_VERSION, FORECAST_DAYS
from feature_engineering import create_feature_dataset, get_feature_columns


class DemandForecaster:
    """
    Modelo de previsão de demanda para pizzaria
    Combina Prophet para séries temporais + Random Forest para features
    """
    
    def __init__(self, model_version: str = MODEL_VERSION):
        self.model_version = model_version
        self.model_orders = None
        self.model_revenue = None
        self.scaler = StandardScaler()
        self.feature_columns = []
        self.metrics = {}
        
    def prepare_data(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Prepara dados para treino/teste
        """
        df = df.copy()
        df = df.sort_values('date')
        
        # Remover linhas com NaN no target
        df = df.dropna(subset=['next_day_orders', 'next_day_revenue'])
        
        # Selecionar features
        feature_cols = get_feature_columns()
        
        # Usar apenas features disponíveis
        available_features = []
        for category in ['calendar', 'holiday', 'weather', 'lag_orders', 'lag_revenue']:
            for col in feature_cols.get(category, []):
                if col in df.columns:
                    available_features.append(col)
        
        self.feature_columns = available_features
        
        # Remover linhas com NaN nas features
        df = df.dropna(subset=available_features)
        
        return df, df[available_features]
    
    def train(self, df: pd.DataFrame, test_size: float = 0.2) -> Dict[str, float]:
        """
        Treina os modelos de previsão
        
        Args:
            df: DataFrame com features
            test_size: Proporção para teste
        
        Returns:
            Dicionário com métricas de avaliação
        """
        print("🎯 Treinando modelos de previsão...")
        
        # Preparar dados
        df_clean, X = self.prepare_data(df)
        
        y_orders = df_clean['next_day_orders']
        y_revenue = df_clean['next_day_revenue']
        
        # Split temporal (não aleatório!)
        split_idx = int(len(df_clean) * (1 - test_size))
        
        X_train = X.iloc[:split_idx]
        X_test = X.iloc[split_idx:]
        
        y_orders_train = y_orders.iloc[:split_idx]
        y_orders_test = y_orders.iloc[split_idx:]
        
        y_revenue_train = y_revenue.iloc[:split_idx]
        y_revenue_test = y_revenue.iloc[split_idx:]
        
        print(f"   📊 Treino: {len(X_train)} dias | Teste: {len(X_test)} dias")
        
        # Normalizar features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Treinar modelo de pedidos
        print("   🔧 Treinando modelo de pedidos...")
        self.model_orders = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        )
        self.model_orders.fit(X_train_scaled, y_orders_train)
        
        # Treinar modelo de receita
        print("   🔧 Treinando modelo de receita...")
        self.model_revenue = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        )
        self.model_revenue.fit(X_train_scaled, y_revenue_train)
        
        # Avaliar modelos
        orders_pred = self.model_orders.predict(X_test_scaled)
        revenue_pred = self.model_revenue.predict(X_test_scaled)
        
        self.metrics = {
            'orders': {
                'mae': mean_absolute_error(y_orders_test, orders_pred),
                'rmse': np.sqrt(mean_squared_error(y_orders_test, orders_pred)),
                'r2': r2_score(y_orders_test, orders_pred),
                'mape': np.mean(np.abs((y_orders_test - orders_pred) / y_orders_test)) * 100
            },
            'revenue': {
                'mae': mean_absolute_error(y_revenue_test, revenue_pred),
                'rmse': np.sqrt(mean_squared_error(y_revenue_test, revenue_pred)),
                'r2': r2_score(y_revenue_test, revenue_pred),
                'mape': np.mean(np.abs((y_revenue_test - revenue_pred) / y_revenue_test)) * 100
            },
            'train_size': len(X_train),
            'test_size': len(X_test),
            'features_used': len(self.feature_columns)
        }
        
        print("\n📈 Métricas do modelo (Pedidos):")
        print(f"   MAE: {self.metrics['orders']['mae']:.2f} pedidos")
        print(f"   RMSE: {self.metrics['orders']['rmse']:.2f}")
        print(f"   R²: {self.metrics['orders']['r2']:.3f}")
        print(f"   MAPE: {self.metrics['orders']['mape']:.1f}%")
        
        print("\n📈 Métricas do modelo (Receita):")
        print(f"   MAE: R$ {self.metrics['revenue']['mae']:.2f}")
        print(f"   RMSE: R$ {self.metrics['revenue']['rmse']:.2f}")
        print(f"   R²: {self.metrics['revenue']['r2']:.3f}")
        print(f"   MAPE: {self.metrics['revenue']['mape']:.1f}%")
        
        return self.metrics
    
    def get_feature_importance(self) -> pd.DataFrame:
        """
        Retorna importância das features
        """
        if self.model_orders is None:
            return pd.DataFrame()
        
        importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance_orders': self.model_orders.feature_importances_,
            'importance_revenue': self.model_revenue.feature_importances_
        })
        
        importance['importance_avg'] = (
            importance['importance_orders'] + importance['importance_revenue']
        ) / 2
        
        return importance.sort_values('importance_avg', ascending=False)
    
    def predict(self, features: pd.DataFrame) -> Dict[str, Any]:
        """
        Faz previsão para um conjunto de features
        
        Args:
            features: DataFrame com features (mesmas colunas do treino)
        
        Returns:
            Dicionário com previsões
        """
        if self.model_orders is None:
            raise ValueError("Modelo não treinado. Execute train() primeiro.")
        
        # Garantir que temos todas as features
        missing = set(self.feature_columns) - set(features.columns)
        if missing:
            raise ValueError(f"Features faltando: {missing}")
        
        X = features[self.feature_columns].copy()
        
        # Preencher NaN com 0 ou média (para previsões futuras)
        X = X.fillna(0)
        
        X_scaled = self.scaler.transform(X)
        
        orders_pred = self.model_orders.predict(X_scaled)
        revenue_pred = self.model_revenue.predict(X_scaled)
        
        return {
            'orders': orders_pred,
            'revenue': revenue_pred,
            'dates': features['date'].values if 'date' in features.columns else None
        }
    
    def save(self, path: Optional[Path] = None) -> str:
        """
        Salva o modelo treinado
        """
        if path is None:
            path = MODELS_DIR / f"demand_model_{self.model_version}.pkl"
        
        model_data = {
            'version': self.model_version,
            'model_orders': self.model_orders,
            'model_revenue': self.model_revenue,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns,
            'metrics': self.metrics,
            'trained_at': datetime.now().isoformat()
        }
        
        with open(path, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"💾 Modelo salvo em: {path}")
        return str(path)
    
    def load(self, path: Optional[Path] = None) -> bool:
        """
        Carrega um modelo salvo
        """
        if path is None:
            path = MODELS_DIR / f"demand_model_{self.model_version}.pkl"
        
        if not path.exists():
            print(f"❌ Modelo não encontrado: {path}")
            return False
        
        with open(path, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model_version = model_data['version']
        self.model_orders = model_data['model_orders']
        self.model_revenue = model_data['model_revenue']
        self.scaler = model_data['scaler']
        self.feature_columns = model_data['feature_columns']
        self.metrics = model_data['metrics']
        
        print(f"✅ Modelo carregado: v{self.model_version}")
        return True


def generate_future_features(
    df_historical: pd.DataFrame,
    days_ahead: int = FORECAST_DAYS
) -> pd.DataFrame:
    """
    Gera features para dias futuros (para previsão)
    """
    last_date = df_historical['date'].max()
    future_dates = pd.date_range(
        start=last_date + timedelta(days=1),
        periods=days_ahead,
        freq='D'
    )
    
    future_df = pd.DataFrame({'date': future_dates})
    
    # Features de calendário
    future_df['dayOfWeek'] = future_df['date'].dt.dayofweek
    future_df['dayOfMonth'] = future_df['date'].dt.day
    future_df['month'] = future_df['date'].dt.month
    future_df['year'] = future_df['date'].dt.year
    future_df['weekOfYear'] = future_df['date'].dt.isocalendar().week
    future_df['quarter'] = future_df['date'].dt.quarter
    future_df['isWeekend'] = future_df['dayOfWeek'].isin([5, 6]).astype(int)
    future_df['isFriday'] = (future_df['dayOfWeek'] == 4).astype(int)
    future_df['isSaturday'] = (future_df['dayOfWeek'] == 5).astype(int)
    future_df['isSunday'] = (future_df['dayOfWeek'] == 6).astype(int)
    future_df['isStartOfMonth'] = (future_df['dayOfMonth'] <= 5).astype(int)
    future_df['isEndOfMonth'] = (future_df['dayOfMonth'] >= 25).astype(int)
    future_df['isSummer'] = future_df['month'].isin([12, 1, 2]).astype(int)
    future_df['isWinter'] = future_df['month'].isin([6, 7, 8]).astype(int)
    future_df['isHighSeason'] = (future_df['isSummer'] | future_df['isWinter']).astype(int)
    
    # Features de feriado (simplificado)
    future_df['isHoliday'] = 0
    future_df['holidayImpact'] = 0
    future_df['daysToHoliday'] = 99
    future_df['daysFromHoliday'] = 99
    
    # Features de clima (usar média histórica por mês)
    month_avg = df_historical.groupby('month').agg({
        'tempMin': 'mean',
        'tempMax': 'mean',
        'tempAvg': 'mean',
        'precipitation': 'mean'
    }).reset_index()
    
    future_df = future_df.merge(month_avg, on='month', how='left')
    future_df['isRainy'] = (future_df['precipitation'] > 5).astype(int)
    future_df['isHot'] = (future_df['tempMax'] > 30).astype(int)
    future_df['isCold'] = (future_df['tempMin'] < 18).astype(int)
    future_df['tempRange'] = future_df['tempMax'] - future_df['tempMin']
    future_df['isBeachWeather'] = 0
    
    # Features de lag (usar últimos valores conhecidos)
    last_orders = df_historical['orders'].iloc[-1] if 'orders' in df_historical.columns else 0
    last_revenue = df_historical['revenue'].iloc[-1] if 'revenue' in df_historical.columns else 0
    
    future_df['orders_lag_1'] = last_orders
    future_df['orders_lag_7'] = df_historical['orders'].iloc[-7] if len(df_historical) >= 7 else last_orders
    future_df['orders_lag_14'] = df_historical['orders'].iloc[-14] if len(df_historical) >= 14 else last_orders
    future_df['orders_lag_28'] = df_historical['orders'].iloc[-28] if len(df_historical) >= 28 else last_orders
    
    future_df['orders_ma_7'] = df_historical['orders'].tail(7).mean()
    future_df['orders_ma_14'] = df_historical['orders'].tail(14).mean()
    future_df['orders_ma_28'] = df_historical['orders'].tail(28).mean()
    
    future_df['orders_std_7'] = df_historical['orders'].tail(7).std()
    future_df['orders_std_14'] = df_historical['orders'].tail(14).std()
    
    future_df['orders_same_dow_last_week'] = last_orders
    future_df['orders_trend_7d'] = 0
    
    future_df['revenue_lag_1'] = last_revenue
    future_df['revenue_lag_7'] = df_historical['revenue'].iloc[-7] if len(df_historical) >= 7 else last_revenue
    future_df['revenue_ma_7'] = df_historical['revenue'].tail(7).mean()
    future_df['revenue_ma_14'] = df_historical['revenue'].tail(14).mean()
    
    last_ticket = df_historical['avg_ticket'].iloc[-1] if 'avg_ticket' in df_historical.columns else 100
    future_df['ticket_lag_1'] = last_ticket
    future_df['ticket_ma_7'] = df_historical['avg_ticket'].tail(7).mean() if 'avg_ticket' in df_historical.columns else last_ticket
    
    return future_df


if __name__ == "__main__":
    print("🎯 Modelo de Previsão de Demanda - Pirata Pizzaria")
    print("=" * 60)
    
    # 1. Criar dataset de features
    df = create_feature_dataset()
    
    if df.empty:
        print("❌ Sem dados para treinar")
        exit(1)
    
    # 2. Treinar modelo
    forecaster = DemandForecaster()
    metrics = forecaster.train(df)
    
    # 3. Mostrar importância das features
    print("\n📊 Top 10 Features mais importantes:")
    importance = forecaster.get_feature_importance()
    print(importance.head(10).to_string())
    
    # 4. Salvar modelo
    forecaster.save()
    
    # 5. Gerar previsão para próximos dias
    print(f"\n🔮 Previsão para os próximos {FORECAST_DAYS} dias:")
    future_features = generate_future_features(df)
    predictions = forecaster.predict(future_features)
    
    for i, date in enumerate(predictions['dates']):
        orders = predictions['orders'][i]
        revenue = predictions['revenue'][i]
        print(f"   {date.strftime('%Y-%m-%d')} ({date.strftime('%A')[:3]}): "
              f"{orders:.0f} pedidos, R$ {revenue:,.2f}")

