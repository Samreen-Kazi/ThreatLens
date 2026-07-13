def calculate_threat_score(
    abuseipdb: dict,
    virustotal: dict,
    greynoise: dict,
    shodan: dict
):
    """
    Calculate an overall threat score (0-100).
    """

    score = 0

    # -------------------------
    # AbuseIPDB
    # -------------------------

    abuse_score = abuseipdb.get("abuse_confidence_score")

    if abuse_score:

        if abuse_score >= 75:
            score += 35

        elif abuse_score >= 50:
            score += 25

        elif abuse_score >= 25:
            score += 15

    # -------------------------
    # VirusTotal
    # -------------------------

    malicious = virustotal.get("malicious", 0)

    if malicious >= 10:
        score += 35

    elif malicious >= 5:
        score += 25

    elif malicious >= 1:
        score += 10

    # -------------------------
    # GreyNoise
    # -------------------------

    classification = greynoise.get(
        "classification",
        ""
    ).lower()

    if classification == "malicious":
        score += 20

    elif classification == "benign":
        score += 0

    # -------------------------
    # Shodan
    # -------------------------

    ports = shodan.get("ports", [])

    risky_ports = {
        21,
        23,
        445,
        3389
    }

    for port in ports:

        if port in risky_ports:

            score += 5

    return min(score, 100)