from core.notes import (
    create_note,
    delete_note,
    get_all_notes,
    get_note,
    rollback_note,
    update_note,
)
from fastapi import APIRouter

from .models.notes import (
    CreateNoteAPIRequest,
    GetAllNotesAPIResponse,
    RollbackNoteAPIRequest,
)

notes_router = APIRouter()


@notes_router.get("/")
async def get_notes():
    """
    Get all notes.
    """
    notes = get_all_notes()

    return GetAllNotesAPIResponse(
        notes=notes,
    )


@notes_router.get("/{note_id}")
async def get_one_note(note_id: str):
    """
    Get a note by ID.
    """
    note = get_note(note_id)

    return note


@notes_router.post("/")
async def create_one_note(create_note_request: CreateNoteAPIRequest):
    """
    Create a new note.
    """
    create_note(
        title=create_note_request.title,
        content=create_note_request.content,
    )
    return {"message": "Note created successfully"}


@notes_router.delete("/{note_id}")
async def delete_one_note(note_id: str):
    """
    Delete a note by ID.
    """
    delete_note(note_id)
    return {"message": "Note deleted successfully"}


@notes_router.put("/{note_id}")
async def update_one_note(note_id: str, update_note_request: CreateNoteAPIRequest):
    """
    Update a note by ID.
    """
    note = update_note(
        note_id=note_id,
        title=update_note_request.title,
        content=update_note_request.content,
    )
    return note


@notes_router.post("/{note_id}/rollback")
async def rollback_one_note(
    note_id: str, rollback_note_request: RollbackNoteAPIRequest
):
    """
    Rollback a note by ID.
    """
    rollback_note(
        note_id=note_id,
        version=rollback_note_request.version,
    )
    return {"message": "Note rolled back successfully"}
