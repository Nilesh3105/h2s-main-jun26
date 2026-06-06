"""Shared FastAPI dependencies, expressed as ``Annotated`` aliases.

Using ``Annotated[..., Depends(...)]`` is the modern FastAPI style: it keeps the
dependency out of mutable argument defaults and is reusable across routers.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from app.data.db import get_session

SessionDep = Annotated[Session, Depends(get_session)]
