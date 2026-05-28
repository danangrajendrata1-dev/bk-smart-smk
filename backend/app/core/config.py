from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "BK SMART SMK"
    APP_ENV: str = "development"
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
