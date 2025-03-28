import importlib
import os
import uuid
from unittest.mock import patch

import pytest
from core.notes import (
    create_note,
    delete_note,
    get_all_notes,
    get_note,
    note_collection,
    rollback_note,
    update_note,
)
from pydantic import ValidationError

TEST_DB = {"MONGO_DB": "core-test-notes"}


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
    note_collection.delete_many({})
    yield


class TestCreateNote:
    def test_create_note_with_valid_data(self):
        title = "Test Note"
        content = "This is a test note."

        created_note = create_note(title=title, content=content)

        assert created_note.title == title
        assert created_note.content == content
        assert created_note.version == 0

        try:
            uuid.UUID(created_note.note_id)  # Try to parse it as a valid UUID
        except ValueError:
            pytest.fail(f"Invalid note_id: {created_note.note_id}")

    def test_create_note_with_wrong_title_type(self):
        title = 12345
        content = "This is a test note."
        with pytest.raises(ValidationError):
            create_note(title=title, content=content)  # type: ignore

    def test_create_note_with_wrong_content_type(self):
        title = "Test Note"
        content = 12345
        with pytest.raises(ValidationError):
            create_note(title=title, content=content)  # type: ignore

    def test_create_note_with_empty_title(self):
        title = ""
        content = "This is a test note."
        with pytest.raises(ValueError):
            create_note(title=title, content=content)


class TestGetNote:
    def test_get_note_with_valid_note_id(self):
        title = "Test Note"
        content = "This is a test note."
        created_note = create_note(title=title, content=content)

        retrieved_note = get_note(note_id=created_note.note_id)
        assert retrieved_note == created_note

    def test_get_note_should_get_last_version(self):
        title = "Test Note"
        content = "This is a test note."
        created_note = create_note(title=title, content=content)

        update_content = "This is an updated test note."
        updated_note = update_note(
            note_id=created_note.note_id,
            title=title,
            content=update_content,
        )

        retrieved_note = get_note(note_id=created_note.note_id)
        assert retrieved_note == updated_note

    def test_get_note_with_invalid_note_id(self):
        invalid_note_id = str(uuid.uuid4())
        with pytest.raises(ValueError):
            get_note(note_id=invalid_note_id)


class TestUpdateNote:
    def test_update_note_with_valid_data(self):
        title = "Test Note"
        content = "This is a test note."
        created_note = create_note(title=title, content=content)

        updated_content = "This is an updated test note."
        updated_note = update_note(
            note_id=created_note.note_id,
            title=title,
            content=updated_content,
        )

        assert updated_note.content == updated_content
        assert updated_note.version == created_note.version + 1


class TestDeleteNote:
    def test_delete_note_with_valid_note_id(self):
        title = "Test Note"
        content = "This is a test note."
        created_note = create_note(title=title, content=content)

        delete_note(note_id=created_note.note_id)

        with pytest.raises(ValueError):
            get_note(note_id=created_note.note_id)


class TestRollbackNote:
    def test_rollback_note_with_1_version(self):
        title = "Test Note"
        content = "This is a test note."
        created_note = create_note(title=title, content=content)

        updated_content = "This is an updated test note."
        updated_note = update_note(
            note_id=created_note.note_id,
            title=title,
            content=updated_content,
        )

        current_note = get_note(note_id=created_note.note_id)
        assert current_note == updated_note

        rollback_note(
            note_id=created_note.note_id,
            version=created_note.version,
        )
        current_note = get_note(note_id=created_note.note_id)
        assert current_note == created_note

    def test_rollback_note_with_2_versions(self):
        title = "Test Note"
        content = "This is a test note."
        created_note = create_note(title=title, content=content)

        update_note(
            note_id=created_note.note_id,
            title=title,
            content="This is an updated test note.",
        )
        updated_note_2 = update_note(
            note_id=created_note.note_id,
            title=title,
            content="This is another updated test note.",
        )
        current_note = get_note(note_id=created_note.note_id)
        assert current_note == updated_note_2
        rollback_note(
            note_id=created_note.note_id,
            version=created_note.version,
        )
        current_note = get_note(note_id=created_note.note_id)
        assert current_note == created_note


class TestGetAllNotes:
    def test_get_all_notes_empty(self):
        notes = get_all_notes()
        assert notes == []

    def test_get_all_notes_with_no_updated_notes(self):
        title_1 = "Test Note"
        content_1 = "This is a test note."
        created_note_1 = create_note(title=title_1, content=content_1)

        title_2 = "Test Note 2"
        content_2 = "This is a test note 2."
        created_note_2 = create_note(title=title_2, content=content_2)

        notes = get_all_notes()
        assert len(notes) == 2
        assert notes[0].title == created_note_1.title
        assert notes[0].note_id == created_note_1.note_id
        assert notes[1].title == created_note_2.title
        assert notes[1].note_id == created_note_2.note_id

    def test_get_all_notes_with_updated_notes_should_get_last_title(self):
        title_1 = "Test Note"
        content_1 = "This is a test note."
        created_note_1 = create_note(title=title_1, content=content_1)
        title_2 = "Test Note 2"
        content_2 = "This is a test note 2."
        created_note_2 = create_note(title=title_2, content=content_2)
        title_1_updated = "Test Note Updated"
        updated_note_1 = update_note(
            note_id=created_note_1.note_id,
            title=title_1_updated,
            content=content_1,
        )

        notes = get_all_notes()
        assert len(notes) == 2
        assert notes[0].title == created_note_2.title
        assert notes[0].note_id == created_note_2.note_id
        assert notes[1].title == updated_note_1.title
        assert notes[1].note_id == created_note_1.note_id
