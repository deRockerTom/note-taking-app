from typing import List

from core.notes import GetAllNotesResponse, Note
from pydantic import BaseModel


class GetAllNotesAPIResponse(BaseModel):
    notes: List[GetAllNotesResponse]


class GetNoteAPIResponse(Note):
    pass


class CreateNoteAPIRequest(BaseModel):
    title: str
    content: str


class UpdateNoteAPIRequest(BaseModel):
    title: str
    content: str


class UpdateNoteAPIResponse(Note):
    pass


class RollbackNoteAPIRequest(BaseModel):
    version: int
