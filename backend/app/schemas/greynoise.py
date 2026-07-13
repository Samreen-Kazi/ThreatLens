from pydantic import BaseModel


class GreyNoiseResponse(BaseModel):
    classification: str | None = None
    name: str | None = None