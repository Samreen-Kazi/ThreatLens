from pydantic import BaseModel, Field


class ShodanResponse(BaseModel):
    ports: list[int] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)