# 📊 Pirata Pizzaria - Analytics & ML

Sistema de análise de dados e previsão de demanda para a Pirata Pizzaria.

## 🚀 Setup

### 1. Criar ambiente virtual

```bash
cd analytics
python -m venv venv

# Ativar ambiente
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate   # Windows
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

O sistema usa o arquivo `.env` da pasta raiz do projeto.

## 📋 Módulos

### `database.py`
Conexão com banco de dados SQLite/MySQL e funções de acesso aos dados.

### `weather_collector.py`
Coleta dados meteorológicos de Bertioga via API Open-Meteo (gratuita).

### `holidays_collector.py`
Gerencia feriados nacionais, estaduais (SP) e municipais (Bertioga).

### `feature_engineering.py`
Cria features para o modelo de ML:
- Features de calendário (dia da semana, mês, temporada)
- Features de feriados
- Features meteorológicas
- Features de lag (valores históricos)

### `demand_forecaster.py`
Modelo de previsão de demanda usando Gradient Boosting.

### `run_pipeline.py`
Script principal para executar o pipeline completo.

## 🎯 Uso

### Pipeline completo

```bash
python run_pipeline.py --all
```

### Apenas coleta de dados

```bash
python run_pipeline.py --weather    # Coleta clima
python run_pipeline.py --holidays   # Coleta feriados
```

### Apenas treinamento

```bash
python run_pipeline.py --train
```

### Apenas previsões

```bash
python run_pipeline.py --predict
```

## 📊 Features Utilizadas

### Calendário
- `dayOfWeek`, `dayOfMonth`, `month`, `year`
- `isWeekend`, `isFriday`, `isSaturday`, `isSunday`
- `isSummer`, `isWinter`, `isHighSeason`

### Feriados
- `isHoliday`, `holidayImpact`
- `daysToHoliday`, `daysFromHoliday`

### Meteorologia
- `tempMin`, `tempMax`, `tempAvg`
- `precipitation`, `isRainy`
- `isHot`, `isCold`, `isBeachWeather`

### Lags (valores passados)
- `orders_lag_1`, `orders_lag_7`, `orders_lag_14`
- `orders_ma_7`, `orders_ma_14` (médias móveis)
- `revenue_lag_1`, `revenue_ma_7`

## 🔮 Roadmap

### Fase 1 (Atual)
- [x] Coleta de dados meteorológicos
- [x] Gerenciamento de feriados
- [x] Feature engineering básico
- [x] Modelo de previsão (Gradient Boosting)

### Fase 2 (Próximo)
- [ ] API FastAPI para servir previsões
- [ ] Integração com página de Inteligência
- [ ] Modelo Prophet para séries temporais
- [ ] Alertas automáticos

### Fase 3 (Futuro)
- [ ] Análise de cesta de compras
- [ ] Segmentação de clientes
- [ ] Otimização de preços
- [ ] Integração com despesas/funcionários

## 📈 Métricas do Modelo

O modelo é avaliado usando:
- **MAE** (Mean Absolute Error): Erro médio absoluto
- **RMSE** (Root Mean Squared Error): Raiz do erro quadrático médio
- **R²**: Coeficiente de determinação
- **MAPE** (Mean Absolute Percentage Error): Erro percentual médio

## 🌤️ API de Clima

Usamos a API gratuita [Open-Meteo](https://open-meteo.com/):
- Dados históricos: até 1 ano
- Previsão: até 16 dias
- Sem necessidade de API key
- Localização: Bertioga, SP (-23.8544, -46.1389)

## 📅 Feriados

O sistema considera:
- **Nacionais**: Confraternização, Páscoa, Natal, etc.
- **Estaduais (SP)**: Revolução Constitucionalista
- **Municipais (Bertioga)**: Aniversário da cidade
- **Comerciais**: Dia das Mães, Namorados, Black Friday, etc.
- **Sazonais**: Férias escolares, temporada de verão

