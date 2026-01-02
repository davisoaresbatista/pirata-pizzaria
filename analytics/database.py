"""
Conexão com banco de dados
"""
import sqlite3
from pathlib import Path
from typing import Optional
import pandas as pd

from config import SQLITE_PATH, DATABASE_URL


def get_sqlite_connection():
    """Conexão SQLite para desenvolvimento"""
    return sqlite3.connect(str(SQLITE_PATH))


def get_sales_data(start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    """
    Busca dados de vendas do banco de dados
    
    Args:
        start_date: Data inicial (YYYY-MM-DD)
        end_date: Data final (YYYY-MM-DD)
    
    Returns:
        DataFrame com os dados de vendas
    """
    conn = get_sqlite_connection()
    
    query = """
        SELECT 
            id,
            externalId,
            origin,
            orderType,
            itemsCount,
            amount,
            status,
            paymentStatus,
            openedAt,
            closedAt,
            duration,
            unit,
            tableNumber,
            isCounter,
            isDelivery
        FROM sales_orders
        WHERE deletedAt IS NULL
    """
    
    params = []
    
    if start_date:
        query += " AND date(openedAt) >= ?"
        params.append(start_date)
    
    if end_date:
        query += " AND date(openedAt) <= ?"
        params.append(end_date)
    
    query += " ORDER BY openedAt"
    
    df = pd.read_sql_query(query, conn, params=params)
    conn.close()
    
    # Converter tipos
    df['openedAt'] = pd.to_datetime(df['openedAt'])
    df['amount'] = pd.to_numeric(df['amount'])
    df['itemsCount'] = pd.to_numeric(df['itemsCount'])
    
    return df


def get_daily_sales_summary() -> pd.DataFrame:
    """
    Retorna resumo diário de vendas
    """
    conn = get_sqlite_connection()
    
    # Detectar formato da data (timestamp vs ISO)
    check_query = "SELECT openedAt FROM sales_orders LIMIT 1"
    sample = pd.read_sql_query(check_query, conn)
    
    if sample.empty:
        conn.close()
        return pd.DataFrame()
    
    sample_value = str(sample['openedAt'].iloc[0])
    
    # Se for timestamp (número grande), converter
    if sample_value.isdigit() and len(sample_value) >= 10:
        query = """
            SELECT 
                date(openedAt / 1000, 'unixepoch', 'localtime') as date,
                COUNT(*) as orders,
                SUM(CAST(amount AS REAL)) as revenue,
                AVG(CAST(amount AS REAL)) as avg_ticket,
                SUM(itemsCount) as total_items,
                AVG(duration) as avg_duration,
                SUM(CASE WHEN isCounter = 1 THEN 1 ELSE 0 END) as counter_orders,
                SUM(CASE WHEN isDelivery = 1 THEN 1 ELSE 0 END) as delivery_orders,
                SUM(CASE WHEN isCounter = 0 AND isDelivery = 0 THEN 1 ELSE 0 END) as table_orders,
                SUM(CASE WHEN paymentStatus = 'PAID' THEN 1 ELSE 0 END) as paid_orders,
                SUM(CASE WHEN paymentStatus = 'PENDING' THEN 1 ELSE 0 END) as pending_orders
            FROM sales_orders
            WHERE deletedAt IS NULL
            GROUP BY date(openedAt / 1000, 'unixepoch', 'localtime')
            ORDER BY date
        """
    else:
        # ISO format
        query = """
            SELECT 
                date(openedAt) as date,
                COUNT(*) as orders,
                SUM(CAST(amount AS REAL)) as revenue,
                AVG(CAST(amount AS REAL)) as avg_ticket,
                SUM(itemsCount) as total_items,
                AVG(duration) as avg_duration,
                SUM(CASE WHEN isCounter = 1 THEN 1 ELSE 0 END) as counter_orders,
                SUM(CASE WHEN isDelivery = 1 THEN 1 ELSE 0 END) as delivery_orders,
                SUM(CASE WHEN isCounter = 0 AND isDelivery = 0 THEN 1 ELSE 0 END) as table_orders,
                SUM(CASE WHEN paymentStatus = 'PAID' THEN 1 ELSE 0 END) as paid_orders,
                SUM(CASE WHEN paymentStatus = 'PENDING' THEN 1 ELSE 0 END) as pending_orders
            FROM sales_orders
            WHERE deletedAt IS NULL
            GROUP BY date(openedAt)
            ORDER BY date
        """
    
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d')
    
    return df


def get_weather_data() -> pd.DataFrame:
    """
    Busca dados meteorológicos do banco
    """
    conn = get_sqlite_connection()
    
    query = """
        SELECT 
            date,
            tempMin,
            tempMax,
            tempAvg,
            precipitation,
            humidity,
            condition
        FROM weather_data
        ORDER BY date
    """
    
    try:
        df = pd.read_sql_query(query, conn)
        df['date'] = pd.to_datetime(df['date'])
    except Exception:
        df = pd.DataFrame()
    
    conn.close()
    return df


def get_holidays() -> pd.DataFrame:
    """
    Busca feriados do banco
    """
    conn = get_sqlite_connection()
    
    query = """
        SELECT 
            date,
            name,
            eventType,
            scope,
            impactExpected
        FROM calendar_events
        ORDER BY date
    """
    
    try:
        df = pd.read_sql_query(query, conn)
        df['date'] = pd.to_datetime(df['date'])
    except Exception:
        df = pd.DataFrame()
    
    conn.close()
    return df


def save_weather_data(df: pd.DataFrame) -> int:
    """
    Salva dados meteorológicos no banco
    """
    conn = get_sqlite_connection()
    cursor = conn.cursor()
    
    count = 0
    for _, row in df.iterrows():
        try:
            cursor.execute("""
                INSERT OR REPLACE INTO weather_data 
                (id, date, tempMin, tempMax, tempAvg, feelsLikeAvg, 
                 precipitation, humidity, condition, conditionCode,
                 windSpeed, windDirection, uvIndex, visibility,
                 source, city, state, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                f"weather_{row['date'].strftime('%Y%m%d')}",
                row['date'].strftime('%Y-%m-%d'),
                row.get('tempMin'),
                row.get('tempMax'),
                row.get('tempAvg'),
                row.get('feelsLikeAvg'),
                row.get('precipitation', 0),
                row.get('humidity'),
                row.get('condition'),
                row.get('conditionCode'),
                row.get('windSpeed'),
                row.get('windDirection'),
                row.get('uvIndex'),
                row.get('visibility'),
                'OPEN_METEO',
                'Bertioga',
                'SP'
            ))
            count += 1
        except Exception as e:
            print(f"Erro ao salvar clima {row['date']}: {e}")
    
    conn.commit()
    conn.close()
    return count


def save_holidays(holidays: list) -> int:
    """
    Salva feriados no banco
    """
    conn = get_sqlite_connection()
    cursor = conn.cursor()
    
    count = 0
    for h in holidays:
        try:
            cursor.execute("""
                INSERT OR REPLACE INTO calendar_events 
                (id, name, date, eventType, scope, description, impactExpected, recurring, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                f"holiday_{h['date']}_{h['name'][:20].replace(' ', '_')}",
                h['name'],
                h['date'],
                h.get('eventType', 'HOLIDAY'),
                h.get('scope', 'NATIONAL'),
                h.get('description'),
                h.get('impactExpected', 'MEDIUM'),
                h.get('recurring', True)
            ))
            count += 1
        except Exception as e:
            print(f"Erro ao salvar feriado {h['name']}: {e}")
    
    conn.commit()
    conn.close()
    return count


def save_predictions(predictions: list) -> int:
    """
    Salva previsões no banco
    
    Args:
        predictions: Lista de dicts com 'date', 'predictedOrders', 'predictedRevenue'
    
    Returns:
        Número de registros salvos
    """
    conn = get_sqlite_connection()
    cursor = conn.cursor()
    
    count = 0
    for p in predictions:
        try:
            date_str = p['date'].strftime('%Y-%m-%d') if hasattr(p['date'], 'strftime') else str(p['date'])[:10]
            model_version = p.get('version', 'v1.0.0')
            cursor.execute("""
                INSERT OR REPLACE INTO predictions 
                (id, date, modelVersion, predictedOrders, predictedRevenue, confidence, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            """, (
                f"pred_{date_str}_{model_version}",
                date_str,
                model_version,
                float(p['predictedOrders']),
                float(p['predictedRevenue']),
                0.85  # Confidence padrão
            ))
            count += 1
        except Exception as e:
            print(f"Erro ao salvar previsão {p['date']}: {e}")
    
    conn.commit()
    conn.close()
    return count


def save_daily_features(df: pd.DataFrame) -> int:
    """
    Salva features diárias no banco
    """
    conn = get_sqlite_connection()
    cursor = conn.cursor()
    
    count = 0
    for _, row in df.iterrows():
        try:
            date_str = row['date'].strftime('%Y-%m-%d') if hasattr(row['date'], 'strftime') else str(row['date'])[:10]
            cursor.execute("""
                INSERT OR REPLACE INTO daily_features 
                (id, date, totalOrders, totalRevenue, avgTicket, totalItems, avgDuration,
                 counterOrders, tableOrders, deliveryOrders, paidOrders, pendingOrders,
                 isWeekend, isHoliday, dayOfWeek, dayOfMonth, month, year,
                 tempMin, tempMax, tempAvg, precipitation, 
                 nextDayOrders, nextDayRevenue, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            """, (
                f"feat_{date_str}",
                date_str,
                int(row.get('orders', 0)),
                float(row.get('revenue', 0)),
                float(row.get('avg_ticket', 0)),
                int(row.get('total_items', 0)),
                int(row.get('avg_duration', 0)) if pd.notna(row.get('avg_duration')) else 0,
                int(row.get('counter_orders', 0)),
                int(row.get('table_orders', 0)),
                int(row.get('delivery_orders', 0)),
                int(row.get('paid_orders', 0)),
                int(row.get('pending_orders', 0)),
                1 if row.get('isWeekend', 0) else 0,
                1 if row.get('isHoliday', 0) else 0,
                int(row.get('dayOfWeek', 0)),
                int(row.get('dayOfMonth', 1)),
                int(row.get('month', 1)),
                int(row.get('year', 2025)),
                float(row.get('tempMin')) if pd.notna(row.get('tempMin')) else None,
                float(row.get('tempMax')) if pd.notna(row.get('tempMax')) else None,
                float(row.get('tempAvg')) if pd.notna(row.get('tempAvg')) else None,
                float(row.get('precipitation')) if pd.notna(row.get('precipitation')) else None,
                int(row.get('next_day_orders')) if pd.notna(row.get('next_day_orders')) else None,
                float(row.get('next_day_revenue')) if pd.notna(row.get('next_day_revenue')) else None
            ))
            count += 1
        except Exception as e:
            print(f"Erro ao salvar feature {row.get('date')}: {e}")
    
    conn.commit()
    conn.close()
    return count


if __name__ == "__main__":
    # Teste
    print("📊 Testando conexão com banco de dados...")
    
    sales = get_daily_sales_summary()
    print(f"\n📈 Vendas diárias: {len(sales)} dias")
    print(sales.head())
    
    print(f"\n💰 Total de receita: R$ {sales['revenue'].sum():,.2f}")
    print(f"📦 Total de pedidos: {sales['orders'].sum():,}")

