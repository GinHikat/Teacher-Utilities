import os
import io
import math
import subprocess
from pathlib import Path

def split_media_by_duration(input_file: Path, output_dir: Path, chunk_minutes=45):
    """Split media file into chunks by duration."""
    chunk_seconds = chunk_minutes * 60

    # Get total duration
    result = subprocess.run([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(input_file)
    ], capture_output=True, text=True)

    if result.returncode != 0:
        raise Exception(f"FFprobe error: {result.stderr}")

    total_duration = float(result.stdout.strip())
    num_chunks = math.ceil(total_duration / chunk_seconds)

    output_files = []
    
    for i in range(num_chunks):
        start = i * chunk_seconds
        output_file_name = f"{input_file.stem}_part_{i+1}{input_file.suffix}"
        output_file_path = output_dir / output_file_name

        subprocess.run([
            "ffmpeg", "-i", str(input_file),
            "-ss", str(start),
            "-t", str(chunk_seconds),
            "-c", "copy",
            "-y", str(output_file_path)
        ], capture_output=True)

        if output_file_path.exists():
            output_files.append(output_file_path)

    return output_files
