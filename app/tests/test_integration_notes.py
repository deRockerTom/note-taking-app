import importlib
import os
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from main import app

TEST_DB = {"MONGO_DB": "integration-test-notes"}

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def patch_env_and_reload_modules():
    """
    Fixture to patch the environment variables and reload relevant modules.
    This will run once at the start of the test session.
    """
    # Patch the environment variable with the test DB name
    with patch.dict(os.environ, TEST_DB):
        import database
        import env

        # Reload to ensure the new environment variable is used
        importlib.reload(env)
        importlib.reload(database)
        yield  # this will allow the tests to run


@pytest.fixture(scope="function", autouse=True)
def clear_db():
    from core.notes import note_collection

    note_collection.delete_many({})
    yield


class TestGetAllNotes:
    def test_get_all_notes_with_no_notes(self):
        response = client.get("/api/v1/notes/")
        assert response.status_code == 200
        assert response.json() == {"notes": []}

    def test_get_all_notes_with_notes(self):
        # First, create a note
        client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )

        # Now, get all notes
        response = client.get("/api/v1/notes/")
        assert response.status_code == 200
        assert len(response.json()["notes"]) == 1
        assert response.json()["notes"][0]["title"] == "Test Note"


class TestGetOneNote:
    def test_get_one_note(self):
        # First, create a note
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )
        assert response.status_code == 200

        all_notes = client.get("/api/v1/notes/")
        note_id = all_notes.json()["notes"][0]["note_id"]

        # Now, get the note
        response = client.get(f"/api/v1/notes/{note_id}")
        assert response.status_code == 200
        assert response.json()["title"] == "Test Note"
        assert response.json()["content"] == "This is a test note."

    def test_get_one_note_not_found(self):
        response = client.get("/api/v1/notes/nonexistent_note_id")
        assert response.status_code == 404
        assert response.json() == {"detail": "Note not found"}


class TestGetNoteVersions:
    def test_get_note_versions(self):
        # First, create a note
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )
        assert response.status_code == 200

        all_notes = client.get("/api/v1/notes/")
        note_id = all_notes.json()["notes"][0]["note_id"]

        # Now, update the note
        response = client.put(
            f"/api/v1/notes/{note_id}",
            json={
                "title": "Updated Test Note",
                "content": "This is an updated test note.",
            },
        )
        assert response.status_code == 200

        # Now, get the note versions
        response = client.get(f"/api/v1/notes/{note_id}/versions")
        assert response.status_code == 200
        assert len(response.json()["notes"]) == 2
        assert response.json()["notes"][0]["note_id"] == note_id
        assert response.json()["notes"][0]["version"] == 1
        assert response.json()["notes"][1]["note_id"] == note_id
        assert response.json()["notes"][1]["version"] == 0


class TestGetNoteWithVersion:
    def test_get_note_with_version(self):
        # First, create a note
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )
        assert response.status_code == 200

        all_notes = client.get("/api/v1/notes/")
        note_id = all_notes.json()["notes"][0]["note_id"]

        # Now, update the note
        response = client.put(
            f"/api/v1/notes/{note_id}",
            json={
                "title": "Updated Test Note",
                "content": "This is an updated test note.",
            },
        )
        assert response.status_code == 200

        # Now, get the note with version
        response = client.get(f"/api/v1/notes/{note_id}/versions/0")
        assert response.status_code == 200
        assert response.json()["title"] == "Test Note"
        assert response.json()["content"] == "This is a test note."
        assert response.json()["note_id"] == note_id
        assert response.json()["version"] == 0


class TestCreateOneNote:
    def test_create_one_note(self):
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Test Note"
        assert response.json()["content"] == "This is a test note."
        assert response.json()["note_id"] is not None
        assert response.json()["version"] == 0
        assert response.json()["date"] is not None
        # Verify the note was created
        all_notes = client.get("/api/v1/notes/")
        assert len(all_notes.json()["notes"]) == 1
        assert all_notes.json()["notes"][0]["title"] == "Test Note"


class TestDeleteOneNote:
    def test_delete_one_note(self):
        # First, create a note
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )
        assert response.status_code == 200

        all_notes = client.get("/api/v1/notes/")
        note_id = all_notes.json()["notes"][0]["note_id"]

        # Now, delete the note
        response = client.delete(f"/api/v1/notes/{note_id}")
        assert response.status_code == 200
        assert response.json() == {"message": "Note deleted successfully"}

        # Verify the note was deleted
        all_notes = client.get("/api/v1/notes/")
        assert len(all_notes.json()["notes"]) == 0


class TestUpdateOneNote:
    def test_update_one_note(self):
        # First, create a note
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )
        assert response.status_code == 200

        all_notes = client.get("/api/v1/notes/")
        note_id = all_notes.json()["notes"][0]["note_id"]

        # Now, update the note
        response = client.put(
            f"/api/v1/notes/{note_id}",
            json={
                "title": "Updated Test Note",
                "content": "This is an updated test note.",
            },
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Test Note"
        assert response.json()["content"] == "This is an updated test note."
        # Verify the note was updated
        note = client.get(f"/api/v1/notes/{note_id}")
        assert note.status_code == 200
        assert note.json()["title"] == "Updated Test Note"
        assert note.json()["content"] == "This is an updated test note."

    def test_update_one_note_not_found(self):
        response = client.put(
            "/api/v1/notes/nonexistent_note_id",
            json={
                "title": "Updated Test Note",
                "content": "This is an updated test note.",
            },
        )
        assert response.status_code == 404
        assert response.json() == {"detail": "Note not found"}


class TestRollbackNote:
    def test_rollback_note(self):
        # First, create a note
        response = client.post(
            "/api/v1/notes/",
            json={"title": "Test Note", "content": "This is a test note."},
        )
        assert response.status_code == 200

        all_notes = client.get("/api/v1/notes/")
        note_id = all_notes.json()["notes"][0]["note_id"]

        # Now, update the note
        response = client.put(
            f"/api/v1/notes/{note_id}",
            json={
                "title": "Updated Test Note",
                "content": "This is an updated test note.",
            },
        )
        assert response.status_code == 200

        # Rollback the note
        response = client.post(
            f"/api/v1/notes/{note_id}/rollback",
            json={"version": 0},
        )
        assert response.status_code == 200
        # Verify the note was rolled back
        note = client.get(f"/api/v1/notes/{note_id}")
        assert note.status_code == 200
        assert note.json()["title"] == "Test Note"
        assert note.json()["content"] == "This is a test note."
