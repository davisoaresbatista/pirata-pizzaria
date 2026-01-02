"""
Coletor e gerenciador de feriados
- Nacionais
- Estaduais (São Paulo)
- Municipais (Bertioga)
"""
from datetime import datetime, date
from typing import List, Dict
from database import save_holidays


def get_easter_date(year: int) -> date:
    """
    Calcula a data da Páscoa usando o algoritmo de Meeus/Jones/Butcher
    """
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(year, month, day)


def get_holidays_for_year(year: int) -> List[Dict]:
    """
    Retorna todos os feriados para um determinado ano
    """
    holidays = []
    
    # Calcular Páscoa (base para feriados móveis)
    easter = get_easter_date(year)
    
    # ============================================
    # FERIADOS NACIONAIS FIXOS
    # ============================================
    national_fixed = [
        {"date": f"{year}-01-01", "name": "Confraternização Universal", "impactExpected": "LOW"},
        {"date": f"{year}-04-21", "name": "Tiradentes", "impactExpected": "MEDIUM"},
        {"date": f"{year}-05-01", "name": "Dia do Trabalho", "impactExpected": "MEDIUM"},
        {"date": f"{year}-09-07", "name": "Independência do Brasil", "impactExpected": "MEDIUM"},
        {"date": f"{year}-10-12", "name": "Nossa Senhora Aparecida", "impactExpected": "MEDIUM"},
        {"date": f"{year}-11-02", "name": "Finados", "impactExpected": "LOW"},
        {"date": f"{year}-11-15", "name": "Proclamação da República", "impactExpected": "MEDIUM"},
        {"date": f"{year}-12-25", "name": "Natal", "impactExpected": "LOW"},
    ]
    
    for h in national_fixed:
        holidays.append({
            **h,
            "eventType": "HOLIDAY",
            "scope": "NATIONAL",
            "recurring": True
        })
    
    # ============================================
    # FERIADOS NACIONAIS MÓVEIS
    # ============================================
    from datetime import timedelta
    
    # Carnaval (47 dias antes da Páscoa)
    carnaval_date = easter - timedelta(days=47)
    holidays.append({
        "date": carnaval_date.strftime("%Y-%m-%d"),
        "name": "Carnaval",
        "eventType": "HOLIDAY",
        "scope": "NATIONAL",
        "impactExpected": "HIGH",
        "recurring": True
    })
    
    # Segunda de Carnaval
    holidays.append({
        "date": (carnaval_date - timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Segunda de Carnaval",
        "eventType": "HOLIDAY",
        "scope": "NATIONAL",
        "impactExpected": "HIGH",
        "recurring": True
    })
    
    # Quarta de Cinzas (ponto facultativo)
    holidays.append({
        "date": (carnaval_date + timedelta(days=1)).strftime("%Y-%m-%d"),
        "name": "Quarta-feira de Cinzas",
        "eventType": "HOLIDAY",
        "scope": "NATIONAL",
        "impactExpected": "MEDIUM",
        "recurring": True
    })
    
    # Sexta-feira Santa (2 dias antes da Páscoa)
    holidays.append({
        "date": (easter - timedelta(days=2)).strftime("%Y-%m-%d"),
        "name": "Sexta-feira Santa",
        "eventType": "HOLIDAY",
        "scope": "NATIONAL",
        "impactExpected": "HIGH",
        "recurring": True
    })
    
    # Páscoa
    holidays.append({
        "date": easter.strftime("%Y-%m-%d"),
        "name": "Páscoa",
        "eventType": "HOLIDAY",
        "scope": "NATIONAL",
        "impactExpected": "MEDIUM",
        "recurring": True
    })
    
    # Corpus Christi (60 dias após a Páscoa)
    corpus_christi = easter + timedelta(days=60)
    holidays.append({
        "date": corpus_christi.strftime("%Y-%m-%d"),
        "name": "Corpus Christi",
        "eventType": "HOLIDAY",
        "scope": "NATIONAL",
        "impactExpected": "MEDIUM",
        "recurring": True
    })
    
    # ============================================
    # FERIADOS ESTADUAIS - SÃO PAULO
    # ============================================
    holidays.append({
        "date": f"{year}-07-09",
        "name": "Revolução Constitucionalista",
        "eventType": "HOLIDAY",
        "scope": "STATE",
        "impactExpected": "MEDIUM",
        "recurring": True,
        "description": "Feriado estadual de São Paulo"
    })
    
    # ============================================
    # FERIADOS MUNICIPAIS - BERTIOGA
    # ============================================
    # Aniversário de Bertioga (30 de dezembro)
    holidays.append({
        "date": f"{year}-12-30",
        "name": "Aniversário de Bertioga",
        "eventType": "HOLIDAY",
        "scope": "MUNICIPAL",
        "impactExpected": "HIGH",
        "recurring": True,
        "description": "Emancipação do município de Bertioga"
    })
    
    # ============================================
    # DATAS COMERCIAIS IMPORTANTES
    # ============================================
    commercial_dates = [
        {"date": f"{year}-02-14", "name": "Valentine's Day", "impactExpected": "LOW"},
        {"date": f"{year}-03-08", "name": "Dia Internacional da Mulher", "impactExpected": "MEDIUM"},
        
        # Dia das Mães (segundo domingo de maio)
        {"date": get_nth_weekday_of_month(year, 5, 6, 2).strftime("%Y-%m-%d"), 
         "name": "Dia das Mães", "impactExpected": "HIGH"},
        
        {"date": f"{year}-06-12", "name": "Dia dos Namorados", "impactExpected": "HIGH"},
        
        # Dia dos Pais (segundo domingo de agosto)
        {"date": get_nth_weekday_of_month(year, 8, 6, 2).strftime("%Y-%m-%d"), 
         "name": "Dia dos Pais", "impactExpected": "HIGH"},
        
        {"date": f"{year}-10-12", "name": "Dia das Crianças", "impactExpected": "HIGH"},
        
        # Black Friday (última sexta de novembro)
        {"date": get_last_weekday_of_month(year, 11, 4).strftime("%Y-%m-%d"), 
         "name": "Black Friday", "impactExpected": "HIGH"},
        
        {"date": f"{year}-12-24", "name": "Véspera de Natal", "impactExpected": "HIGH"},
        {"date": f"{year}-12-31", "name": "Réveillon", "impactExpected": "HIGH"},
    ]
    
    for h in commercial_dates:
        holidays.append({
            **h,
            "eventType": "COMMERCIAL",
            "scope": "NATIONAL",
            "recurring": True
        })
    
    # ============================================
    # TEMPORADAS
    # ============================================
    seasons = [
        # Férias escolares de verão
        {"date": f"{year}-01-01", "name": "Início Férias de Verão", "impactExpected": "HIGH"},
        {"date": f"{year}-01-31", "name": "Fim Férias de Verão", "impactExpected": "HIGH"},
        
        # Férias de julho
        {"date": f"{year}-07-01", "name": "Início Férias de Julho", "impactExpected": "HIGH"},
        {"date": f"{year}-07-31", "name": "Fim Férias de Julho", "impactExpected": "HIGH"},
        
        # Temporada de verão (praia)
        {"date": f"{year}-12-15", "name": "Início Temporada de Verão", "impactExpected": "HIGH"},
    ]
    
    for h in seasons:
        holidays.append({
            **h,
            "eventType": "SEASONAL",
            "scope": "NATIONAL",
            "recurring": True
        })
    
    return holidays


def get_nth_weekday_of_month(year: int, month: int, weekday: int, n: int) -> date:
    """
    Retorna o n-ésimo dia da semana de um mês
    weekday: 0=segunda, 6=domingo
    n: 1=primeiro, 2=segundo, etc.
    """
    first_day = date(year, month, 1)
    first_weekday = first_day.weekday()
    
    # Dias até o primeiro dia da semana desejado
    days_until = (weekday - first_weekday) % 7
    
    # Adicionar semanas
    target_day = 1 + days_until + (n - 1) * 7
    
    return date(year, month, target_day)


def get_last_weekday_of_month(year: int, month: int, weekday: int) -> date:
    """
    Retorna o último dia da semana de um mês
    weekday: 0=segunda, 4=sexta, 6=domingo
    """
    from datetime import timedelta as td
    
    # Último dia do mês
    if month == 12:
        last_day = date(year + 1, 1, 1) - td(days=1)
    else:
        last_day = date(year, month + 1, 1) - td(days=1)
    
    # Voltar até encontrar o dia da semana
    while last_day.weekday() != weekday:
        last_day -= td(days=1)
    
    return last_day


def collect_and_save_holidays(years: List[int] = None) -> int:
    """
    Coleta e salva feriados para os anos especificados
    """
    if years is None:
        current_year = datetime.now().year
        years = [current_year - 1, current_year, current_year + 1]
    
    all_holidays = []
    
    for year in years:
        print(f"📅 Coletando feriados de {year}...")
        holidays = get_holidays_for_year(year)
        all_holidays.extend(holidays)
        print(f"   ✅ {len(holidays)} eventos encontrados")
    
    count = save_holidays(all_holidays)
    print(f"\n💾 {count} feriados salvos no banco")
    
    return count


if __name__ == "__main__":
    from datetime import timedelta
    
    print("📅 Coletor de Feriados - Bertioga/SP")
    print("=" * 50)
    
    # Coletar feriados para 2024, 2025 e 2026
    count = collect_and_save_holidays([2024, 2025, 2026])
    
    print("\n" + "=" * 50)
    print("📊 Amostra dos próximos feriados:")
    
    today = datetime.now().date()
    holidays = get_holidays_for_year(today.year)
    
    upcoming = [h for h in holidays if datetime.strptime(h["date"], "%Y-%m-%d").date() >= today]
    upcoming.sort(key=lambda x: x["date"])
    
    for h in upcoming[:10]:
        print(f"   {h['date']}: {h['name']} ({h['scope']}) - Impacto: {h['impactExpected']}")

