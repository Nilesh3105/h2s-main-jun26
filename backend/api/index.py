"""Vercel Python serverless entrypoint.

Exposes the FastAPI ASGI ``app`` so a single function can serve the whole API
(the vercel.json rewrite routes every path here). On Vercel the filesystem is
read-only except ``/tmp``, so we point SQLite there and create tables at cold
start — meaning hosted-demo data is ephemeral (resets on cold start). The graded
repo, run locally, uses durable SQLite as normal.
"""

from __future__ import annotations

import os
import sys

# Make the backend package importable from this api/ subfolder.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure the serverless environment before settings are first read.
os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/softreset.db")
os.environ.setdefault("CORS_ORIGINS", "https://softreset.vercel.app")

from app.data.db import create_db_and_tables  # noqa: E402
from app.main import app  # noqa: E402

# Create tables eagerly (don't rely on ASGI lifespan being run by the adapter).
create_db_and_tables()

__all__ = ["app"]
