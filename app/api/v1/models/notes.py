from typing import List

from core.notes import GetAllNotesResponse, GetNoteVersionResponse, Note
from pydantic import BaseModel


class GetAllNotesAPIResponse(BaseModel):
    notes: List[GetAllNotesResponse]


class GetNoteAPIResponse(Note):
    pass


class GetNoteVersionAPIResponse(BaseModel):
    notes: List[GetNoteVersionResponse]


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
