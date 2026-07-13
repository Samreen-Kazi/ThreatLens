from datetime import datetime
from typing import Any

from fpdf import FPDF


class ThreatLensPDF(FPDF):
    def header(self) -> None:
        self.set_fill_color(2, 6, 23)
        self.rect(
            x=0,
            y=0,
            w=self.w,
            h=22,
            style="F",
        )

        self.set_xy(12, 7)
        self.set_font(
            "Helvetica",
            style="B",
            size=16,
        )
        self.set_text_color(103, 232, 249)
        self.cell(
            w=0,
            h=8,
            text="ThreatLens",
        )

        self.set_xy(12, 14)
        self.set_font(
            "Helvetica",
            size=8,
        )
        self.set_text_color(203, 213, 225)
        self.cell(
            w=0,
            h=5,
            text=(
                "OSINT Threat Intelligence "
                "Investigation Report"
            ),
        )

        self.ln(20)

    def footer(self) -> None:
        self.set_y(-15)

        self.set_draw_color(
            203,
            213,
            225,
        )
        self.line(
            12,
            self.get_y(),
            self.w - 12,
            self.get_y(),
        )

        self.set_y(-12)
        self.set_font(
            "Helvetica",
            size=8,
        )
        self.set_text_color(
            100,
            116,
            139,
        )

        self.cell(
            w=0,
            h=8,
            text=(
                f"ThreatLens report | "
                f"Page {self.page_no()}"
            ),
            align="C",
        )


def safe_text(
    value: Any,
    fallback: str = "Unavailable",
) -> str:
    if value is None:
        return fallback

    value_text = str(value).strip()

    if not value_text:
        return fallback

    # Built-in Helvetica does not support all
    # Unicode characters, so replace unsupported
    # characters instead of crashing.
    return value_text.encode(
        "latin-1",
        errors="replace",
    ).decode("latin-1")


def add_section_title(
    pdf: ThreatLensPDF,
    title: str,
) -> None:
    pdf.ln(4)

    pdf.set_fill_color(
        15,
        23,
        42,
    )
    pdf.set_text_color(
        255,
        255,
        255,
    )
    pdf.set_font(
        "Helvetica",
        style="B",
        size=12,
    )

    pdf.cell(
        w=0,
        h=9,
        text=safe_text(title),
        new_x="LMARGIN",
        new_y="NEXT",
        fill=True,
    )

    pdf.ln(2)


def add_key_value(
    pdf: ThreatLensPDF,
    label: str,
    value: Any,
) -> None:
    pdf.set_font(
        "Helvetica",
        style="B",
        size=9,
    )
    pdf.set_text_color(
        71,
        85,
        105,
    )

    pdf.cell(
        w=52,
        h=7,
        text=safe_text(label),
    )

    pdf.set_font(
        "Helvetica",
        size=9,
    )
    pdf.set_text_color(
        15,
        23,
        42,
    )

    pdf.multi_cell(
        w=0,
        h=7,
        text=safe_text(value),
        new_x="LMARGIN",
        new_y="NEXT",
    )


def add_provider_status(
    pdf: ThreatLensPDF,
    provider: str,
    fields: list[tuple[str, Any]],
) -> None:
    pdf.set_fill_color(
        241,
        245,
        249,
    )

    pdf.set_font(
        "Helvetica",
        style="B",
        size=10,
    )
    pdf.set_text_color(
        15,
        23,
        42,
    )

    pdf.cell(
        w=0,
        h=8,
        text=safe_text(provider),
        new_x="LMARGIN",
        new_y="NEXT",
        fill=True,
    )

    for label, value in fields:
        add_key_value(
            pdf,
            label,
            value,
        )

    pdf.ln(2)


