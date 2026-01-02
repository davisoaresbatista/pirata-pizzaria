#!/usr/bin/env python3
"""
Pipeline Principal de Analytics - Pirata Pizzaria
Executa coleta de dados, feature engineering e treinamento de modelo

Uso:
    python run_pipeline.py --all           # Executa tudo
    python run_pipeline.py --weather       # Apenas coleta clima
    python run_pipeline.py --holidays      # Apenas coleta feriados
    python run_pipeline.py --train         # Apenas treina modelo
    python run_pipeline.py --predict       # Apenas gera previsões
"""
import argparse
from datetime import datetime
import pandas as pd

def run_weather_collection():
    """Coleta dados meteorológicos"""
    print("\n" + "=" * 60)
    print("🌤️  COLETA DE DADOS METEOROLÓGICOS")
    print("=" * 60)
    
    from weather_collector import collect_and_save_historical, fetch_forecast_weather
    
    # Coletar histórico
    count = collect_and_save_historical()
    print(f"   ✅ {count} dias de clima histórico salvos")
    
    # Mostrar previsão
    forecast = fetch_forecast_weather(7)
    if not forecast.empty:
        print("\n   📅 Previsão para próximos 7 dias:")
        for _, row in forecast.iterrows():
            print(f"      {row['date'].strftime('%d/%m')}: "
                  f"{row['tempMin']:.0f}°-{row['tempMax']:.0f}° | {row['condition']}")


def run_holidays_collection():
    """Coleta feriados"""
    print("\n" + "=" * 60)
    print("📅 COLETA DE FERIADOS")
    print("=" * 60)
    
    from holidays_collector import collect_and_save_holidays
    
    current_year = datetime.now().year
    count = collect_and_save_holidays([current_year - 1, current_year, current_year + 1])
    print(f"   ✅ {count} feriados salvos")


def run_training():
    """Treina modelo de previsão"""
    print("\n" + "=" * 60)
    print("🎯 TREINAMENTO DO MODELO")
    print("=" * 60)
    
    from feature_engineering import create_feature_dataset
    from demand_forecaster import DemandForecaster
    
    # Criar dataset
    df = create_feature_dataset()
    
    if df.empty:
        print("   ❌ Sem dados para treinar")
        return None
    
    # Treinar modelo
    forecaster = DemandForecaster()
    metrics = forecaster.train(df)
    
    # Mostrar importância das features
    print("\n📊 Top 10 Features mais importantes:")
    importance = forecaster.get_feature_importance()
    for _, row in importance.head(10).iterrows():
        print(f"   {row['feature']}: {row['importance_avg']:.4f}")
    
    # Salvar modelo
    forecaster.save()
    
    return forecaster


def run_predictions(forecaster=None):
    """Gera previsões e salva no banco"""
    print("\n" + "=" * 60)
    print("🔮 PREVISÕES")
    print("=" * 60)
    
    from feature_engineering import create_feature_dataset
    from demand_forecaster import DemandForecaster, generate_future_features
    from database import save_predictions, save_daily_features
    from config import FORECAST_DAYS, MODEL_VERSION
    
    # Carregar modelo se não fornecido
    if forecaster is None:
        forecaster = DemandForecaster()
        if not forecaster.load():
            print("   ❌ Modelo não encontrado. Execute --train primeiro")
            return
    
    # Criar dataset histórico
    df = create_feature_dataset()
    
    if df.empty:
        print("   ❌ Sem dados históricos")
        return
    
    # Salvar features históricas no banco
    features_count = save_daily_features(df)
    print(f"💾 {features_count} dias de features salvos no banco")
    
    # Gerar features futuras
    future_features = generate_future_features(df, FORECAST_DAYS)
    
    # Fazer previsões
    predictions = forecaster.predict(future_features)
    
    print(f"\n📅 Previsão para os próximos {FORECAST_DAYS} dias:")
    print("-" * 50)
    
    total_orders = 0
    total_revenue = 0
    predictions_to_save = []
    
    weekdays_pt = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    
    for i, dt in enumerate(predictions['dates']):
        orders = predictions['orders'][i]
        revenue = predictions['revenue'][i]
        date_obj = pd.Timestamp(dt).to_pydatetime()
        weekday = weekdays_pt[date_obj.weekday()]
        
        total_orders += orders
        total_revenue += revenue
        
        # Preparar para salvar
        predictions_to_save.append({
            'date': date_obj,
            'predictedOrders': orders,
            'predictedRevenue': revenue,
            'modelUsed': 'GradientBoosting',
            'version': MODEL_VERSION
        })
        
        print(f"   {date_obj.strftime('%d/%m/%Y')} ({weekday}): "
              f"{orders:>3.0f} pedidos | R$ {revenue:>8,.2f}")
    
    print("-" * 50)
    print(f"   TOTAL PREVISTO: {total_orders:.0f} pedidos | R$ {total_revenue:,.2f}")
    print(f"   MÉDIA DIÁRIA:   {total_orders/FORECAST_DAYS:.0f} pedidos | R$ {total_revenue/FORECAST_DAYS:,.2f}")
    
    # Salvar previsões no banco
    saved_count = save_predictions(predictions_to_save)
    print(f"\n💾 {saved_count} previsões salvas no banco de dados")


def run_full_pipeline():
    """Executa pipeline completo"""
    print("🏴‍☠️ PIRATA PIZZARIA - ANALYTICS PIPELINE")
    print("=" * 60)
    print(f"   Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    
    # 1. Coletar clima
    run_weather_collection()
    
    # 2. Coletar feriados
    run_holidays_collection()
    
    # 3. Treinar modelo
    forecaster = run_training()
    
    # 4. Gerar previsões
    if forecaster:
        run_predictions(forecaster)
    
    print("\n" + "=" * 60)
    print("✅ PIPELINE CONCLUÍDO")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description='Pipeline de Analytics - Pirata Pizzaria')
    parser.add_argument('--all', action='store_true', help='Executa pipeline completo')
    parser.add_argument('--weather', action='store_true', help='Coleta dados meteorológicos')
    parser.add_argument('--holidays', action='store_true', help='Coleta feriados')
    parser.add_argument('--train', action='store_true', help='Treina modelo de previsão')
    parser.add_argument('--predict', action='store_true', help='Gera previsões')
    
    args = parser.parse_args()
    
    # Se nenhum argumento, mostrar help
    if not any(vars(args).values()):
        parser.print_help()
        return
    
    if args.all:
        run_full_pipeline()
    else:
        if args.weather:
            run_weather_collection()
        if args.holidays:
            run_holidays_collection()
        if args.train:
            run_training()
        if args.predict:
            run_predictions()


if __name__ == "__main__":
    main()

