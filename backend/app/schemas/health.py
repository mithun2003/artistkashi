from datetime import datetime

from pydantic import BaseModel


class ServiceHealth(BaseModel):
    status: str
    timestamp: datetime
    error: str | None = None


class BasicHealthData(BaseModel):
    status: str
    timestamp: datetime
    version: str

class HealthServices(BaseModel):
    database: ServiceHealth
    redis: ServiceHealth
    
class DetailedHealthData(BaseModel):
    status: str
    timestamp: datetime
    services: HealthServices