def create_analysis_pdf(
    analysis: dict[str, Any],
) -> bytes:
    summary = analysis.get(
        "summary",
        {},
    )

    sources = analysis.get(
        "sources",
        {},
    )

    ipinfo = sources.get(
        "ipinfo",
        {},
    )

    abuseipdb = sources.get(
        "abuseipdb",
        {},
    )

    virustotal = sources.get(
        "virustotal",
        {},
    )

    greynoise = sources.get(
        "greynoise",
        {},
    )

    shodan = sources.get(
        "shodan",
        {},
    )

    pdf = ThreatLensPDF(
        orientation="P",
        unit="mm",
        format="A4",
    )

    pdf.set_auto_page_break(
        auto=True,
        margin=18,
    )

    pdf.set_margins(
        left=12,
        top=25,
        right=12,
    )

    pdf.add_page()

    pdf.set_title(
        "ThreatLens Investigation Report"
    )

    pdf.set_author("ThreatLens")

    generated_at = datetime.now().strftime(
        "%B %d, %Y at %H:%M:%S"
    )

    # Executive summary
    add_section_title(
        pdf,
        "Executive Summary",
    )

    add_key_value(
        pdf,
        "IP Address",
        summary.get("ip"),
    )

    add_key_value(
        pdf,
        "Country",
        summary.get("country"),
    )

    add_key_value(
        pdf,
        "Organization",
        summary.get("organization"),
    )

    add_key_value(
        pdf,
        "Threat Score",
        (
            f"{summary.get('threat_score', 0)}"
            "/100"
        ),
    )

    add_key_value(
        pdf,
        "Risk Level",
        summary.get("risk_level"),
    )

    add_key_value(
        pdf,
        "Generated",
        generated_at,
    )

    # Recommendation
    add_section_title(
        pdf,
        "Recommended Action",
    )

    pdf.set_font(
        "Helvetica",
        size=10,
    )
    pdf.set_text_color(
        15,
        23,
        42,
    )

    pdf.multi_cell(
        w=0,
        h=7,
        text=safe_text(
            summary.get("recommendation")
        ),
        new_x="LMARGIN",
        new_y="NEXT",
    )

    # Network identity
    add_section_title(
        pdf,
        "Network Identity",
    )

    add_key_value(
        pdf,
        "ASN",
        ipinfo.get("asn"),
    )

    add_key_value(
        pdf,
        "Hostname",
        ipinfo.get("hostname"),
    )

    add_key_value(
        pdf,
        "Country",
        ipinfo.get("country"),
    )

    add_key_value(
        pdf,
        "Organization",
        ipinfo.get("organization"),
    )

    # Provider details
    add_section_title(
        pdf,
        "Threat Intelligence Sources",
    )

    add_provider_status(
        pdf,
        "AbuseIPDB",
        [
            (
                "Confidence Score",
                abuseipdb.get(
                    "abuse_confidence_score"
                ),
            ),
            (
                "Total Reports",
                abuseipdb.get(
                    "total_reports"
                ),
            ),
            (
                "Last Reported",
                abuseipdb.get(
                    "last_reported_at"
                ),
            ),
        ],
    )

    add_provider_status(
        pdf,
        "VirusTotal",
        [
            (
                "Malicious",
                virustotal.get(
                    "malicious"
                ),
            ),
            (
                "Suspicious",
                virustotal.get(
                    "suspicious"
                ),
            ),
            (
                "Harmless",
                virustotal.get(
                    "harmless"
                ),
            ),
            (
                "Undetected",
                virustotal.get(
                    "undetected"
                ),
            ),
            (
                "Reputation",
                virustotal.get(
                    "reputation"
                ),
            ),
        ],
    )

    add_provider_status(
        pdf,
        "GreyNoise",
        [
            (
                "Classification",
                greynoise.get(
                    "classification"
                ),
            ),
            (
                "Actor Name",
                greynoise.get("name"),
            ),
        ],
    )

    ports = shodan.get(
        "ports",
        [],
    )

    tags = shodan.get(
        "tags",
        [],
    )

    add_provider_status(
        pdf,
        "Shodan",
        [
            (
                "Open Ports",
                (
                    ", ".join(
                        str(port)
                        for port in ports
                    )
                    if ports
                    else "None returned"
                ),
            ),
            (
                "Tags",
                (
                    ", ".join(tags)
                    if tags
                    else "None returned"
                ),
            ),
        ],
    )

    # Methodology
    add_section_title(
        pdf,
        "Methodology",
    )

    pdf.set_font(
        "Helvetica",
        size=9,
    )
    pdf.set_text_color(
        71,
        85,
        105,
    )

    methodology = (
        "ThreatLens aggregates intelligence "
        "from IPInfo, AbuseIPDB, VirusTotal, "
        "GreyNoise, and Shodan. It calculates "
        "a custom threat score using reputation "
        "signals, malicious detections, network "
        "classification, and exposed risky ports."
    )

    pdf.multi_cell(
        w=0,
        h=6,
        text=methodology,
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.ln(4)

    pdf.set_font(
        "Helvetica",
        style="I",
        size=8,
    )
    pdf.set_text_color(
        100,
        116,
        139,
    )

    pdf.multi_cell(
        w=0,
        h=5,
        text=(
            "This report provides automated "
            "threat-intelligence enrichment and "
            "should be reviewed alongside other "
            "organizational security evidence."
        ),
        new_x="LMARGIN",
        new_y="NEXT",
    )

    return bytes(pdf.output())


def generate_pdf_filename(
    ip: str,
) -> str:
    safe_ip = (
        ip.replace(
            ":",
            "-",
        )
        .replace(
            "/",
            "-",
        )
    )

    timestamp = datetime.now().strftime(
        "%Y-%m-%d_%H-%M-%S"
    )

    return (
        f"threatlens_report_"
        f"{safe_ip}_{timestamp}.pdf"
    )