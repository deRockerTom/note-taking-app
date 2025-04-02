from api.v1.models.shared import DefaultAPIResponse
from core.notes import (
    Note,
    create_note,
    delete_note,
    get_all_notes,
    get_note,
    get_note_version_list,
    rollback_note,
    update_note,
)
from fastapi import APIRouter

from .models.notes import (
    CreateNoteAPIRequest,
    GetAllNotesAPIResponse,
    GetNoteVersionAPIResponse,
    RollbackNoteAPIRequest,
)

notes_router = APIRouter()


@notes_router.get("/", response_model=GetAllNotesAPIResponse)
async def get_notes():
    """
    Get all notes.
    """
    notes = get_all_notes()

    return GetAllNotesAPIResponse(
        notes=notes,
    )


@notes_router.get("/{note_id}", response_model=Note)
async def get_one_note(note_id: str):
    """
    Get a note by ID.
    """
    note = get_note(note_id)

    return note


@notes_router.get("/{note_id}/versions", response_model=GetNoteVersionAPIResponse)
async def get_note_versions(note_id: str):
    """
    Get all versions of a note.
    """
    note_versions = get_note_version_list(note_id)

    return GetNoteVersionAPIResponse(
        notes=note_versions,
    )


@notes_router.get("/{note_id}/versions/{version}", response_model=Note)
async def get_one_note_with_version(note_id: str, version: int):
    """
    Get a specific version of a note by ID and version number.
    """
    note = get_note(note_id, version)

    return note


@notes_router.post("/", response_model=Note)
async def create_one_note(create_note_request: CreateNoteAPIRequest):
    """
    Create a new note.
    """
    print("yolo", create_note_request)
    note = create_note(
        title=create_note_request.title,
        content=create_note_request.content,
    )
    return note


@notes_router.delete("/{note_id}", response_model=DefaultAPIResponse)
async def delete_one_note(note_id: str):
    """
    Delete a note by ID.
    """
    delete_note(note_id)
    return DefaultAPIResponse(
        message="Note deleted successfully",
    )


@notes_router.put("/{note_id}", response_model=Note)
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


@notes_router.post("/{note_id}/rollback", response_model=DefaultAPIResponse)
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
    return DefaultAPIResponse(
        message="Note rolled back successfully",
    )
