import uuid
from datetime import datetime

from database import db
from errors import BackException
from pydantic import BaseModel
from pymongo import ASCENDING, DESCENDING

note_collection = db["notes"]


def now_truncated():
    """
    Get the current time truncated to seconds.
    This is used because MongoDB does not support microseconds.
    """
    now = datetime.now()
    return now.replace(microsecond=(now.microsecond // 1000) * 1000)


class Note(BaseModel):
    """
    Note model.
    """

    title: str
    content: str
    note_id: str
    version: int
    date: datetime


class GetAllNotesResponse(BaseModel):
    """
    Response model for getting all notes.
    """

    title: str
    note_id: str
    date: datetime


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
                "date": {"$first": "$date"},  # Take the date of the most recent note
            }
        },
        {"$sort": {"date": DESCENDING}},  # Sort the final results by title
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
        raise BackException("Note not found", 404)
    return Note(**notes[0])


def update_note(
    note_id: str,
    title: str,
    content: str,
):
    """
    Update a note in the database.
    """
    if not title:
        raise BackException("Title cannot be empty", 400)
    old_note = get_note(note_id=note_id)
    old_version = old_note.version
    new_version = old_version + 1
    note = Note(
        title=title,
        content=content,
        note_id=note_id,
        version=new_version,
        date=now_truncated(),
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
        raise BackException("Title cannot be empty", 400)

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
        date=now_truncated(),
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
        raise BackException("Version must be greater than 0", 400)
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
