from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Form, HTTPException
from fastapi.responses import FileResponse
import shutil
import uuid
import os
from pathlib import Path
from services.translation import translate_full_document_async
from services.transcription import split_mp3_by_duration
import zipfile

router = APIRouter()

UPLOAD_DIR = Path("uploads").resolve()
OUTPUT_DIR = Path("outputs").resolve()
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Shared memory for job progress
jobs = {}

async def update_job_progress(job_id, completed, total):
    progress = round((completed / total) * 100, 2) if total > 0 else 0
    jobs[job_id] = {"status": "processing", "progress": progress}

async def translate_task(job_id: str, input_path: Path, output_path: Path, target_lang: str):
    try:
        # Wrapper to pass job_id along with progression data
        async def progress_wrapper(completed, total):
            await update_job_progress(job_id, completed, total)

        await translate_full_document_async(
            input_path, 
            output_path, 
            target_lang=target_lang,
            progress_callback=progress_wrapper
        )
        jobs[job_id] = {"status": "completed", "progress": 100, "result_file": output_path.name}
    except Exception as e:
        jobs[job_id] = {"status": "failed", "error": str(e), "progress": 0}

from typing import List

@router.post("/translate")
async def start_translation(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    target_lang: str = Form("en")
):
    job_ids = []
    for file in files:
        if not file.filename.lower().endswith(('.docx', '.pdf')):
            continue

        job_id = str(uuid.uuid4())
        input_filename = f"{job_id}_{file.filename}"
        input_path = UPLOAD_DIR / input_filename
        output_filename = f"trans_{input_filename}"
        if output_filename.lower().endswith(".pdf"):
            output_filename = output_filename[:-4] + ".docx"
        output_path = OUTPUT_DIR / output_filename

        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        jobs[job_id] = {"status": "queued", "progress": 0, "filename": file.filename}
        background_tasks.add_task(translate_task, job_id, input_path, output_path, target_lang)
        job_ids.append(job_id)

    if not job_ids:
        raise HTTPException(status_code=400, detail="No valid .docx or .pdf files uploaded.")

    return {"job_ids": job_ids}

@router.post("/split-audio")
async def start_audio_split(
    file: UploadFile = File(...),
    chunk_minutes: int = Form(45)
):
    if not file.filename.lower().endswith(('.mp3', '.wav', '.m4a')):
        raise HTTPException(status_code=400, detail="Invalid audio file type.")

    job_id = str(uuid.uuid4())
    input_filename = f"{job_id}_{file.filename}"
    input_path = UPLOAD_DIR / input_filename
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        output_dir = OUTPUT_DIR / job_id
        output_dir.mkdir(exist_ok=True, parents=True)
        
        split_files = split_mp3_by_duration(input_path, output_dir, chunk_minutes)
        
        zip_path = OUTPUT_DIR / f"{job_id}_split_audio.zip"
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for f in split_files:
                zipf.write(f, arcname=f.name)
        
        return {
            "job_id": job_id,
            "status": "completed",
            "result_file": zip_path.name,
            "num_chunks": len(split_files)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/job-status/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename=filename.split('_', 2)[-1] if '_' in filename else filename)
