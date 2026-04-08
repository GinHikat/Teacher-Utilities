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

    duration_str = result.stdout.strip().split('\n')[0]
    
    try:
        total_duration = float(duration_str)
    except ValueError:
        raise Exception(f"Cannot parse duration from FFprobe: '{result.stdout.strip()}' for file {input_file}")

    num_chunks = math.ceil(total_duration / chunk_seconds)

    output_files = []
    
    is_mp3 = input_file.suffix.lower() == '.mp3'
    
    for i in range(num_chunks):
        start = i * chunk_seconds
        
        # Ensure non-mp3 files or video files are safely converted to mp3 chunks
        out_ext = ".mp3" if not is_mp3 else ".mp3"
        output_file_name = f"{input_file.stem}_part_{i+1}{out_ext}"
        output_file_path = output_dir / output_file_name

        # Fast seeking: Place -ss and -t BEFORE -i for near-instant extraction of large files
        ffmpeg_cmd = [
            "ffmpeg", 
            "-ss", str(start),
            "-t", str(chunk_seconds),
            "-i", str(input_file)
        ]
        
        if is_mp3:
            ffmpeg_cmd.extend(["-map", "0:a:0", "-c", "copy"])
        else:
            ffmpeg_cmd.extend(["-map", "0:a:0", "-acodec", "libmp3lame", "-b:a", "128k"])
            
        ffmpeg_cmd.extend(["-y", str(output_file_path)])

        res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        
        if res.returncode != 0:
            raise Exception(f"FFMPEG Error: {res.stderr}")

        if output_file_path.exists():
            output_files.append(output_file_path)

    return output_files
