def calculate_risk_level(score: int):

    if score <= 20:
        return "Safe"

    if score <= 40:
        return "Low"

    if score <= 60:
        return "Medium"

    if score <= 80:
        return "High"

    return "Critical"