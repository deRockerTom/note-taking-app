import uuid

from database import db
from pydantic import BaseModel
from pymongo import ASCENDING, DESCENDING

note_collection = db["notes"]


class Note(BaseModel):
    """
    Note model.
    """

    title: str
    content: str
    note_id: str
    version: int


class GetAllNotesResponse(BaseModel):
    """
    Response model for getting all notes.
    """

    title: str
    note_id: str


def get_all_notes():
    """
    Get all notes from the database, ensuring only the latest version for each note_id.
    """
    pipeline = [
        {
            "$sort": {
                "note_id": ASCENDING,
                "version": DESCENDING,
            }  # Sort by note_id and then by version in descending order
        },
        {
            "$group": {
                "_id": "$note_id",  # Group by note_id
                "note_id": {
                    "$first": "$note_id"
                },  # Take the first note_id in the group (the most recent)
                "title": {"$first": "$title"},  # Take the title of the most recent note
            }
        },
        {"$sort": {"title": ASCENDING}},  # Sort the final results by title
    ]

    notes = list(note_collection.aggregate(pipeline))

    notes = [GetAllNotesResponse(**note) for note in notes]
    return notes


def get_note(note_id: str):
    """
    Get the last version of a note.
    """
    notes = list(
        note_collection.find({"note_id": note_id}).sort("version", DESCENDING).limit(1)
    )
    if not notes:
        raise ValueError("Note not found")
    return Note(**notes[0])


def update_note(
    note_id: str,
    title: str,
    content: str,
    old_version: int,
):
    """
    Update a note in the database.
    """
    if not title:
        raise ValueError("Title cannot be empty")
    new_version = old_version + 1
    note = Note(
        title=title,
        content=content,
        note_id=note_id,
        version=new_version,
    )
    note_collection.insert_one(note.model_dump())
    return note


def create_note(
    title: str,
    content: str,
):
    """
    Create a new note in the database.
    """
    if not title:
        raise ValueError("Title cannot be empty")

    # Generate a new random note_id
    while True:
        note_id = str(uuid.uuid4())
        if not note_collection.find_one({"note_id": note_id}):
            break

    note = Note(
        title=title,
        content=content,
        note_id=note_id,
        version=0,
    )

    note_collection.insert_one(note.model_dump())
    return note


def rollback_note(
    note_id: str,
    version: int,
):
    """
    Rollback a note to a previous version.
    """
    if version < 0:
        raise ValueError("Version must be greater than 0")
    # Delete all versions greater than the specified version
    note_collection.delete_many({"note_id": note_id, "version": {"$gt": version}})
    return


def delete_note(
    note_id: str,
):
    """
    Delete a note from the database.
    """
    note_collection.delete_many({"note_id": note_id})
    return
