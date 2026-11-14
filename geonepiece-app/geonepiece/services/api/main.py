"""
GeOnePiece API (opsional) — menerima lembar jawaban tes dari PWA dan menyerahkannya ke guru.

Jalankan:
    pip install -r requirements.txt
    set TEACHER_KEY=rahasia-guru            (Windows)   |  export TEACHER_KEY=rahasia-guru  (Mac/Linux)
    set ALLOWED_ORIGINS=http://localhost:5173
    uvicorn main:app --reload --port 8000

Lalu di apps/web/.env isi:  VITE_API_URL=http://localhost:8000
Database: SQLite (file geonepiece.db) — cukup untuk penelitian skala kelas/sekolah.
"""
from __future__ import annotations

import json
import os
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from typing import Any, Literal

from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB_PATH = os.environ.get("DB_PATH", "geonepiece.db")
TEACHER_KEY = os.environ.get("TEACHER_KEY", "")
ORIGINS = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173").split(",") if o.strip()]

app = FastAPI(title="GeOnePiece API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_methods=["GET", "POST"], allow_headers=["Content-Type", "X-Teacher-Key"])


def db() -> sqlite3.Connection:
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


with closing(db()) as con:
    con.execute(
        """CREATE TABLE IF NOT EXISTS attempts (
            id TEXT PRIMARY KEY,
            class_code TEXT NOT NULL,
            student_code TEXT NOT NULL,
            kind TEXT NOT NULL,
            package TEXT NOT NULL,
            submitted_at TEXT,
            received_at TEXT NOT NULL,
            payload TEXT NOT NULL
        )"""
    )
    con.execute("CREATE INDEX IF NOT EXISTS idx_class ON attempts(class_code)")
    con.commit()


class Attempt(BaseModel):
    # Hanya kode siswa — tidak ada nama, email, atau nomor HP.
    id: str = Field(max_length=120)
    kind: Literal["pre", "post"]
    package: Literal["A", "B"]
    classCode: str = Field(max_length=20)
    studentCode: str = Field(max_length=20)
    startedAt: str
    submittedAt: str | None = None
    status: Literal["active", "submitted"]
    answers: dict[str, Any]
    model_config = {"extra": "allow"}


@app.get("/api/health")
def health() -> dict:
    return {"ok": True, "time": datetime.now(timezone.utc).isoformat()}


@app.post("/api/attempts")
def save_attempt(a: Attempt) -> dict:
    """Idempoten: mengirim ulang attempt yang sama hanya memperbarui datanya."""
    if a.status != "submitted":
        raise HTTPException(400, "Hanya lembar jawaban yang sudah dikumpulkan yang diterima.")
    payload = a.model_dump_json()
    if len(payload) > 3_000_000:  # sketsa besar
        raise HTTPException(413, "Lembar jawaban terlalu besar.")
    with closing(db()) as con:
        con.execute(
            """INSERT INTO attempts (id, class_code, student_code, kind, package, submitted_at, received_at, payload)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, submitted_at=excluded.submitted_at, received_at=excluded.received_at""",
            (a.id, a.classCode.upper(), a.studentCode.upper(), a.kind, a.package, a.submittedAt, datetime.now(timezone.utc).isoformat(), payload),
        )
        con.commit()
    return {"ok": True, "id": a.id}


@app.get("/api/attempts")
def list_attempts(class_code: str = Query(..., max_length=20), x_teacher_key: str = Header(default="")) -> list[dict]:
    if not TEACHER_KEY or x_teacher_key != TEACHER_KEY:
        raise HTTPException(401, "Kunci guru salah atau belum diatur di server (TEACHER_KEY).")
    with closing(db()) as con:
        rows = con.execute("SELECT payload FROM attempts WHERE class_code = ? ORDER BY student_code, kind", (class_code.upper(),)).fetchall()
    return [json.loads(r["payload"]) for r in rows]
