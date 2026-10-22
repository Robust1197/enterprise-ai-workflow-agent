"""First API contract test: no real server, model, DB or external network."""

from fastapi.testclient import TestClient

from app.main import app


def test_liveness_returns_200_and_status_ok() -> None:
    # Arrange
    client = TestClient(app)

    # Act
    response = client.get("/health/live")

    # Assert
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "enterprise-ai-workflow-agent"}

def test_liveness_returns_404_for_nonexistent_endpoint() -> None:
    # Arrange
    client = TestClient(app)

    # Act
    response = client.get("/no-such-endpoint")

    # Assert
    assert response.status_code == 404