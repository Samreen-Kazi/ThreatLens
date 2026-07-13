from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    ABUSEIPDB_API_KEY: str

    SHODAN_API_KEY: str

    GREYNOISE_API_KEY: str

    VIRUSTOTAL_API_KEY: str

    IPINFO_TOKEN: str

    class Config:
        env_file = ".env"


settings = Settings()