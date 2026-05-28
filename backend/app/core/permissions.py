from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import get_current_user_from_token

ROLE_ACCESS = {
    "admin": ["all"],
    "guru_bk": ["dashboard", "siswa", "presensi", "pelanggaran", "konseling", "surat_peringatan", "laporan"],
    "wali_kelas": ["dashboard", "siswa", "presensi", "pelanggaran", "konseling", "laporan"],
    "kesiswaan": ["dashboard", "presensi", "pelanggaran", "surat_peringatan", "laporan"],
    "kepala_sekolah": ["dashboard", "laporan"],
}

bearer_scheme = HTTPBearer(auto_error=False)


def can_access(role: str, module: str) -> bool:
    access = ROLE_ACCESS.get(role, [])
    return "all" in access or module in access


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak ditemukan",
        )
    return get_current_user_from_token(db, credentials.credentials)


def require_roles(*allowed_roles: str):
    def dependency(user=Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Akses ditolak",
            )
        return user

    return dependency
