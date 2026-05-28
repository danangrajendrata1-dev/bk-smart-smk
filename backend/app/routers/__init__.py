from fastapi import APIRouter

from app.routers.arsip_router import router as arsip_router
from app.routers.auth_router import router as auth_router
from app.routers.master_pelanggaran_router import router as master_pelanggaran_router
from app.routers.daftar_hadir_konseling_router import router as daftar_hadir_konseling_router
from app.routers.home_visit_router import router as home_visit_router
from app.routers.kelas_router import router as kelas_router
from app.routers.konseling_router import router as konseling_router
from app.routers.laporan_router import router as laporan_router
from app.routers.pelanggaran_router import router as pelanggaran_router
from app.routers.pemanggilan_ortu_router import router as pemanggilan_ortu_router
from app.routers.presensi_router import router as presensi_router
from app.routers.settings_router import router as settings_router
from app.routers.siswa_router import router as siswa_router
from app.routers.surat_peringatan_router import router as surat_peringatan_router
from app.routers.user_router import router as user_router

api_router = APIRouter()


@api_router.get("/health")
def health_check():
    return {"status": "success", "message": "Service healthy", "data": {}}


api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(master_pelanggaran_router)
api_router.include_router(kelas_router)
api_router.include_router(siswa_router)
api_router.include_router(presensi_router)
api_router.include_router(pelanggaran_router)
api_router.include_router(konseling_router)
api_router.include_router(daftar_hadir_konseling_router)
api_router.include_router(surat_peringatan_router)
api_router.include_router(pemanggilan_ortu_router)
api_router.include_router(home_visit_router)
api_router.include_router(arsip_router)
api_router.include_router(laporan_router)
api_router.include_router(settings_router)
