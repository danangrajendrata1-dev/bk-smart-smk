from datetime import datetime
from uuid import uuid4


def new_id() -> str:
    return str(uuid4())


def now_utc():
    return datetime.utcnow()
