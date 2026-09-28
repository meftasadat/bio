import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_bio_content():
    response = client.get("/api/content/bio")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Mefta Sadat"
    assert data["title"] == "Staff ML Engineer"
    assert "13+ years" in data["summary"]
    assert "13+ years" in data["about"]


def test_experience_content():
    response = client.get("/api/content/experience")
    assert response.status_code == 200
    data = response.json()
    experiences = data["experience"]
    priceline = next(e for e in experiences if e["id"] == "priceline")
    assert priceline["position"] == "Staff ML Engineer"
    assert "centralized AI/ML platform" in priceline["description"]
    assert "weeks to days" in priceline["description"]

    loblaw = next(e for e in experiences if e["id"] == "loblaw-digital")
    assert loblaw["position"] == "Staff ML Engineer"
    assert "15 million" in loblaw["description"]


def test_publications():
    response = client.get("/api/content/publications")
    assert response.status_code == 200
    data = response.json()
    pubs = data["publications"]
    assert len(pubs) >= 5
    cascon_2017 = next(p for p in pubs if p["id"] == "cascon-2017-preferences")
    assert cascon_2017["date"] == "2017-11-06"


def test_frontend_prerendered_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Mefta Sadat | Staff ML Engineer" in response.text
    assert "Appearances &amp; Talks" in response.text or "Appearances" in response.text
    assert "Publications" in response.text
    assert "Priceline" in response.text


def test_resume_download():
    response = client.get("/api/resume/download")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
