from datetime import datetime
from unittest.mock import Mock, patch

from core.notes import GetAllNotesResponse, GetNoteVersionResponse, Note
from fastapi.testclient import TestClient

from .notes import notes_router

client = TestClient(notes_router)


class TestGetAllNotes:
    @patch("api.v1.notes.get_all_notes")
    def test_get_all_notes_with_no_notes(self, mock_get_all_notes: Mock):
        mock_get_all_notes.return_value = []
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"notes": []}
        mock_get_all_notes.assert_called_once()

    @patch("api.v1.notes.get_all_notes")
    def test_get_all_notes_with_notes(self, mock_get_all_notes: Mock):
        mock_get_all_notes.return_value = [
            GetAllNotesResponse(note_id="1", title="Test Note", date=datetime.now())
        ]
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {
            "notes": [
                {
                    "note_id": "1",
                    "title": "Test Note",
                    "date": mock_get_all_notes.return_value[0].date.isoformat(),
                }
            ]
        }
        mock_get_all_notes.assert_called_once()


class TestGetOneNote:
    @patch("api.v1.notes.get_note")
    def test_get_one_note(self, mock_get_note: Mock):
        mock_get_note.return_value = Note(
            title="Test Note",
            content="This is a test note.",
            note_id="1",
            version=1,
            date=datetime.now(),
        )
        response = client.get("/1")
        assert response.status_code == 200
        assert response.json() == {
            "note_id": "1",
            "title": "Test Note",
            "date": mock_get_note.return_value.date.isoformat(),
            "content": "This is a test note.",
            "version": 1,
        }
        mock_get_note.assert_called_once_with("1")


class TestGetNoteVersions:
    @patch("api.v1.notes.get_note_version_list")
    def test_get_note_versions(self, mock_get_note_version_list: Mock):
        mock_get_note_version_list.return_value = [
            GetNoteVersionResponse(
                note_id="1",
                version=1,
                date=datetime.now(),
            )
        ]
        response = client.get("/1/versions")
        assert response.status_code == 200
        assert response.json() == {
            "notes": [
                {
                    "note_id": "1",
                    "version": 1,
                    "date": mock_get_note_version_list.return_value[0].date.isoformat(),
                }
            ]
        }
        mock_get_note_version_list.assert_called_once_with("1")


class TestCreateOneNote:
    @patch("api.v1.notes.create_note")
    def test_create_one_note(self, mock_create_note: Mock):
        mock_create_note.return_value = Note(
            title="Test Note",
            content="This is a test note.",
            note_id="1",
            version=1,
            date=datetime.now(),
        )
        response = client.post(
            "/", json={"title": "Test Note", "content": "This is a test note."}
        )
        assert response.status_code == 200
        assert response.json() == {
            "note_id": "1",
            "title": "Test Note",
            "date": mock_create_note.return_value.date.isoformat(),
            "content": "This is a test note.",
            "version": 1,
        }
        mock_create_note.assert_called_once_with(
            title="Test Note", content="This is a test note."
        )


class TestDeleteOneNote:
    @patch("api.v1.notes.delete_note")
    def test_delete_one_note(self, mock_delete_note: Mock):
        mock_delete_note.return_value = None
        response = client.delete("/1")
        assert response.status_code == 200
        assert response.json() == {"message": "Note deleted successfully"}
        mock_delete_note.assert_called_once_with("1")


class TestUpdateOneNote:
    @patch("api.v1.notes.update_note")
    def test_update_one_note(self, mock_update_note: Mock):
        mock_update_note.return_value = Note(
            title="Test Note",
            content="This is a test note.",
            note_id="1",
            version=1,
            date=datetime.now(),
        )
        response = client.put(
            "/1",
            json={"title": "Updated Note", "content": "This is an updated test note."},
        )
        assert response.status_code == 200
        assert response.json() == {
            "note_id": "1",
            "title": "Test Note",
            "content": "This is a test note.",
            "date": mock_update_note.return_value.date.isoformat(),
            "version": 1,
        }
        mock_update_note.assert_called_once_with(
            note_id="1", title="Updated Note", content="This is an updated test note."
        )


class TestRollbackNote:
    @patch("api.v1.notes.rollback_note")
    def test_rollback_note(self, mock_rollback_note: Mock):
        mock_rollback_note.return_value = None
        response = client.post("/1/rollback", json={"version": 1})
        assert response.status_code == 200
        assert response.json() == {"message": "Note rolled back successfully"}
        mock_rollback_note.assert_called_once_with(note_id="1", version=1)
