import os
import io
import math
import subprocess
from pathlib import Path

def split_media_by_duration(input_file: Path, output_dir: Path, chunk_minutes=45):
    """Split media file into chunks by duration."""
    chunk_seconds = chunk_minutes * 60

    # Get total duration using a temporary file to avoid subprocess pipe decoding crashes on Windows
    import tempfile
    import json

    with tempfile.NamedTemporaryFile(delete=False) as tf:
        temp_name = tf.name

    try:
        # We use JSON format for ffprobe as it's more reliable to parse
        subprocess.run([
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "json",
            str(input_file)
        ], stdout=open(temp_name, 'w'), stderr=subprocess.DEVNULL, check=True)
        
        with open(temp_name, 'r') as f:
            data = json.load(f)
            total_duration = float(data['format']['duration'])
    except Exception as e:
        raise Exception(f"FFprobe duration parsing failed: {str(e)}")
    finally:
        if os.path.exists(temp_name):
            os.remove(temp_name)

    num_chunks = math.ceil(total_duration / chunk_seconds)

    output_files = []
    
    is_mp3 = input_file.suffix.lower() == '.mp3'
    
    for i in range(num_chunks):
        start = i * chunk_seconds
        
        # Ensure non-mp3 files or video files are safely converted to mp3 chunks
        out_ext = ".mp3"
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

        # Run ffmpeg WITHOUT pipes to avoid the crashing background reader threads in Python on Windows
        subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        if output_file_path.exists():
            output_files.append(output_file_path)
            
    if not output_files:
         raise Exception("Process failed: No chunks generated. Confirm FFMPEG is installed and file is valid.")

    return output_files
