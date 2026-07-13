def generate_recommendation(level: str):

    recommendations = {

        "Safe":
            "No malicious indicators detected. No action required.",

        "Low":
            "Continue monitoring this IP for unusual activity.",

        "Medium":
            "Investigate the IP before allowing sensitive communication.",

        "High":
            "Restrict or closely monitor traffic from this IP.",

        "Critical":
            "Immediately block this IP and perform incident response procedures."
    }

    return recommendations.get(
        level,
        "No recommendation available."
    )