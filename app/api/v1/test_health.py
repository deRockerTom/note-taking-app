from fastapi.testclient import TestClient

from .health import health_router

client = TestClient(health_router)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
